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

	// http://www.inkthemes.com/ajax-comment-wordpress/
	function ajaxify_comments_jaya($comment_ID, $comment_status) {
		if ($GLOBALS['is_ajax']) {
			switch ($comment_status) {
				case '0': //notify moderator of unapproved comment
					wp_notify_moderator($comment_ID);
					break;
				case '1': //Approved comment
					// echo "success";
					$commentdata = &get_comment( $comment_ID, ARRAY_A );
					// print_r( $commentdata);
					$permaurl = get_permalink( $post->ID );
					$url = str_replace('http://', '/', $permaurl);

					$comment_depth = 1;
					$comment_ancestor_ID = $commentdata['comment_parent']; 
					while ($comment_ancestor_ID != 0){
						$comment_depth++;
						$comment_ancestor_ID = get_comment( $comment_ancestor_ID, ARRAY_A )['comment_parent']; 
					}

					$output = '';
					// TODO: find out what all these classes do and implement them properly
					$output .='	<li class="comment byuser comment-author-admin bypostauthor odd alt thread-odd thread-alt depth-'.$comment_depth.'" id="comment-' . $commentdata['comment_ID'] . '">';
					$output .='			<div id="div-comment-' . $commentdata['comment_ID'] . '" class="comment-body">';
					$output .='				<div class="comment-author vcard">';
					$output .=					get_avatar( $commentdata['comment_author_email'], 32 );
					$output .='					<cite class="fn">' . $commentdata['comment_author'] . '</cite> ';
					$output .='					<span class="says">says:</span>';
					$output .='				</div>';
					$output .='				<div class="comment-meta commentmetadata"><a href="http://localhost/WordPress_Code/?p=1#comment-'. $commentdata['comment_ID'] .'">';
					$output .=					get_comment_date( 'F j, Y \a\t g:i a', $commentdata['comment_ID']) .'</a>&nbsp;&nbsp;';
												if ( is_user_logged_in() ){
					$output .='					<a class="comment-edit-link" href="'. home_url() .'/wp-admin/comment.php?action=editcomment&amp;c='. $commentdata['comment_ID'] .'">';
					$output .='						(Edit)';
					$output .='					</a>';
												}
					$output .='				</div>';
					$output .='				<p>' . $commentdata['comment_content'] . '</p>';
					$output .='				<div class="reply">';
					$output .='					<a class="comment-reply-link" href="'. $url .'&amp;replytocom='. $commentdata['comment_ID'] .'#respond"';
					$output .='					onclick="return addComment.moveForm(&quot;div-comment-'. $commentdata['comment_ID'] .'&quot;, &quot;'. $commentdata['comment_ID'] . '&quot;, &quot;respond&quot;, &quot;1&quot;)">Reply</a>';
					$output .='				</div>';
					$output .='			</div>';
					$output .='		</li>';
					
					echo $output;
					wp_notify_postauthor($comment_ID, $commentdata['comment_type']);
					break;

				default: // $comment_status was null
					echo "error";
			}
			exit;
		}
	}
	add_action('comment_post', 'ajaxify_comments_jaya', 25, 2);

	// Options Framework (https://github.com/devinsays/options-framework-plugin)
	if ( !function_exists( 'optionsframework_init' ) ) {
		define( 'OPTIONS_FRAMEWORK_DIRECTORY', get_template_directory_uri() . '/_/inc/' );
		require_once dirname( __FILE__ ) . '/_/inc/options-framework.php';
	}

	// Theme Setup (based on twentythirteen: http://make.wordpress.org/core/tag/twentythirteen/)
	function html5reset_setup() {
		load_theme_textdomain( 'html5reset', get_template_directory() . '/languages' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'structured-post-formats', array( 'link', 'video' ) );
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'quote', 'status' ) );
		register_nav_menu( 'primary', __( 'Navigation Menu', 'html5reset' ) );
		register_nav_menu( 'secondary', __( 'Footer Menu', 'html5reset' ) );
		add_theme_support( 'post-thumbnails' );
	}
	add_action( 'after_setup_theme', 'html5reset_setup' );

	// Scripts & Styles (based on twentythirteen: http://make.wordpress.org/core/tag/twentythirteen/)
	function html5reset_scripts_styles() {
		global $wp_styles;

		// Load Comments
		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )
			wp_enqueue_script( 'comment-reply' );

		// Load Stylesheets
//		wp_enqueue_style( 'html5reset-reset', get_template_directory_uri() . '/reset.css' );
//		wp_enqueue_style( 'html5reset-style', get_stylesheet_uri() );

		// Load IE Stylesheet.
//		wp_enqueue_style( 'html5reset-ie', get_template_directory_uri() . '/css/ie.css', array( 'html5reset-style' ), '20130213' );
//		$wp_styles->add_data( 'html5reset-ie', 'conditional', 'lt IE 9' );

		// Modernizr
		// This is an un-minified, complete version of Modernizr. Before you move to production, you should generate a custom build that only has the detects you need.
		// wp_enqueue_script( 'html5reset-modernizr', get_template_directory_uri() . '/_/js/modernizr-2.6.2.dev.js' );

	}
	add_action( 'wp_enqueue_scripts', 'html5reset_scripts_styles' );

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




//OLD STUFF BELOW


	// Load jQuery
	if ( !function_exists( 'core_mods' ) ) {
		function core_mods() {
			if ( !is_admin() ) {
				wp_deregister_script( 'jquery' );
				// wp_register_script( 'jquery', ( "http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js" ), false);
				// wp_enqueue_script( 'jquery' );
			}
		}
		add_action( 'wp_enqueue_scripts', 'core_mods' );
	}

	// Load Custom Scripts
	if ( !function_exists( 'load_custom_scripts' ) ) {
		function load_custom_scripts() {
			if ( !is_admin() ) {
				wp_register_script( 'ajaxjs', ( dirname( __FILE__ )."/_/js/functions.js" ), false);
				wp_enqueue_script( 'ajaxjs' );
			}
		}
		// add_action( 'wp_enqueue_scripts', 'load_custom_scripts' );
	}

	// Clean up the <head>, if you so desire.
	//	function removeHeadLinks() {
	//    	remove_action('wp_head', 'rsd_link');
	//    	remove_action('wp_head', 'wlwmanifest_link');
	//    }
	//    add_action('init', 'removeHeadLinks');

	// Custom Menu
	register_nav_menu( 'primary', __( 'Navigation Menu', 'html5reset' ) );

	// Widgets
	if ( function_exists('register_sidebar' )) {
		function html5reset_widgets_init() {
			register_sidebar( array(
				'name'          => __( 'Sidebar Widgets', 'html5reset' ),
				'id'            => 'sidebar-primary',
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			) );
		}
		add_action( 'widgets_init', 'html5reset_widgets_init' );
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

?>
