<?php
/**
 *
 * custom html outputs
 * 
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
 */

function single_comment( $commentdata ){

	$comment_depth = 1;
	$comment_ancestor_ID = $commentdata['comment_parent']; 
	while ($comment_ancestor_ID != 0){
		$comment_depth++;
		$comment_ancestor_ID = get_comment( $comment_ancestor_ID, ARRAY_A )['comment_parent']; 
	}

	?>
	<li id="comment-<?php echo $commentdata['comment_ID']; ?>" class="<?php echo join( ' ',get_comment_class( '', $commentdata['comment_ID'], $commentdata['comment_post_ID'] )) ; ?>">
		<article id="div-comment-<?php echo $commentdata['comment_ID']; ?>" class="comment-body">

			<footer class="comment-meta">
				<div class="comment-author vcard">
					<?php echo get_avatar( $commentdata['comment_author_email'], 32 ); ?>
					<b class="fn"><?php echo $commentdata['comment_author']; ?></b> 
					<span class="says">says:</span>					
				</div><!-- .comment-author -->
				<div class="comment-metadata">
					<a href="<?php echo get_comment_link( $commentdata['comment_ID'] ); ?>">
						<time datetime="<?php echo $commentdata['comment_date_gmt']; ?>+00:00">
							<?php echo get_comment_date( 'F j, Y \a\t g:i a', $commentdata['comment_ID']); ?>
						</time>
					</a>
					<?php if ( is_user_logged_in() ): ?>
					<span class="edit-link">
						<a class="comment-edit-link" href="<?php echo home_url();?>/wp-admin/comment.php?action=editcomment&#038;c=<?php echo $commentdata['comment_content']; ?>">
							Edit
						</a>
					</span>
					<?php endif; ?>
				</div><!-- .comment-metadata -->
			</footer><!-- .comment-meta -->

			<div class="comment-content">
				<p>
					<?php echo $commentdata['comment_content']; ?>
				</p>
			</div><!-- .comment-content -->

			<div class="reply">
				<?php // echo get_comment_reply_link(array(), $commentdata['comment_ID'], $commentdata['comment_post_ID'] ); // I don't know why this doesn't work?>
				<a rel="nofollow" 
				   class="comment-reply-link" 
				   href="<?php echo get_permalink( $commentdata['comment_post_ID'] ); ?>?replytocom=<?php echo $commentdata['comment_ID']; ?>#respond" 
				   onclick="return addComment.moveForm( 'div-comment-<?php echo $commentdata['comment_ID']; ?>', '<?php echo $commentdata['comment_ID']; ?>', 'respond', '12' )"  
				   aria-label="Reply to <?php echo $commentdata['comment_author']; ?>"
				   >
					Reply
				</a>
			</div>

		</article><!-- .comment-body -->
	</li><!-- #comment-## -->
	<?php

	return;

}
?>