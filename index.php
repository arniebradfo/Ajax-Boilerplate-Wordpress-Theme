<?php
/**
 * @package WordPress
 * @subpackage WPAjax
 * @since 0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : ?>

		<section class="post-items">		
			<?php while (have_posts()) : the_post(); ?>

				<?php get_template_part('part-postitem'); ?>

			<?php endwhile; ?>
		</section>

	<?php else : ?>

		<h1><?php _e('Nothing Found','wpajax'); ?></h1>

	<?php endif; ?>

<?php get_footer(); ?>
