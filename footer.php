<?php
/**
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
 */
?>

</main>

<?php
	ajax_post_pagination(); 	
	if (!$GLOBALS['is_ajax']): // if this is not an ajax call
?>

<?php get_sidebar(); ?>

<footer id="footer" class="source-org vcard copyright" role="contentinfo">

	<nav class="nav" role="navigation">
		<?php wp_nav_menu( array('theme_location' => 'secondary') ); ?>
	</nav>
	<small>&copy;<?php echo date("Y"); echo " "; bloginfo('name'); ?></small>

	<div id="wp_footer" style="display:none;">
		<?php wp_footer(); // wrapped in a div so it can be targeted after ajax call if needed ?>

		<?php // all .js is called via the WordPress-friendly way via functions.php ?>

		<?php 
		// Asynchronous google analytics; this is the official snippet.
		// Replace UA-XXXX-Y with your site's ID and domainname.com with your domain, then uncomment to enable. 
		/*
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-XXXX-Y', 'auto');  // Creates a tracker.
			ga('send', 'pageview');             // Sends a pageview.

		</script>
		*/
		?>
	</div>

</footer>

</body>

</html>

<?php endif;// end ajax detection?>