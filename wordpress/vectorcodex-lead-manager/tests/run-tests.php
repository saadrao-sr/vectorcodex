<?php
/**
 * VectorCodex Lead Manager — offline + optional WP integration tests.
 *
 * Offline (no WordPress):
 *   php tests/run-tests.php
 *
 * With WordPress (plugin active):
 *   php tests/run-tests.php --wp=/path/to/wp-load.php
 *
 * Offline Turnstile tests use an injected HTTP handler — they do not call Cloudflare.
 *
 * @package VectorCodexLeadManager
 */

$wp_load = '';
foreach ($argv as $arg) {
	if (strpos($arg, '--wp=') === 0) {
		$wp_load = substr($arg, 5);
	}
}

$passed = 0;
$failed = 0;
$lines  = array();

function vc_test_assert($condition, $label, &$passed, &$failed, &$lines) {
	if ($condition) {
		$passed++;
		$lines[] = "PASS  $label";
	} else {
		$failed++;
		$lines[] = "FAIL  $label";
	}
}

$plugin_dir = dirname(__DIR__);

// --- Offline polyfills (skipped when --wp= is used before class load) ---
$GLOBALS['vc_test_options']    = array();
$GLOBALS['vc_test_meta']       = array();
$GLOBALS['vc_test_transients'] = array();

if (!defined('ABSPATH')) {
	define('ABSPATH', sys_get_temp_dir() . '/vc-leads-tests/');
}

if (!class_exists('WP_Error')) {
	class WP_Error {
		private $code;
		private $message;
		private $data;
		public function __construct($code = '', $message = '', $data = '') {
			$this->code    = $code;
			$this->message = $message;
			$this->data    = $data;
		}
		public function get_error_code() {
			return $this->code;
		}
		public function get_error_message() {
			return $this->message;
		}
		public function get_error_data() {
			return $this->data;
		}
	}
}

