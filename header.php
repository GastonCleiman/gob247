<?php session_start(); ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="initial-scale=0.8, maximum-scale=0.8, width=device-width">
<title>

<?php 

if (function_exists('is_tag') && is_tag()) { 

	//echo 'Tag Archive for &quot;'.$tag.'&quot; - '; 
	echo $tag.'&quot; - '; 

} elseif (is_archive()) { 

	wp_title('');
	echo ' - ';
	//echo ' Archive - '; 

} elseif (is_search()) { 

	echo 'Búsqueda para &quot;'.esc_html($s).'&quot; - '; 

} elseif (!(is_404()) && (is_single()) || (is_page())) { 

	wp_title(''); echo ' - '; 

} elseif (is_404()) {

	echo 'No fue encontrado - '; 

}
bloginfo('name'); 
echo " | ";
if (is_home() OR is_front_page() ) {

	echo " " . bloginfo('description'); 

}

?>
</title>

<?php 

$GLOBALS[ 'ua' ] = $_SERVER["HTTP_USER_AGENT"];

$GLOBALS[ 'browser' ] = '';

if (strlen(strstr($GLOBALS[ 'ua' ], 'Firefox')) > 0) {
   $GLOBALS[ '$browser' ] = 'firefox';
}
if (strlen(strstr($GLOBALS[ 'ua' ], 'Chrome')) > 0) {
    $GLOBALS[ 'browser' ] = 'chrome';
}

// Linux
$GLOBALS[ 'linux' ] = strpos($GLOBALS[ 'ua' ], 'Linux') ? true : false;
// Macintosh
$GLOBALS[ 'mac' ] = strpos($GLOBALS[ 'ua' ], 'Macintosh') ? true : false;
// Windows
$GLOBALS[ 'win' ] = strpos($GLOBALS[ 'ua' ], 'Windows') ? true : false;

/* ============================ */

$GLOBALS[ 'msie_7' ] = strpos($GLOBALS[ 'ua' ], 'MSIE 7.0') ? true : false; // Internet Explorer 7
$GLOBALS[ 'msie_8' ] = strpos($GLOBALS[ 'ua' ], 'MSIE 8.0') ? true : false; // Internet Explorer 8

// Android
$GLOBALS[ 'android' ] = strpos($GLOBALS[ 'ua' ], 'Android') ? true : false;
// BlackBerry
$GLOBALS[ 'blackberry' ] = strpos($GLOBALS[ 'ua' ], 'BlackBerry') ? true : false;
// iPhone
$GLOBALS[ 'iphone' ] = strpos($GLOBALS[ 'ua' ], 'iPhone') ? true : false;
// Palm
$GLOBALS[ '$palm' ] = strpos($GLOBALS[ 'ua' ], 'Palm') ? true : false;

$GLOBALS[ 'iPad' ] = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
if(stripos($_SERVER['HTTP_USER_AGENT'],"Android") && stripos($_SERVER['HTTP_USER_AGENT'],"mobile")){
	$GLOBALS[ 'Android' ] = true;
}else if(stripos($_SERVER['HTTP_USER_AGENT'],"Android")){
	$GLOBALS[ 'Android' ] = false;
	$GLOBALS[ 'AndroidTablet' ] = true;
}else{
	$GLOBALS[ 'Android' ] = false;
	$GLOBALS[ 'AndroidTablet' ] = false;
}

$mensajeDeCompatibilidad = false;

if($GLOBALS[ 'iphone' ] OR $GLOBALS[ 'android' ] OR $GLOBALS[ '$palm' ] OR $GLOBALS[ 'iPad' ]  ){
	$mensajeDeCompatibilidad = "GOB247 aún no está optimizado para dispositivos móviles";
}

if($GLOBALS[ 'msie_8' ] OR $GLOBALS[ 'msie_7' ]  ){
	$mensajeDeCompatibilidad = "Su explorador está desactualizado, debe actualizarlo o utilizar un <a href='http://www.whatbrowser.org/es/' target='_blank'>navegador moderno</a> para utilizar GOB247";
}

?>

<link href="<?php bloginfo('template_directory'); ?>/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />

<script src="<?php bloginfo('template_directory'); ?>/js/jquery-1.11.1.min.js"></script>

