<?php
/**
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
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
		if (is_file($path)) {
			require_once $path;
		}
	}

	// http://www.inkthemes.com/ajax-comment-wordpress/
	function ajaxify_comments_jaya($comment_ID, $comment_status) {
		if ($GLOBALS['is_ajax']) {
			switch ($comment_status) {
				case '0': //notify moderator of unapproved comment
					wp_notify_moderator($comment_ID);
					break;
				case '1': //Approved comment
					// echo "success";
					$commentdata = get_comment( $comment_ID, ARRAY_A );
					// print_r( $commentdata);
					$permaurl = get_permalink( $post['ID'] );
					$url = str_replace('http://', '/', $permaurl);

					single_comment( $commentdata, $url );
					wp_notify_postauthor($comment_ID);
					break;

				default: // $comment_status was null
					echo "error";
			}
			exit;
		}
	}
	add_action('comment_post', 'ajaxify_comments_jaya', 25, 2);

	// Theme Setup (based on twentythirteen: http://make.wordpress.org/core/tag/twentythirteen/)
	function html5reset_setup() {
		load_theme_textdomain( 'html5reset', get_template_directory() . '/languages' );

		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
		add_theme_support( 'automatic-feed-links' );
		// add_theme_support( 'title-tag' );
		add_theme_support( 'post-formats', array( 'link', 'video', 'aside', 'audio', 'chat', 'gallery', 'image', 'quote', 'status' ) );
		add_theme_support( 'post-thumbnails' );

		// Nav Menus
		register_nav_menus( array(
			'primary'   => __( 'Navigation Menu', 'html5reset' ),
			'secondary' => __( 'Footer Menu', 'html5reset' ),
		) );

		// Widgets
		register_sidebar( array(
			'name'          => __( 'Sidebar Widgets', 'html5reset' ),
			'id'            => 'sidebar-primary',
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		) );
	}
	add_action( 'after_setup_theme', 'html5reset_setup' );

	// WP Title (based on twentythirteen: http://make.wordpress.org/core/tag/twentythirteen/)
	function html5reset_wp_title( $title, $sep ) {
		global $paged, $page;

		if ( is_feed() )
			return $title;

//		 Add the site name.
		$title .= get_bloginfo( 'name' );

//		 Add the site description for the home/front page.
		$site_description = get_bloginfo( 'description', 'display' );
		if ( $site_description && ( is_home() || is_front_page() ) )
			$title = "$title $sep $site_description";

//		 Add a page number if necessary.
		if ( $paged >= 2 || $page >= 2 )
			$title = "$title $sep " . sprintf( __( 'Page %s', 'html5reset' ), max( $paged, $page ) );

		return $title;
	}
	add_filter( 'wp_title', 'html5reset_wp_title', 10, 2 );

	if ( !function_exists( 'load_theme_scripts_and_styles' ) ) {
		function load_theme_scripts_and_styles() {
			// Load Custom Styles
			wp_register_style( 'reset', get_template_directory_uri()."/_/css/reset.css" );
			wp_enqueue_style( 'reset' );
			wp_register_style( 'style', get_stylesheet_uri() );
			wp_enqueue_style( 'style' );

			// Load jQuery scripts - jq v1.12.0 is for < IE8 
			wp_deregister_script( 'jquery' ); // if using vanilla .js
			// google Hosted jQuery
			// wp_register_script( 'jquery', "http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js", false, null, false, true);
			// local Hosted jQuery
			// wp_register_script( 'jquery', get_template_directory_uri()."/_/js/jquery-2.2.0.min.js", null, false, true);
			// wp_enqueue_script( 'jquery' );

			// add the wp comment-reply.js to manage comments
			if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )
				wp_enqueue_script( 'comment-reply' );

			// Load Custom Scripts
			wp_register_script( 'ajaxjs', get_template_directory_uri()."/_/js/functions.js", null, false, true );
			wp_enqueue_script( 'ajaxjs' );

		}
		add_action( 'wp_enqueue_scripts', 'load_theme_scripts_and_styles' ); 
	}

	// Posted On
	function posted_on() {
		printf( __( '
			<span class="sep">
				Posted 
			</span>
			<a href="%1$s" title="%2$s" rel="bookmark">
				<time class="entry-date" datetime="%3$s" pubdate>%4$s</time>
			</a> 
			by 
			<span class="byline author vcard">
				%5$s
			</span>
			', '' ),
			esc_url( get_permalink() ),
			esc_attr( get_the_time() ),
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_author() )
		);
	}

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