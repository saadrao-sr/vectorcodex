<?php
/**
 * Form-type-aware field presentation for admin, email and CSV.
 *
 * Maps each of the seven frontend forms to its own submitted fields only.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Presentation {

	const NOT_RECORDED = 'Not recorded';

	/**
	 * Field schemas per form type.
	 * Each entry: key => label. Values resolve from meta and/or payload.fields.
	 *
	 * @return array<string,array<string,string>>
	 */
	public static function field_schemas() {
		return array(
			'quote' => array(
				'name'     => 'Full name',
				'company'  => 'Company',
				'phone'    => 'Phone',
				'email'    => 'Email',
				'service'  => 'Service',
				'timeline' => 'Timeline',
				'budget'   => 'Budget',
				'message'  => 'Message',
			),
			'booking' => array(
				'name'    => 'Full name',
				'email'   => 'Email',
				'phone'   => 'Phone',
				'company' => 'Company',
				'budget'  => 'Budget',
				'service' => 'Service',
				'message' => 'Message',
			),
			'free_audit' => array(
				'website' => 'Website name / URL',
				'name'    => 'Full name',
				'email'   => 'Email',
				'phone'   => 'Contact number',
				'company' => 'Company',
				'focus'   => 'Primary focus',
				'message' => 'Message',
			),
			'team_requirements' => array(
				'name'       => 'Full name',
				'email'      => 'Email',
				'phone'      => 'Phone',
				'company'    => 'Company',
				'department' => 'Department',
				'resources'  => 'Resources required',
				'budget'     => 'Budget',
				'engagement' => 'Engagement type',
				'timeline'   => 'Timeline',
				'message'    => 'Message',
			),
			'project_inquiry' => array(
				'name'        => 'Full name',
				'email'       => 'Email',
				'company'     => 'Company',
				'phone'       => 'Phone',
				'website_url' => 'Website URL',
				'service'     => 'Service',
				'budget'      => 'Budget',
				'message'     => 'Message',
			),
			'homepage_inquiry' => array(
				'name'    => 'Full name',
				'email'   => 'Email',
				'phone'   => 'Phone',
				'company' => 'Company',
				'service' => 'Service',
				'budget'  => 'Budget',
				'message' => 'Message',
			),
		);
	}

	/**
	 * Keys treated as optional: hide when empty.
	 *
	 * @param string $form_type Form type.
	 * @return string[]
	 */
	public static function optional_keys($form_type) {
		$map = array(
			'quote'              => array('message'),
			'booking'            => array('company', 'budget', 'message'),
			'free_audit'         => array('company', 'focus', 'message'),
			'team_requirements'  => array('company', 'engagement', 'timeline', 'message'),
			'project_inquiry'    => array('company', 'website_url', 'service', 'budget'),
			'homepage_inquiry'   => array('company', 'budget'),
		);
		return isset($map[$form_type]) ? $map[$form_type] : array();
	}

	/**
	 * Human labels for pricing calculator answer keys (frontend is source of truth).
	 *
	 * @return array<string,string>
	 */
	public static function pricing_answer_labels() {
		return array(
			'companyName'         => 'Company name',
			'industry'            => 'Industry',
			'industryOther'       => 'Industry (other)',
			'businessType'        => 'Business type',
			'websiteUrl'          => 'Website URL',
			'targetMarket'        => 'Target market',
			'primaryGoal'         => 'Primary goal',
			'fullName'            => 'Full name',
			'email'               => 'Email',
			'phone'               => 'Phone',
			'company'             => 'Company',
			'jobTitle'            => 'Job title',
			'country'             => 'Country',
			'contactMethod'       => 'Preferred contact method',
			'contactTime'         => 'Preferred contact time',
			'notes'               => 'Additional notes',
			'currentUrl'          => 'Current website URL',
			'websiteType'         => 'Website type',
			'pageCount'           => 'Website size / pages',
			'seoStatus'           => 'Current SEO status',
			'targetLocations'     => 'Target locations',
			'needsLocalSeo'       => 'Needs Local SEO',
			'localLocationCount'  => 'Local SEO locations',
			'primaryService'      => 'Primary service',
			'additionalServices'  => 'Additional services',
			'allServices'         => 'All services',
		);
	}

	/**
	 * Resolve a sanitized source URL for a lead, with payload recovery.
	 *
	 * @param int $lead_id Lead ID.
	 * @return string Empty string when unavailable/invalid.
	 */
	public static function source_url($lead_id) {
		$candidates = array();
		$meta = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SOURCE_URL);
		if ($meta !== '') {
			$candidates[] = $meta;
		}

		$payload = VC_Lead_Meta::get_payload($lead_id);
		if (is_array($payload)) {
			foreach (array('source_url', 'sourceUrl', 'page_url', 'referrer') as $key) {
				if (!empty($payload[$key]) && is_scalar($payload[$key])) {
					$candidates[] = (string) $payload[$key];
				}
			}
			if (!empty($payload['fields']) && is_array($payload['fields'])) {
				foreach (array('source_url', 'sourceUrl', 'page_url') as $key) {
					if (!empty($payload['fields'][$key]) && is_scalar($payload['fields'][$key])) {
						$candidates[] = (string) $payload['fields'][$key];
					}
				}
			}
			if (!empty($payload['flat']) && is_array($payload['flat'])) {
				foreach (array('source', 'source_url') as $key) {
					if (!empty($payload['flat'][$key]) && is_scalar($payload['flat'][$key])) {
						$candidates[] = (string) $payload['flat'][$key];
					}
				}
			}
		}

		foreach ($candidates as $candidate) {
			$url = self::sanitize_source_url($candidate);
			if ($url !== '') {
				return $url;
			}
		}
		return '';
	}

	/**
	 * @param string $url Raw URL.
	 * @return string
	 */
	public static function sanitize_source_url($url) {
		$url = esc_url_raw(trim((string) $url));
		if ($url === '') {
			return '';
		}
		$parts = wp_parse_url($url);
		if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
			return '';
		}
		$scheme = strtolower((string) $parts['scheme']);
		if ($scheme !== 'http' && $scheme !== 'https') {
			return '';
		}
		return $url;
	}

	/**
	 * Display value for source URL (or Not recorded).
	 *
	 * @param int $lead_id Lead ID.
	 * @return string
	 */
	public static function source_url_display($lead_id) {
		$url = self::source_url($lead_id);
		return $url !== '' ? $url : self::NOT_RECORDED;
	}

	/**
	 * Build form-specific rows for a lead (excludes empty optional fields).
	 *
	 * @param int  $lead_id      Lead ID.
	 * @param bool $include_empty_required Include empty required-looking fields as blank.
	 * @return array<int,array{key:string,label:string,value:string}>
	 */
	public static function form_rows($lead_id, $include_empty_required = true) {
		$form_type = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::FORM_TYPE);
		if ($form_type === 'pricing_calculator') {
			return array();
		}

		$schemas = self::field_schemas();
		if (!isset($schemas[$form_type])) {
			return self::fallback_rows($lead_id);
		}

		$optional = self::optional_keys($form_type);
		$rows     = array();
		foreach ($schemas[$form_type] as $key => $label) {
			$value = self::resolve_field_value($lead_id, $key);
			if ($value === '' && in_array($key, $optional, true)) {
				continue;
			}
			if ($value === '' && !$include_empty_required) {
				continue;
			}
			$rows[] = array(
				'key'   => $key,
				'label' => $label,
				'value' => $value,
			);
		}
		return $rows;
	}

	/**
	 * Pricing calculator grouped sections for admin/email.
	 *
	 * @param int $lead_id Lead ID.
	 * @return array<int,array{title:string,rows:array<int,array{label:string,value:string}>}>
	 */
	public static function pricing_sections($lead_id) {
		$payload = VC_Lead_Meta::get_payload($lead_id);
		if (!is_array($payload)) {
			return array();
		}

		$sections = array();
		$labels   = self::pricing_answer_labels();

		$estimate_rows = array();
		if (!empty($payload['estimate']) && is_array($payload['estimate'])) {
			foreach ($payload['estimate'] as $key => $value) {
				$estimate_rows[] = array(
					'label' => self::humanize_key((string) $key),
					'value' => self::stringify_value($value),
				);
			}
		}
		if (!empty($payload['primaryService'])) {
			array_unshift(
				$estimate_rows,
				array('label' => 'Primary service', 'value' => self::stringify_value($payload['primaryService']))
			);
		}
		if (!empty($payload['additionalServices'])) {
			$estimate_rows[] = array(
				'label' => 'Additional services',
				'value' => self::stringify_value($payload['additionalServices']),
			);
		}
		if (!empty($payload['allServices'])) {
			$estimate_rows[] = array(
				'label' => 'All services',
				'value' => self::stringify_value($payload['allServices']),
			);
		}
		if (!empty($estimate_rows)) {
			$sections[] = array('title' => 'Estimate', 'rows' => $estimate_rows);
		}

		if (!empty($payload['businessAnswers']) && is_array($payload['businessAnswers'])) {
			$sections[] = array(
				'title' => 'Business information',
				'rows'  => self::answer_rows($payload['businessAnswers'], $labels, array()),
			);
		}

		if (!empty($payload['serviceAnswers']) && is_array($payload['serviceAnswers'])) {
			foreach ($payload['serviceAnswers'] as $service_id => $answers) {
				if (!is_array($answers)) {
					continue;
				}
				$sections[] = array(
					'title' => 'Service: ' . self::stringify_value($service_id),
					'rows'  => self::answer_rows($answers, $labels, array()),
				);
			}
		}

		if (!empty($payload['contactAnswers']) && is_array($payload['contactAnswers'])) {
			$skip = array('company_website', 'human_check', 'consent');
			$sections[] = array(
				'title' => 'Contact information',
				'rows'  => self::answer_rows($payload['contactAnswers'], $labels, $skip),
			);
		}

		return $sections;
	}

	/**
	 * Plain-text lines for admin email (form-specific only).
	 *
	 * @param int $lead_id Lead ID.
	 * @return string[]
	 */
	public static function admin_email_lines($lead_id) {
		$types      = VC_Lead_Meta::form_types();
		$form_type  = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::FORM_TYPE);
		$type_label = isset($types[$form_type]) ? $types[$form_type] : $form_type;
		$submitted  = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SUBMITTED_AT);
		$source     = self::source_url_display($lead_id);

		$lines = array(
			'A new lead was stored in WordPress.',
			'',
			'Form type: ' . $type_label,
			'Source URL: ' . $source,
			'Submitted: ' . ($submitted !== '' ? $submitted : self::NOT_RECORDED),
			'',
		);

		if ($form_type === 'pricing_calculator') {
			foreach (self::pricing_sections($lead_id) as $section) {
				$lines[] = '— ' . $section['title'] . ' —';
				foreach ($section['rows'] as $row) {
					if ($row['value'] === '') {
						continue;
					}
					$lines[] = $row['label'] . ': ' . $row['value'];
				}
				$lines[] = '';
			}
			$summary = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::SUMMARY);
			if ($summary !== '') {
				$lines[] = '— Summary text —';
				$lines[] = $summary;
				$lines[] = '';
			}
			$lines[] = 'Complete nested submission is available in the WordPress lead detail view.';
		} else {
			$lines[] = '— Submission details —';
			foreach (self::form_rows($lead_id, false) as $row) {
				if ($row['value'] === '') {
					continue;
				}
				$lines[] = $row['label'] . ': ' . $row['value'];
			}
		}

		return $lines;
	}

	/**
	 * Readable pricing block for CSV.
	 *
	 * @param int $lead_id Lead ID.
	 * @return string
	 */
	public static function pricing_export_text($lead_id) {
		$chunks = array();
		foreach (self::pricing_sections($lead_id) as $section) {
			$parts = array($section['title']);
			foreach ($section['rows'] as $row) {
				if ($row['value'] === '') {
					continue;
				}
				$parts[] = $row['label'] . ': ' . $row['value'];
			}
			$chunks[] = implode(' | ', $parts);
		}
		return implode("\n", $chunks);
	}

	/**
	 * Form-specific details as a single exportable string.
	 *
	 * @param int $lead_id Lead ID.
	 * @return string
	 */
	public static function form_details_export_text($lead_id) {
		$form_type = VC_Lead_Meta::get($lead_id, VC_Lead_Meta::FORM_TYPE);
		if ($form_type === 'pricing_calculator') {
			return self::pricing_export_text($lead_id);
		}
		$parts = array();
		foreach (self::form_rows($lead_id, false) as $row) {
			if ($row['value'] === '') {
				continue;
			}
			$parts[] = $row['label'] . ': ' . $row['value'];
		}
		return implode(' | ', $parts);
	}

	/**
	 * Guard spreadsheet formula injection.
	 *
	 * @param string $value Cell value.
	 * @return string
	 */
	public static function csv_safe($value) {
		$value = (string) $value;
		if ($value === '') {
			return $value;
		}
		$first = substr($value, 0, 1);
		if (in_array($first, array('=', '+', '-', '@', "\t", "\r"), true)) {
			return "'" . $value;
		}
		return $value;
	}

	/**
	 * Ensure payload retains source_url for recovery (non-destructive).
	 *
	 * @param array  $payload    Payload.
	 * @param string $source_url Source URL.
	 * @return array
	 */
	public static function embed_source_url(array $payload, $source_url) {
		$url = self::sanitize_source_url($source_url);
		if ($url === '') {
			return $payload;
		}
		if (empty($payload['source_url'])) {
			$payload['source_url'] = $url;
		}
		return $payload;
	}

	/**
	 * @param int    $lead_id Lead ID.
	 * @param string $key     Field key.
	 * @return string
	 */
	private static function resolve_field_value($lead_id, $key) {
		$meta_map = array(
			'name'     => VC_Lead_Meta::NAME,
			'email'    => VC_Lead_Meta::EMAIL,
			'phone'    => VC_Lead_Meta::PHONE,
			'company'  => VC_Lead_Meta::COMPANY,
			'service'  => VC_Lead_Meta::SERVICE,
			'budget'   => VC_Lead_Meta::BUDGET,
			'timeline' => VC_Lead_Meta::TIMELINE,
			'message'  => VC_Lead_Meta::MESSAGE,
		);

		if (isset($meta_map[$key])) {
			$meta_value = VC_Lead_Meta::get($lead_id, $meta_map[$key]);
			if ($meta_value !== '') {
				return $meta_value;
			}
		}

		$payload = VC_Lead_Meta::get_payload($lead_id);
		if (!is_array($payload)) {
			return '';
		}

		if (!empty($payload['fields']) && is_array($payload['fields']) && isset($payload['fields'][$key]) && is_scalar($payload['fields'][$key])) {
			$value = trim((string) $payload['fields'][$key]);
			if ($value !== '') {
				return $value;
			}
		}
		if (!empty($payload['flat']) && is_array($payload['flat']) && isset($payload['flat'][$key]) && is_scalar($payload['flat'][$key])) {
			$value = trim((string) $payload['flat'][$key]);
			if ($value !== '') {
				return $value;
			}
		}
		if (isset($payload[$key]) && is_scalar($payload[$key])) {
			return trim((string) $payload[$key]);
		}

		return '';
	}

	/**
	 * @param int $lead_id Lead ID.
	 * @return array<int,array{key:string,label:string,value:string}>
	 */
	private static function fallback_rows($lead_id) {
		$candidates = array(
			'name'    => 'Full name',
			'email'   => 'Email',
			'phone'   => 'Phone',
			'company' => 'Company',
			'message' => 'Message',
		);
		$rows = array();
		foreach ($candidates as $key => $label) {
			$value = self::resolve_field_value($lead_id, $key);
			if ($value === '') {
				continue;
			}
			$rows[] = array('key' => $key, 'label' => $label, 'value' => $value);
		}
		return $rows;
	}

	/**
	 * @param array                $answers Answers.
	 * @param array<string,string> $labels  Label map.
	 * @param string[]             $skip    Keys to skip.
	 * @return array<int,array{label:string,value:string}>
	 */
	private static function answer_rows(array $answers, array $labels, array $skip) {
		$rows = array();
		foreach ($answers as $key => $value) {
			$key = (string) $key;
			if (in_array($key, $skip, true)) {
				continue;
			}
			$display = self::stringify_value($value);
			if ($display === '') {
				continue;
			}
			$label = isset($labels[$key]) ? $labels[$key] : self::humanize_key($key);
			$rows[] = array('label' => $label, 'value' => $display);
		}
		return $rows;
	}

	/**
	 * @param mixed $value Value.
	 * @return string
	 */
	public static function stringify_value($value) {
		if ($value === null) {
			return '';
		}
		if (is_bool($value)) {
			return $value ? 'Yes' : 'No';
		}
		if (is_scalar($value)) {
			return trim((string) $value);
		}
		if (is_array($value)) {
			$flat = array();
			foreach ($value as $item) {
				if (is_scalar($item)) {
					$flat[] = (string) $item;
				}
			}
			if (count($flat) === count($value)) {
				return implode(', ', $flat);
			}
			$json = wp_json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
			return is_string($json) ? $json : '';
		}
		return '';
	}

	/**
	 * @param string $key Key.
	 * @return string
	 */
	private static function humanize_key($key) {
		$key = str_replace(array('_', '-'), ' ', $key);
		$key = preg_replace('/([a-z])([A-Z])/', '$1 $2', $key);
		return ucfirst(trim((string) $key));
	}
}