if (!function_exists('is_wp_error')) {
	function is_wp_error($thing) {
		return $thing instanceof WP_Error;
	}
}
if (!function_exists('sanitize_text_field')) {
	function sanitize_text_field($str) {
		return trim(strip_tags((string) $str));
	}
}
if (!function_exists('sanitize_textarea_field')) {
	function sanitize_textarea_field($str) {
		return trim(strip_tags((string) $str));
	}
}
if (!function_exists('sanitize_email')) {
	function sanitize_email($email) {
		return filter_var((string) $email, FILTER_SANITIZE_EMAIL);
	}
}
if (!function_exists('sanitize_key')) {
	function sanitize_key($key) {
		return strtolower(preg_replace('/[^a-z0-9_\-]/', '', (string) $key));
	}
}
if (!function_exists('esc_url_raw')) {
	function esc_url_raw($url) {
		return filter_var((string) $url, FILTER_SANITIZE_URL);
	}
}
if (!function_exists('wp_unslash')) {
	function wp_unslash($value) {
		return is_string($value) ? stripslashes($value) : $value;
	}
}
if (!function_exists('is_email')) {
	function is_email($email) {
		return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
	}
}
if (!function_exists('wp_parse_url')) {
	function wp_parse_url($url, $component = -1) {
		return $component === -1 ? parse_url($url) : parse_url($url, $component);
	}
}
if (!function_exists('untrailingslashit')) {
	function untrailingslashit($value) {
		return rtrim((string) $value, '/');
	}
}
if (!function_exists('wp_json_encode')) {
	function wp_json_encode($data, $options = 0, $depth = 512) {
		return json_encode($data, $options, $depth);
	}
}
if (!function_exists('wp_salt')) {
	function wp_salt($scheme = 'auth') {
		return 'vc-test-salt-' . $scheme;
	}
}
if (!function_exists('wp_specialchars_decode')) {
	function wp_specialchars_decode($string, $quote_style = ENT_NOQUOTES) {
		return htmlspecialchars_decode((string) $string, $quote_style);
	}
}
if (!function_exists('get_bloginfo')) {
	function get_bloginfo($show = '') {
		return 'VectorCodex Test';
	}
}
if (!function_exists('admin_url')) {
	function admin_url($path = '') {
		return 'https://blog.vectorcodex.com/wp-admin/' . ltrim((string) $path, '/');
	}
}
if (!function_exists('do_action')) {
	function do_action($hook) {
		return null;
	}
}
if (!function_exists('get_option')) {
	function get_option($key, $default = false) {
		if (array_key_exists($key, $GLOBALS['vc_test_options'])) {
			return $GLOBALS['vc_test_options'][$key];
		}
		if ($key === 'admin_email') {
			return 'admin@example.com';
		}
		return $default;
	}
}
if (!function_exists('update_option')) {
	function update_option($key, $value) {
		$GLOBALS['vc_test_options'][$key] = $value;
		return true;
	}
}
if (!function_exists('get_post_meta')) {
	function get_post_meta($post_id, $key = '', $single = false) {
		$store = $GLOBALS['vc_test_meta'];
		if (!isset($store[$post_id])) {
			return $single ? '' : array();
		}
		if ($key === '') {
			return $store[$post_id];
		}
		if (!isset($store[$post_id][$key])) {
			return $single ? '' : array();
		}
		return $single ? $store[$post_id][$key] : array($store[$post_id][$key]);
	}
}
if (!function_exists('update_post_meta')) {
	function update_post_meta($post_id, $key, $value) {
		if (!isset($GLOBALS['vc_test_meta'][$post_id])) {
			$GLOBALS['vc_test_meta'][$post_id] = array();
		}
		$GLOBALS['vc_test_meta'][$post_id][$key] = $value;
		return true;
	}
}
if (!function_exists('get_transient')) {
	function get_transient($key) {
		if (!isset($GLOBALS['vc_test_transients'][$key])) {
			return false;
		}
		$entry = $GLOBALS['vc_test_transients'][$key];
		if ($entry['expires'] > 0 && $entry['expires'] < time()) {
			unset($GLOBALS['vc_test_transients'][$key]);
			return false;
		}
		return $entry['value'];
	}
}
if (!function_exists('set_transient')) {
	function set_transient($key, $value, $expiration) {
		$GLOBALS['vc_test_transients'][$key] = array(
			'value'   => $value,
			'expires' => $expiration > 0 ? time() + (int) $expiration : 0,
		);
		return true;
	}
}
if (!function_exists('current_user_can')) {
	function current_user_can($cap) {
		return false;
	}
}
if (!function_exists('wp_mail')) {
	function wp_mail($to, $subject, $message, $headers = '') {
		return true;
	}
}

$GLOBALS['vc_test_options']['vc_leads_settings'] = array(
	'notify_enabled'       => 1,
	'notify_to'            => 'info@vectorcodex.com',
	'ack_enabled'          => 1,
	'rate_limit_max'       => 8,
	'rate_limit_window'    => 600,
	'max_body_bytes'       => 524288,
	'retention_days'       => 730,
	'turnstile_enabled'    => 0,
	'turnstile_site_key'   => '',
	'turnstile_secret_key' => '',
);

if (!defined('VC_LEADS_CPT')) {
	define('VC_LEADS_CPT', 'vc_lead');
}
if (!defined('VC_LEADS_REST_NS')) {
	define('VC_LEADS_REST_NS', 'vectorcodex/v1');
}
if (!defined('VC_LEADS_VERSION')) {
	define('VC_LEADS_VERSION', '1.1.0-test');
}

require_once $plugin_dir . '/includes/class-vc-lead-meta.php';
require_once $plugin_dir . '/includes/class-vc-lead-normalize.php';
require_once $plugin_dir . '/includes/class-vc-lead-security.php';
require_once $plugin_dir . '/includes/class-vc-lead-presentation.php';
require_once $plugin_dir . '/includes/class-vc-lead-email.php';
require_once $plugin_dir . '/includes/class-vc-lead-turnstile.php';

$fixtures = require $plugin_dir . '/tests/fixtures/sample-leads.php';

foreach ($fixtures as $type => $raw) {
	$result = VC_Lead_Normalize::from_request($raw);
	vc_test_assert(!empty($result['ok']), "normalize accepts $type", $passed, $failed, $lines);
	if (!empty($result['ok'])) {
		vc_test_assert($result['data']['form_type'] === $type, "form_type is $type", $passed, $failed, $lines);
		vc_test_assert($result['data']['email'] !== '', "email present for $type", $passed, $failed, $lines);
		vc_test_assert(is_array($result['data']['payload']), "payload array for $type", $passed, $failed, $lines);
	}
}

