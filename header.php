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

<head>

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
		// <meta name="author" content="" />
		// <meta name="google-site-verification" content="" />
	?>

	<meta name="Copyright" content="Copyright &copy; <?php bloginfo('name'); ?> <?php echo date('Y'); ?>. All Rights Reserved.">

	<?php /*
		j.mp/mobileviewport & davidbcalhoun.com/2010/viewport-metatag
		 - device-width : Occupy full width of the screen in its current orientation
		 - initial-scale = 1.0 retains dimensions instead of zooming out if page height > device height
		 - maximum-scale = 1.0 retains dimensions instead of zooming in if page width < device width
		 - minimal-ui = iOS devices have minimal browser ui by default
	*/ ?>
		<meta name="viewport" content="width=device-width, initial-scale=1.0 minimal-ui" />
	
	<?php
		// <!-- Application-specific meta tags -->

		// Google  -  https://support.google.com/webmasters/answer/79812
		// LinkedIn  -  https://developer.linkedin.com/docs/share-on-linkedin
		// OpenGraph  -  http://ogp.me/
		// Richard's Toolbox  -  http://richardstoolbox.com/#q=meta tag

		// Windows  -  https://msdn.microsoft.com/en-us/library/dn255024(v=vs.85).aspx
		// https://msdn.microsoft.com/library/dn455106.aspx

		// Twitter  -  https://dev.twitter.com/cards/markup

		// Facebook  -  https://developers.facebook.com/docs/sharing/webmasters
	?>

	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

	<?php wp_head(); ?>

</head>
<body <?php body_class(); ?>>

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
	
	<main><?php // Pjax content wrapper element ?>