<script src="<?php bloginfo('template_directory'); ?>/js/ui/jquery-ui.min.js"></script>
<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/js/ui/jquery-ui.min.css">

<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?><?php echo "?rand=" . time();?>">

<!--[if lte IE 8]>
	<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/style-ie8.css">
<![endif]-->

<!-- SCROLL -->
<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/js/scroll/jquery.mCustomScrollbar.css">
<script src="<?php bloginfo('template_directory'); ?>/js/scroll/jquery.mCustomScrollbar.js"></script>

<script src="<?php bloginfo('template_directory'); ?>/js/jquery.hoverIntent.minified.js"></script>

<link href="<?php bloginfo('template_directory'); ?>/js/messi/messi.css" rel="stylesheet" type="text/css" />
<script src="<?php bloginfo('template_directory'); ?>/js/messi/messi.js"></script>


<?php if ( is_home() || is_single() ){ ?>
<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/js/bxslider/jquery.bxslider.css">
<script src="<?php bloginfo('template_directory'); ?>/js/bxslider/jquery.bxslider.min.js"></script>
<?php } ?>


<?php if ( is_home() ){ ?>

<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/js/video-js/video-js.css">
<script src="<?php bloginfo('template_directory'); ?>/js/video-js/video.js"></script>

<?php } ?>

<?php if ( is_single() ){ ?>
<script src="<?php bloginfo('template_directory'); ?>/js/jquery.textHighlighter.js"></script>
<script src="<?php bloginfo('template_directory'); ?>/js/jquery.autosize.js"></script>
<?php } ?>

<?php if ( is_search() || is_category() ){ ?>
<script src="<?php bloginfo('template_directory'); ?>/js/isotope.pkgd.min.js"></script>
<?php } ?>

<?php wp_head(); ?>

<script src="<?php bloginfo('template_directory'); ?>/js/jquery.easing.1.3.js"></script>
<script src="<?php bloginfo('template_directory'); ?>/js/jquery.livequery.min.js"></script>
<script src="<?php bloginfo('template_directory'); ?>/js/jquery.ba-outside-events.min.js"></script>

<?php if ( is_page(296) ){ // CONTACTO?>
<script src="<?php bloginfo('template_directory'); ?>/js/validation/jquery.validate.js"></script>
<script src="<?php bloginfo('template_directory'); ?>/js/validation/src/localization/messages_es.js"></script>
<?php } ?>


<script src="<?php bloginfo('template_directory'); ?>/js/functions.js"></script>

<!-- Include the twitter JS library -->
<script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>
<script src="https://apis.google.com/js/client.js"></script>

<script>

var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";

window.fbAsyncInit = function() {

	FB.init({
		appId      : '1482168622023607',
		cookie     : true,  // enable cookies to allow the server to access the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.0' // use version 2.0
	});
	
};

(function(d) {
	var js, id = 'facebook-jssdk';
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	d.getElementsByTagName('head')[0].appendChild(js);
}(document));
  
function statusChangeCallback(response) {
  
  myLog("statusChangeCallback()");

  token = response.authResponse.accessToken;
  myLog("TOKEN: " + token);
  
  myLog(response);
  
  if (response.status === 'connected') {
	  
	<?php // if (!is_user_logged_in()){ ?>
	
	FB.api('/me', function(responseDATA) {
	 // $("#forceLoginSocial").text("Facebook");
	  
	  /* myLog("TOKEN: " . response.authResponse.accessToken ); */
	  myLog("DATA OBJETO:");
	  myLog( responseDATA );
	  
	  if(responseDATA.location){
		  country = responseDATA.location;
	  } else {
		  country = false;
	  }
	  
	  forceLogin(responseDATA.email,responseDATA.id,responseDATA.first_name,responseDATA.last_name,country,"facebook",false);
	  
	});
	
	<?php //} ?>

  } else if (response.status === 'not_authorized') {
   
  } else {
	
  }
}

function checkLoginState() {
  myLog("checkLoginState");
  FB.getLoginStatus(function(response) {
	statusChangeCallback(response);
  });
}


