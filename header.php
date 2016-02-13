<?php
/**
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
 */
?>

<?php 
	// if this is an ajax request posting a comment
	if ($GLOBALS['is_ajax'] && $GLOBALS['is_ajax_get_comments_section']){
		// return only the comments section of the current context
		if (have_posts()) : while (have_posts()) : the_post();

			comments_template();

		endwhile; endif;
		exit;
	}
?>

<?php if (!$GLOBALS['is_ajax']): // if this is not an ajax call ?>

<!DOCTYPE html>

<!--[if lt IE 7 ]> <html class="ie ie6 ie-lt11 ie-lt10 ie-lt9 ie-lt8 ie-lt7" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 ie-lt11 ie-lt10 ie-lt9 ie-lt8" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8 ie-lt11 ie-lt10 ie-lt9" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9 ie-lt11 ie-lt10" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 10 ]>   <html class="ie ie10 ie-lt11 " <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 11 ]>   <html class="ie ie11 " <?php language_attributes(); ?>> <![endif]-->
<!--[if !IE ]><!--><html <?php language_attributes(); ?>><!--<![endif]-->

<head id="<?php echo of_get_option('meta_headid'); ?>">

	<meta charset="<?php bloginfo('charset'); ?>">

	<?php // Always force latest IE rendering engine (even in intranet) ?>
	<!--[if IE ]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->

	<?php
		if (is_search())
			echo '<meta name="robots" content="noindex, nofollow" />';
	?>

	<?php endif; // step out of ajax detection for the title?>
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<?php if (!$GLOBALS['is_ajax']): //... and step back in?>

	<meta name="title" content="<?php wp_title( '|', true, 'right' ); ?>">

	<?php // Google will often use this as its description of your page/site. Make it good. ?>
	<meta name="description" content="<?php bloginfo('description'); ?>" />

	<?php
		if (true == of_get_option('meta_author'))
			echo '<meta name="author" content="' . of_get_option("meta_author") . '" />';

		if (true == of_get_option('meta_google'))
			echo '<meta name="google-site-verification" content="' . of_get_option("meta_google") . '" />';
	?>

	<meta name="Copyright" content="Copyright &copy; <?php bloginfo('name'); ?> <?php echo date('Y'); ?>. All Rights Reserved.">

	<?php
		/*
			j.mp/mobileviewport & davidbcalhoun.com/2010/viewport-metatag
			 - device-width : Occupy full width of the screen in its current orientation
			 - initial-scale = 1.0 retains dimensions instead of zooming out if page height > device height
			 - maximum-scale = 1.0 retains dimensions instead of zooming in if page width < device width
			 - minimal-ui = iOS devices have minimal browser ui by default
		*/
		if (true == of_get_option('meta_viewport'))
			echo '<meta name="viewport" content="' . of_get_option("meta_viewport") . ' minimal-ui" />';
	?>
	
	<!-- Application-specific meta tags -->
	<?php

		// Google  -  https://support.google.com/webmasters/answer/79812
		// LinkedIn  -  https://developer.linkedin.com/docs/share-on-linkedin
		// OpenGraph  -  http://ogp.me/
		// Richard's Toolbox  -  http://richardstoolbox.com/#q=meta tag

		// Windows  -  https://msdn.microsoft.com/en-us/library/dn255024(v=vs.85).aspx
		if (true == of_get_option('meta_app_win_name')) {
			echo '<meta name="application-name" content="' . of_get_option("meta_app_win_name") . '" /> ';
			echo '<meta name="msapplication-TileColor" content="' . of_get_option("meta_app_win_color") . '" /> ';
			echo '<meta name="msapplication-TileImage" content="' . of_get_option("meta_app_win_image") . '" />';
		}

		// Twitter  -  https://dev.twitter.com/cards/markup
		if (true == of_get_option('meta_app_twt_card')) {
			echo '<meta name="twitter:card" content="' . of_get_option("meta_app_twt_card") . '" />';
			echo '<meta name="twitter:site" content="' . of_get_option("meta_app_twt_site") . '" />';
			echo '<meta name="twitter:title" content="' . of_get_option("meta_app_twt_title") . '">';
			echo '<meta name="twitter:description" content="' . of_get_option("meta_app_twt_description") . '" />';
			echo '<meta name="twitter:url" content="' . of_get_option("meta_app_twt_url") . '" />';
		}

		// Facebook  -  https://developers.facebook.com/docs/sharing/webmasters
		if (true == of_get_option('meta_app_fb_title')) {
			echo '<meta property="og:title" content="' . of_get_option("meta_app_fb_title") . '" />';
			echo '<meta property="og:description" content="' . of_get_option("meta_app_fb_description") . '" />';
			echo '<meta property="og:url" content="' . of_get_option("meta_app_fb_url") . '" />';
			echo '<meta property="og:image" content="' . of_get_option("meta_app_fb_image") . '" />';
		}
	?>

	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

	<?php wp_head(); ?>

</head>
<body <?php body_class(); ?>>

	<!-- not needed? up to you: http://camendesign.com/code/developpeurs_sans_frontieres -->
	<div id="wrapper">

		<header id="header" role="banner">
			<h1><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<div class="description"><?php bloginfo( 'description' ); ?></div>
		</header>

		<nav class="nav" role="navigation">
			<?php 
				$primary_menu_name = 'primary';
				wp_nav_menu( array('theme_location' => $primary_menu_name) ); 
			?>
		</nav>

		<?php else:	// content that only comes through ajax ?>

		<nav id="wp-all-registered-nav-menus">
			<?php
				$menus = get_registered_nav_menus();
				foreach ( $menus as $location => $description ) { 
					wp_nav_menu( array('theme_location' => $location) ); 
					// echo $location . ': ' . $description . "\r";
				}
			?>
		</nav>

		<?php endif; // end ajax detection ?>
		
		<main><!-- Pjax content wrapper element -->