$pricing = VC_Lead_Normalize::from_request($fixtures['pricing_calculator']);
vc_test_assert(!empty($pricing['ok']), 'pricing calculator ok', $passed, $failed, $lines);
if (!empty($pricing['ok'])) {
	$p = $pricing['data']['payload'];
	vc_test_assert(isset($p['businessAnswers']['companyName']), 'pricing keeps businessAnswers', $passed, $failed, $lines);
	vc_test_assert(isset($p['serviceAnswers']['web']['websiteType']), 'pricing keeps serviceAnswers', $passed, $failed, $lines);
	vc_test_assert(isset($p['contactAnswers']['jobTitle']), 'pricing keeps contactAnswers job title', $passed, $failed, $lines);
	vc_test_assert(isset($p['contactAnswers']['consent']) && $p['contactAnswers']['consent'] === 'yes', 'pricing keeps contactAnswers', $passed, $failed, $lines);
	vc_test_assert(isset($p['estimate']['label']), 'pricing keeps estimate', $passed, $failed, $lines);
}

// Form-type-aware presentation: only relevant fields, source URL preserved.
$expected_keys = array(
	'quote'              => array('name', 'company', 'phone', 'email', 'service', 'timeline', 'budget', 'message'),
	'booking'            => array('name', 'email', 'phone', 'company', 'budget', 'service'),
	'free_audit'         => array('website', 'name', 'email', 'phone', 'company', 'focus', 'message'),
	'team_requirements'  => array('name', 'email', 'phone', 'company', 'department', 'resources', 'budget', 'engagement', 'timeline', 'message'),
	'project_inquiry'    => array('name', 'email', 'company', 'phone', 'website_url', 'service', 'budget', 'message'),
	'homepage_inquiry'   => array('name', 'email', 'phone', 'company', 'service', 'budget', 'message'),
);

$lead_seed = 200;
foreach ($expected_keys as $type => $keys) {
	$normalized = VC_Lead_Normalize::from_request($fixtures[$type]);
	vc_test_assert(!empty($normalized['ok']), "presentation seed normalize $type", $passed, $failed, $lines);
	if (empty($normalized['ok'])) {
		continue;
	}
	$id = $lead_seed++;
	VC_Lead_Meta::save_lead_fields(
		$id,
		array_merge(
			$normalized['data'],
			array(
				'submitted_at' => '2026-11-18T12:00:00+00:00',
				'source_url'   => $fixtures[$type]['source_url'],
			)
		)
	);

	$rows = VC_Lead_Presentation::form_rows($id, true);
	$row_keys = array_map(
		function ($row) {
			return $row['key'];
		},
		$rows
	);
	foreach ($keys as $key) {
		vc_test_assert(in_array($key, $row_keys, true), "$type detail includes $key", $passed, $failed, $lines);
	}
	// Irrelevant generic fields must not appear when not in this form schema.
	if ($type === 'free_audit') {
		vc_test_assert(!in_array('service', $row_keys, true), 'free_audit hides service', $passed, $failed, $lines);
		vc_test_assert(!in_array('budget', $row_keys, true), 'free_audit hides budget', $passed, $failed, $lines);
		vc_test_assert(!in_array('timeline', $row_keys, true), 'free_audit hides timeline', $passed, $failed, $lines);
	}
	if ($type === 'booking') {
		vc_test_assert(!in_array('timeline', $row_keys, true), 'booking hides timeline', $passed, $failed, $lines);
	}

	$source = VC_Lead_Presentation::source_url($id);
	vc_test_assert($source === $fixtures[$type]['source_url'], "$type source URL preserved", $passed, $failed, $lines);

	$email_body = implode("\n", VC_Lead_Presentation::admin_email_lines($id));
	vc_test_assert(strpos($email_body, 'Source URL: ' . $fixtures[$type]['source_url']) !== false, "$type email includes source URL", $passed, $failed, $lines);
	if ($type === 'free_audit') {
		vc_test_assert(strpos($email_body, 'Website name / URL:') !== false, 'free_audit email includes website', $passed, $failed, $lines);
		vc_test_assert(!preg_match('/^Service:/m', $email_body), 'free_audit email omits service', $passed, $failed, $lines);
		vc_test_assert(!preg_match('/^Budget:/m', $email_body), 'free_audit email omits budget', $passed, $failed, $lines);
		vc_test_assert(!preg_match('/^Timeline:/m', $email_body), 'free_audit email omits timeline', $passed, $failed, $lines);
	}
	if ($type === 'booking') {
		vc_test_assert(strpos($email_body, 'Timeline:') === false, 'booking email omits timeline', $passed, $failed, $lines);
	}

	$csv_details = VC_Lead_Presentation::form_details_export_text($id);
	vc_test_assert($csv_details !== '', "$type CSV details not empty", $passed, $failed, $lines);
	vc_test_assert(VC_Lead_Presentation::csv_safe('=SUM(A1)') === "'=SUM(A1)", 'CSV formula injection guarded', $passed, $failed, $lines);
}

