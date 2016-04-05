<?php
/**
 * @package WordPress
 * @subpackage WPAjax
 * @since 0.1.0
 * @author     James Bradford &lt;james@polaris.graphics&gt;
 * @copyright  Copyright (c) 2016, James Bradford
 * @link       https://github.com/arniebradfo/WPAjax-Theme
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

	// Detect ajax request (https://rosspenman.com/pushstate-part-2/)
	$GLOBALS['is_ajax'] = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') ? true : false ;
	// detect differet types of wordpress ajax requests by setting a header in the js call
	$GLOBALS['is_ajax_get_page'] = (!empty($_SERVER['HTTP_WP_REQUEST_TYPE']) && strtolower($_SERVER['HTTP_WP_REQUEST_TYPE']) == 'getpage') ? true : false ;
	$GLOBALS['is_ajax_get_comments_section'] = (!empty($_SERVER['HTTP_WP_REQUEST_TYPE']) && strtolower($_SERVER['HTTP_WP_REQUEST_TYPE']) == 'getcommentssection') ? true : false ;
	$GLOBALS['is_ajax_post_comment'] = (!empty($_SERVER['HTTP_WP_REQUEST_TYPE']) && strtolower($_SERVER['HTTP_WP_REQUEST_TYPE']) == 'postcomment') ? true : false ;

	// runs through all .php partials in /_/php/
	foreach (scandir(dirname(__FILE__).'/_/php') as $filename) {
		$path = dirname(__FILE__).'/_/php/' . $filename;
		if ( is_file($path) && pathinfo($path,PATHINFO_EXTENSION) == 'php') {
			require_once $path;
		}
	}

	// http://www.inkthemes.com/ajax-comment-wordpress/
	function WPAjax_load_comment($comment_ID, $comment_status) {
		if ($GLOBALS['is_ajax']) {
			switch ($comment_status) {
				case '0': //notify moderator of unapproved comment
					wp_notify_moderator( $comment_ID );
					break;
				case '1': //Approved comment
					single_comment( $comment_ID );
					wp_notify_postauthor( $comment_ID );
					break;
				default: // $comment_status was null
					echo "error";
			}
			exit; // better the wp_die() ?
		}
	}
	add_action('comment_post', 'WPAjax_load_comment', 25, 2);

	// Theme Setup (based on twentythirteen: http://make.wordpress.org/core/tag/twentythirteen/)
	function WPAjax_theme_setup() {
		load_theme_textdomain( 'wpajax', get_template_directory() . '/languages' );

		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-formats', array( 'link', 'video', 'aside', 'audio', 'chat', 'gallery', 'image', 'quote', 'status' ) );
		add_theme_support( 'post-thumbnails' );

		// Nav Menus
		register_nav_menus( array(
			'primary'   => __( 'Navigation Menu', 'wpajax' ),
			'secondary' => __( 'Footer Menu', 'wpajax' ),
		) );

		// Widgets
		register_sidebar( array(
			'name'          => __( 'Sidebar Widgets', 'wpajax' ),
			'id'            => 'sidebar-primary',
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		) );
	}
	add_action( 'after_setup_theme', 'WPAjax_theme_setup' );

	function load_theme_scripts_and_styles() {
		// Load Custom Styles
		wp_register_style( 'reset', get_template_directory_uri()."/_/css/reset.css" );
		wp_enqueue_style( 'reset' );
		wp_register_style( 'style', get_stylesheet_uri() );
		wp_enqueue_style( 'style' );
		// Remove widget css from head - https://wordpress.org/support/topic/remove-css-from-head

		// Load jQuery scripts - jq v1.12.0 is for < IE8 
		wp_deregister_script( 'jquery' ); // if using vanilla .js
		// google Hosted jQuery
		// wp_register_script( 'jquery', "http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js", false, null, false, true);
		// wp_enqueue_script( 'jquery' );

		// add the wp comment-reply.js to manage comments
		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )
			wp_enqueue_script( 'comment-reply' );

		// Load Custom Scripts
		wp_register_script( 'ajaxjs', get_template_directory_uri()."/_/js/functions.js", null, false, true );
		wp_enqueue_script( 'ajaxjs' );

	}
	add_action( 'wp_enqueue_scripts', 'load_theme_scripts_and_styles' ); 

	// DISABLE EMOJIs  -  http://wordpress.stackexchange.com/questions/185577/disable-emojicons-introduced-with-wp-4-2
	function disable_wp_emojicons() {
		// all actions related to emojis
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
		// filter to remove TinyMCE emojis
		function disable_emojicons_tinymce( $plugins ) {
			if ( is_array( $plugins ) ) {
				return array_diff( $plugins, array( 'wpemoji' ) );
			} else {
				return array();
			}
		}
		add_filter( 'tiny_mce_plugins', 'disable_emojicons_tinymce' );
	}
	add_action( 'init', 'disable_wp_emojicons' );

?>