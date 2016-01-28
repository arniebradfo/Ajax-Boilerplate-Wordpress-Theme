<?php
/**
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
 */
?>

</main><!-- Pjax content wrapper element -->

<?php get_sidebar(); ?>

<?php
	// if this is not an ajax call
	if (!$GLOBALS['is_ajax']):
?>

	<footer id="footer" class="source-org vcard copyright" role="contentinfo">
		<nav class="nav" role="navigation">
			<?php 
				$secondary_menu_name = 'secondary';
				wp_nav_menu( array('theme_location' => $secondary_menu_name) ); 
			?>
		</nav>
		<small>&copy;<?php echo date("Y"); echo " "; bloginfo('name'); ?></small>
	</footer>

	<?php wp_footer(); ?>


<!-- jQuery is called via the WordPress-friendly way via functions.php -->

<!-- this is where we put our custom functions -->
<script src="<?php bloginfo('template_directory'); ?>/_/js/functions.js"></script>

<!-- Asynchronous google analytics; this is the official snippet.
				 Replace UA-XXXX-Y with your site's ID and domainname.com with your domain, then uncomment to enable.

<script>
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-XXXX-Y', 'auto');  // Creates a tracker.
	ga('send', 'pageview');             // Sends a pageview.

</script>
-->

</body>

</html>

<?php endif;// end ajax detection?>