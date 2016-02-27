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

	<?php // Always force latest IE rendering engine (even in intranet) ?>
	<!--[if IE ]><meta http-equiv="X-UA-Compatible" content="IE=edge" /><![endif]-->
	
	<?php // <!-- Application-specific meta tags -->
		// Google  				-  https://support.google.com/webmasters/answer/79812
		// LinkedIn  			-  https://developer.linkedin.com/docs/share-on-linkedin
		// OpenGraph  			-  http://ogp.me/
		// Richard's Toolbox  	-  http://richardstoolbox.com/#q=meta tag
		// Windows  			-  https://msdn.microsoft.com/en-us/library/dn255024(v=vs.85).aspx
		// 						-  https://msdn.microsoft.com/library/dn455106.aspx
		// Twitter  			-  https://dev.twitter.com/cards/markup
		// Facebook  			-  https://developers.facebook.com/docs/sharing/webmasters
	?>

	<?php if (is_search()){ ?>
		<meta name="robots" content="noindex, nofollow" />
	<?php } ?>
	<meta charset="<?php bloginfo('charset'); ?>"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0 minimal-ui" />
	<meta name="Copyright" content="Copyright &copy; <?php bloginfo('name'); ?> <?php echo date('Y'); ?>. All Rights Reserved." />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	<?php // <meta name="google-site-verification" content="" /> ?>

	<?php endif; // step out of ajax detection for meta and wp_head ?>

	<?php author_meta_tag(); ?>
	<meta name="description" content="<?php bloginfo('description'); // Google will often use this as its description of your page/site. Make it good. ?>" />
	<?php wp_head(); ?>

	<?php if (!$GLOBALS['is_ajax']): //... and step back in?>

</head>
<body <?php body_class(); ?> >

	<header id="header" role="banner">
		<h1><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
		<div class="description"><?php bloginfo( 'description' ); ?></div>
	</header>

	<nav class="nav" role="navigation">
		<?php wp_nav_menu( array('theme_location' => 'primary') ); ?>
	</nav>

	<?php else:	// content that only comes through ajax ?>

	<nav id="wp-all-registered-nav-menus">
		<?php
			$menus = get_registered_nav_menus();
			foreach ( $menus as $location => $description ) { 
				wp_nav_menu( array('theme_location' => $location) ); 
			}
		?>
	</nav>

	<?php endif; // end ajax detection ?>
	
	<main><?php // Pjax content wrapper element ?>
