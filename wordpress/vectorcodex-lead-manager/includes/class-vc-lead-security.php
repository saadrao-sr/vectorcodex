<?php
/**
 * Rate limiting, honeypot, request size, IP hashing.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Security {

	const RATE_TRANSIENT_PREFIX = 'vc_leads_rl_';

	/**
	 * Hook registration.
	 */
	public static function init() {
		// No global hooks required.
	}

	/**
	 * Plugin settings with defaults.
	 *
	 * @return array
	 */
	public static function settings() {
		$defaults = array(
			'notify_enabled'       => 1,
			'notify_to'            => 'info@vectorcodex.com',
			'ack_enabled'          => 1,
			'rate_limit_max'       => 8,
			'rate_limit_window'    => 600,
			'max_body_bytes'       => 524288,
			'retention_days'       => 730,
			'turnstile_site_key'   => '',
			'turnstile_secret_key' => '',
			'turnstile_enabled'    => 0,
		);
		$stored = get_option('vc_leads_settings', array());
		if (!is_array($stored)) {
			$stored = array();
		}
		return array_merge($defaults, $stored);
	}

	/**
	 * Hash client IP for rate limiting / forensics (not reversible storage of raw IP).
	 *
	 * @return string
	 */
	public static function client_ip_hash() {
		$ip = self::client_ip();
		$salt = wp_salt('auth');
		return hash_hmac('sha256', $ip, $salt);
	}

	/**
	 * Best-effort client IP (may be proxied).
	 *
	 * @return string
	 */
	public static function client_ip() {
		$keys = array('HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR');
		foreach ($keys as $key) {
			if (empty($_SERVER[$key])) {
				continue;
			}
			$raw = sanitize_text_field(wp_unslash((string) $_SERVER[$key]));
			if (strpos($raw, ',') !== false) {
				$parts = explode(',', $raw);
				$raw = trim($parts[0]);
			}
			if (filter_var($raw, FILTER_VALIDATE_IP)) {
				return $raw;
			}
		}
		return '0.0.0.0';
	}

	/**
	 * Truncated user agent for diagnostics.
	 *
	 * @return string
	 */
	public static function user_agent() {
		if (empty($_SERVER['HTTP_USER_AGENT'])) {
			return '';
		}
		return substr(sanitize_text_field(wp_unslash((string) $_SERVER['HTTP_USER_AGENT'])), 0, 255);
	}

	/**
	 * Enforce Content-Length / body size limit.
	 *
	 * @return true|WP_Error
	 */
	public static function check_request_size() {
		$settings = self::settings();
		$max = (int) $settings['max_body_bytes'];
		if ($max < 1024) {
			$max = 524288;
		}
		if (!empty($_SERVER['CONTENT_LENGTH'])) {
			$length = (int) $_SERVER['CONTENT_LENGTH'];
			if ($length > $max) {
				return new WP_Error(
					'vc_leads_payload_too_large',
					'Submission is too large.',
					array('status' => 413)
				);
			}
		}
		return true;
	}

	/**
	 * Honeypot check — form-type aware.
	 * Free audit uses `website` as a real field; its honeypot is `company_website`.
	 * Other forms use `website` / `website_hp` as honeypots.
	 *
	 * @param array  $raw       Raw params.
	 * @param string $form_type Normalized type (may be empty before normalize).
	 * @return bool True if bot suspected (honeypot filled).
	 */
	public static function honeypot_triggered(array $raw, $form_type = '') {
		$type = $form_type !== '' ? $form_type : VC_Lead_Normalize::normalize_form_type($raw);

		if ($type === 'free_audit' || $type === 'pricing_calculator') {
			$keys = array('company_website', 'website_hp');
		} else {
			$keys = array('website', 'website_hp', 'company_website');
		}

		foreach ($keys as $key) {
			if (!isset($raw[$key])) {
				continue;
			}
			$value = is_scalar($raw[$key]) ? trim((string) $raw[$key]) : '';
			if ($value !== '') {
				return true;
			}
		}
		return false;
	}

	/**
	 * Rate-limit by IP hash. Returns WP_Error when exceeded.
	 *
	 * @return true|WP_Error
	 */
	public static function check_rate_limit() {
		$settings = self::settings();
		$max = max(1, (int) $settings['rate_limit_max']);
		$window = max(60, (int) $settings['rate_limit_window']);
		$key = self::RATE_TRANSIENT_PREFIX . substr(self::client_ip_hash(), 0, 32);
		$count = (int) get_transient($key);
		if ($count >= $max) {
			return new WP_Error(
				'vc_leads_rate_limited',
				'Too many submissions. Please try again later.',
				array('status' => 429)
			);
		}
		set_transient($key, $count + 1, $window);
		return true;
	}

	/**
	 * Whether the current user can manage leads.
	 *
	 * @return bool
	 */
	public static function current_user_can_manage() {
		return current_user_can('manage_options');
	}
}
