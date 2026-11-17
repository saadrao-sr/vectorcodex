<?php
/**
 * CSV export for VectorCodex leads (admin-only).
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Export {

	/**
	 * Hook registration.
	 */
	public static function init() {
		add_action('admin_init', array(__CLASS__, 'maybe_export'));
	}

	/**
	 * Stream CSV when requested from the leads screen.
	 */
	public static function maybe_export() {
		if (!is_admin()) {
			return;
		}
		if (empty($_GET['page']) || $_GET['page'] !== VC_Lead_Admin::MENU_SLUG) {
			return;
		}
		if (empty($_GET['vc_action']) || sanitize_key((string) $_GET['vc_action']) !== 'export_csv') {
			return;
		}
		if (!VC_Lead_Security::current_user_can_manage()) {
			wp_die(esc_html__('Unauthorized.', 'vectorcodex-leads'), 403);
		}
		check_admin_referer('vc_leads_export');

		$search    = isset($_GET['s']) ? sanitize_text_field(wp_unslash((string) $_GET['s'])) : '';
		$form_type = isset($_GET['form_type']) ? sanitize_key((string) $_GET['form_type']) : '';
		$status    = isset($_GET['status']) ? sanitize_key((string) $_GET['status']) : '';
		$date_from = isset($_GET['date_from']) ? sanitize_text_field(wp_unslash((string) $_GET['date_from'])) : '';
		$date_to   = isset($_GET['date_to']) ? sanitize_text_field(wp_unslash((string) $_GET['date_to'])) : '';

		$query = VC_Lead_Admin::query_leads(
			array(
				'search'    => $search,
				'form_type' => $form_type,
				'status'    => $status,
				'date_from' => $date_from,
				'date_to'   => $date_to,
				'paged'     => 1,
				'per_page'  => 5000,
			)
		);

		$filename = 'vectorcodex-leads-' . gmdate('Ymd-His') . '.csv';
		nocache_headers();
		header('Content-Type: text/csv; charset=utf-8');
		header('Content-Disposition: attachment; filename=' . $filename);

		$out = fopen('php://output', 'w');
		if ($out === false) {
			wp_die(esc_html__('Unable to open export stream.', 'vectorcodex-leads'));
		}

		fwrite($out, "\xEF\xBB\xBF");

		$extra_keys = array(
			'website'     => 'Website',
			'website_url' => 'Website URL',
			'focus'       => 'Primary focus',
			'department'  => 'Department',
			'resources'   => 'Resources required',
			'engagement'  => 'Engagement type',
			'service'     => 'Service',
			'budget'      => 'Budget',
			'timeline'    => 'Timeline',
			'message'     => 'Message',
		);

		$header = array_merge(
			array(
				'ID',
				'Form type',
				'Status',
				'Name',
				'Email',
				'Phone',
				'Company',
				'Submitted at',
				'Source URL',
				'Form details',
				'Pricing details',
				'Payload JSON',
			),
			array_values($extra_keys)
		);
		fputcsv($out, $header);

		$types    = VC_Lead_Meta::form_types();
		$statuses = VC_Lead_Meta::statuses();

		foreach ($query->posts as $post) {
			$id = (int) $post->ID;
			$ft = VC_Lead_Meta::get($id, VC_Lead_Meta::FORM_TYPE);
			$st = VC_Lead_Meta::get($id, VC_Lead_Meta::STATUS);

			$schema_keys = array();
			$schemas     = VC_Lead_Presentation::field_schemas();
			if (isset($schemas[$ft])) {
				$schema_keys = array_keys($schemas[$ft]);
			}

			$row = array(
				$id,
				isset($types[$ft]) ? $types[$ft] : $ft,
				isset($statuses[$st]) ? $statuses[$st] : $st,
				VC_Lead_Meta::get($id, VC_Lead_Meta::NAME),
				VC_Lead_Meta::get($id, VC_Lead_Meta::EMAIL),
				VC_Lead_Meta::get($id, VC_Lead_Meta::PHONE),
				VC_Lead_Meta::get($id, VC_Lead_Meta::COMPANY),
				VC_Lead_Meta::get($id, VC_Lead_Meta::SUBMITTED_AT),
				VC_Lead_Presentation::source_url_display($id),
				VC_Lead_Presentation::form_details_export_text($id),
				$ft === 'pricing_calculator' ? VC_Lead_Presentation::pricing_export_text($id) : '',
				VC_Lead_Meta::get($id, VC_Lead_Meta::PAYLOAD_JSON),
			);

			$resolved = array();
			foreach (VC_Lead_Presentation::form_rows($id, false) as $field_row) {
				$resolved[$field_row['key']] = $field_row['value'];
			}

			foreach ($extra_keys as $key => $_label) {
				if ($ft === 'pricing_calculator') {
					$row[] = '';
					continue;
				}
				// Only fill columns that belong to this form schema (or message/service/budget when present).
				if (!empty($schema_keys) && !in_array($key, $schema_keys, true)) {
					$row[] = '';
					continue;
				}
				$row[] = isset($resolved[$key]) ? $resolved[$key] : '';
			}

			$safe = array();
			foreach ($row as $cell) {
				$safe[] = VC_Lead_Presentation::csv_safe(is_scalar($cell) ? (string) $cell : '');
			}
			fputcsv($out, $safe);
		}

		fclose($out);
		exit;
	}
}
