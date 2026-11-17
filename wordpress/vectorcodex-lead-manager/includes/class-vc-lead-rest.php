<?php
/**
 * Public submission endpoint: POST /wp-json/vectorcodex/v1/leads
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_REST {

	/**
	 * Hook registration.
	 */
	public static function init() {
		add_action('rest_api_init', array(__CLASS__, 'register_routes'));
	}

	/**
	 * Register routes.
	 */
	public static function register_routes() {
		register_rest_route(
			VC_LEADS_REST_NS,
			'/leads',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array(__CLASS__, 'create_lead'),
					'permission_callback' => array(__CLASS__, 'public_submit_permission'),
					'args'                => array(),
				),
			)
		);
	}

	/**
	 * Public submissions are allowed for anyone, but this callback is explicit
	 * and never grants read access to stored leads.
	 *
	 * @return true|WP_Error
	 */
	public static function public_submit_permission() {
		$size = VC_Lead_Security::check_request_size();
		if (is_wp_error($size)) {
			return $size;
		}
		$rate = VC_Lead_Security::check_rate_limit();
		if (is_wp_error($rate)) {
			return $rate;
		}
		return true;
	}

	/**
	 * Create a lead from multipart FormData (or JSON body).
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function create_lead(WP_REST_Request $request) {
		$raw = self::collect_params($request);

		// Help form-type inference when the frontend omitted form_type.
		if (empty($raw['source_url']) && empty($raw['sourceUrl']) && empty($raw['page_url'])) {
			$ref = $request->get_header('referer');
			if (is_string($ref) && $ref !== '') {
				$raw['source_url'] = esc_url_raw($ref);
			}
		}

		// Honeypot: pretend success so bots do not learn the trap.
		$form_type_hint = VC_Lead_Normalize::normalize_form_type($raw);
		if (VC_Lead_Security::honeypot_triggered($raw, $form_type_hint)) {
			return rest_ensure_response(
				array(
					'ok'      => true,
					'message' => 'Thank you. Your submission has been received.',
				)
			);
		}

		$turnstile = VC_Lead_Turnstile::verify(
			isset($raw['cf-turnstile-response']) ? (string) $raw['cf-turnstile-response'] : ''
		);
		if (is_wp_error($turnstile)) {
			$data = $turnstile->get_error_data();
			$status = (is_array($data) && isset($data['status'])) ? (int) $data['status'] : 400;
			return self::error_response($turnstile->get_error_code(), $turnstile->get_error_message(), $status);
		}

		// human_check is recorded in payload but never treated as CAPTCHA.
		$normalized = VC_Lead_Normalize::from_request($raw);
		if (empty($normalized['ok'])) {
			return self::error_response(
				'vc_leads_validation_failed',
				'Please correct the highlighted fields and try again.',
				400,
				isset($normalized['errors']) ? $normalized['errors'] : array()
			);
		}

		$data = $normalized['data'];
		$submitted_at = gmdate('c');
		if (!empty($raw['submitted_at']) && is_scalar($raw['submitted_at'])) {
			$candidate = sanitize_text_field((string) $raw['submitted_at']);
			$ts = strtotime($candidate);
			if ($ts) {
				$submitted_at = gmdate('c', $ts);
			}
		}

		$source_url = $data['source_url'];
		if ($source_url === '') {
			$ref = $request->get_header('referer');
			if (is_string($ref) && $ref !== '') {
				$source_url = esc_url_raw($ref);
			}
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => VC_LEADS_CPT,
				'post_status' => 'private',
				'post_title'  => $data['title'],
				'post_content'=> '',
			),
			true
		);

		if (is_wp_error($post_id)) {
			return self::error_response(
				'vc_leads_store_failed',
				'Unable to store your submission. Please try again.',
				500
			);
		}

		VC_Lead_Meta::save_lead_fields(
			$post_id,
			array_merge(
				$data,
				array(
					'submitted_at' => $submitted_at,
					'source_url'   => $source_url,
					'ip_hash'      => VC_Lead_Security::client_ip_hash(),
					'user_agent'   => VC_Lead_Security::user_agent(),
					'status'       => 'new',
				)
			)
		);

		// Email delivery is best-effort and never rolls back storage.
		VC_Lead_Email::send_for_lead($post_id);

		/**
		 * Fires after a lead is stored successfully.
		 *
		 * @param int   $post_id Lead ID.
		 * @param array $data    Normalized data (no secrets).
		 */
		do_action('vc_leads_stored', $post_id, $data);

		// Never return stored lead content publicly.
		return rest_ensure_response(
			array(
				'ok'      => true,
				'message' => 'Thank you. Your submission has been received.',
			)
		);
	}

	/**
	 * Merge query/body/json params into a flat string-keyed array.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return array
	 */
	private static function collect_params(WP_REST_Request $request) {
		$params = array();

		foreach ($request->get_params() as $key => $value) {
			if (is_string($key)) {
				$params[$key] = $value;
			}
		}

		$body = $request->get_body_params();
		if (is_array($body)) {
			foreach ($body as $key => $value) {
				$params[$key] = $value;
			}
		}

		$json = $request->get_json_params();
		if (is_array($json)) {
			foreach ($json as $key => $value) {
				$params[$key] = $value;
			}
		}

		return $params;
	}

	/**
	 * Consistent error JSON.
	 *
	 * @param string               $code    Error code.
	 * @param string               $message Message.
	 * @param int                  $status  HTTP status.
	 * @param array<string,string> $errors  Field errors.
	 * @return WP_REST_Response
	 */
	private static function error_response($code, $message, $status = 400, array $errors = array()) {
		$response = array(
			'ok'      => false,
			'code'    => $code,
			'message' => $message,
		);
		if (!empty($errors)) {
			$response['errors'] = $errors;
		}
		return new WP_REST_Response($response, $status);
	}
}