// Pricing presentation sections + email.
$pricing_id = 300;
$pricing_payload = json_decode($fixtures['pricing_calculator']['payload_json'], true);
VC_Lead_Meta::save_lead_fields(
	$pricing_id,
	array(
		'form_type'    => 'pricing_calculator',
		'status'       => 'new',
		'name'         => 'Gabe Price',
		'email'        => 'gabe.price@example.com',
		'phone'        => '+447700903333',
		'company'      => 'Price Co',
		'service'      => 'web',
		'budget'       => 'Indicative mid-range',
		'summary'      => $fixtures['pricing_calculator']['summary'],
		'source_url'   => 'https://vectorcodex.com/pricing/',
		'submitted_at' => '2026-11-18T10:00:00+00:00',
		'payload'      => $pricing_payload,
	)
);
$sections = VC_Lead_Presentation::pricing_sections($pricing_id);
$titles = array_map(
	function ($section) {
		return $section['title'];
	},
	$sections
);
vc_test_assert(in_array('Business information', $titles, true), 'pricing sections include business', $passed, $failed, $lines);
vc_test_assert(in_array('Contact information', $titles, true), 'pricing sections include contact', $passed, $failed, $lines);
vc_test_assert(count(VC_Lead_Presentation::form_rows($pricing_id)) === 0, 'pricing uses sections not flat form rows', $passed, $failed, $lines);
$pricing_email = implode("\n", VC_Lead_Presentation::admin_email_lines($pricing_id));
vc_test_assert(strpos($pricing_email, 'Job title:') !== false, 'pricing email includes job title', $passed, $failed, $lines);
vc_test_assert(strpos($pricing_email, 'Source URL: https://vectorcodex.com/pricing/') !== false, 'pricing email includes source URL', $passed, $failed, $lines);
vc_test_assert(strpos(VC_Lead_Presentation::pricing_export_text($pricing_id), 'Company name:') !== false, 'pricing CSV export readable', $passed, $failed, $lines);

// Source URL recovery from payload when meta empty.
$legacy_id = 301;
VC_Lead_Meta::save_lead_fields(
	$legacy_id,
	array(
		'form_type' => 'quote',
		'name'      => 'Legacy',
		'email'     => 'legacy@example.com',
		'phone'     => '+441111111111',
		'company'   => 'Legacy Co',
		'service'   => 'SEO',
		'timeline'  => 'ASAP',
		'budget'    => '£1k',
		'source_url'=> '',
		'payload'   => array(
			'form_type'  => 'quote',
			'source_url' => 'https://vectorcodex.com/recovered/',
			'fields'     => array('name' => 'Legacy'),
		),
	)
);
// Clear meta source after save embedding — simulate old lead without meta URL.
update_post_meta($legacy_id, VC_Lead_Meta::SOURCE_URL, '');
vc_test_assert(
	VC_Lead_Presentation::source_url($legacy_id) === 'https://vectorcodex.com/recovered/',
	'source URL recovered from payload',
	$passed,
	$failed,
	$lines
);
vc_test_assert(
	VC_Lead_Presentation::source_url_display(9999) === VC_Lead_Presentation::NOT_RECORDED,
	'missing source URL displays Not recorded',
	$passed,
	$failed,
	$lines
);

