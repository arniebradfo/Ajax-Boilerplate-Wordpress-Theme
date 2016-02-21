<?php
/**
 * @package WordPress
 * @subpackage HTML5-Reset-Plus-PJAX
 * @since HTML5 Reset + PJAX 0.1
 */

// http://www.paulund.co.uk/theme-options-page

// Theme Option Page Example
function opts_theme_menu()
{
  add_theme_page( 'Theme Options', 'Theme Options', 'manage_options', 'opts_theme_options.php', 'opts_theme_page');  
}
add_action('admin_menu', 'opts_theme_menu');

// Callback function to the add_theme_page will display the theme options page
function opts_theme_page()
{
?>
	<div class="section panel">
		<h1>Theme Options</h1>
		<form method="post" enctype="multipart/form-data" action="options.php">
		<?php 
			settings_fields('opts_theme_options'); 	
			do_settings_sections('opts_theme_options.php');
		?>
			<p class="submit">  
				<input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />  
			</p>
		</form>
	</div>
<?php
}

//Function to register the settings
function opts_register_settings()
{
	// Register the settings with Validation callback
	register_setting( 'opts_theme_options', 'opts_theme_options', 'opts_validate_settings' );

	// Add settings section
	add_settings_section( 'opts_text_section', 'Text box Title', 'opts_display_section', 'opts_theme_options.php' );

	// Create textbox field
	$field_args = array(
	  'type'      => 'text',
	  'id'        => 'opts_textbox',
	  'name'      => 'opts_textbox',
	  'desc'      => 'Example of textbox description',
	  'std'       => '',
	  'label_for' => 'opts_textbox',
	  'class'     => 'css_class'
	);

	add_settings_field( 'example_textbox', 'Example Textbox', 'opts_display_setting', 'opts_theme_options.php', 'opts_text_section', $field_args );
}
add_action( 'admin_init', 'opts_register_settings' );

// Function to add extra text to display on each section
function opts_display_section($section){ 

}
/**
 * Function to display the settings on the page
 * This is setup to be expandable by using a switch on the type variable.
 * In future you can add multiple types to be display from this function,
 * Such as checkboxes, select boxes, file upload boxes etc.
 */
function opts_display_setting($args)
{
	extract( $args );

	$option_name = 'opts_theme_options';

	$options = get_option( $option_name );

	switch ( $type ) {  
		case 'text':  
			$options[$id] = stripslashes($options[$id]);  
			$options[$id] = esc_attr( $options[$id]);  
			echo "<input class='regular-text$class' type='text' id='$id' name='" . $option_name . "[$id]' value='$options[$id]' />";  
			echo ($desc != '') ? "<br /><span class='description'>$desc</span>" : "";  
		 	break;  
	}
}
/**
 * Callback function to the register_settings function will pass through an input variable
 * You can then validate the values and the return variable will be the values stored in the database.
 */
function opts_validate_settings($input)
{
	foreach($input as $k => $v)
	{
		$newinput[$k] = trim($v);
	
		// Check the input is a letter or a number
		if(!preg_match('/^[A-Z0-9 _]*$/i', $v)) {
			$newinput[$k] = '';
		}
	}

	return $newinput;
}

?>