function loginFB() {
	FB.login(function(response) {
     if (response.authResponse) {
     	FB.api('/me', function(response) {
       		myLog("Se conecto");
       		checkLoginState();
     	});
	 	} else {
		 
	     new Messi('No se pudo conectar por Facebook', {title: 'Error Conexión Facebook', modal: true, titleClass: 'anim error'});
	     
		}
 	}, {scope: 'email,public_profile'});
}


// GOOGLE
  (function() {
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  })();

  function render() {
    gapi.signin.render('google-log-btn', {
      'callback': 'signinCallback',
      'clientid': '749487373221-9eevh72ja6j1bpot16bpj8es8r7t233d.apps.googleusercontent.com',
      'cookiepolicy': 'single_host_origin',
      'requestvisibleactions': 'http://schemas.google.com/AddActivity',
      'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/urlshortener'
    });
  }
   
// GOOGLE 
function signinCallback(authResult) {
	<?php if ( !is_user_logged_in() ) { ?>	
	//console.log(authResult);
	
	if (authResult['access_token']) {
		// Autorizado correctamente
		// Oculta el botón de inicio de sesión ahora que el usuario está autorizado, por ejemplo:
		//document.getElementById('signinButton').setAttribute('style', 'display: none');
		
		gapi.client.load('plus','v1', function(){ 
		// once we get this call back, gapi.client.plus.* will exist
		var request = gapi.client.plus.people.get( {'userId' : 'me'} );
		request.execute(loadProfileCallback);
		});	
		
	} else if (authResult['error']) {
		// Se ha producido un error.
		// Posibles códigos de error:
		//   "access_denied": el usuario ha denegado el acceso a la aplicación.
		//   "immediate_failed": no se ha podido dar acceso al usuario de forma automática.
		//console.log('There was an error: ' + authResult['error']);
	}
	
	<?php } ?>
}

  //Callback for the asynchronous request to the people.get method. The profile
  //and email are set to global variables. Triggers the user's basic profile
  //to display when called.
  function loadProfileCallback(obj) {
    profile = obj;
	//console.log(profile)
	
	var google_user_id = profile['id'];

    // Filter the emails object to find the user's primary account, which might
    // not always be the first in the array. The filter() method supports IE9+.
    var google_user_email = profile['emails'].filter(function(v) {
        return v.type === 'account'; // Filter out the primary email
    })[0].value; // get the email from the filtered results, should always be defined.
	
	//console.log(google_user_email);
	
	var google_user_name = profile['name']; 

	var google_user_img = profile['image'];

	country = false;
	
	forceLogin(google_user_email , google_user_id , google_user_name['givenName'] , google_user_name['familyName'] , country , "google" , google_user_img['url']);
  }

window.onbeforeunload = function(e){
  gapi.auth.signOut();
};

// TWITTER


twttr.ready(function (twttr) {
    // bind to the tweet event
    twttr.events.bind('tweet', function( event ) {
        // add ajax call here to store the tweet details
        // i.e. increment a counter in your database
        myLog( event );
		like_ajax( $('#security').val() , $('#apoyoid').val() , 'twitter');
    });
});



