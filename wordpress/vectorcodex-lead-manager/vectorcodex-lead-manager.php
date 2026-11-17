<?php
/**
 * Plugin Name:       VectorCodex Lead Manager
 * Plugin URI:        https://vectorcodex.com/
 * Description:       Stores and manages website form submissions (quotes, bookings, audits, pricing calculator, and more) for VectorCodex. Separate from editorial formatting.
 * Version:           1.2.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            VectorCodex
 * Author URI:        https://vectorcodex.com/
 * License:           Proprietary
 * Text Domain:  vectorcodex-leads
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

define('VC_LEADS_VERSION', '1.2.0');
define('VC_LEADS_PLUGIN_FILE', __FILE__);
define('VC_LEADS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('VC_LEADS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('VC_LEADS_CPT', 'vc_lead');
define('VC_LEADS_REST_NS', 'vectorcodex/v1');

require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-cpt.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-meta.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-normalize.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-security.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-presentation.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-email.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-turnstile.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-rest.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-admin.php';
require_once VC_LEADS_PLUGIN_DIR . 'includes/class-vc-lead-export.php';

/**
 * Bootstrap the plugin.
 */
function vc_leads_bootstrap() {
	VC_Lead_CPT::init();
	VC_Lead_Meta::init();
	VC_Lead_Security::init();
	VC_Lead_Turnstile::init();
	VC_Lead_REST::init();
	VC_Lead_Email::init();
	VC_Lead_Admin::init();
	VC_Lead_Export::init();
}
add_action('plugins_loaded', 'vc_leads_bootstrap');

/**
 * Activation: register CPT and flush rewrite rules.
 */
function vc_leads_activate() {
	VC_Lead_CPT::register();
	flush_rewrite_rules();

	if (false === get_option('vc_leads_settings')) {
		add_option(
			'vc_leads_settings',
			array(
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
			)
		);
	} else {
		vc_leads_upgrade_settings();
	}
}

/**
 * Merge new settings keys for existing installs without overwriting secrets.
 */
function vc_leads_upgrade_settings() {
	$stored = get_option('vc_leads_settings', array());
	if (!is_array($stored)) {
		$stored = array();
	}
	$changed = false;
	if (!array_key_exists('ack_enabled', $stored)) {
		$stored['ack_enabled'] = 1;
		$changed = true;
	}
	if ($changed) {
		update_option('vc_leads_settings', $stored);
	}
}
add_action('plugins_loaded', 'vc_leads_upgrade_settings', 5);
register_activation_hook(__FILE__, 'vc_leads_activate');

/**
 * Deactivation: flush rewrite rules only (keep leads).
 */
function vc_leads_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'vc_leads_deactivate');