$invalid = VC_Lead_Normalize::from_request(array('form_type' => 'quote', 'name' => '', 'email' => 'bad'));
vc_test_assert(empty($invalid['ok']), 'rejects empty/invalid quote', $passed, $failed, $lines);
vc_test_assert(isset($invalid['errors']['email']) || isset($invalid['errors']['name']), 'returns field errors', $passed, $failed, $lines);

$missing_type = VC_Lead_Normalize::from_request(array('name' => 'X', 'email' => 'x@example.com'));
vc_test_assert(empty($missing_type['ok']), 'rejects unknown form without inferable fields', $passed, $failed, $lines);

vc_test_assert(
	VC_Lead_Security::honeypot_triggered(array('form_type' => 'quote', 'website' => 'http://spam.example'), 'quote'),
	'honeypot triggers on quote website',
	$passed,
	$failed,
	$lines
);
vc_test_assert(
	!VC_Lead_Security::honeypot_triggered(array('form_type' => 'free_audit', 'website' => 'https://real.example', 'company_website' => ''), 'free_audit'),
	'free_audit website is not honeypot',
	$passed,
	$failed,
	$lines
);
vc_test_assert(
	VC_Lead_Security::honeypot_triggered(array('form_type' => 'free_audit', 'company_website' => 'spam'), 'free_audit'),
	'free_audit company_website is honeypot',
	$passed,
	$failed,
	$lines
);
vc_test_assert(
	VC_Lead_Security::honeypot_triggered(array('form_type' => 'pricing_calculator', 'company_website' => 'bot'), 'pricing_calculator'),
	'pricing company_website is honeypot',
	$passed,
	$failed,
	$lines
);

$rl = VC_Lead_Security::check_rate_limit();
vc_test_assert($rl === true, 'rate limit allows first request (polyfill)', $passed, $failed, $lines);
vc_test_assert(!VC_Lead_Security::current_user_can_manage(), 'unauthorized user cannot manage leads', $passed, $failed, $lines);

// --- Seed a fake lead for email tests ---
$lead_id = 101;
VC_Lead_Meta::save_lead_fields(
	$lead_id,
	array(
		'form_type'    => 'quote',
		'status'       => 'new',
		'name'         => 'Ava Quote',
		'email'        => 'ava.quote@example.com',
		'phone'        => '+441234567890',
		'company'      => 'Quote Co',
		'service'      => 'Web Development',
		'budget'       => '£5k–£10k',
		'timeline'     => '1-3 months',
		'message'      => 'Need a marketing site rebuild.',
		'summary'      => '',
		'source_url'   => 'https://vectorcodex.com/get-a-quote/',
		'submitted_at' => '2026-11-18T10:00:00+00:00',
		'payload'      => array('form_type' => 'quote', 'fields' => array('service' => 'Web Development')),
	)
);

$pricing_lead_id = 102;
$pricing_payload = json_decode($fixtures['pricing_calculator']['payload_json'], true);
VC_Lead_Meta::save_lead_fields(
	$pricing_lead_id,
	array(
		'form_type'    => 'pricing_calculator',
		'status'       => 'new',
		'name'         => 'Gabe Price',
		'email'        => 'gabe.price@example.com',
		'phone'        => '+447700903333',
		'company'      => 'Price Co',
		'service'      => 'web-development',
		'budget'       => 'Indicative mid-range',
		'timeline'     => '',
		'message'      => '',
		'summary'      => $fixtures['pricing_calculator']['summary'],
		'source_url'   => 'https://vectorcodex.com/pricing/',
		'submitted_at' => '2026-11-18T10:00:00+00:00',
		'payload'      => $pricing_payload,
	)
);

