<?php
/**
 * Admin dashboard: VectorCodex Leads list, filters, detail, settings.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Admin {

	const MENU_SLUG     = 'vc-leads';
	const SETTINGS_SLUG = 'vc-leads-settings';

	/**
	 * Hook registration.
	 */
	public static function init() {
		add_action('admin_menu', array(__CLASS__, 'register_menu'));
		add_action('admin_init', array(__CLASS__, 'handle_actions'));
		add_action('admin_enqueue_scripts', array(__CLASS__, 'enqueue_assets'));
		add_filter('post_row_actions', array(__CLASS__, 'row_actions'), 10, 2);
	}

	/**
	 * Top-level admin menu.
	 */
	public static function register_menu() {
		add_menu_page(
			'VectorCodex Leads',
			'VectorCodex Leads',
			'manage_options',
			self::MENU_SLUG,
			array(__CLASS__, 'render_page'),
			'dashicons-id',
			26
		);

		add_submenu_page(
			self::MENU_SLUG,
			'All Leads',
			'All Leads',
			'manage_options',
			self::MENU_SLUG,
			array(__CLASS__, 'render_page')
		);

		add_submenu_page(
			self::MENU_SLUG,
			'Lead Settings',
			'Settings',
			'manage_options',
			self::SETTINGS_SLUG,
			array(__CLASS__, 'render_settings')
		);
	}

	/**
	 * Enqueue admin CSS/JS only on plugin screens.
	 *
	 * @param string $hook Hook suffix.
	 */
	public static function enqueue_assets($hook) {
		if (strpos($hook, self::MENU_SLUG) === false && strpos($hook, self::SETTINGS_SLUG) === false) {
			return;
		}
		wp_enqueue_style(
			'vc-leads-admin',
			VC_LEADS_PLUGIN_URL . 'assets/admin.css',
			array(),
			VC_LEADS_VERSION
		);
		wp_enqueue_script(
			'vc-leads-admin',
			VC_LEADS_PLUGIN_URL . 'assets/admin.js',
			array(),
			VC_LEADS_VERSION,
			true
		);
	}

	/**
	 * Soften CPT row actions if ever shown.
	 *
	 * @param array   $actions Actions.
	 * @param WP_Post $post    Post.
	 * @return array
	 */
	public static function row_actions($actions, $post) {
		if ($post->post_type !== VC_LEADS_CPT) {
			return $actions;
		}
		unset($actions['inline hide-if-no-js'], $actions['view']);
		return $actions;
	}

	/**
	 * Handle status updates, deletes, settings saves (capability-checked).
	 */
	public static function handle_actions() {
		if (!is_admin() || !VC_Lead_Security::current_user_can_manage()) {
			return;
		}

		if (isset($_POST['vc_leads_save_settings'])) {
			check_admin_referer('vc_leads_settings');
			self::save_settings_from_post();
			wp_safe_redirect(add_query_arg(array('page' => self::SETTINGS_SLUG, 'updated' => '1'), admin_url('admin.php')));
			exit;
		}

		if (empty($_GET['page']) || $_GET['page'] !== self::MENU_SLUG) {
			return;
		}

		$action = isset($_REQUEST['vc_action']) ? sanitize_key((string) $_REQUEST['vc_action']) : '';
		if ($action === '') {
			return;
		}

		$lead_id = isset($_REQUEST['lead_id']) ? absint($_REQUEST['lead_id']) : 0;

		if ($action === 'update_status' && $lead_id) {
			check_admin_referer('vc_leads_status_' . $lead_id);
			$status = isset($_POST['vc_status']) ? sanitize_key((string) $_POST['vc_status']) : '';
			$allowed = VC_Lead_Meta::statuses();
			if (isset($allowed[$status]) && self::is_lead($lead_id)) {
				update_post_meta($lead_id, VC_Lead_Meta::STATUS, $status);
			}
			wp_safe_redirect(add_query_arg(array('page' => self::MENU_SLUG, 'action' => 'view', 'lead_id' => $lead_id, 'updated' => '1'), admin_url('admin.php')));
			exit;
		}

		if ($action === 'delete' && $lead_id) {
			check_admin_referer('vc_leads_delete_' . $lead_id);
			if (self::is_lead($lead_id)) {
				wp_delete_post($lead_id, true);
			}
			wp_safe_redirect(add_query_arg(array('page' => self::MENU_SLUG, 'deleted' => '1'), admin_url('admin.php')));
			exit;
		}
	}

	/**
	 * Persist settings (no hardcoded secrets).
	 */
	private static function save_settings_from_post() {
		$current = VC_Lead_Security::settings();
		$next = array(
			'notify_enabled'       => empty($_POST['notify_enabled']) ? 0 : 1,
			'notify_to'            => isset($_POST['notify_to']) ? sanitize_email(wp_unslash((string) $_POST['notify_to'])) : $current['notify_to'],
			'ack_enabled'          => empty($_POST['ack_enabled']) ? 0 : 1,
			'rate_limit_max'       => isset($_POST['rate_limit_max']) ? max(1, absint($_POST['rate_limit_max'])) : $current['rate_limit_max'],
			'rate_limit_window'    => isset($_POST['rate_limit_window']) ? max(60, absint($_POST['rate_limit_window'])) : $current['rate_limit_window'],
			'max_body_bytes'       => isset($_POST['max_body_bytes']) ? max(1024, absint($_POST['max_body_bytes'])) : $current['max_body_bytes'],
			'retention_days'       => isset($_POST['retention_days']) ? max(30, absint($_POST['retention_days'])) : $current['retention_days'],
			'turnstile_enabled'    => empty($_POST['turnstile_enabled']) ? 0 : 1,
			'turnstile_site_key'   => isset($_POST['turnstile_site_key']) ? sanitize_text_field(wp_unslash((string) $_POST['turnstile_site_key'])) : '',
			'turnstile_secret_key' => isset($_POST['turnstile_secret_key']) ? sanitize_text_field(wp_unslash((string) $_POST['turnstile_secret_key'])) : '',
		);
		if ($next['notify_to'] === '') {
			$next['notify_to'] = 'info@vectorcodex.com';
		}
		// Keep previous secret if the field was left blank (avoid accidental wipe).
		if ($next['turnstile_secret_key'] === '' && !empty($current['turnstile_secret_key'])) {
			$next['turnstile_secret_key'] = $current['turnstile_secret_key'];
		}
		update_option('vc_leads_settings', $next);
	}

	/**
	 * Router for list vs detail.
	 */
	public static function render_page() {
		if (!VC_Lead_Security::current_user_can_manage()) {
			wp_die(esc_html__('You do not have permission to manage leads.', 'vectorcodex-leads'), 403);
		}

		$action = isset($_GET['action']) ? sanitize_key((string) $_GET['action']) : 'list';
		$lead_id = isset($_GET['lead_id']) ? absint($_GET['lead_id']) : 0;

		if ($action === 'view' && $lead_id && self::is_lead($lead_id)) {
			self::render_detail($lead_id);
			return;
		}

		self::render_list();
	}

	/**
	 * List table with search + filters.
	 */
	private static function render_list() {
		$search    = isset($_GET['s']) ? sanitize_text_field(wp_unslash((string) $_GET['s'])) : '';
		$form_type = isset($_GET['form_type']) ? sanitize_key((string) $_GET['form_type']) : '';
		$status    = isset($_GET['status']) ? sanitize_key((string) $_GET['status']) : '';
		$date_from = isset($_GET['date_from']) ? sanitize_text_field(wp_unslash((string) $_GET['date_from'])) : '';
		$date_to   = isset($_GET['date_to']) ? sanitize_text_field(wp_unslash((string) $_GET['date_to'])) : '';
		$paged     = max(1, isset($_GET['paged']) ? absint($_GET['paged']) : 1);
		$per_page  = 20;

		$query = self::query_leads(
			array(
				'search'    => $search,
				'form_type' => $form_type,
				'status'    => $status,
				'date_from' => $date_from,
				'date_to'   => $date_to,
				'paged'     => $paged,
				'per_page'  => $per_page,
			)
		);

		$types = VC_Lead_Meta::form_types();
		$statuses = VC_Lead_Meta::statuses();
		$total_pages = max(1, (int) $query->max_num_pages);

		$export_url = wp_nonce_url(
			add_query_arg(
				array(
					'page'      => self::MENU_SLUG,
					'vc_action' => 'export_csv',
					's'         => $search,
					'form_type' => $form_type,
					'status'    => $status,
					'date_from' => $date_from,
					'date_to'   => $date_to,
				),
				admin_url('admin.php')
			),
			'vc_leads_export'
		);

		echo '<div class="wrap vc-leads-wrap">';
		echo '<h1 class="wp-heading-inline">VectorCodex Leads</h1>';
		echo ' <a class="page-title-action" href="' . esc_url($export_url) . '">Export CSV</a>';
		echo '<hr class="wp-header-end" />';

		if (!empty($_GET['deleted'])) {
			echo '<div class="notice notice-success is-dismissible"><p>Lead deleted.</p></div>';
		}

		echo '<form method="get" class="vc-leads-filters">';
		echo '<input type="hidden" name="page" value="' . esc_attr(self::MENU_SLUG) . '" />';
		echo '<p class="search-box">';
		echo '<label class="screen-reader-text" for="vc-leads-search">Search leads</label>';
		echo '<input type="search" id="vc-leads-search" name="s" value="' . esc_attr($search) . '" placeholder="Search name, email, company…" />';
		echo '</p>';

		echo '<div class="vc-leads-filter-row">';
		echo '<label>Form type <select name="form_type"><option value="">All types</option>';
		foreach ($types as $key => $label) {
			printf('<option value="%s"%s>%s</option>', esc_attr($key), selected($form_type, $key, false), esc_html($label));
		}
		echo '</select></label>';

		echo '<label>Status <select name="status"><option value="">All statuses</option>';
		foreach ($statuses as $key => $label) {
			printf('<option value="%s"%s>%s</option>', esc_attr($key), selected($status, $key, false), esc_html($label));
		}
		echo '</select></label>';

		echo '<label>From <input type="date" name="date_from" value="' . esc_attr($date_from) . '" /></label>';
		echo '<label>To <input type="date" name="date_to" value="' . esc_attr($date_to) . '" /></label>';
		submit_button('Filter', 'secondary', '', false);
		echo '</div></form>';

		echo '<table class="wp-list-table widefat fixed striped vc-leads-table">';
		echo '<thead><tr>';
		echo '<th>Form type</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Service</th><th>Submitted</th><th>Status</th>';
		echo '</tr></thead><tbody>';

		if (empty($query->posts)) {
			echo '<tr><td colspan="8">No leads found.</td></tr>';
		} else {
			foreach ($query->posts as $post) {
				$id = (int) $post->ID;
				$view = add_query_arg(array('page' => self::MENU_SLUG, 'action' => 'view', 'lead_id' => $id), admin_url('admin.php'));
				$ft = VC_Lead_Meta::get($id, VC_Lead_Meta::FORM_TYPE);
				$st = VC_Lead_Meta::get($id, VC_Lead_Meta::STATUS);
				$submitted = VC_Lead_Meta::get($id, VC_Lead_Meta::SUBMITTED_AT);
				if ($submitted === '') {
					$submitted = get_post_time('c', true, $post);
				}
				echo '<tr>';
				echo '<td>' . esc_html(isset($types[$ft]) ? $types[$ft] : $ft) . '</td>';
				echo '<td><a href="' . esc_url($view) . '"><strong>' . esc_html(VC_Lead_Meta::get($id, VC_Lead_Meta::NAME)) . '</strong></a></td>';
				echo '<td>' . esc_html(VC_Lead_Meta::get($id, VC_Lead_Meta::EMAIL)) . '</td>';
				echo '<td>' . esc_html(VC_Lead_Meta::get($id, VC_Lead_Meta::PHONE)) . '</td>';
				echo '<td>' . esc_html(VC_Lead_Meta::get($id, VC_Lead_Meta::COMPANY)) . '</td>';
				echo '<td>' . esc_html(VC_Lead_Meta::get($id, VC_Lead_Meta::SERVICE)) . '</td>';
				echo '<td>' . esc_html(self::format_datetime($submitted)) . '</td>';
				echo '<td><span class="vc-leads-status vc-leads-status--' . esc_attr($st) . '">' . esc_html(isset($statuses[$st]) ? $statuses[$st] : $st) . '</span></td>';
				echo '</tr>';
			}
		}
		echo '</tbody></table>';

		if ($total_pages > 1) {
			echo '<div class="tablenav bottom"><div class="tablenav-pages">';
			echo paginate_links(
				array(
					'base'      => add_query_arg('paged', '%#%'),
					'format'    => '',
					'current'   => $paged,
					'total'     => $total_pages,
					'prev_text' => '&laquo;',
					'next_text' => '&raquo;',
				)
			);
			echo '</div></div>';
		}

		echo '<p class="description">Leads are private. Only administrators with <code>manage_options</code> can view or export them. Personal data retention: review periodically (see Settings).</p>';
		echo '</div>';
	}

	/**
	 * Lead detail + payload inspection.
	 *
	 * @param int $lead_id Lead ID.
	 */
	private static function render_detail($lead_id) {
		$types = VC_Lead_Meta::form_types();
		$statuses = VC_Lead_Meta::statuses();
		$form_type = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::FORM_TYPE);
		$status = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::STATUS);
		$payload = VC_Lead_Meta::get_payload($lead_id);
		$back = add_query_arg(array('page' => self::MENU_SLUG), admin_url('admin.php'));
		$delete_url = wp_nonce_url(
			add_query_arg(array('page' => self::MENU_SLUG, 'vc_action' => 'delete', 'lead_id' => $lead_id), admin_url('admin.php')),
			'vc_leads_delete_' . $lead_id
		);

		echo '<div class="wrap vc-leads-wrap">';
		echo '<h1>Lead detail</h1>';
		if (!empty($_GET['updated'])) {
			echo '<div class="notice notice-success is-dismissible"><p>Lead updated.</p></div>';
		}
		echo '<p><a href="' . esc_url($back) . '">&larr; Back to all leads</a></p>';

		$source_display = VC_Lead_Presentation::source_url_display($lead_id);
		$source_url     = VC_Lead_Presentation::source_url($lead_id);

		echo '<div class="vc-leads-detail-grid">';
		echo '<div class="vc-leads-card">';
		echo '<h2>Submission</h2>';
		echo '<table class="form-table"><tbody>';
		self::detail_row('Form type', isset($types[$form_type]) ? $types[$form_type] : $form_type);
		self::detail_row('Submitted', self::format_datetime(VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SUBMITTED_AT)));
		echo '<tr><th scope="row">Source URL</th><td>';
		if ($source_url !== '') {
			echo '<a href="' . esc_url($source_url) . '" target="_blank" rel="noopener noreferrer"><strong>' . esc_html($source_display) . '</strong></a>';
		} else {
			echo '<strong>' . esc_html(VC_Lead_Presentation::NOT_RECORDED) . '</strong>';
		}
		echo '</td></tr>';
		echo '</tbody></table>';

		if ($form_type === 'pricing_calculator') {
			echo '<h3>Pricing calculator answers</h3>';
			self::render_pricing_sections(VC_Lead_Presentation::pricing_sections($lead_id));
			$summary = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SUMMARY);
			if ($summary !== '') {
				echo '<h3>Summary text</h3><pre class="vc-leads-pre">' . esc_html($summary) . '</pre>';
			}
		} else {
			echo '<h3>Submitted fields</h3>';
			echo '<table class="form-table"><tbody>';
			foreach (VC_Lead_Presentation::form_rows($lead_id, true) as $row) {
				$value = $row['value'];
				if ($value === '' && in_array($row['key'], VC_Lead_Presentation::optional_keys($form_type), true)) {
					continue;
				}
				if ($row['key'] === 'message' && $value !== '') {
					echo '<tr><th scope="row">' . esc_html($row['label']) . '</th><td><pre class="vc-leads-pre">' . esc_html($value) . '</pre></td></tr>';
				} else {
					self::detail_row($row['label'], $value !== '' ? $value : '—');
				}
			}
			echo '</tbody></table>';
		}
		echo '</div>';

		echo '<div class="vc-leads-card">';
		echo '<h2>Status</h2>';
		echo '<form method="post" action="' . esc_url(admin_url('admin.php?page=' . self::MENU_SLUG)) . '">';
		wp_nonce_field('vc_leads_status_' . $lead_id);
		echo '<input type="hidden" name="vc_action" value="update_status" />';
		echo '<input type="hidden" name="lead_id" value="' . esc_attr((string) $lead_id) . '" />';
		echo '<select name="vc_status">';
		foreach ($statuses as $key => $label) {
			printf('<option value="%s"%s>%s</option>', esc_attr($key), selected($status, $key, false), esc_html($label));
		}
		echo '</select> ';
		submit_button('Update status', 'primary', '', false);
		echo '</form>';

		echo '<h3>Email delivery</h3>';
		echo '<table class="form-table"><tbody>';
		self::detail_row(
			'Admin notification',
			self::format_email_outcome(
				VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_ADMIN_STATUS),
				VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_ADMIN_AT),
				VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_ADMIN_CODE)
			)
		);
		self::detail_row(
			'Customer acknowledgement',
			self::format_email_outcome(
				VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_CUSTOMER_STATUS),
				VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_CUSTOMER_AT),
				VC_Lead_Meta::get($lead_id, VC_Lead_Meta::EMAIL_CUSTOMER_CODE)
			)
		);
		echo '</tbody></table>';
		echo '<p class="description">Email outcomes are recorded for troubleshooting. Failures never delete the lead. Codes never include message bodies or secrets.</p>';

		echo '<p class="vc-leads-danger"><a class="button button-link-delete" href="' . esc_url($delete_url) . '" onclick="return confirm(\'Delete this lead permanently?\');">Delete lead</a></p>';
		echo '<p class="description">IP is stored only as a salted hash for rate-limit forensics. User agent (truncated): ' . esc_html(VC_Lead_Meta::get($lead_id, VC_Lead_Meta::USER_AGENT)) . '</p>';
		echo '</div>';
		echo '</div>';

		echo '<div class="vc-leads-card vc-leads-card--wide">';
		echo '<h2>Complete original payload</h2>';
		echo '<p class="description">Preserved submission JSON for auditability. The sections above show only fields relevant to this form type.</p>';
		echo '<pre class="vc-leads-pre vc-leads-pre--json">' . esc_html(wp_json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) . '</pre>';
		echo '</div>';

		echo '</div>';
	}

	/**
	 * Render grouped pricing sections from presentation helper.
	 *
	 * @param array $sections Sections.
	 */
	private static function render_pricing_sections(array $sections) {
		if (empty($sections)) {
			echo '<p>No pricing answers recorded.</p>';
			return;
		}
		echo '<div class="vc-leads-pricing">';
		foreach ($sections as $section) {
			$title = isset($section['title']) ? (string) $section['title'] : '';
			$rows  = isset($section['rows']) && is_array($section['rows']) ? $section['rows'] : array();
			if ($title !== '') {
				echo '<h4>' . esc_html($title) . '</h4>';
			}
			echo '<table class="widefat striped vc-leads-kv"><tbody>';
			foreach ($rows as $row) {
				$label = isset($row['label']) ? (string) $row['label'] : '';
				$value = isset($row['value']) ? (string) $row['value'] : '';
				if ($value === '') {
					continue;
				}
				echo '<tr><th>' . esc_html($label) . '</th><td>' . esc_html($value) . '</td></tr>';
			}
			echo '</tbody></table>';
		}
		echo '</div>';
	}

	/**
	 * Settings screen.
	 */
	public static function render_settings() {
		if (!VC_Lead_Security::current_user_can_manage()) {
			wp_die(esc_html__('You do not have permission to manage lead settings.', 'vectorcodex-leads'), 403);
		}
		$s = VC_Lead_Security::settings();
		$mail_status = self::email_config_status($s);
		$ts_status   = VC_Lead_Turnstile::status();

		echo '<div class="wrap vc-leads-wrap">';
		echo '<h1>Lead Settings</h1>';
		if (!empty($_GET['updated'])) {
			echo '<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>';
		}

		echo '<div class="vc-leads-status-grid">';
		echo '<div class="vc-leads-card"><h2>Email status</h2>';
		echo '<p><span class="vc-leads-pill vc-leads-pill--' . esc_attr($mail_status['tone']) . '">' . esc_html($mail_status['label']) . '</span></p>';
		echo '<ul class="vc-leads-status-list">';
		echo '<li>Admin notify: ' . esc_html(!empty($s['notify_enabled']) ? 'On' : 'Off') . ' → ' . esc_html((string) $s['notify_to']) . '</li>';
		echo '<li>Customer acknowledgement: ' . esc_html(!empty($s['ack_enabled']) ? 'On' : 'Off') . '</li>';
		echo '<li>Transport: WordPress <code>wp_mail()</code> (configure SMTP for reliable delivery)</li>';
		echo '</ul></div>';

		echo '<div class="vc-leads-card"><h2>Turnstile status</h2>';
		echo '<p><span class="vc-leads-pill vc-leads-pill--' . esc_attr($ts_status['tone']) . '">' . esc_html($ts_status['label']) . '</span></p>';
		echo '<ul class="vc-leads-status-list">';
		echo '<li>Site key: ' . esc_html($ts_status['site_key_set'] ? 'Set' : 'Missing') . '</li>';
		echo '<li>Secret key: ' . esc_html($ts_status['secret_set'] ? 'Set (hidden)' : 'Missing') . '</li>';
		echo '<li>Frontend field required when enabled: <code>cf-turnstile-response</code></li>';
		echo '</ul></div></div>';

		echo '<form method="post">';
		wp_nonce_field('vc_leads_settings');
		echo '<input type="hidden" name="vc_leads_save_settings" value="1" />';
		echo '<table class="form-table" role="presentation"><tbody>';

		echo '<tr><th>Admin notification</th><td>';
		echo '<label><input type="checkbox" name="notify_enabled" value="1"' . checked(!empty($s['notify_enabled']), true, false) . ' /> Send admin email after each stored lead</label>';
		echo '<p class="description">Leads are always stored even when mail is disabled or SMTP fails.</p>';
		echo '</td></tr>';

		echo '<tr><th><label for="notify_to">Admin notification email</label></th><td>';
		echo '<input type="email" class="regular-text" id="notify_to" name="notify_to" value="' . esc_attr((string) $s['notify_to']) . '" />';
		echo '<p class="description">Default: <code>info@vectorcodex.com</code>.</p>';
		echo '</td></tr>';

		echo '<tr><th>Customer acknowledgement</th><td>';
		echo '<label><input type="checkbox" name="ack_enabled" value="1"' . checked(!empty($s['ack_enabled']), true, false) . ' /> Send acknowledgement to the customer email</label>';
		echo '</td></tr>';

		echo '<tr><th>Email / SMTP guidance</th><td>';
		echo '<div class="vc-leads-guidance">';
		echo '<p>This plugin uses <code>wp_mail()</code>. On many hosts the default PHP mailer is unreliable or marked as spam.</p>';
		echo '<ol>';
		echo '<li>Install a trusted SMTP plugin (e.g. WP Mail SMTP, FluentSMTP, or Post SMTP).</li>';
		echo '<li>Authenticate with your provider (Google Workspace, Microsoft 365, SendGrid, Amazon SES, etc.).</li>';
		echo '<li>Set the From address to a domain you control (ideally matching <code>info@vectorcodex.com</code>).</li>';
		echo '<li>Send a test message from the SMTP plugin, then submit a test lead and check the lead detail <strong>Email delivery</strong> panel.</li>';
		echo '</ol>';
		echo '<p class="description">Do not put SMTP passwords in this plugin. Keep credentials in your SMTP plugin or hosting secrets manager.</p>';
		echo '</div></td></tr>';

		echo '<tr><th>Rate limit</th><td>';
		echo 'Max <input type="number" min="1" name="rate_limit_max" value="' . esc_attr((string) $s['rate_limit_max']) . '" class="small-text" /> submissions per ';
		echo '<input type="number" min="60" name="rate_limit_window" value="' . esc_attr((string) $s['rate_limit_window']) . '" class="small-text" /> seconds (per IP hash).';
		echo '</td></tr>';

		echo '<tr><th><label for="max_body_bytes">Max body size (bytes)</label></th><td>';
		echo '<input type="number" min="1024" name="max_body_bytes" id="max_body_bytes" value="' . esc_attr((string) $s['max_body_bytes']) . '" class="regular-text" />';
		echo '</td></tr>';

		echo '<tr><th><label for="retention_days">Retention (days)</label></th><td>';
		echo '<input type="number" min="30" name="retention_days" id="retention_days" value="' . esc_attr((string) $s['retention_days']) . '" class="small-text" />';
		echo '<p class="description">Documented retention target. Minimize stored PII; review and delete leads you no longer need.</p>';
		echo '</td></tr>';

		echo '<tr><th>Cloudflare Turnstile</th><td>';
		echo '<label><input type="checkbox" name="turnstile_enabled" value="1"' . checked(!empty($s['turnstile_enabled']), true, false) . ' /> Enable Turnstile enforcement</label>';
		echo '<p class="description">Keep disabled until the Astro frontend embeds Turnstile and posts <code>cf-turnstile-response</code>. The existing <code>human_check</code> checkbox is not CAPTCHA. Secret keys are stored in WordPress options and never exposed in API responses or public logs.</p>';
		echo '<p><label>Site key (public)<br /><input type="text" class="regular-text" name="turnstile_site_key" value="' . esc_attr((string) $s['turnstile_site_key']) . '" autocomplete="off" /></label></p>';
		echo '<p><label>Secret key (private)<br /><input type="password" class="regular-text" name="turnstile_secret_key" value="" placeholder="' . esc_attr(!empty($s['turnstile_secret_key']) ? '•••••••• (unchanged if blank)' : '') . '" autocomplete="new-password" /></label></p>';
		echo '</td></tr>';

		echo '</tbody></table>';
		submit_button('Save settings');
		echo '</form></div>';
	}

	/**
	 * Email configuration status indicator.
	 *
	 * @param array $s Settings.
	 * @return array{label:string,tone:string}
	 */
	private static function email_config_status(array $s) {
		$notify = !empty($s['notify_enabled']);
		$ack    = !empty($s['ack_enabled']);
		$to     = isset($s['notify_to']) ? sanitize_email((string) $s['notify_to']) : '';
		if (($notify || $ack) && ($to === '' || !is_email($to)) && $notify) {
			return array(
				'label' => 'Admin recipient missing or invalid',
				'tone'  => 'warn',
			);
		}
		if ($notify && $ack) {
			return array(
				'label' => 'Admin + customer emails enabled',
				'tone'  => 'ok',
			);
		}
		if ($notify || $ack) {
			return array(
				'label' => 'Partial email notifications enabled',
				'tone'  => 'neutral',
			);
		}
		return array(
			'label' => 'Email notifications disabled',
			'tone'  => 'warn',
		);
	}

	/**
	 * Human-readable email outcome for lead detail.
	 *
	 * @param string $status Status.
	 * @param string $at     ISO time.
	 * @param string $code   Short code.
	 * @return string
	 */
	private static function format_email_outcome($status, $at, $code) {
		if ($status === '') {
			return '—';
		}
		$parts = array(ucfirst($status));
		if ($at !== '') {
			$parts[] = self::format_datetime($at);
		}
		if ($code !== '' && $status !== 'sent') {
			$parts[] = '(' . $code . ')';
		}
		return implode(' · ', $parts);
	}

	/**
	 * Query helper shared with CSV export.
	 *
	 * @param array $args Args.
	 * @return WP_Query
	 */
	public static function query_leads(array $args) {
		$meta_query = array('relation' => 'AND');

		if (!empty($args['form_type'])) {
			$meta_query[] = array(
				'key'   => VC_Lead_Meta::FORM_TYPE,
				'value' => sanitize_key($args['form_type']),
			);
		}
		if (!empty($args['status'])) {
			$meta_query[] = array(
				'key'   => VC_Lead_Meta::STATUS,
				'value' => sanitize_key($args['status']),
			);
		}

		$date_query = array();
		if (!empty($args['date_from'])) {
			$date_query['after'] = sanitize_text_field($args['date_from']) . ' 00:00:00';
			$date_query['inclusive'] = true;
		}
		if (!empty($args['date_to'])) {
			$date_query['before'] = sanitize_text_field($args['date_to']) . ' 23:59:59';
			$date_query['inclusive'] = true;
		}

		$query_args = array(
			'post_type'      => VC_LEADS_CPT,
			'post_status'    => array('private', 'publish', 'draft'),
			'posts_per_page' => isset($args['per_page']) ? (int) $args['per_page'] : 20,
			'paged'          => isset($args['paged']) ? max(1, (int) $args['paged']) : 1,
			'orderby'        => 'date',
			'order'          => 'DESC',
		);

		if (count($meta_query) > 1) {
			$query_args['meta_query'] = $meta_query;
		}
		if (!empty($date_query)) {
			$query_args['date_query'] = array($date_query);
		}
		if (!empty($args['search'])) {
			$query_args['s'] = sanitize_text_field($args['search']);
			// Also search common meta via posts_clauses filter for this request only.
			add_filter('posts_search', array(__CLASS__, 'extend_search'), 10, 2);
		}

		$query = new WP_Query($query_args);
		remove_filter('posts_search', array(__CLASS__, 'extend_search'), 10);
		return $query;
	}

	/**
	 * Extend WP search to email / phone / company meta.
	 *
	 * @param string   $search Search SQL.
	 * @param WP_Query $query  Query.
	 * @return string
	 */
	public static function extend_search($search, $query) {
		global $wpdb;
		if ($query->get('post_type') !== VC_LEADS_CPT) {
			return $search;
		}
		$term = $query->get('s');
		if (!is_string($term) || $term === '') {
			return $search;
		}
		$like = '%' . $wpdb->esc_like($term) . '%';
		$meta_keys = array(
			VC_Lead_Meta::NAME,
			VC_Lead_Meta::EMAIL,
			VC_Lead_Meta::PHONE,
			VC_Lead_Meta::COMPANY,
		);
		$parts = array();
		foreach ($meta_keys as $key) {
			$parts[] = $wpdb->prepare(
				"EXISTS (SELECT 1 FROM {$wpdb->postmeta} pm WHERE pm.post_id = {$wpdb->posts}.ID AND pm.meta_key = %s AND pm.meta_value LIKE %s)",
				$key,
				$like
			);
		}
		$meta_or = implode(' OR ', $parts);
		$title_like = $wpdb->prepare("{$wpdb->posts}.post_title LIKE %s", $like);
		return " AND ( ({$title_like}) OR {$meta_or} ) ";
	}

	/**
	 * @param int $post_id Post ID.
	 * @return bool
	 */
	private static function is_lead($post_id) {
		return $post_id > 0 && get_post_type($post_id) === VC_LEADS_CPT;
	}

	/**
	 * @param string $label Label.
	 * @param string $value Value.
	 */
	private static function detail_row($label, $value) {
		echo '<tr><th scope="row">' . esc_html($label) . '</th><td>' . esc_html($value) . '</td></tr>';
	}

	/**
	 * @param string $iso ISO datetime.
	 * @return string
	 */
	private static function format_datetime($iso) {
		if ($iso === '') {
			return '—';
		}
		$ts = strtotime($iso);
		if (!$ts) {
			return $iso;
		}
		return wp_date('Y-m-d H:i', $ts) . ' UTC';
	}
}
