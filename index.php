<?php get_header(); ?>

<?php

if(  !isset($_SESSION['vistaPop'])  ){
		$_SESSION['vistaPop'] = 'false';
}else{
		
	if ( $_SESSION['vistaPop'] == 'false' ){
		$_SESSION['vistaPop'] = 'true';
	}
}

if ( $_SESSION['vistaPop'] == 'true' ){
			$display_video = false;
} else {
	$display_video = true;
}


?>

	
		<div id="lighboxVideo" <?php echo ($display_video == false) ? "style='display:none'" : ""; ?>>
		
				<div class="innerLightbox">
				<?php if($display_video == true){ ?>
				<iframe width="560" height="315" src="//www.youtube.com/embed/u_4npsZDOIM?autoplay=1" frameborder="0" allowfullscreen></iframe>
				<?php } ?>
				<a class="cancel-video video-btn"><i class="fa fa-times"></i><p>Cerrar video y continuar con GOB247.</p></a>
				</div>
				<div class="bglightbox"></div>
		</div>
	
	


    <div id="principal">

		<?php  if(  $GLOBALS[ 'iPad' ] OR $GLOBALS[ 'AndroidTablet' ]){ ?>
	        <div class="informacion" style="display:none; height:auto;">
        <?php  }else{ ?>
            <div class="informacion" style="height:auto;">
        <?php  } ?>    
            <a href="<?php bloginfo('url'); ?>"><img src="<?php bloginfo('template_directory'); ?>/img/gob-247.png" /></a>
            
            <p><?php the_field('texto_propuesta' , 'options'); ?></p>
            
            <a href="http://www.iadb.org/es/banco-interamericano-de-desarrollo,2837.html" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/img/bid.png" /></a>
        	
			<a id="video-again" class="video-btn"><img src="<?php bloginfo('template_directory'); ?>/img/play-small.png"/><p>Volver a reproducir introducción.</p></a>
			
		</div><!-- informacion -->


        
        <div class="triangulos"></div>
    </div><!-- principal -->

    <div id="colecciones-out" class="infinite-wrapper">
<?php

