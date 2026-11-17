<?php
/**
 * Email notifications via wp_mail().
 *
 * Admin notification + customer acknowledgement.
 * Delivery is independent of lead storage — failures never roll back a lead.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Email {

	/**
	 * Optional mail handler for offline tests: function( $to, $subject, $body, $headers ): bool
	 *
	 * @var callable|null
	 */
	private static $mail_handler = null;

	/**
	 * Hook registration.
	 */
	public static function init() {
		// Sending is triggered from REST after successful storage.
	}

	/**
	 * Inject a mail transport (tests only). Pass null to restore wp_mail().
	 *
	 * @param callable|null $handler Handler.
	 */
	public static function set_mail_handler($handler) {
		self::$mail_handler = is_callable($handler) ? $handler : null;
	}

	/**
	 * Send all configured notifications after a lead is stored.
	 * Always returns true so callers never treat mail as a storage dependency.
	 *
	 * @param int $lead_id Lead post ID.
	 * @return bool
	 */
	public static function send_for_lead($lead_id) {
		$lead_id = (int) $lead_id;
		if ($lead_id <= 0) {
			return true;
		}

		try {
			self::notify_staff($lead_id);
		} catch (Exception $e) {
			self::record_outcome($lead_id, 'admin', 'failed', 'exception');
		}

		try {
			self::acknowledge_customer($lead_id);
		} catch (Exception $e) {
			self::record_outcome($lead_id, 'customer', 'failed', 'exception');
		}

		return true;
	}

	/**
	 * Back-compat alias used by earlier bootstrap/REST code.
	 *
	 * @param int $lead_id Lead ID.
	 * @return bool
	 */
	public static function notify_staff($lead_id) {
		$settings = VC_Lead_Security::settings();
		if (empty($settings['notify_enabled'])) {
			self::record_outcome($lead_id, 'admin', 'skipped', 'disabled');
			do_action('vc_leads_notify_skipped', $lead_id);
			return true;
		}

		$prepared = self::prepare_admin_message($lead_id);
		if (empty($prepared['to']) || !is_email($prepared['to'])) {
			self::record_outcome($lead_id, 'admin', 'failed', 'invalid_recipient');
			return true;
		}

		do_action('vc_leads_notify_ready', $lead_id, $prepared);

		$sent = self::deliver($prepared['to'], $prepared['subject'], $prepared['body'], $prepared['headers']);
		self::record_outcome($lead_id, 'admin', $sent ? 'sent' : 'failed', $sent ? '' : 'wp_mail_false');

		return true;
	}

	/**
	 * Customer acknowledgement email.
	 *
	 * @param int $lead_id Lead ID.
	 * @return bool
	 */
	public static function acknowledge_customer($lead_id) {
		$settings = VC_Lead_Security::settings();
		if (empty($settings['ack_enabled'])) {
			self::record_outcome($lead_id, 'customer', 'skipped', 'disabled');
			return true;
		}

		$prepared = self::prepare_customer_message($lead_id);
		if (empty($prepared['to']) || !is_email($prepared['to'])) {
			self::record_outcome($lead_id, 'customer', 'failed', 'invalid_recipient');
			return true;
		}

		do_action('vc_leads_ack_ready', $lead_id, $prepared);

		$sent = self::deliver($prepared['to'], $prepared['subject'], $prepared['body'], $prepared['headers']);
		self::record_outcome($lead_id, 'customer', $sent ? 'sent' : 'failed', $sent ? '' : 'wp_mail_false');

		return true;
	}

	/**
	 * Build admin notification content.
	 *
	 * @param int $lead_id Lead ID.
	 * @return array{to:string,subject:string,body:string,headers:string[]}
	 */
	public static function prepare_admin_message($lead_id) {
		$settings   = VC_Lead_Security::settings();
		$types      = VC_Lead_Meta::form_types();
		$form_type  = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::FORM_TYPE);
		$type_label = isset($types[$form_type]) ? $types[$form_type] : $form_type;
		$name       = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::NAME);
		$from_name  = self::from_name();
		$from_email = self::from_email();

		$subject = sprintf('[VectorCodex Lead] %s — %s', $type_label, $name);

		$lines = array(
			'A new lead was stored in WordPress.',
			'',
			'Form type: ' . $type_label,
			'Name: ' . $name,
			'Email: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL),
			'Phone: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::PHONE),
			'Company: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::COMPANY),
			'Service: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SERVICE),
			'Budget: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::BUDGET),
			'Timeline: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::TIMELINE),
			'Submitted: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SUBMITTED_AT),
			'Source: ' . VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SOURCE_URL),
		);

		$message = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::MESSAGE);
		if ($message !== '') {
			$lines[] = '';
			$lines[] = 'Message:';
			$lines[] = $message;
		}

		$summary = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SUMMARY);
		if ($summary !== '') {
			$lines[] = '';
			$lines[] = 'Summary:';
			$lines[] = $summary;
		}

		if ($form_type === 'pricing_calculator') {
			$lines[] = '';
			$lines[] = '— Pricing calculator —';
			$lines = array_merge($lines, self::pricing_admin_lines($lead_id));
			$lines[] = '';
			$lines[] = 'Complete submitted information (including nested answers) is available in the WordPress lead detail view.';
		}

		$lines[] = '';
		$lines[] = 'Open in admin: ' . admin_url('admin.php?page=vc-leads&action=view&lead_id=' . (int) $lead_id);

		$headers = array(
			'Content-Type: text/plain; charset=UTF-8',
			sprintf('From: %s <%s>', self::header_name($from_name), $from_email),
		);

		$customer = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL);
		if ($customer !== '' && is_email($customer)) {
			$headers[] = 'Reply-To: ' . $customer;
		}

		return array(
			'to'      => sanitize_email((string) $settings['notify_to']),
			'subject' => $subject,
			'body'    => implode("\n", $lines),
			'headers' => $headers,
		);
	}

	/**
	 * Alias for older callers / tests.
	 *
	 * @param int $lead_id Lead ID.
	 * @return array
	 */
	public static function prepare_message($lead_id) {
		return self::prepare_admin_message($lead_id);
	}

	/**
	 * Build customer acknowledgement.
	 *
	 * @param int $lead_id Lead ID.
	 * @return array{to:string,subject:string,body:string,headers:string[]}
	 */
	public static function prepare_customer_message($lead_id) {
		$types      = VC_Lead_Meta::form_types();
		$form_type  = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::FORM_TYPE);
		$type_label = isset($types[$form_type]) ? $types[$form_type] : 'enquiry';
		$name       = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::NAME);
		$first      = self::first_name($name);
		$to         = sanitize_email(VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL));
		$from_name  = self::from_name();
		$from_email = self::from_email();
		$notify_to  = sanitize_email((string) VC_Lead_Security::settings()['notify_to']);

		$subject = 'We received your VectorCodex enquiry';

		$lines = array(
			($first !== '' ? "Hi {$first}," : 'Hello,'),
			'',
			'Thank you for contacting VectorCodex. We have received your ' . strtolower($type_label) . ' and our team will review it shortly.',
			'',
			'Reference details:',
			'• Type: ' . $type_label,
			'• Name: ' . $name,
			'• Email: ' . $to,
		);

		$service = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SERVICE);
		if ($service !== '') {
			$lines[] = '• Service: ' . $service;
		}
		$submitted = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SUBMITTED_AT);
		if ($submitted !== '') {
			$lines[] = '• Submitted: ' . $submitted;
		}

		if ($form_type === 'pricing_calculator') {
			$budget = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::BUDGET);
			if ($budget !== '') {
				$lines[] = '• Indicative estimate: ' . $budget;
			}
			$lines[] = '';
			$lines[] = 'Your pricing calculator answers have been saved. We will use them to prepare a tailored follow-up.';
		}

		$lines[] = '';
		$lines[] = 'If you need to add anything, reply to this email or write to ' . ($notify_to !== '' ? $notify_to : 'info@vectorcodex.com') . '.';
		$lines[] = '';
		$lines[] = 'Kind regards,';
		$lines[] = 'VectorCodex';
		$lines[] = 'https://vectorcodex.com/';

		$headers = array(
			'Content-Type: text/plain; charset=UTF-8',
			sprintf('From: %s <%s>', self::header_name($from_name), $from_email),
		);
		if ($notify_to !== '' && is_email($notify_to)) {
			$headers[] = 'Reply-To: ' . $notify_to;
		}

		return array(
			'to'      => $to,
			'subject' => $subject,
			'body'    => implode("\n", $lines),
			'headers' => $headers,
		);
	}

	/**
	 * Readable pricing lines for admin email (not the full raw JSON dump).
	 *
	 * @param int $lead_id Lead ID.
	 * @return string[]
	 */
	private static function pricing_admin_lines($lead_id) {
		$payload = VC_Lead_Meta::get_payload($lead_id);
		$lines   = array();
		if (!is_array($payload)) {
			$lines[] = '(Payload unavailable — open the lead detail screen for the stored submission.)';
			return $lines;
		}

		if (!empty($payload['estimate']) && is_array($payload['estimate'])) {
			$label = isset($payload['estimate']['label']) ? (string) $payload['estimate']['label'] : '';
			$min   = isset($payload['estimate']['min']) ? (string) $payload['estimate']['min'] : '';
			$max   = isset($payload['estimate']['max']) ? (string) $payload['estimate']['max'] : '';
			$lines[] = 'Estimate: ' . trim($label . ' ' . ($min !== '' && $max !== '' ? "({$min}–{$max})" : ''));
		}
		if (!empty($payload['primaryService'])) {
			$lines[] = 'Primary service: ' . (string) $payload['primaryService'];
		}
		if (!empty($payload['allServices']) && is_array($payload['allServices'])) {
			$lines[] = 'All services: ' . implode(', ', array_map('strval', $payload['allServices']));
		}

		if (!empty($payload['summaryText'])) {
			$lines[] = '';
			$lines[] = 'Calculator summary:';
			$lines[] = (string) $payload['summaryText'];
		} else {
			if (!empty($payload['businessAnswers']) && is_array($payload['businessAnswers'])) {
				$lines[] = '';
				$lines[] = 'Business answers:';
				foreach ($payload['businessAnswers'] as $key => $value) {
					$lines[] = '- ' . $key . ': ' . self::stringify_answer($value);
				}
			}
			if (!empty($payload['serviceAnswers']) && is_array($payload['serviceAnswers'])) {
				foreach ($payload['serviceAnswers'] as $service_id => $answers) {
					$lines[] = '';
					$lines[] = 'Service answers (' . $service_id . '):';
					if (is_array($answers)) {
						foreach ($answers as $key => $value) {
							$lines[] = '- ' . $key . ': ' . self::stringify_answer($value);
						}
					}
				}
			}
		}

		return $lines;
	}

	/**
	 * @param mixed $value Answer value.
	 * @return string
	 */
	private static function stringify_answer($value) {
		if (is_scalar($value) || $value === null) {
			return (string) $value;
		}
		$json = wp_json_encode($value);
		return is_string($json) ? $json : '';
	}

	/**
	 * Deliver via injected handler or wp_mail().
	 *
	 * @param string   $to      Recipient.
	 * @param string   $subject Subject.
	 * @param string   $body    Body.
	 * @param string[] $headers Headers.
	 * @return bool
	 */
	private static function deliver($to, $subject, $body, array $headers) {
		if (is_callable(self::$mail_handler)) {
			return (bool) call_user_func(self::$mail_handler, $to, $subject, $body, $headers);
		}
		if (!function_exists('wp_mail')) {
			return false;
		}
		// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_mail_wp_mail
		return (bool) wp_mail($to, $subject, $body, $headers);
	}

	/**
	 * Record delivery outcome for admin troubleshooting (no secrets / no full bodies).
	 *
	 * @param int    $lead_id Lead ID.
	 * @param string $channel admin|customer.
	 * @param string $status  sent|failed|skipped.
	 * @param string $code    Short machine code (never tokens/secrets).
	 */
	public static function record_outcome($lead_id, $channel, $status, $code = '') {
		$channel = ($channel === 'customer') ? 'customer' : 'admin';
		$status  = sanitize_key($status);
		$code    = sanitize_key($code);
		$now     = gmdate('c');

		if ($channel === 'admin') {
			update_post_meta($lead_id, VC_Lead_Meta::EMAIL_ADMIN_STATUS, $status);
			update_post_meta($lead_id, VC_Lead_Meta::EMAIL_ADMIN_AT, $now);
			update_post_meta($lead_id, VC_Lead_Meta::EMAIL_ADMIN_CODE, $code);
		} else {
			update_post_meta($lead_id, VC_Lead_Meta::EMAIL_CUSTOMER_STATUS, $status);
			update_post_meta($lead_id, VC_Lead_Meta::EMAIL_CUSTOMER_AT, $now);
			update_post_meta($lead_id, VC_Lead_Meta::EMAIL_CUSTOMER_CODE, $code);
		}
	}

	/**
	 * @return string
	 */
	private static function from_name() {
		$name = wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES);
		return $name !== '' ? $name : 'VectorCodex';
	}

	/**
	 * Prefer configured notify address as From when valid; else WP admin email.
	 *
	 * @return string
	 */
	private static function from_email() {
		$settings = VC_Lead_Security::settings();
		$notify   = isset($settings['notify_to']) ? sanitize_email((string) $settings['notify_to']) : '';
		if ($notify !== '' && is_email($notify)) {
			return $notify;
		}
		$admin = sanitize_email((string) get_option('admin_email'));
		return ($admin !== '' && is_email($admin)) ? $admin : 'noreply@vectorcodex.com';
	}

	/**
	 * @param string $name Display name.
	 * @return string
	 */
	private static function header_name($name) {
		return str_replace(array("\r", "\n", '<', '>'), '', $name);
	}

	/**
	 * @param string $name Full name.
	 * @return string
	 */
	private static function first_name($name) {
		$name = trim($name);
		if ($name === '') {
			return '';
		}
		$parts = preg_split('/\s+/', $name);
		return is_array($parts) && isset($parts[0]) ? $parts[0] : $name;
	}
}
