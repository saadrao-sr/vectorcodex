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

		// UTF-8 BOM for Excel.
		fwrite($out, "\xEF\xBB\xBF");

		fputcsv(
			$out,
			array(
				'ID',
				'Form type',
				'Status',
				'Name',
				'Email',
				'Phone',
				'Company',
				'Service',
				'Budget',
				'Timeline',
				'Submitted at',
				'Source URL',
				'Summary',
				'Message',
				'Payload JSON',
			)
		);

		$types = VC_Lead_Meta::form_types();
		$statuses = VC_Lead_Meta::statuses();

		foreach ($query->posts as $post) {
			$id = (int) $post->ID;
			$ft = VC_Lead_Meta::get($id, VC_Lead_Meta::FORM_TYPE);
			$st = VC_Lead_Meta::get($id, VC_Lead_Meta::STATUS);
			fputcsv(
				$out,
				array(
					$id,
					isset($types[$ft]) ? $types[$ft] : $ft,
					isset($statuses[$st]) ? $statuses[$st] : $st,
					VC_Lead_Meta::get($id, VC_Lead_Meta::NAME),
					VC_Lead_Meta::get($id, VC_Lead_Meta::EMAIL),
					VC_Lead_Meta::get($id, VC_Lead_Meta::PHONE),
					VC_Lead_Meta::get($id, VC_Lead_Meta::COMPANY),
					VC_Lead_Meta::get($id, VC_Lead_Meta::SERVICE),
					VC_Lead_Meta::get($id, VC_Lead_Meta::BUDGET),
					VC_Lead_Meta::get($id, VC_Lead_Meta::TIMELINE),
					VC_Lead_Meta::get($id, VC_Lead_Meta::SUBMITTED_AT),
					VC_Lead_Meta::get($id, VC_Lead_Meta::SOURCE_URL),
					VC_Lead_Meta::get($id, VC_Lead_Meta::SUMMARY),
					VC_Lead_Meta::get($id, VC_Lead_Meta::MESSAGE),
					VC_Lead_Meta::get($id, VC_Lead_Meta::PAYLOAD_JSON),
				)
			);
		}

		fclose($out);
		exit;
	}
}
