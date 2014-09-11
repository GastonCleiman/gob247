<?php


// COMMENT META BOXES 

function adding_custom_meta_boxes( $post ) {
    add_meta_box( 
        'comment-meta-box',
        __( 'Informacion Extra' ),
        'render_comment_meta_box',
        'comment',
        'normal'
    );
}
add_action( 'add_meta_boxes_comment', 'adding_custom_meta_boxes' );

// Output the Metabox
function render_comment_meta_box( $post ) {
    
	// create a nonce field
    wp_nonce_field( 'my_comment_meta_box_nonce', 'comment_meta_box_nonce' );
	
	$comment_id = get_comment_ID();
		
?>
    
	<style>

	#namediv h3 label {
		vertical-align: baseline;
	}
	#comments-meta table {
		width: 100%;
	}
	#comments-meta td.first {
		white-space: nowrap;
		width: 10px;
	}
	#comments-meta input {
		width: 98%;
	}
	#comments-meta p {
		margin: 10px 0;
	}
    </style>    
    <div class="inside">
    <table class="form-table editcomment" id="comments-meta">
        <tbody>
        <tr>
            <td class="first">Párrafo Index:</td>
            <td><input type="text" id="parrafo_index" value="<?php echo comment_get_custom_field( 'parrafo_index' , $comment_id ); ?>" size="30" name="parrafo_index"></td>
        </tr>
        <tr>
            <td class="first">
            Tipo de Comentario:</td>
            <td><input type="text" id="tipo_comentario" value="<?php echo comment_get_custom_field( 'tipo_comentario' ,$comment_id ); ?>" size="30" name="tipo_comentario"></td>
        </tr>
        
        <tr>
            <td class="first">
            Texto Seleccionado:</td>
            <td><input type="text" id="tipo_comentario" value='<?php echo comment_get_custom_field( 'highlight_span_info' ,$comment_id ); ?>' size="30" name="tipo_comentario"></td>
        </tr>
        </tbody>
    </table>
    </div>

<?php
}


// Little function to return a custom field value
function comment_get_custom_field( $value , $id ) {
	
	$comment_meta = get_comment_meta( $id, $value, 'true' );
	return $comment_meta;
}



// FUNCION AJAX PARA COMENTARIOS ( NOTAS )

add_action("wp_ajax_comment_save_action", "comment_save_function");
//add_action("wp_ajax_nopriv_comment_save_action", "comment_save_function");


function comment_save_function() {
	
	if ( !wp_verify_nonce( $_REQUEST['nonce'] , "comment_save_nonce")) {
	  exit("No naughty business please");
	}
	
	foreach(array_keys($_POST) as $key){
		$clean[$key] = mysql_real_escape_string($_REQUEST[$key]);
	}
	
	//echo $clean['id'];
	
	global $current_user;
    get_currentuserinfo();

	$time = current_time('mysql');

	$data_comment = array(
		'comment_post_ID' => $clean['id'],
		'comment_author' => $current_user->user_login,
		'comment_author_email' => $current_user->user_email,
		'comment_author_url' => 'http://',
		'comment_content' => $clean['text'],
		'comment_type' => '',
		'comment_parent' => $clean['parent_id'],
		'user_id' => $current_user->ID,
		'comment_author_IP' => '127.0.0.1',
		'comment_agent' => 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.10) Gecko/2009042316 Firefox/3.0.10 (.NET CLR 3.5.30729)',
		'comment_date' => $time,
		'comment_approved' => 1,
	);
	
	$comment_id = wp_insert_comment($data_comment);
	
	add_comment_meta( $comment_id, 'parrafo_index' , $clean['parrafo_index'] , true );
	add_comment_meta( $comment_id, 'tipo_comentario' , $clean['type'] , true );
	add_comment_meta( $comment_id, 'highlight_span_info' , $clean['highlight_span_info'] , true );
	update_user_meta( $current_user->ID,  "primer_comentario", 'false' );
	
	echo $comment_id;
	
	die();
  
}

?>