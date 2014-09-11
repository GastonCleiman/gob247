<?php

date_default_timezone_set('America/Argentina/Buenos_Aires');

/////////////////// Eliminar la versión de WordPress del header y del feed
add_filter('the_generator','killVersion');
function killVersion() { return ''; }
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'start_post_rel_link', 10, 0);
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);


// Blockeo de usuarios

add_action( 'admin_init', 'custom_wpadmin_blockusers_init' );
function custom_wpadmin_blockusers_init() {
if (!current_user_can('administrator')) {
  	$file = basename($_SERVER['PHP_SELF']);
    if ($file == 'wp-login.php' || is_admin() && !current_user_can('administrator') && $file != 'admin-ajax.php'){
        wp_redirect( home_url() );
        exit();
    }

  }
}

/////////////////// Elimina notificación de actualización para no administradores
global $user_login;
get_currentuserinfo();
if ($user_login !== "admin") {
	add_action( 'init', create_function( '$a', "remove_action( 'init', 'wp_version_check' );" ), 2 );
	add_filter( 'pre_option_update_core', create_function( '$a', "return null;" ) );
}

add_action('after_setup_theme', 'remove_admin_bar');

function remove_admin_bar() {
if (!current_user_can('administrator') && !is_admin()) {
  show_admin_bar(false);
}
}

/////// This theme uses Featured Images (also known as post thumbnails) for per-post/per-page Custom Header images
	add_theme_support( 'post-thumbnails', array( 'post' ,'coleccion' ) );
	//add_image_size( 'list-item-hover' , 512 , 200 , true );

	
/// BR MANUALES
	
function breakall(){
   return '<br clear="all" />';
}
add_shortcode('br', 'breakall');


add_filter( 'wp_mail_from', 'my_mail_from' );
function my_mail_from( $email ){
    return 'noreply@gob247.org';
}

add_filter( 'wp_mail_from_name', 'my_mail_from_name' );
function my_mail_from_name( $name )
{
    return 'gob247.org';
}

add_filter('excerpt_length', 'my_excerpt_length');
function my_excerpt_length($length) {
return 25; // Or whatever you want the length to be.
}

function limit_words($string, $word_limit){
    $words = explode(" ",$string);
    return implode(" ",array_splice($words,0,$word_limit));
}

function print_d($miarray, $die=0) {
	// Muestro el esquema del array
	echo "<pre> ";
	print_r($miarray);
	echo "</pre> ";
	// Detengo la ejecución
	if($die) die();
}

function tiempo_estimado_lectura( $content ){
	$word = str_word_count(strip_tags($content));
	$m = floor($word / 200);
	$s = floor($word % 200 / (200 / 60));
	/*if ( $m > 0 ){
		$est = $m . ' minuto' . ($m == 1 ? '' : 's') . ', ' . $s . ' segundo' . ($s == 1 ? '' : 's');
	}else{
		$est = $s . ' segundo' . ($s == 1 ? '' : 's');
	}*/
	if ( $m > 0 ){
		$est = ( $m + 1 ) . ' minuto' . ( ($m + 1 ) == 1 ? '' : 's');
	}else{
		$est = '1 minuto';
	}
	
	return $est;
}

function tiempo_ultima_interaccion( $last_comment_date ){

	if ( $last_comment_date != '' ){
		$date1 = date('Y-m-d H:i:s');
		$date2 = $last_comment_date;
		//echo 'date1   '.$date1.'</br>';
		//echo 'date2   '.$date2.'</br>';
		
		$date1 = strtotime($date1);
		$date2 = strtotime($date2);
		//echo 'date1   '.$date1.'</br>';
		//echo 'date2   '.$date2.'</br>';
		
		$dt1 = new DateTime('@'.$date1);
		$dt2 = new DateTime('@'.$date2);
		$diff = $dt1->diff($dt2);
		//echo $diff->format('%h hours, %i minutes, %s seconds');
		$horas = $diff->format('%h');
		$dias = $diff->format('%d');
		
		
		
		$print_ult_int = 'Última interacción, hace ';
		
		if (  $dias >= 1 ){
			$print_ult_int .= $diff->format('%d dia(s)');
		}else if (  $horas == 0 ){	
			$print_ult_int .= $diff->format('%i minutos');
		}else {
			$print_ult_int .= $diff->format('%h horas, %i minutos');
		}
		
		/*if( is_single() ){
			$print_ult_int .='. /';
		}else{
			$print_ult_int .='.';
		}*/
		
		$print_ult_int .='.';
		
	}else{
		$print_ult_int = '';
	}
		
	return $print_ult_int;
	
}