$cont_colecciones = 1;
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
$the_query = new WP_Query( array( 'paged' => $paged , 'post_type' => 'coleccion' , 'order' => 'ASC'  ) );
if ( $the_query->have_posts() ) {
	while ( $the_query->have_posts() ) {
		$the_query->the_post();
		
		$notas = get_field('notas_relacionadas');
		
		
		if ( $notas ){

			$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
			$image = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
			
			$color = get_field('color');
			
			$date = get_the_date( 'd/n/Y' );
			
			$coleccion_id = $post->ID;
?>
            <div class="bloque infinite-item" data-id="lista-<?php echo $cont_colecciones; ?>">
                
                <!--  <div class="pliegue"></div> -->
				
				<div class="leftArrow"></div>
				<div class="rightArrow"></div>
				
				
				
                <?php if ( $image ){ ?>
                <div class="img-fondo" style="background-image:url(<?php echo $image[0]; ?>);"></div>
                <?php } ?>
                <div class="color-fondo" style="background-color:<?php echo $color; ?>"></div>
                
                <div class="bloque-header">
                    <p>Colección</p>
                    <h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
                    <p class="publicado">Publicado el <?php echo $date; ?></p>
                </div><!-- bloque header -->
                
                
				<?php if(  $GLOBALS[ 'iPad' ] OR $GLOBALS[ 'AndroidTablet' ]){ ?>
                    <div class="bloque-list-wrapper" id="lista-<?php echo $cont_colecciones; ?>" style="margin:62px auto 0; width:92%;">
                    <ul class="bxslider">
                <?php }else{ ?>
                    <div class="bloque-list-wrapper" id="lista-<?php echo $cont_colecciones; ?>">        
                    <div class="bloque-list">
                <?php } ?>
                
 				<?php
					$cont_posts = 1;
					$label = false;
					if( $notas ):
						foreach( $notas as $post):
						setup_postdata($post);
						
						$post_id = $post->ID;
						
						$cant_aportes = get_field('cantidad_aportes' , $post_id);
						$cant_ajustes = get_field('cantidad_ajustes' , $post_id);
						$cant_bibliografias = get_field('cantidad_bibliografias' , $post_id);
						$cant_ejemplos = get_field('cantidad_ejemplos' , $post_id);
						
						$print_ult_int = '';
						$last_comment = get_comments( array('number' => 1 , 'post_id' => $post_id) );
						if ( $last_comment ){
							$last_comment_date = $last_comment[0]->comment_date;
							if ( $last_comment_date ){
								$print_ult_int = tiempo_ultima_interaccion( $last_comment_date );
							}
						}
						
						if ( $post->post_content ){
							$est = tiempo_estimado_lectura( $post->post_content );
						}else{
							$est = '-';
						}
						
						$visto = is_seen_post( $post_id );

				?>
                    
				<?php if(  $GLOBALS[ 'iPad' ] OR $GLOBALS[ 'AndroidTablet' ]){ ?>
                    <li>
                <?php } ?>
                
                        <a href="<?php the_permalink(); ?>&coleccion_id=<?php echo $coleccion_id; ?>" class="nota-box">
                            <h1><?php echo $cont_colecciones.'.'.$cont_posts; ?>.&nbsp;<?php the_title(); ?></h1>
                            
                            <p><?php echo $print_ult_int; ?></p>
                            <p>Tiempo de lectura estimado: <?php echo $est; ?></p>
                            
                            <div class="visto">
                            	<?php
									if ( $visto ){
										echo '<p>visto</p>';
									}
								?>
                            </div>
                            
                            <div class="index">
                                <div class="index-top">
                                    <h1><?php echo $cont_posts;?>.</h1>
                                    <p><?php echo $cant_aportes.'&nbsp;&nbsp;'.$cant_ajustes.'&nbsp;&nbsp;'.$cant_bibliografias.'&nbsp;&nbsp;'.$cant_ejemplos; ?></p>
                                </div>
                                <div class="linea"></div>
                            	<?php
									if ( !$visto && $cont_posts == 1 && !$label ){
										echo '<p>Iniciar »</p>';
										$label = true;
									}else if ( !$visto && $cont_posts > 1 && !$label ){
										echo '<p>Continuar »</p>';
										$label = true;
									}
								?>
                            </div>
                        </a><!-- nota box -->
                        
				<?php if(  $GLOBALS[ 'iPad' ] OR $GLOBALS[ 'AndroidTablet' ]){ ?>
                    </li>
                <?php } ?>
                    
				<?php
						$cont_posts++;
						endforeach;
						wp_reset_postdata();
					endif; 
				?>
                                
                </div><!-- bloque list -->
                </div><!-- bloque list wrapper-->
                
            </div><!-- bloque -->

<?php
	$cont_colecciones++;
		}
	}
}
wp_reset_postdata();
?> 
    
	<div id="infinite-nav" style="display:none;">
    	<?php next_posts_link('<span>Más</span>', $the_query->max_num_pages); ?>
    </div>
    
    <div id="preloader"></div><!-- preloader -->
    
    </div> <!-- colecciones-out -->
    
<script>
$(document).ready(function(e) {
	
	if ( window.location.hash ){
    	var hash = window.location.hash;
		//console.log(hash);
		if ( hash == '#goColecciones'){
			var offset = $("#colecciones-out").offset();
			$('html , body').animate({ scrollTop: offset.top } , 800 , 'easeInOutQuint' );
		}
	}
	
	$("#topbar a.boton").click(function(e){
		e.preventDefault();
		var offset = $("#colecciones-out").offset();
		$('html , body').animate({ scrollTop: offset.top } , 500 , 'easeInOutQuint' );
	});
	
	
	$("#principal .video-out").click( function(){
		$(this).addClass('paused');
		playPause();
	});
	
	$("a#video-again").click(function(){
		
		var markupDetail = '<iframe width="560" height="315" src="//www.youtube.com/embed/u_4npsZDOIM?autoplay=1" frameborder="0" allowfullscreen></iframe>';
		$(".innerLightbox").prepend( markupDetail );

		$("#lighboxVideo").fadeIn(300 , function(){
			
		});
		
	});
	
	$(".cancel-video").on( "click", function(){
		
		$("#lighboxVideo").fadeOut(300 , function(){
			$(".innerLightbox iframe").remove();
		});
	});

	
	
	
});


</script>

    
<?php get_footer(); ?>
