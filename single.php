<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<article <?php post_class() ?> id="post-<?php the_ID(); ?>">
			
			<h1 class="entry-title"><?php the_title(); ?></h1>

			<div class="entry-content">
				
				<?php the_content(); ?>

				<?php wp_link_pages(array('before' => __('Pages: ','wpajax'), 'next_or_number' => 'number')); ?>
				
				<?php the_tags( __('Tags: ','wpajax'), ', ', ''); ?>
			
				<?php posted_on(); ?>

			</div>
			
			<?php edit_post_link(__('Edit this entry','wpajax'),'','.'); ?>
			
		</article>

	<?php comments_template(); ?>

	<?php endwhile; endif; ?>
	
<?php get_footer(); ?>