function traduccion_dia( $dia ){
	if ($dia=="Monday") $dia="Lunes";
	if ($dia=="Tuesday") $dia="Martes";
	if ($dia=="Wednesday") $dia="Miércoles";
	if ($dia=="Thursday") $dia="Jueves";
	if ($dia=="Friday") $dia="Viernes";
	if ($dia=="Saturday") $dia="Sabado";
	if ($dia=="Sunday") $dia="Domingo";
	
	return $dia;
}

function traduccion_mes( $mes ){
	if ($mes=="January") $mes="Enero";
	if ($mes=="February") $mes="Febrero";
	if ($mes=="March") $mes="Marzo";
	if ($mes=="April") $mes="Abril";
	if ($mes=="May") $mes="Mayo";
	if ($mes=="June") $mes="Junio";
	if ($mes=="July") $mes="Julio";
	if ($mes=="August") $mes="Agosto";
	if ($mes=="September") $mes="Setiembre";
	if ($mes=="October") $mes="Octubre";
	if ($mes=="November") $mes="Noviembre";
	if ($mes=="December") $mes="Diciembre";	
	
	return $mes;
}


include_once "functions-dos.php";

/* CONTENIDO POST *//* 
_______________________________________________________________________________________ */




function my_acf_save_post( $post_id )
{
	$post = get_post( $post_id );
	//print_d($post);
	if ( $post ){
			
		$post_type = $post->post_type;
		$post_status = $post->post_status;
		
		
		$convertido = get_field('convertido', $post_id);
		
		if($post_type == 'post' AND !$convertido ) {
		
			$content = $post->post_content;
			/*echo  $content;
			echo "</br>----------------------------------------------------------------------------</br>";
			echo addcslashes( $content , "\0..\37!@\177..\377");
			echo "</br>----------------------------------------------------------------------------</br>";*/
			
			/* 
			// BORRO EL CONTENIDO
			$update_post = array(
				'ID'           => $post_id,
				'post_content' => ''
			);
			
			// Update the post into the database
			wp_update_post( $update_post );
			*/
			
			$content_array = array();
			$content_array = preg_split ("/\r\n\r\n/", $content);
			
			//print_d($content_array);
			
			$field_key = "field_53cfcf3074bf4";
			$repeater_post = array();
			
			foreach( $content_array as $parrafo ){
			
	
				//$parrafo = nl2br($parrafo, false);
				//$parrafo = '<p>' . preg_replace('#(<br>[\r\n]+){2}#', '</p><p>', $parrafo) . '</p>';
				
				$parrafo = trim($parrafo);		
				//$parrafo = htmlentities($parrafo);
				
				//echo '</br>'.$parrafo.'</br>';
				
				if ( $parrafo == '&amp;nbsp;'){
					//echo "VACIO";
				}else{
					$repeater_post[] = array("texto" => $parrafo , "identificador" => uniqid() );
				}
			
			}
			
			//print_d($repeater_post);
	
			update_field( $field_key, $repeater_post , $post_id );
			update_field( 'field_53cfd168b7ccd', 1, $post_id );
			//die();
		
		}
	}
	
	
}

 
// run after ACF saves the $_POST['fields'] data
add_action('acf/save_post', 'my_acf_save_post', 20);


/////// Agrega el POST Type - Colecciones

add_action('init', 'add_Coleccion');

