<?php
/**
 * @package WordPress
 * @subpackage WPAjax
 * @since 0.1.0
 */
?>
		<article <?php post_class() ?> id="post-<?php the_ID(); ?>">

			<h2><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h2>

			<?php posted_on(); ?>

			<div class="entry">
				<?php the_content(); ?>
			</div>

			<footer class="postmetadata">
				<?php the_tags(__('Tags: ','wpajax'), ', ', '<br />'); ?>
				<?php _e('Posted in','wpajax'); ?> <?php the_category(', ') ?> | 
				<?php comments_popup_link(__('No Comments &#187;','wpajax'), __('1 Comment &#187;','wpajax'), __('% Comments &#187;','wpajax')); ?>
			</footer>

		</article>

<?php // end of postitem ?>