function openTWLogin(){
	h = 160;
	w = 370;
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	
	var shareURL = '<?php bloginfo("url"); ?>/dev/twitterLogin/';
	
	window.open(shareURL, 'facebook_share', 'height='+h+', width='+w+',top='+top+',left='+left+', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
}


function loginTW(nombre,apellido,email,uid,country,avatar) {
	myLog(nombre + "," + apellido + "," + email + "," + uid + "," + location + "," + avatar);
	forceLogin(email,uid,nombre,apellido,country,"twitter",avatar);
}


$(document).ready(function(e) {

	<?php if($GLOBALS[ 'iphone' ] OR $GLOBALS[ 'android' ] OR $GLOBALS[ 'blackberry' ]) { ?>
	new Messi('La navegación y funcionalidades de GOB247 aún no están optimizadas para dispositivos móviles.', {title: 'Navegación no optimizada', modal: true, titleClass: 'anim error'});
	<?php } ?>     
	
	$("#topbar .sesion a#fb-log-btn").click(function(){
		loginFB();
	});
	
	$("#topbar .sesion a#tw-log-btn").click(function(){
		openTWLogin();
	});
	
	$(document).on('click' , 'ul.messi-login li i.fa-facebook-square' , function(){
		$(".messi-titlebox span.messi-closebtn").trigger('click');
		$("#topbar .sesion a#fb-log-btn").trigger('click');
	});
	$(document).on('click' , 'ul.messi-login li i.fa-twitter-square' , function(){
		$(".messi-titlebox span.messi-closebtn").trigger('click');
		$("#topbar .sesion a#tw-log-btn").trigger('click');
	});
	$(document).on('click' , 'ul.messi-login li i.fa-google-plus-square' , function(){
		$(".messi-titlebox span.messi-closebtn").trigger('click');
		$("#topbar .sesion #google-log-btn").trigger('click');
	});
	
	$("#topbar .sesion a#cerrar-sesion").click( function(e){
		e.preventDefault();
		
		var url = $(this).attr("data-url");
		var source = $("input#social-source").val();
		var token = false;
		if ( source == 'google' ){
			gapi.auth.authorize({
				client_id: '749487373221-9eevh72ja6j1bpot16bpj8es8r7t233d.apps.googleusercontent.com',
				scope: 'https://www.googleapis.com/auth/urlshortener',
				immediate: true },  function() {
				//console.log(gapi.auth.getToken());
				var token = gapi.auth.getToken();
				
				//alert(token['access_token']); 
				disconnect_social( source , url ,token['access_token'] );
			});
		}else{
			disconnect_social( source , url ,token );
		}

	});
	 
	 // https://developers.google.com/+/web/signin/
});

</script>


<?php


if ( is_user_logged_in() ) {
	
	$user_array = wp_get_current_user();
	$user_ID = $user_array->ID;
	$seen_posts_temp = get_user_meta($user_ID, 'posts_vistos' , true);

	//echo '</br></br></br></br></br></br>';
	//echo $seen_posts_temp ;
	
	$seen_posts_array = explode(",", $seen_posts_temp );
	if ( $seen_posts_array[0] == '' ){
		$seen_posts_array = array();
	}
	
	//print_d($seen_posts_array);
	
	if ( isset( $_SESSION['seen_posts']) ){
		
		$merge_array = array_merge( $_SESSION['seen_posts'] , $seen_posts_array  );
		
		//echo 'merge_array </br>';
		//print_d($merge_array);
		//echo '/merge_array </br>';
		
		foreach( $merge_array as $postID ){
			update_seen_posts( $user_ID  , $postID );
		}

	}else{
		$_SESSION['seen_posts'] = $seen_posts_array;
	}
	
	$user_log = 'logged';
	$user_array = wp_get_current_user();
	$user_name = $user_array->display_name;
	$user_ID = $user_array->ID;
}else{
	
	if ( !isset( $_SESSION['seen_posts']) ){
		$_SESSION['seen_posts'] = array();
	}
	
}


if ( is_single() ){
	
	if ( is_user_logged_in() ) {
		update_seen_posts( $user_ID  , $post->ID );
	}
	
	if ( !in_array ( $post->ID , $_SESSION['seen_posts'] ) ){
		$_SESSION['seen_posts'][] = $post->ID;
	}
	
}

/*echo 'SESSION </br>';
print_d($_SESSION['seen_posts']);
echo '/SESSION </br>';*/

?>

</head>
<body>

<div id="fb-root"></div>

<div id="topbar">
	<div class="sesion">
    <?php if ( !is_user_logged_in() ) { ?>	
		<div>
		<?php if($mensajeDeCompatibilidad) { ?>
			<span class="noCompatibilidad"><?php echo $mensajeDeCompatibilidad ?></span> 
		<?php } ?>
		
		<?php if(!$GLOBALS[ 'msie_8' ] AND !$GLOBALS[ 'msie_7' ]  ){ ?>
		
		Iniciar Sesión con</div>
        <a id="fb-log-btn">Facebook</a>
        <div>/</div>
        <a id="tw-log-btn">Twitter</a>
        <div>/</div>
        <div id="google-log-btn" class="customGPlusSignIn">
            <span class="icon"></span>
            <span class="buttonText">Google +</span>
        
		
		<?php } ?>
		
		</div>
		
	<?php }else{ ?>
        <?php
		$user_array = wp_get_current_user();
		$user_ID = $user_array->ID;
		$user_social_source =  get_user_meta($user_ID, "source" , true);
		?>
    	<div><?php if($mensajeDeCompatibilidad) { ?><span class="noCompatibilidad"><?php echo $mensajeDeCompatibilidad ?></span> <?php } ?>Bienvenido <span><?php echo $user_array->user_firstname; ?></span> -</div>
    	<a id="cerrar-sesion" data-url="<?php echo wp_logout_url( get_bloginfo('url') ); ?>">Cerrar Sesión</a>
        <input name="social-source" type="hidden" id="social-source" value="<?php echo $user_social_source; ?>">
	<?php } ?>	
    </div><!-- sesion -->

    <?php wp_nonce_field( 'ajax-login-nonce', 'security' ); ?>
    <input name="redirect" type="hidden" id="redirect" value="http://gob247.org/">
    
    <a href="<?php echo get_permalink(244); ?>" class="boton" >
    Manual de Usuario
    </a>
    
</div><!-- topbar -->

<a id="menu-btn"><i class="fa fa-bars"></i></a>

<div id="menu-wrapper" class="off">
    <div class="bg-transparente"></div>
    <div class="menu">
        <ul>
            <li><a href="<?php bloginfo('url'); ?>">Inicio</a></li>
            
            <li>
            	<a class="desplegable">Colecciones</a>
				<?php
				$colecciones = get_posts( array( 'post_type' => 'coleccion' ) );
				echo '<ul class="segundo-nivel">';
				foreach( $colecciones as $coleccion ){
					echo '<li><a href="'.$coleccion->guid.'">'.$coleccion->post_title.'</a></li>';
                }
				echo '</ul>';
				?>
            </li>
            
            <li>
            	<a class="desplegable">Categorías</a>
				<?php
				$categories = get_categories();
				echo '<ul class="segundo-nivel">';
				foreach( $categories as $cat ){
					echo '<li><a href="'.get_category_link( $cat->term_id ) .'">'.$cat->name.'</a></li>';
                }
				echo '</ul>';
				?>
            </li>
            
            <?php
            	$pages = get_pages();
				foreach( $pages as $page ){
			?>
            	<li><a href="<?php echo get_page_link($page->ID); ?>"><?php echo $page->post_title; ?></a></li>
            <?php } ?>
            
         </ul>

		<?php     
        $the_query = new WP_Query( array(
           'numberposts' => -1,
           'post_type' => 'post'
        ));
		//print_d($posts);
		$cont_posts = 1;
		$cant_posts = sizeof($the_query->posts);
        ?>
         
		  <script>
			$(document).ready(function(e) {
                
				var availableTags = [
				<?php
				foreach( $the_query->posts as $post){
					if ( $cont_posts != $cant_posts ){
						echo '"'.$post->post_title.'",';
					}else{
						echo '"'.$post->post_title.'"';
					}
					$cont_posts++;
				}
				?>
				];
				$( ".menu form#searchform input#s" ).autocomplete({
					source: availableTags,
					appendTo: "#search-preview",
					position: { my: "left top", at: "left top", of: "#search-preview" },
					open: function () {
						$('ul.ui-autocomplete').addClass('opened');
						var autocomplete_elem = $("#menu-wrapper .menu #search-preview ul.ui-autocomplete.ui-widget-content");
						$("#search-preview").height(autocomplete_elem.height());
						
					},
					close: function () { 
						$('ul.ui-autocomplete').removeClass('opened').css('display','block'); 
						$("#search-preview").height(1);
					},
				});
            });
          </script>
         
         
        <form role="search" method="get" id="searchform" action="<?php echo home_url( '/' ); ?>">
            <input type="text" value="" name="s" id="s" placeholder="Buscador" />
            <input type="submit" id="searchsubmit" value="" />
        </form>
        
        <div id="search-preview">    
        </div><!-- search preview -->
        
    </div>
</div><!-- menu wrapper -->

<?php if ( is_single() ){ ?>
<div id="page-wrapper" class="single">
<?php }else{ ?>
<div id="page-wrapper">
<?php } ?>