// Admin notification.
$sent_mail = array();
VC_Lead_Email::set_mail_handler(
	function ($to, $subject, $body, $headers) use (&$sent_mail) {
		$sent_mail[] = compact('to', 'subject', 'body', 'headers');
		return true;
	}
);
VC_Lead_Email::notify_staff($lead_id);
vc_test_assert(count($sent_mail) === 1, 'admin notification sends one email', $passed, $failed, $lines);
vc_test_assert($sent_mail[0]['to'] === 'info@vectorcodex.com', 'admin notification to info@vectorcodex.com', $passed, $failed, $lines);
vc_test_assert(strpos($sent_mail[0]['subject'], 'Quote') !== false, 'admin subject includes form type', $passed, $failed, $lines);
vc_test_assert(strpos($sent_mail[0]['body'], 'ava.quote@example.com') !== false, 'admin body includes lead email', $passed, $failed, $lines);
vc_test_assert(VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_ADMIN_STATUS) === 'sent', 'admin email status recorded as sent', $passed, $failed, $lines);

// Pricing admin email includes readable summary + admin link (full payload stays in WP).
$sent_mail = array();
VC_Lead_Email::notify_staff($pricing_lead_id);
vc_test_assert(count($sent_mail) === 1, 'pricing admin notification sends', $passed, $failed, $lines);
vc_test_assert(strpos($sent_mail[0]['body'], 'Business information') !== false || strpos($sent_mail[0]['body'], 'Contact information') !== false, 'pricing admin email includes readable grouped sections', $passed, $failed, $lines);
vc_test_assert(strpos($sent_mail[0]['body'], 'Source URL:') !== false, 'pricing admin email includes source URL', $passed, $failed, $lines);
vc_test_assert(strpos($sent_mail[0]['body'], 'lead_id=' . $pricing_lead_id) !== false, 'pricing admin email links to complete lead detail', $passed, $failed, $lines);

// Customer acknowledgement.
$sent_mail = array();
VC_Lead_Email::acknowledge_customer($lead_id);
vc_test_assert(count($sent_mail) === 1, 'customer acknowledgement sends one email', $passed, $failed, $lines);
vc_test_assert($sent_mail[0]['to'] === 'ava.quote@example.com', 'customer ack goes to submitter', $passed, $failed, $lines);
vc_test_assert(strpos($sent_mail[0]['body'], 'Thank you') !== false, 'customer ack is professional', $passed, $failed, $lines);
vc_test_assert(VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_CUSTOMER_STATUS) === 'sent', 'customer email status recorded as sent', $passed, $failed, $lines);

// Email failure must not prevent "storage success" path — send_for_lead still returns true and records failed.
$fail_lead = 103;
VC_Lead_Meta::save_lead_fields(
	$fail_lead,
	array(
		'form_type' => 'booking',
		'status'    => 'new',
		'name'      => 'Fail Case',
		'email'     => 'fail.case@example.com',
		'phone'     => '+447700900000',
		'company'   => 'Fail Co',
		'service'   => 'SEO',
		'payload'   => array('form_type' => 'booking'),
	)
);
VC_Lead_Email::set_mail_handler(
	function () {
		return false;
	}
);
$mail_ok = VC_Lead_Email::send_for_lead($fail_lead);
vc_test_assert($mail_ok === true, 'email failure still returns success for storage independence', $passed, $failed, $lines);
vc_test_assert(VC_Lead_Meta::get($fail_lead, VC_Lead_Meta::EMAIL_ADMIN_STATUS) === 'failed', 'admin failure recorded', $passed, $failed, $lines);
vc_test_assert(VC_Lead_Meta::get($fail_lead, VC_Lead_Meta::EMAIL_CUSTOMER_STATUS) === 'failed', 'customer failure recorded', $passed, $failed, $lines);
vc_test_assert(VC_Lead_Meta::get($fail_lead, VC_Lead_Meta::NAME) === 'Fail Case', 'lead meta intact after email failure', $passed, $failed, $lines);

VC_Lead_Email::set_mail_handler(null);

// --- Turnstile (mocked HTTP — not live Cloudflare) ---
$settings = $GLOBALS['vc_test_options']['vc_leads_settings'];

// Disabled mode soft-passes without token.
$settings['turnstile_enabled'] = 0;
$settings['turnstile_secret_key'] = '';
$settings['turnstile_site_key'] = '';
$GLOBALS['vc_test_options']['vc_leads_settings'] = $settings;
vc_test_assert(VC_Lead_Turnstile::verify('') === true, 'turnstile disabled mode allows missing token', $passed, $failed, $lines);
vc_test_assert(VC_Lead_Turnstile::status()['tone'] === 'neutral', 'turnstile status disabled indicator', $passed, $failed, $lines);

