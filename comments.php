<?php

	if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
		die ('Please do not load this page directly. Thanks!');

	if ( post_password_required() ) { ?>
		<?php _e('This post is password protected. Enter the password to view comments.','wpajax'); ?>
	<?php
		return;
	}
?>

<section id="comments-section">

<?php if ( have_comments() ) : ?>
	
	<h2 id="comments"><?php comments_number(__('No Responses','wpajax'), __('One Response','wpajax'), __('% Responses','wpajax') );?></h2>

	<?php wpajax_comment_pagination(); ?>

	<ol class="commentlist">
		<?php wp_list_comments(); ?>
	</ol>

	<?php wpajax_comment_pagination(true); ?>
	
 <?php else : // this is displayed if there are no comments so far ?>

	<?php if ( comments_open() ) : ?>
		<!-- If comments are open, but there are no comments. -->
		<nav class="nav comment-navigation"></nav>
		<ol class="commentlist"></ol>
		<nav class="nav comment-navigation"></nav>

	 <?php else : // comments are closed ?>
		<p><?php _e('Comments are closed.','wpajax'); ?></p>

	<?php endif; ?>
	
<?php endif; ?>

<?php if ( comments_open() ) : ?>

	<div id="comment-status" ></div>
	<?php comment_form(); ?>
	
	<!-- 
	<div id="respond">

		<h2><?php comment_form_title( __('Leave a Reply','wpajax'), __('Leave a Reply to %s','wpajax') ); ?></h2>

		<div id="comment-status" ></div>

		<div class="cancel-comment-reply">
			<?php cancel_comment_reply_link(); ?>
		</div>

		<?php if ( get_option('comment_registration') && !is_user_logged_in() ) : ?>
			<p><?php _e('You must be','wpajax'); ?> <a href="<?php echo wp_login_url( get_permalink() ); ?>"><?php _e('logged in','wpajax'); ?></a> <?php _e('to post a comment.','wpajax'); ?></p>
		<?php else : ?>

		<form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">

			<?php if ( is_user_logged_in() ) : ?>

				<p><?php _e('Logged in as','wpajax'); ?> <a href="<?php echo get_option('siteurl'); ?>/wp-admin/profile.php"><?php echo $user_identity; ?></a>. <a href="<?php echo wp_logout_url(get_permalink()); ?>" title="Log out of this account"><?php _e('Log out','wpajax'); ?> &raquo;</a></p>

			<?php else : ?>

				<div>
					<input type="text" name="author" id="author" value="<?php echo esc_attr($comment_author); ?>" size="22" tabindex="1" <?php if ($req) echo "aria-required='true'"; ?> />
					<label for="author"><?php _e('Name','wpajax'); ?> <?php if ($req) echo "(required)"; ?></label>
				</div>

				<div>
					<input type="text" name="email" id="email" value="<?php echo esc_attr($comment_author_email); ?>" size="22" tabindex="2" <?php if ($req) echo "aria-required='true'"; ?> />
					<label for="email"><?php _e('Mail (will not be published)','wpajax'); ?> <?php if ($req) echo "(required)"; ?></label>
				</div>

				<div>
					<input type="text" name="url" id="url" value="<?php echo esc_attr($comment_author_url); ?>" size="22" tabindex="3" />
					<label for="url"><?php _e('Website','wpajax'); ?></label>
				</div>

			<?php endif; ?>

			<div>
				<textarea name="comment" id="comment" cols="58" rows="10" tabindex="4"></textarea>
			</div>

			<div>
				<input name="submit" type="submit" id="submit" tabindex="5" value="<?php _e('Submit Comment','wpajax'); ?>" />
				<?php comment_id_fields(); ?>
			</div>
			
			<?php do_action('comment_form', $post->ID); ?>

		</form>

		<?php endif; // If registration required and not logged in ?>
		
	</div>
	-->

</section>

<?php endif; ?>
