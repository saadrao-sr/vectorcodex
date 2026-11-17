<?php
/**
 * Custom post type: vc_lead.
 *
 * @package VectorCodexLeadManager
 */

if (!defined('ABSPATH')) {
	exit;
}

class VC_Lead_CPT {

	/**
	 * Hook registration.
	 */
	public static function init() {
		add_action('init', array(__CLASS__, 'register'));
	}

	/**
	 * Register private CPT — admin UI only, not publicly queryable or REST-exposed.
	 */
	public static function register() {
		$labels = array(
			'name'               => 'Leads',
			'singular_name'      => 'Lead',
			'menu_name'          => 'VectorCodex Leads',
			'name_admin_bar'     => 'Lead',
			'add_new'            => 'Add Lead',
			'add_new_item'       => 'Add New Lead',
			'edit_item'          => 'View Lead',
			'new_item'           => 'New Lead',
			'view_item'          => 'View Lead',
			'search_items'       => 'Search Leads',
			'not_found'          => 'No leads found.',
			'not_found_in_trash' => 'No leads found in Trash.',
			'all_items'          => 'All Leads',
		);

		register_post_type(
			VC_LEADS_CPT,
			array(
				'labels'              => $labels,
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => false, // Custom top-level menu in admin class.
				'show_in_admin_bar'   => false,
				'show_in_nav_menus'   => false,
				'show_in_rest'        => false, // Never expose via WP core REST.
				'exclude_from_search' => true,
				'has_archive'         => false,
				'rewrite'             => false,
				'query_var'           => false,
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'capabilities'        => array(
					'create_posts' => 'do_not_allow', // Public creates via custom REST only.
				),
				'supports'            => array('title'),
				'delete_with_user'    => false,
			)
		);
	}
}
