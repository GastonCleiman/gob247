<?php get_header(); ?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<?php
	$post_id = $post->ID;

		
		$image = array();
		
		if ( get_the_post_thumbnail() ){
			$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
			$image = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
		}else{
			$image[0] = '';
		}

		$content = get_post_field( 'post_content' , $post_id);
		$content = strip_tags($content);
?>

    <div id="principal">
    	
        <?php
        	if ( $image ){
				echo '<div style="background-image:url('.$image[0].');" class="img-fondo"></div>';
			}
		?>
        
        <div class="informacion">
        <a href="<?php bloginfo('url'); ?>">
			<?php if(get_field('logonegro')){ ?>
			<img src="<?php bloginfo('template_directory'); ?>/img/gob-247-negro.png" />
			<?php } else { ?>
			<img src="<?php bloginfo('template_directory'); ?>/img/gob-247.png" />
			<?php } ?>
			</a>
            <div class="bloque-header single-principal">
				<p>Sobre está colección</p>
				<h1><?php the_title(); ?></h1>
            </div>
            
            <p class="desc-coleccion"><?php echo limit_words($content, 50); ?></p>
        
        <a href="http://www.iadb.org/es/banco-interamericano-de-desarrollo,2837.html" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/img/bid.png" /></a>
        </div>

    </div><!-- principal -->
    
<?php
endwhile;
endif;
?>

<?php
		$notas = get_field('notas_relacionadas');
		
		$cont_colecciones = 1;
		
		if ( $notas ){

			$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
			$image = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
			
			$image = false;
			
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
                    <h1><?php the_title(); ?></h1>
                    <p class="publicado">Publicado el <?php echo $date; ?></p>
                </div><!-- bloque header -->
                
                <div class="bloque-list-wrapper" id="lista-<?php echo $cont_colecciones; ?>">        
                <div class="bloque-list">
                
 				<?php
					$cont_posts = 1;
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
						
				?>
                    
                        <a href="<?php the_permalink(); ?>&coleccion_id=<?php echo $coleccion_id; ?>" class="nota-box">
                            <h1><?php echo $cont_posts; ?>.&nbsp;<?php the_title(); ?></h1>
                            
                            <p><?php echo $print_ult_int; ?></p>
                            <p>Tiempo de lectura estimado: <?php echo $est; ?></p>
                            
                            <div class="index">
                                <div class="index-top">
                                    <h1><?php echo $cont_posts;?>.</h1>
                                    <p><?php echo $cant_aportes.'&nbsp;&nbsp;'.$cant_ajustes.'&nbsp;&nbsp;'.$cant_bibliografias.'&nbsp;&nbsp;'.$cant_ejemplos; ?></p>
                                </div>
                                <div class="linea"></div>
                                <p>Iniciar »</p>
                            </div>
                        </a><!-- nota box -->
                    
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
		}
?>


<?php get_footer(); ?>