function add_Coleccion() {

  $labels = array(

    'name' => _x('Coleccion', 'post type general name'),
    'singular_name' => _x('Coleccion', 'post type singular name'),
    'add_new' => _x('Nueva Coleccion', 'producto'),
    'add_new_item' => __('Nueva Coleccion'),
    'edit_item' => __('Editar Coleccion'),
    'new_item' => __('Nueva Coleccion'),
    'view_item' => __('Ver Coleccion'),
    'search_items' => __('Buscar Coleccion'),
    'not_found' =>  __('No se encuentra.'),
    'not_found_in_trash' => __('No se encuentra en Trash.'), 
    'parent_item_colon' => '',
    'menu_name' => 'Colecciones'
  );
  $args = array(
    'labels' => $labels,
    'public' => true,
    'publicly_queryable' => true,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
    'capability_type' => 'page',
    'has_archive' => true, 
    'hierarchical' => false,
	//'taxonomies' => array('category'),
    'menu_position' => 7,
	'supports' => array( 'title', 'editor' ,'thumbnail' )
  ); 
  register_post_type('coleccion',$args);
}
add_filter('post_updated_messages', 'add_Coleccion_messages');
function add_Coleccion_messages( $messages ) {
  global $post, $post_ID;
  $messages['Coleccion'] = array(
    0 => '', // Unused. Messages start at index 1.
    1 => sprintf( __('Se registro el Coleccion. <a href="%s">Ver Coleccion</a>'), esc_url( get_permalink($post_ID) ) ),
    2 => __('Actualizado.'),
    3 => __('Borrado.'),
    4 => __('Coleccion Actualizado.'),
    /* translators: %s: date and time of the revision */
    5 => isset($_GET['revision']) ? sprintf( __('Coleccion Revisión %s'), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
    6 => sprintf( __('Coleccion Publicado. <a href="%s">Ver Coleccion</a>'), esc_url( get_permalink($post_ID) ) ),
    7 => __('Coleccion Salvado.'),
    8 => sprintf( __('Coleccion Enviado. <a target="_blank" href="%s">Previsualizar Coleccion</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
    9 => sprintf( __('Coleccion Programado: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Previsualizar Coleccion</a>'),
      // translators: Publish box date format, see http://php.net/date
      date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) ), esc_url( get_permalink($post_ID) ) ),
    10 => sprintf( __('Boceto de Coleccion Actualizado. <a target="_blank" href="%s">Previsualizar Coleccion</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
  );
  return $messages;
}

// HOOK DELETE USER AND MESSAGE

function my_delete_user( $user_id ) {

	$comments_args = array(
		'user_id' => $user_id,
	);

	$comments = get_comments( $comments_args );
	
	foreach( $comments as $comment ){
		wp_delete_comment( $comment->comment_ID );
	}

}
add_action( 'delete_user', 'my_delete_user' );


// POSTS VISTOS

function update_seen_posts( $userID , $postID ){
	
	$seen_posts = '';
	$seen_posts_temp = get_user_meta($userID, 'posts_vistos', true );
	$seen_posts_array = explode(",", $seen_posts_temp );
	
	if ( !in_array ( $postID , $seen_posts_array ) ){
		if ( $seen_posts_array[0] == ''  ){
			$seen_posts .= $postID;
		}else{
			$seen_posts .= $seen_posts_temp.','.$postID;
		}
		update_user_meta( $userID,  "posts_vistos" , $seen_posts );
	}
	
}


function is_seen_post( $postID ){
	
	if ( is_user_logged_in() ) {
		
		$user_array = wp_get_current_user();
		$user_ID = $user_array->ID;
		$seen_posts_temp = get_user_meta($user_ID, 'posts_vistos', true );
		$seen_posts_array = explode(",", $seen_posts_temp );
		
		if ( in_array ( $postID , $seen_posts_array ) ){
			return true;
		}else{
			return false;
		}
	}else{
		if ( in_array ( $postID , $_SESSION['seen_posts'] ) ){
			return true;
		}else{
			return false;
		}
	}
}

// LOGUIN REDES SOCIALES

// LOGUEARSE RRSS //


// Registrar la funcion Ajax de Login
function rrss_init(){
    // Enable the user with no privileges to run ajax_login() in AJAX
    add_action( 'wp_ajax_nopriv_ajax_rrss', 'ajax_rrss' );
}

// Execute the action only if the user isn't logged in
if (!is_user_logged_in()) {
    add_action('init', 'rrss_init');  
}

function ajax_rrss(){
	// First check the nonce, if it fails the function will break
	
    check_ajax_referer( 'ajax-login-nonce', 'security' );
	
	foreach(array_keys($_REQUEST) as $key){
	  $clean[$key] = mysql_real_escape_string($_REQUEST[$key]);
	}
	
	$autoGeneratePass = encrypt_decrypt("encrypt",$clean['uid']);
	
	$info['user_login'] = $clean['username'];
    $info['password'] = $autoGeneratePass;
    $info['uid'] = $clean['uid'];
    $info['nombre'] = $clean['nombre'];
    $info['apellido'] = $clean['apellido'];
    $info['source'] = $clean['source'];
    $info['redirect'] = $clean['redirect'];
    
	//print_d($info);

    if($clean['source'] != "facebook") {
    	$info['avatar'] = $clean['avatar'];
    }

	if( $info["user_login"] != "" AND $info["uid"] != "" AND $info["nombre"] != "" ){

		$creating = createUser( $info );
		//print_r($creating);
		
		if ( $creating["bool"] ){
		
			echo json_encode(array('loggedin'=>true, 'message'=>$clean['redirect'] , 'userID' =>$creating["userID"] ));
		
		}else{
			
			if($creating["status"] == "El e-mail ya esta en uso."){
				
				$trylogin = loginUser($clean['username'],$autoGeneratePass);
				
				if ( is_wp_error($trylogin) ){
					 echo json_encode(array('loggedin'=>2, 'message'=>__('El mail asociado a este usuario ya esta registrado en gob247 con otra red social. Por favor vuelva a intentarlo eligiendo otra de las opciones de login.')));
				}else{
					echo json_encode(array('loggedin'=>1, 'message'=>$clean['redirect'] , 'userID' =>$creating["userID"] ));
				}
	
			}else{
				
				echo json_encode(array('loggedin'=>0, 'message'=>"No se pudo crear usuario. Intente nuevamente." ));   
			
			}   
		}
		
	}else{
		echo json_encode(array('loggedin'=>0, 'message'=>"No se pudo crear usuario. Probablemente usted no permite compartir información necesaria para crear una cuenta en GOB247." ));   
	}
    die();
}// END AJAX RRSS


function createUser($registerInfo) {

	$user_name = $user_email = $registerInfo["user_login"];

	if($registerInfo["user_login"] != "" AND $registerInfo["user_login"] != false AND isset($registerInfo["user_login"]) ) {

		$id_social_unico = $registerInfo["source"].'_'.$registerInfo["uid"];
		
		$user_id = user_social_id_exists( $id_social_unico );
		
		//$user_id = username_exists( $user_name );
		
		if ( !$user_id and email_exists($user_email) == false ) {
		
			$password = $registerInfo["password"];

			$user_id_new = wp_create_user( $user_name, $registerInfo["password"] , $user_email );
			
			wp_update_user(
				array(
				'ID'       => $user_id_new,
				'first_name' => $registerInfo["nombre"] ,
				'last_name' => $registerInfo["apellido"],
				'display_name' => $registerInfo["nombre"] . " " . $registerInfo["apellido"],
				'role' => 'subscriber'
				)
			);
			
			update_user_meta( $user_id_new,  "primer_comentario", 'true' );
			update_user_meta( $user_id_new,  "source", $registerInfo["source"] );
			update_user_meta( $user_id_new,  "idsocialunico", $id_social_unico );
			
			if($registerInfo["source"] == "facebook") {
			
				update_user_meta( $user_id_new,  "profile_picture", "https://graph.facebook.com/" . $registerInfo["uid"] . "/picture?width=100&height=100" );
				update_user_meta( $user_id_new,  "idredsocial", $registerInfo["uid"] );
			
			}else{
			
				update_user_meta( $user_id_new,  "profile_picture", $registerInfo["avatar"] );
				update_user_meta( $user_id_new,  "idredsocial", $registerInfo["uid"] );

			}
			
			if($registerInfo["source"] == "facebook" OR $registerInfo["source"] == "twitter" OR $registerInfo["source"] == "google"    ){
			
				$verificationCode = true;
			
			} else {
			
				$verificationCode = uniqid("userVerfication",true);
			
			}
			
			
				
			if(update_user_meta( $user_id_new, "confirmed", $verificationCode )){
				
				$return["status"] = "El usuario fue exitosamente creado.";
				
				// Nonce is checked, get the POST data and sign user on
				$info = array();
				$info['user_login'] = $registerInfo["user_login"];
				$info['user_password'] = $password;
				$info['remember'] = true;
				$info['redirect'] = $registerInfo['redirect'];
			
				$user_signon = wp_signon( $info, false );
				
				 $user_signon = wp_signon( $info, false );
				 if ( is_wp_error($user_signon) ){
					$return["status"] = "El usuario fue exitosamente creado y se esta logueando.";
				 } else {
					$return["status"] = "El usuario fue exitosamente creado y se esta logueando.";
				 }
				
				$return["bool"] = true;
				/* wp_mail(); */
				
				$return["userID"] = $user_id_new;

			}

		} else {
			
			if($registerInfo["source"] == "facebook") {
				
				update_user_meta( $user_id,  "profile_picture", "https://graph.facebook.com/" . $registerInfo["uid"]."/picture?width=100&height=100" );
			}else{
				update_user_meta( $user_id,  "profile_picture", $registerInfo["avatar"] );
			}
			
			$return["status"] = "El e-mail ya esta en uso."; 
			$return["bool"] = false;
			$return["userID"] = $user_id;
		}
		
	} else {
		
			$return["status"] = "Hay un error. No se esta proporcionando la información necesaria para iniciar sección."; 
			$return["bool"] = false;

	}
	
	return $return;

}


function check_user_social_id_init(){
    // Enable the user with no privileges to run ajax_login() in AJAX
    add_action( 'wp_ajax_nopriv_check_user_social_id', 'check_user_social_id' );
}

// Execute the action only if the user isn't logged in
if (!is_user_logged_in()) {
    add_action('init', 'check_user_social_id_init');  
}

function check_user_social_id(){
		
	foreach(array_keys($_REQUEST) as $key){
	  $clean[$key] = mysql_real_escape_string($_REQUEST[$key]);
	}

	$id = $clean['id'];
	
	$args = array(
		'meta_key'     => 'idsocialunico',
		'meta_value'   => $id,
	);
	
	$user = get_users( $args );
	//print_d($user);
	
	if ( $user ){
		$user_id = $user[0]->ID;
		$user_email = $user[0]->user_email;
	}else{
		$user_id = false;
		$user_email = false;
	}

	echo json_encode(array( 'userID' =>$user_id , 'userEmail' => $user_email ));
	die();
}

function user_social_id_exists( $id ){
	
	$args = array(
		'meta_key'     => 'idsocialunico',
		'meta_value'   => $id,
	);
	
	$user = get_users( $args );
	
	if ( $user ){
		return $user[0]->ID;
	}else{
		return false;
	}
}

function loginUser($username,$password) {
	$info = array();
    $info['user_login'] = $username;
    $info['user_password'] = $password;
    $info['remember'] = true;
	
    $user_signon = wp_signon( $info, false );
    
    return $user_signon;
}

function encrypt_decrypt($action, $string) {
    
    $output = false;
    
    $secret_key = '19358940345';
    
    $safe_hash = hash("sha512",$string.$secret_key);
    
    if( $action == 'encrypt' ) {
        $output = hash("sha512",$string.$secret_key);
    }
    else if( $action == 'decrypt' ){
        $output = false;
    }

	//DEBUG bd5beaf9ef77887d6307d989c1ae8cc617ee91a7a72d0f485f9fd966c7c55da116933efeb0fd1f2a422fa62642738bc444a21f4f6cb61e24bb26cc3a210dd784

    return $output;
}

// FORMS

add_action("wp_ajax_form_send_action", "form_send_function");
add_action("wp_ajax_nopriv_form_send_action", "form_send_function");

function form_send_function() {
	
	if ( !wp_verify_nonce( $_REQUEST['nonce'] , "form_send_nonce")) {
	  exit("No naughty business please");
	}
	
	$body = "";
	foreach(array_keys($_POST) as $key){
		$clean[$key] = mysql_real_escape_string($_REQUEST[$key]);
	}

	foreach ($clean as $key => $value) {
		if ( $key != 'action' && $key != 'nonce' ){
			$body .= "<strong>" . $key . ":</strong> " . $value . "<br>";
		}
	}
	
	//echo $body;
	
	add_filter('wp_mail_content_type',create_function('', 'return "text/html"; '));
	if( wp_mail( get_field('mail' , 'options') , "Contacto GOB | 247" , $body )){
		$okgreen = true;
	}
	
	echo '1';
	
	die();
  
}

function comment_filters($comment){

	$content_array = explode(" ", $comment);
	$output = '';

	foreach($content_array as $content)
	{
	//starts with http://
	if(substr($content, 0, 7) == "http://")
	$content = '<a target="_blank" href="' . $content . '">' . $content . '</a>';

	//starts with www.
	if(substr($content, 0, 4) == "www.")
	$content = '<a target="_blank" href="http://' . $content . '">' . $content . '</a>';

	$output .= " " . $content;
	}

	$output = trim($output);
	
	return $output; 

}

add_action('get_header', 'my_filter_head');

function my_filter_head() {
	remove_action('wp_head', '_admin_bar_bump_cb');
}


?>