// Enabled but missing configuration.
$settings['turnstile_enabled'] = 1;
$settings['turnstile_secret_key'] = '';
$settings['turnstile_site_key'] = '';
$GLOBALS['vc_test_options']['vc_leads_settings'] = $settings;
$mis = VC_Lead_Turnstile::verify('tok');
vc_test_assert(is_wp_error($mis) && $mis->get_error_code() === 'vc_leads_turnstile_misconfigured', 'turnstile rejects when enabled without secret', $passed, $failed, $lines);
vc_test_assert(VC_Lead_Turnstile::status()['tone'] === 'warn', 'turnstile incomplete config indicator', $passed, $failed, $lines);

// Enabled + configured.
$settings['turnstile_site_key'] = 'site-public-key';
$settings['turnstile_secret_key'] = 'secret-private-key';
$GLOBALS['vc_test_options']['vc_leads_settings'] = $settings;
$GLOBALS['vc_test_transients'] = array();

$missing = VC_Lead_Turnstile::verify('');
vc_test_assert(is_wp_error($missing) && $missing->get_error_code() === 'vc_leads_turnstile_missing', 'turnstile rejects missing token when enabled', $passed, $failed, $lines);

$last_verify_url = '';
VC_Lead_Turnstile::set_http_handler(
	function ($url, $args) use (&$last_verify_url) {
		$last_verify_url = $url;
		$body = isset($args['body']) ? $args['body'] : array();
		// Ensure secret is used server-side but tests never print it.
		if (empty($body['secret']) || $body['secret'] !== 'secret-private-key') {
			return array(
				'response' => array('code' => 200),
				'body'     => wp_json_encode(array('success' => false, 'error-codes' => array('invalid-input-secret'))),
			);
		}
		$token = isset($body['response']) ? (string) $body['response'] : '';
		if ($token === 'valid-token') {
			return array(
				'response' => array('code' => 200),
				'body'     => wp_json_encode(array('success' => true)),
			);
		}
		if ($token === 'expired-token') {
			return array(
				'response' => array('code' => 200),
				'body'     => wp_json_encode(array('success' => false, 'error-codes' => array('timeout-or-duplicate'))),
			);
		}
		if ($token === 'invalid-token') {
			return array(
				'response' => array('code' => 200),
				'body'     => wp_json_encode(array('success' => false, 'error-codes' => array('invalid-input-response'))),
			);
		}
		if ($token === 'reused-cf-token') {
			return array(
				'response' => array('code' => 200),
				'body'     => wp_json_encode(array('success' => false, 'error-codes' => array('invalid-or-already-seen-response'))),
			);
		}
		return array(
			'response' => array('code' => 200),
			'body'     => wp_json_encode(array('success' => false, 'error-codes' => array('bad-request'))),
		);
	}
);

$valid = VC_Lead_Turnstile::verify('valid-token');
vc_test_assert($valid === true, 'turnstile accepts valid token (mocked siteverify)', $passed, $failed, $lines);
vc_test_assert(strpos($last_verify_url, 'siteverify') !== false, 'turnstile posts to siteverify URL', $passed, $failed, $lines);

$invalid_tok = VC_Lead_Turnstile::verify('invalid-token');
vc_test_assert(is_wp_error($invalid_tok) && $invalid_tok->get_error_code() === 'vc_leads_turnstile_invalid', 'turnstile rejects invalid token', $passed, $failed, $lines);

$expired = VC_Lead_Turnstile::verify('expired-token');
vc_test_assert(is_wp_error($expired) && $expired->get_error_code() === 'vc_leads_turnstile_expired', 'turnstile rejects expired/duplicate token', $passed, $failed, $lines);

$reused_cf = VC_Lead_Turnstile::verify('reused-cf-token');
vc_test_assert(is_wp_error($reused_cf) && $reused_cf->get_error_code() === 'vc_leads_turnstile_reused', 'turnstile rejects Cloudflare already-seen token', $passed, $failed, $lines);

