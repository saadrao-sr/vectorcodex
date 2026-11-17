<?php
/**
 * VectorCodex Blog child theme — Classic Editor native style formats.
 *
 * Uses TinyMCE Styles dropdown only (no custom buttons, dialogs, or plugins).
 */

if (!defined('ABSPATH')) {
	exit;
}

define('VC_BLOG_CHILD_VERSION', '1.3.0');
define('VC_BLOG_FAQS_META_KEY', 'vc_blog_faqs');

/**
 * Enqueue parent stylesheet when present, then child stylesheet.
 */
function vc_blog_child_enqueue_styles() {
	$deps = array();
	$parent_style = get_template_directory() . '/style.css';

	if (is_readable($parent_style)) {
		wp_enqueue_style(
			'hostinger-ai-theme-style',
			get_template_directory_uri() . '/style.css',
			array(),
			wp_get_theme(get_template())->get('Version')
		);
		$deps[] = 'hostinger-ai-theme-style';
	}

	wp_enqueue_style(
		'vectorcodex-blog-child-style',
		get_stylesheet_uri(),
		$deps,
		VC_BLOG_CHILD_VERSION
	);
}
add_action('wp_enqueue_scripts', 'vc_blog_child_enqueue_styles');

/**
 * Load Classic Editor stylesheet so formats are visible while editing.
 */
function vc_blog_child_editor_styles() {
	add_editor_style('editor-style.css');
}
add_action('after_setup_theme', 'vc_blog_child_editor_styles');

/**
 * Ensure the native TinyMCE Styles dropdown is available on the second toolbar.
 *
 * @param array $buttons Existing buttons.
 * @return array
 */
function vc_blog_child_mce_buttons_2($buttons) {
	if (!is_array($buttons)) {
		$buttons = array();
	}

	if (!in_array('styleselect', $buttons, true)) {
		array_unshift($buttons, 'styleselect');
	}

	return $buttons;
}
add_filter('mce_buttons_2', 'vc_blog_child_mce_buttons_2');

/**
 * Register VectorCodex style formats for Classic Editor.
 *
 * @param array $init TinyMCE init settings.
 * @return array
 */
function vc_blog_child_tiny_mce_before_init($init) {
	$style_formats = array(
		array(
			'title'   => 'CTA Block',
			'block'   => 'div',
			'classes' => 'vc-editorial-cta',
			'wrapper' => true,
		),
		array(
			'title'      => 'CTA Button',
			'inline'     => 'a',
			'classes'    => 'vc-editorial-cta__btn vc-editorial-cta__btn--primary',
			'wrapper'    => true,
			'attributes' => array(
				'href' => '#',
			),
		),
		array(
			'title'   => 'Pro Tip',
			'block'   => 'div',
			'classes' => 'vc-pro-tip',
			'wrapper' => true,
		),
		array(
			'title'   => 'Citation',
			'inline'  => 'span',
			'classes' => 'vc-inline-citation',
			'wrapper' => true,
		),
		array(
			'title'   => 'Key Statistics',
			'block'   => 'div',
			'classes' => 'vc-statistics',
			'wrapper' => true,
		),
	);

	$init['style_formats'] = wp_json_encode($style_formats);

	// Keep formats selectable after save/reopen.
	$init['style_formats_merge'] = false;

	$existing = isset($init['body_class']) ? $init['body_class'] . ' ' : '';
	$init['body_class'] = trim($existing . 'vc-classic-editor');

	return $init;
}
add_filter('tiny_mce_before_init', 'vc_blog_child_tiny_mce_before_init');

/**
 * Allow editorial wrapper classes through KSES on save.
 *
 * @param array  $tags    Allowed HTML.
 * @param string $context Context.
 * @return array
 */
function vc_blog_child_kses_allowed_html($tags, $context) {
	if ($context !== 'post' || !is_array($tags)) {
		return $tags;
	}

	$vc_attrs = array(
		'class' => true,
		'id'    => true,
	);

	foreach (array('div', 'span', 'p', 'aside', 'section') as $tag) {
		if (!isset($tags[$tag]) || !is_array($tags[$tag])) {
			$tags[$tag] = array();
		}
		$tags[$tag] = array_merge($tags[$tag], $vc_attrs);
	}

	return $tags;
}
add_filter('wp_kses_allowed_html', 'vc_blog_child_kses_allowed_html', 10, 2);

/**
 * Normalise FAQ rows from post meta or form input.
 *
 * @param mixed $value Raw value.
 * @return array<int, array{question:string,answer:string}>
 */
function vc_blog_child_normalize_faqs($value) {
	if (is_string($value) && $value !== '') {
		$decoded = json_decode($value, true);
		$value = is_array($decoded) ? $decoded : array();
	}

	if (!is_array($value)) {
		return array();
	}

	$faqs = array();
	foreach ($value as $row) {
		if (!is_array($row)) {
			continue;
		}
		$question = isset($row['question']) ? sanitize_text_field($row['question']) : '';
		$answer = isset($row['answer']) ? sanitize_textarea_field($row['answer']) : '';
		if ($question === '' || $answer === '') {
			continue;
		}
		$faqs[] = array(
			'question' => $question,
			'answer'   => $answer,
		);
	}

	return $faqs;
}

