<?php
/**
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
 */
 get_header(); ?>

	<?php if (have_posts()) : ?>

		<h1><?php _e('Search Results','html5reset'); ?></h1>

		<section class="post-items">		
			<?php while (have_posts()) : the_post(); ?>

				<?php get_template_part('part-postitem'); ?>

			<?php endwhile; ?>
		</section>

	<?php else : ?>

		<h1><?php _e('Nothing Found','html5reset'); ?></h1>

	<?php endif; ?>

<?php get_footer(); ?>
