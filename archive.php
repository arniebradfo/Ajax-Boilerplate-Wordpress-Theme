<?php
/**
 * @package WordPress
 * @subpackage WPAjax
 * @since 0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : ?>

		<h1><?php echo the_archive_title(); ?></h1>

		<?php if (the_archive_description()): ?>
			<p><?php echo the_archive_description(); ?></p>
		<?php endif; ?>

		<section class="post-items">		
			<?php while ( have_posts()) : the_post(); ?>
		
				<?php template_post_item(); ?>

			<?php endwhile; ?>
		</section>
			
	<?php else : ?>

		<h1><?php _e('Nothing Found','wpajax'); ?></h1>

	<?php endif; ?>

<?php get_footer(); ?>