/**
 * Register the FAQs meta box on posts.
 */
function vc_blog_child_add_faqs_metabox() {
	add_meta_box(
		'vc-blog-faqs',
		'Blog FAQs',
		'vc_blog_child_render_faqs_metabox',
		'post',
		'normal',
		'default'
	);
}
add_action('add_meta_boxes', 'vc_blog_child_add_faqs_metabox');

/**
 * Render FAQs meta box.
 *
 * @param WP_Post $post Post.
 */
function vc_blog_child_render_faqs_metabox($post) {
	wp_nonce_field('vc_blog_faqs_save', 'vc_blog_faqs_nonce');
	$faqs = vc_blog_child_normalize_faqs(get_post_meta($post->ID, VC_BLOG_FAQS_META_KEY, true));
	if (count($faqs) === 0) {
		$faqs = array(
			array(
				'question' => '',
				'answer'   => '',
			),
		);
	}
	?>
	<p class="description">Add FAQs for this post. They appear on the Astro article page after the content, above Share.</p>
	<div id="vc-faqs-list">
		<?php foreach ($faqs as $index => $faq) : ?>
			<div class="vc-faq-row">
				<div class="vc-faq-row__head">
					<span class="vc-faq-index"><?php echo esc_html(str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT)); ?></span>
					<button type="button" class="button-link-delete vc-faq-remove">Remove</button>
				</div>
				<p>
					<label>Question<br>
						<input
							type="text"
							class="widefat vc-faq-question"
							name="vc_faqs[<?php echo esc_attr((string) $index); ?>][question]"
							value="<?php echo esc_attr($faq['question']); ?>"
						>
					</label>
				</p>
				<p>
					<label>Answer<br>
						<textarea
							class="widefat vc-faq-answer"
							name="vc_faqs[<?php echo esc_attr((string) $index); ?>][answer]"
							rows="3"
						><?php echo esc_textarea($faq['answer']); ?></textarea>
					</label>
				</p>
			</div>
		<?php endforeach; ?>
	</div>
	<p>
		<button type="button" class="button" id="vc-faqs-add">Add FAQ</button>
	</p>
	<?php
}

/**
 * Save FAQs meta.
 *
 * @param int $post_id Post ID.
 */
function vc_blog_child_save_faqs_metabox($post_id) {
	if (!isset($_POST['vc_blog_faqs_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['vc_blog_faqs_nonce'])), 'vc_blog_faqs_save')) {
		return;
	}
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return;
	}
	if (!current_user_can('edit_post', $post_id)) {
		return;
	}

	$raw = isset($_POST['vc_faqs']) && is_array($_POST['vc_faqs']) ? wp_unslash($_POST['vc_faqs']) : array();
	$faqs = vc_blog_child_normalize_faqs($raw);

	if (count($faqs) === 0) {
		delete_post_meta($post_id, VC_BLOG_FAQS_META_KEY);
		return;
	}

	update_post_meta($post_id, VC_BLOG_FAQS_META_KEY, $faqs);
}
add_action('save_post_post', 'vc_blog_child_save_faqs_metabox');

/**
 * Admin assets for the FAQs meta box.
 *
 * @param string $hook Current admin page.
 */
function vc_blog_child_faqs_admin_assets($hook) {
	if ($hook !== 'post.php' && $hook !== 'post-new.php') {
		return;
	}

	$screen = function_exists('get_current_screen') ? get_current_screen() : null;
	if (!$screen || $screen->post_type !== 'post') {
		return;
	}

	wp_enqueue_style(
		'vc-blog-faqs-admin',
		get_stylesheet_directory_uri() . '/assets/css/vc-faqs-admin.css',
		array(),
		VC_BLOG_CHILD_VERSION
	);
	wp_enqueue_script(
		'vc-blog-faqs-admin',
		get_stylesheet_directory_uri() . '/assets/js/vc-faqs-admin.js',
		array(),
		VC_BLOG_CHILD_VERSION,
		true
	);
}
add_action('admin_enqueue_scripts', 'vc_blog_child_faqs_admin_assets');

/**
 * Expose FAQs on the posts REST API as `vc_faqs`.
 */
function vc_blog_child_register_faqs_rest_field() {
	register_rest_field(
		'post',
		'vc_faqs',
		array(
			'get_callback' => function ($post_arr) {
				$post_id = isset($post_arr['id']) ? (int) $post_arr['id'] : 0;
				if ($post_id <= 0) {
					return array();
				}
				return vc_blog_child_normalize_faqs(get_post_meta($post_id, VC_BLOG_FAQS_META_KEY, true));
			},
			'schema'       => array(
				'description' => 'VectorCodex blog FAQs for this post.',
				'type'        => 'array',
				'context'     => array('view', 'edit', 'embed'),
				'items'       => array(
					'type'       => 'object',
					'properties' => array(
						'question' => array('type' => 'string'),
						'answer'   => array('type' => 'string'),
					),
				),
			),
		)
	);
}
add_action('rest_api_init', 'vc_blog_child_register_faqs_rest_field');
