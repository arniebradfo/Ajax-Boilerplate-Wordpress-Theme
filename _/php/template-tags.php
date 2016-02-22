<?php
/**
 *
 * custom html outputs
 * 
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
 */

function single_comment( $commentdata, $url ){

		$comment_depth = 1;
		$comment_ancestor_ID = $commentdata['comment_parent']; 
		while ($comment_ancestor_ID != 0){
			$comment_depth++;
			$comment_ancestor_ID = get_comment( $comment_ancestor_ID, ARRAY_A )['comment_parent']; 
		}

		$output = '';
		// TODO: find out what all these classes do and implement them properly
		$output .='	<li class="comment byuser comment-author-admin bypostauthor odd alt thread-odd thread-alt depth-'.$comment_depth.'" id="comment-' . $commentdata['comment_ID'] . '">';
		$output .='			<div id="div-comment-' . $commentdata['comment_ID'] . '" class="comment-body">';
		$output .='				<div class="comment-author vcard">';
		$output .=					get_avatar( $commentdata['comment_author_email'], 32 );
		$output .='					<cite class="fn">' . $commentdata['comment_author'] . '</cite> ';
		$output .='					<span class="says">says:</span>';
		$output .='				</div>';
		$output .='				<div class="comment-meta commentmetadata"><a href="http://localhost/WordPress_Code/?p=1#comment-'. $commentdata['comment_ID'] .'">';
		$output .=					get_comment_date( 'F j, Y \a\t g:i a', $commentdata['comment_ID']) .'</a>&nbsp;&nbsp;';
									if ( is_user_logged_in() ){
		$output .='					<a class="comment-edit-link" href="'. home_url() .'/wp-admin/comment.php?action=editcomment&amp;c='. $commentdata['comment_ID'] .'">';
		$output .='						(Edit)';
		$output .='					</a>';
									}
		$output .='				</div>';
		$output .='				<p>' . $commentdata['comment_content'] . '</p>';
		$output .='				<div class="reply">';
		$output .='					<a class="comment-reply-link" href="'. $url .'&amp;replytocom='. $commentdata['comment_ID'] .'#respond"';
		$output .='					onclick="return addComment.moveForm(&quot;div-comment-'. $commentdata['comment_ID'] .'&quot;, &quot;'. $commentdata['comment_ID'] . '&quot;, &quot;respond&quot;, &quot;1&quot;)">Reply</a>';
		$output .='				</div>';
		$output .='			</div>';
		$output .='		</li>';

		echo $output;


}

?>