// Local replay protection after a successful verify.
$again = VC_Lead_Turnstile::verify('valid-token');
vc_test_assert(is_wp_error($again) && $again->get_error_code() === 'vc_leads_turnstile_reused', 'turnstile rejects locally reused token', $passed, $failed, $lines);

// Secret must never appear in error messages.
vc_test_assert(strpos($invalid_tok->get_error_message(), 'secret-private-key') === false, 'turnstile errors do not expose secret', $passed, $failed, $lines);
$status = VC_Lead_Turnstile::status();
vc_test_assert($status['ready'] === true && $status['secret_set'] === true, 'turnstile ready status without revealing secret', $passed, $failed, $lines);
$status_json = wp_json_encode($status);
vc_test_assert(strpos($status_json, 'secret-private-key') === false, 'turnstile status JSON has no secret value', $passed, $failed, $lines);

VC_Lead_Turnstile::set_http_handler(null);

// Optional live WordPress REST checks.
if ($wp_load !== '' && is_readable($wp_load)) {
	require_once $wp_load;
	$endpoint = rest_url(VC_LEADS_REST_NS . '/leads');
	$lines[] = 'INFO  Live endpoint: ' . $endpoint;

	foreach ($fixtures as $type => $raw) {
		$request = new WP_REST_Request('POST', '/' . VC_LEADS_REST_NS . '/leads');
		$request->set_body_params($raw);
		$request->set_header('Content-Type', 'multipart/form-data');
		$response = rest_do_request($request);
		$data = $response->get_data();
		$status_code = $response->get_status();
		vc_test_assert($status_code === 200 && !empty($data['ok']), "REST stores $type", $passed, $failed, $lines);
		vc_test_assert(empty($data['lead']) && empty($data['id']) && empty($data['payload']), "REST does not leak lead for $type", $passed, $failed, $lines);
	}

	$hp = new WP_REST_Request('POST', '/' . VC_LEADS_REST_NS . '/leads');
	$hp->set_body_params(array_merge($fixtures['quote'], array('website' => 'http://bot.example')));
	$hp_res = rest_do_request($hp);
	$hp_data = $hp_res->get_data();
	vc_test_assert(!empty($hp_data['ok']), 'REST honeypot returns success', $passed, $failed, $lines);

	$bad = new WP_REST_Request('POST', '/' . VC_LEADS_REST_NS . '/leads');
	$bad->set_body_params(array('form_type' => 'quote', 'name' => '', 'email' => 'nope'));
	$bad_res = rest_do_request($bad);
	$bad_data = $bad_res->get_data();
	vc_test_assert($bad_res->get_status() === 400 && empty($bad_data['ok']), 'REST rejects invalid quote', $passed, $failed, $lines);

	$settings_live = get_option('vc_leads_settings', array());
	$settings_live['rate_limit_max'] = 1;
	$settings_live['rate_limit_window'] = 600;
	update_option('vc_leads_settings', $settings_live);
	$ip_hash = VC_Lead_Security::client_ip_hash();
	set_transient('vc_leads_rl_' . substr($ip_hash, 0, 32), 1, 600);
	$rl_req = new WP_REST_Request('POST', '/' . VC_LEADS_REST_NS . '/leads');
	$rl_req->set_body_params($fixtures['booking']);
	$rl_res = rest_do_request($rl_req);
	vc_test_assert($rl_res->get_status() === 429, 'REST rate limits when exceeded', $passed, $failed, $lines);

	$types = get_post_types(array('name' => VC_LEADS_CPT), 'objects');
	$cpt = isset($types[VC_LEADS_CPT]) ? $types[VC_LEADS_CPT] : null;
	vc_test_assert($cpt && empty($cpt->show_in_rest), 'vc_lead not exposed on public REST', $passed, $failed, $lines);
	vc_test_assert($cpt && empty($cpt->publicly_queryable), 'vc_lead not publicly queryable', $passed, $failed, $lines);
} else {
	$lines[] = 'INFO  Live Cloudflare Siteverify / SMTP not exercised (offline mocked transports only).';
}

echo implode("\n", $lines) . "\n";
echo "----\nPassed: $passed  Failed: $failed\n";
exit($failed > 0 ? 1 : 0);
