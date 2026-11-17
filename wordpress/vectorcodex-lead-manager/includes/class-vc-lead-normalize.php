<?php
/**
 * Normalize multipart FormData from all frontend forms into a shared lead shape.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_Normalize {

	/**
	 * Honeypot field names used across frontend forms.
	 *
	 * @return string[]
	 */
	public static function honeypot_keys() {
		return array('website', 'website_hp', 'company_website');
	}

	/**
	 * Normalize a raw request params array (from WP_REST_Request::get_params / get_body_params / get_file_params).
	 *
	 * @param array $raw Raw params (strings).
	 * @return array{ok:bool,errors?:array,data?:array}
	 */
	public static function from_request(array $raw) {
		$errors = array();
		$form_type = self::normalize_form_type($raw);

		if ($form_type === '') {
			$errors['form_type'] = 'A valid form type is required.';
			return array('ok' => false, 'errors' => $errors);
		}

		// Pricing calculator often ships a structured payload_json — prefer it.
		$payload = self::extract_payload($raw, $form_type);

		$name    = self::pick_string($raw, array('name', 'fullName', 'full_name'));
		$email   = self::pick_string($raw, array('email'));
		$phone   = self::pick_string($raw, array('phone'));
		$company = self::pick_string($raw, array('company', 'companyName', 'company_name'));
		$service = self::pick_string($raw, array('service', 'primary_service', 'primaryService'));
		$budget  = self::pick_string($raw, array('budget', 'estimate_label'));
		$timeline = self::pick_string($raw, array('timeline'));
		$message = self::pick_string($raw, array('message', 'notes'));
		$summary = self::pick_string($raw, array('summary', 'summaryText', 'summary_text'));
		$source  = self::pick_string($raw, array('source_url', 'sourceUrl', 'page_url', 'referrer'));

		// Pull contact fields from pricing payload when flat fields are empty.
		if ($form_type === 'pricing_calculator' && is_array($payload)) {
			$contact = isset($payload['contactAnswers']) && is_array($payload['contactAnswers'])
				? $payload['contactAnswers']
				: array();
			if ($name === '' && !empty($contact['fullName'])) {
				$name = sanitize_text_field((string) $contact['fullName']);
			}
			if ($email === '' && !empty($contact['email'])) {
				$email = sanitize_email((string) $contact['email']);
			}
			if ($phone === '' && !empty($contact['phone'])) {
				$phone = sanitize_text_field((string) $contact['phone']);
			}
			if ($company === '' && !empty($contact['company'])) {
				$company = sanitize_text_field((string) $contact['company']);
			}
			if ($summary === '' && !empty($payload['summaryText'])) {
				$summary = sanitize_textarea_field((string) $payload['summaryText']);
			}
			if ($service === '' && !empty($payload['primaryService'])) {
				$service = sanitize_text_field((string) $payload['primaryService']);
			}
			if ($budget === '' && isset($payload['estimate']) && is_array($payload['estimate']) && !empty($payload['estimate']['label'])) {
				$budget = sanitize_text_field((string) $payload['estimate']['label']);
			}
		}

		$name    = sanitize_text_field($name);
		$email   = sanitize_email($email);
		$phone   = sanitize_text_field($phone);
		$company = sanitize_text_field($company);
		$service = sanitize_text_field($service);
		$budget  = sanitize_text_field($budget);
		$timeline = sanitize_text_field($timeline);
		$message = sanitize_textarea_field($message);
		$summary = sanitize_textarea_field($summary);
		$source  = esc_url_raw($source);

		// Per-form required field checks (server-side; never trust client alone).
		$required_errors = self::validate_required($form_type, $raw, $name, $email, $phone, $company, $service, $message, $payload);
		$errors = array_merge($errors, $required_errors);

		if ($email !== '' && !is_email($email)) {
			$errors['email'] = 'Enter a valid email address.';
		}
		if ($email === '') {
			$errors['email'] = 'Email is required.';
		}
		if ($name === '') {
			$errors['name'] = 'Name is required.';
		}

		if (!empty($errors)) {
			return array('ok' => false, 'errors' => $errors);
		}

		// Ensure payload always contains the full original submission for auditability.
		if (!is_array($payload)) {
			$payload = self::build_fallback_payload($form_type, $raw, compact(
				'name',
				'email',
				'phone',
				'company',
				'service',
				'budget',
				'timeline',
				'message',
				'summary',
				'source'
			));
		} else {
			// Keep original nested structures untouched; only ensure form_type key exists.
			if (!isset($payload['form_type'])) {
				$payload['form_type'] = $form_type;
			}
		}

		$title = self::build_title($form_type, $name, $email);

		return array(
			'ok'   => true,
			'data' => array(
				'form_type'    => $form_type,
				'status'       => 'new',
				'name'         => $name,
				'email'        => $email,
				'phone'        => $phone,
				'company'      => $company,
				'service'      => $service,
				'budget'       => $budget,
				'timeline'     => $timeline,
				'message'      => $message,
				'summary'      => $summary,
				'source_url'   => $source,
				'payload'      => $payload,
				'title'        => $title,
			),
		);
	}

	/**
	 * Map frontend form_type / formType values to canonical keys.
	 *
	 * @param array $raw Raw request.
	 * @return string
	 */
	public static function normalize_form_type(array $raw) {
		$candidates = array();
		foreach (array('form_type', 'formType', 'form-type', 'type') as $key) {
			if (isset($raw[$key]) && is_scalar($raw[$key])) {
				$candidates[] = strtolower(trim((string) $raw[$key]));
			}
		}

		// Infer when frontend omitted type (migration support for live forms).
		if (empty($candidates)) {
			if (isset($raw['payload_json']) || isset($raw['primary_service']) || isset($raw['primaryService'])) {
				$candidates[] = 'pricing_calculator';
			} elseif (isset($raw['department']) || isset($raw['resources'])) {
				$candidates[] = 'team_requirements';
			} elseif (isset($raw['focus'])) {
				// Free audit uses `website` as a real field; honeypot is company_website.
				$candidates[] = 'free_audit';
			} elseif (isset($raw['website_url']) || array_key_exists('website_hp', $raw)) {
				$candidates[] = 'project_inquiry';
			} elseif (isset($raw['timeline']) && !isset($raw['engagement'])) {
				$candidates[] = 'quote';
			} else {
				$inferred = self::infer_from_source($raw);
				if ($inferred !== '') {
					$candidates[] = $inferred;
				} elseif (isset($raw['service'])) {
					// Booking (optional message) vs homepage inquiry (required message).
					$message = self::pick_string($raw, array('message', 'notes'));
					$candidates[] = (strlen($message) >= 10) ? 'homepage_inquiry' : 'booking';
				}
			}
		}

		$map = array(
			'quote'               => 'quote',
			'booking'             => 'booking',
			'consultation'        => 'booking',
			'free_audit'          => 'free_audit',
			'free-audit'          => 'free_audit',
			'audit'               => 'free_audit',
			'team_requirements'   => 'team_requirements',
			'team-requirements'   => 'team_requirements',
			'teamrequirements'    => 'team_requirements',
			'project_inquiry'     => 'project_inquiry',
			'project-inquiry'     => 'project_inquiry',
			'project_enquiry'     => 'project_inquiry',
			'homepage_inquiry'    => 'homepage_inquiry',
			'homepage-inquiry'    => 'homepage_inquiry',
			'inquiry'             => 'homepage_inquiry',
			'contact'             => 'homepage_inquiry',
			'pricing_calculator'  => 'pricing_calculator',
			'pricing-calculator'  => 'pricing_calculator',
			'pricing'             => 'pricing_calculator',
		);

		foreach ($candidates as $value) {
			$value = preg_replace('/[^a-z0-9_\-]/', '', $value);
			if (isset($map[$value])) {
				return $map[$value];
			}
		}

		return '';
	}

	/**
	 * Extract structured payload from payload_json or rebuild.
	 *
	 * @param array  $raw       Raw request.
	 * @param string $form_type Normalized type.
	 * @return array|null
	 */
	private static function extract_payload(array $raw, $form_type) {
		$json = '';
		if (isset($raw['payload_json']) && is_string($raw['payload_json'])) {
			$json = $raw['payload_json'];
		} elseif (isset($raw['payload']) && is_string($raw['payload'])) {
			$json = $raw['payload'];
		}

		if ($json !== '') {
			$decoded = json_decode(wp_unslash($json), true);
			if (is_array($decoded)) {
				// Preserve nested pricing calculator answers exactly.
				return $decoded;
			}
		}

		return null;
	}

	/**
	 * Build a fallback payload from flat FormData.
	 *
	 * @param string $form_type Form type.
	 * @param array  $raw       Raw request.
	 * @param array  $flat      Sanitized flat fields.
	 * @return array
	 */
	private static function build_fallback_payload($form_type, array $raw, array $flat) {
		// Form-type-aware honeypot skips: free_audit uses `website` as a real field.
		if ($form_type === 'free_audit' || $form_type === 'pricing_calculator') {
			$honeypot_skip = array('company_website', 'website_hp');
		} else {
			$honeypot_skip = self::honeypot_keys();
		}

		$skip = array_merge(
			$honeypot_skip,
			array('payload_json', 'payload', 'human_check', 'consent', 'cf-turnstile-response')
		);
		$fields = array();
		foreach ($raw as $key => $value) {
			if (!is_string($key) || in_array($key, $skip, true)) {
				continue;
			}
			if (is_array($value)) {
				$fields[$key] = array_map('sanitize_text_field', $value);
			} elseif (is_scalar($value)) {
				$fields[$key] = sanitize_text_field((string) $value);
			}
		}

		return array(
			'form_type' => $form_type,
			'fields'    => $fields,
			'flat'      => $flat,
		);
	}

	/**
	 * Required-field validation by form type.
	 *
	 * @return array<string,string>
	 */
	private static function validate_required($form_type, array $raw, $name, $email, $phone, $company, $service, $message, $payload) {
		$errors = array();

		switch ($form_type) {
			case 'quote':
				if (strlen($phone) < 7) {
					$errors['phone'] = 'Enter a valid phone number.';
				}
				if (strlen($company) < 2) {
					$errors['company'] = 'Enter your company name.';
				}
				if ($service === '') {
					$errors['service'] = 'Select a service.';
				}
				$timeline = self::pick_string($raw, array('timeline'));
				if ($timeline === '') {
					$errors['timeline'] = 'Select a project timeline.';
				}
				break;

			case 'booking':
				if (strlen(preg_replace('/\D/', '', $phone)) < 7) {
					$errors['phone'] = 'Enter a valid mobile number.';
				}
				if ($service === '') {
					$errors['service'] = 'Select a service.';
				}
				break;

			case 'free_audit':
				$website = self::pick_string($raw, array('website'));
				// For free_audit, `website` is the real site field (honeypot is company_website).
				if (strlen($website) < 3) {
					$errors['website'] = 'Enter your website name or URL.';
				}
				if (strlen(preg_replace('/\D/', '', $phone)) < 7) {
					$errors['phone'] = 'Enter a valid contact number.';
				}
				break;

			case 'team_requirements':
				if (strlen(preg_replace('/\D/', '', $phone)) < 7) {
					$errors['phone'] = 'Enter a valid phone number.';
				}
				if (self::pick_string($raw, array('department')) === '') {
					$errors['department'] = 'Select a department.';
				}
				if (self::pick_string($raw, array('resources')) === '') {
					$errors['resources'] = 'Select how many resources you need.';
				}
				if (self::pick_string($raw, array('budget')) === '') {
					$errors['budget'] = 'Select a budget range.';
				}
				break;

			case 'project_inquiry':
				if (strlen($phone) < 7) {
					$errors['phone'] = 'Enter a valid phone number.';
				}
				if (strlen($message) < 10) {
					$errors['message'] = 'Add project details of at least 10 characters.';
				}
				break;

			case 'homepage_inquiry':
				if (strlen(preg_replace('/\D/', '', $phone)) < 7) {
					$errors['phone'] = 'Enter a valid phone number.';
				}
				if ($service === '') {
					$errors['service'] = 'Select a service.';
				}
				if (strlen($message) < 10) {
					$errors['message'] = 'Add a short message, at least 10 characters.';
				}
				break;

			case 'pricing_calculator':
				if (!is_array($payload)) {
					$errors['payload_json'] = 'Pricing calculator payload_json is required.';
					break;
				}
				foreach (array('businessAnswers', 'serviceAnswers', 'contactAnswers') as $key) {
					if (!isset($payload[$key]) || !is_array($payload[$key])) {
						$errors[$key] = sprintf('Pricing calculator %s must be present.', $key);
					}
				}
				if (isset($payload['contactAnswers']) && is_array($payload['contactAnswers'])) {
					$c = $payload['contactAnswers'];
					if (empty($c['consent']) || (string) $c['consent'] !== 'yes') {
						$errors['consent'] = 'Consent is required to submit this enquiry.';
					}
				}
				break;
		}

		return $errors;
	}

	/**
	 * Pick first non-empty string from candidate keys.
	 *
	 * @param array    $raw  Raw data.
	 * @param string[] $keys Keys.
	 * @return string
	 */
	private static function pick_string(array $raw, array $keys) {
		foreach ($keys as $key) {
			if (!isset($raw[$key]) || !is_scalar($raw[$key])) {
				continue;
			}
			$value = trim((string) wp_unslash($raw[$key]));
			if ($value !== '') {
				return $value;
			}
		}
		return '';
	}

	/**
	 * Soft-infer booking vs homepage from source / referer URL.
	 *
	 * @param array $raw Raw request.
	 * @return string
	 */
	private static function infer_from_source(array $raw) {
		$source = self::pick_string($raw, array('source_url', 'sourceUrl', 'page_url', 'referrer'));
		if ($source === '') {
			return '';
		}
		$path = (string) wp_parse_url($source, PHP_URL_PATH);
		$path = untrailingslashit(strtolower($path));
		if ($path === '' || $path === '/' || $path === '/index' || $path === '/index.html') {
			return 'homepage_inquiry';
		}
		if (strpos($path, '/contact') !== false) {
			return 'project_inquiry';
		}
		if (strpos($path, '/services') !== false || strpos($path, '/locations') !== false) {
			return 'booking';
		}
		return '';
	}

	/**
	 * Admin list title.
	 *
	 * @param string $form_type Type.
	 * @param string $name      Name.
	 * @param string $email     Email.
	 * @return string
	 */
	private static function build_title($form_type, $name, $email) {
		$types = VC_Lead_Meta::form_types();
		$label = isset($types[$form_type]) ? $types[$form_type] : $form_type;
		$who   = $name !== '' ? $name : $email;
		return sprintf('%s — %s', $label, $who);
	}
}
