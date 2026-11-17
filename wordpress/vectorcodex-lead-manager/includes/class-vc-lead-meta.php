<?php
/**
 * Lead meta keys and helpers.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Meta {

	const FORM_TYPE       = 'vc_form_type';
	const STATUS          = 'vc_status';
	const NAME            = 'vc_name';
	const EMAIL           = 'vc_email';
	const PHONE           = 'vc_phone';
	const COMPANY         = 'vc_company';
	const SERVICE         = 'vc_service';
	const BUDGET          = 'vc_budget';
	const TIMELINE        = 'vc_timeline';
	const MESSAGE         = 'vc_message';
	const SUMMARY         = 'vc_summary';
	const PAYLOAD_JSON    = 'vc_payload_json';
	const SOURCE_URL      = 'vc_source_url';
	const SUBMITTED_AT    = 'vc_submitted_at';
	const IP_HASH         = 'vc_ip_hash';
	const USER_AGENT      = 'vc_user_agent';
	const EMAIL_ADMIN_STATUS    = 'vc_email_admin_status';
	const EMAIL_ADMIN_AT        = 'vc_email_admin_at';
	const EMAIL_ADMIN_CODE      = 'vc_email_admin_code';
	const EMAIL_CUSTOMER_STATUS = 'vc_email_customer_status';
	const EMAIL_CUSTOMER_AT     = 'vc_email_customer_at';
	const EMAIL_CUSTOMER_CODE   = 'vc_email_customer_code';

	/**
	 * Allowed lead statuses.
	 *
	 * @return string[]
	 */
	public static function statuses() {
		return array(
			'new'           => 'New',
			'contacted'     => 'Contacted',
			'qualified'     => 'Qualified',
			'proposal_sent' => 'Proposal Sent',
			'won'           => 'Won',
			'lost'          => 'Lost',
		);
	}

	/**
	 * Allowed normalized form types.
	 *
	 * @return string[]
	 */
	public static function form_types() {
		return array(
			'quote'              => 'Quote',
			'booking'            => 'Booking',
			'free_audit'         => 'Free Audit',
			'team_requirements'  => 'Team Requirements',
			'project_inquiry'    => 'Project Inquiry',
			'homepage_inquiry'   => 'Homepage Inquiry',
			'pricing_calculator' => 'Pricing Calculator',
		);
	}

	/**
	 * Hook registration.
	 */
	public static function init() {
		// Meta is written by REST / admin; no public register_post_meta needed.
	}

	/**
	 * Read a meta string.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta key.
	 * @return string
	 */
	public static function get($post_id, $key) {
		$value = get_post_meta($post_id, $key, true);
		return is_string($value) ? $value : (is_scalar($value) ? (string) $value : '');
	}

	/**
	 * Decode payload JSON safely.
	 *
	 * @param int $post_id Post ID.
	 * @return array|null
	 */
	public static function get_payload($post_id) {
		$raw = self::get($post_id, self::PAYLOAD_JSON);
		if ($raw === '') {
			return null;
		}
		$decoded = json_decode($raw, true);
		return is_array($decoded) ? $decoded : null;
	}

	/**
	 * Persist lead fields from a normalized array.
	 *
	 * @param int   $post_id Post ID.
	 * @param array $data    Normalized lead data.
	 */
	public static function save_lead_fields($post_id, array $data) {
		$map = array(
			self::FORM_TYPE    => isset($data['form_type']) ? $data['form_type'] : '',
			self::STATUS       => isset($data['status']) ? $data['status'] : 'new',
			self::NAME         => isset($data['name']) ? $data['name'] : '',
			self::EMAIL        => isset($data['email']) ? $data['email'] : '',
			self::PHONE        => isset($data['phone']) ? $data['phone'] : '',
			self::COMPANY      => isset($data['company']) ? $data['company'] : '',
			self::SERVICE      => isset($data['service']) ? $data['service'] : '',
			self::BUDGET       => isset($data['budget']) ? $data['budget'] : '',
			self::TIMELINE     => isset($data['timeline']) ? $data['timeline'] : '',
			self::MESSAGE      => isset($data['message']) ? $data['message'] : '',
			self::SUMMARY      => isset($data['summary']) ? $data['summary'] : '',
			self::SOURCE_URL   => isset($data['source_url']) ? $data['source_url'] : '',
			self::SUBMITTED_AT => isset($data['submitted_at']) ? $data['submitted_at'] : '',
			self::IP_HASH      => isset($data['ip_hash']) ? $data['ip_hash'] : '',
			self::USER_AGENT   => isset($data['user_agent']) ? $data['user_agent'] : '',
		);

		foreach ($map as $key => $value) {
			update_post_meta($post_id, $key, $value);
		}

		if (isset($data['payload']) && is_array($data['payload'])) {
			update_post_meta($post_id, self::PAYLOAD_JSON, wp_json_encode($data['payload']));
		} elseif (isset($data['payload_json']) && is_string($data['payload_json'])) {
			update_post_meta($post_id, self::PAYLOAD_JSON, $data['payload_json']);
		}
	}
}
