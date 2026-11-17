<?php
/**
 * Cloudflare Turnstile server-side Siteverify.
 *
 * Enforcement is disabled by default until the Astro frontend sends
 * `cf-turnstile-response`. When enabled, missing/invalid/expired/reused
 * tokens are rejected. The Secret Key is never returned to clients or logged.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Turnstile {

	const SITEVERIFY_URL     = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	const REPLAY_PREFIX      = 'vc_leads_ts_';
	const REPLAY_TTL_SECONDS = 600;

	/**
	 * Optional HTTP handler for offline tests:
	 * function( string $url, array $args ): array|WP_Error
	 *
	 * @var callable|null
	 */
	private static $http_handler = null;

	/**
	 * Hook registration.
	 */
	public static function init() {
		// Settings UI in admin; verification from REST.
	}

	/**
	 * Inject HTTP transport (tests only).
	 *
	 * @param callable|null $handler Handler.
	 */
	public static function set_http_handler($handler) {
		self::$http_handler = is_callable($handler) ? $handler : null;
	}

	/**
	 * Whether the admin toggle is on (may still lack keys).
	 *
	 * @return bool
	 */
	public static function is_toggle_enabled() {
		$settings = VC_Lead_Security::settings();
		return !empty($settings['turnstile_enabled']);
	}

	/**
	 * Whether enforcement is active (toggle + secret configured).
	 *
	 * @return bool
	 */
	public static function is_enabled() {
		return self::is_toggle_enabled() && self::has_secret();
	}

	/**
	 * @return bool
	 */
	public static function has_secret() {
		$settings = VC_Lead_Security::settings();
		return !empty($settings['turnstile_secret_key']);
	}

	/**
	 * @return bool
	 */
	public static function has_site_key() {
		$settings = VC_Lead_Security::settings();
		return !empty($settings['turnstile_site_key']);
	}

	/**
	 * Configuration status for admin UI (never includes the secret value).
	 *
	 * @return array{enabled:bool,ready:bool,site_key_set:bool,secret_set:bool,label:string,tone:string}
	 */
	public static function status() {
		$enabled    = self::is_toggle_enabled();
		$site_set   = self::has_site_key();
		$secret_set = self::has_secret();
		$ready      = $enabled && $site_set && $secret_set;

		if (!$enabled) {
			return array(
				'enabled'      => false,
				'ready'        => false,
				'site_key_set' => $site_set,
				'secret_set'   => $secret_set,
				'label'        => 'Disabled (default until frontend integration)',
				'tone'         => 'neutral',
			);
		}
		if (!$secret_set || !$site_set) {
			return array(
				'enabled'      => true,
				'ready'        => false,
				'site_key_set' => $site_set,
				'secret_set'   => $secret_set,
				'label'        => 'Enabled but incomplete — submissions will be rejected until both keys are set',
				'tone'         => 'warn',
			);
		}
		return array(
			'enabled'      => true,
			'ready'        => true,
			'site_key_set' => true,
			'secret_set'   => true,
			'label'        => 'Enabled and ready — tokens required on submit',
			'tone'         => 'ok',
		);
	}

	/**
	 * Verify Turnstile token when enforcement is on. Soft-pass when disabled.
	 *
	 * @param string $token Token from `cf-turnstile-response`.
	 * @return true|WP_Error
	 */
	public static function verify($token) {
		if (!self::is_toggle_enabled()) {
			return true;
		}

		if (!self::has_secret()) {
			return new WP_Error(
				'vc_leads_turnstile_misconfigured',
				'Human verification is temporarily unavailable. Please try again later.',
				array('status' => 503)
			);
		}

		$token = is_string($token) ? trim($token) : '';
		if ($token === '') {
			return new WP_Error(
				'vc_leads_turnstile_missing',
				'Human verification is required.',
				array('status' => 400)
			);
		}

		// Local reuse guard (Cloudflare also rejects duplicates via timeout-or-duplicate).
		$token_hash = hash_hmac('sha256', $token, wp_salt('auth'));
		$replay_key = self::REPLAY_PREFIX . substr($token_hash, 0, 40);
		if (false !== get_transient($replay_key)) {
			return new WP_Error(
				'vc_leads_turnstile_reused',
				'Human verification token was already used. Please try again.',
				array('status' => 400)
			);
		}

		$settings = VC_Lead_Security::settings();
		$secret   = (string) $settings['turnstile_secret_key'];

		$response = self::http_post(
			self::SITEVERIFY_URL,
			array(
				'timeout' => 8,
				'body'    => array(
					'secret'   => $secret,
					'response' => $token,
					'remoteip' => VC_Lead_Security::client_ip(),
				),
			)
		);

		if (is_wp_error($response)) {
			return new WP_Error(
				'vc_leads_turnstile_unreachable',
				'Human verification could not be completed. Please try again.',
				array('status' => 503)
			);
		}

		$code = 0;
		$body_raw = '';
		if (is_array($response)) {
			$code     = isset($response['response']['code']) ? (int) $response['response']['code'] : 0;
			$body_raw = isset($response['body']) ? (string) $response['body'] : '';
		}

		if ($code < 200 || $code >= 300) {
			return new WP_Error(
				'vc_leads_turnstile_unreachable',
				'Human verification could not be completed. Please try again.',
				array('status' => 503)
			);
		}

		$body = json_decode($body_raw, true);
		if (!is_array($body)) {
			return new WP_Error(
				'vc_leads_turnstile_unreachable',
				'Human verification could not be completed. Please try again.',
				array('status' => 503)
			);
		}

		if (!empty($body['success'])) {
			set_transient($replay_key, 1, self::REPLAY_TTL_SECONDS);
			return true;
		}

		$error_codes = array();
		if (!empty($body['error-codes']) && is_array($body['error-codes'])) {
			foreach ($body['error-codes'] as $c) {
				if (is_scalar($c)) {
					$error_codes[] = sanitize_key((string) $c);
				}
			}
		}

		return self::map_error_codes($error_codes);
	}

	/**
	 * Map Cloudflare error-codes to safe client messages (never echo secrets).
	 *
	 * @param string[] $codes Codes.
	 * @return WP_Error
	 */
	private static function map_error_codes(array $codes) {
		if (in_array('missing-input-response', $codes, true) || in_array('missing-input-secret', $codes, true)) {
			return new WP_Error(
				'vc_leads_turnstile_missing',
				'Human verification is required.',
				array('status' => 400, 'turnstile_codes' => $codes)
			);
		}
		if (in_array('timeout-or-duplicate', $codes, true)) {
			return new WP_Error(
				'vc_leads_turnstile_expired',
				'Human verification expired or was already used. Please try again.',
				array('status' => 400, 'turnstile_codes' => $codes)
			);
		}
		if (in_array('invalid-input-response', $codes, true) || in_array('bad-request', $codes, true)) {
			return new WP_Error(
				'vc_leads_turnstile_invalid',
				'Human verification failed. Please try again.',
				array('status' => 400, 'turnstile_codes' => $codes)
			);
		}
		if (in_array('invalid-input-secret', $codes, true) || in_array('invalid-or-already-seen-response', $codes, true)) {
			// invalid-input-secret = server misconfiguration; do not reveal that detail publicly.
			$code = in_array('invalid-or-already-seen-response', $codes, true)
				? 'vc_leads_turnstile_reused'
				: 'vc_leads_turnstile_misconfigured';
			$status = ($code === 'vc_leads_turnstile_misconfigured') ? 503 : 400;
			$message = ($code === 'vc_leads_turnstile_misconfigured')
				? 'Human verification is temporarily unavailable. Please try again later.'
				: 'Human verification token was already used. Please try again.';
			return new WP_Error($code, $message, array('status' => $status, 'turnstile_codes' => $codes));
		}

		return new WP_Error(
			'vc_leads_turnstile_failed',
			'Human verification failed.',
			array('status' => 400, 'turnstile_codes' => $codes)
		);
	}

	/**
	 * @param string $url  URL.
	 * @param array  $args Args compatible with wp_remote_post.
	 * @return array|WP_Error
	 */
	private static function http_post($url, array $args) {
		if (is_callable(self::$http_handler)) {
			return call_user_func(self::$http_handler, $url, $args);
		}
		return wp_remote_post($url, $args);
	}
}
