<?php get_header(); ?>

<?php 
$page_object = get_queried_object();
$post_id     = get_queried_object_id();
//echo $post_id;
if ( isset($_GET['coleccion_id']) ){
$coleccion_id = $_GET['coleccion_id'];
}else{
$coleccion_id = 0;
}

if ( is_user_logged_in() ) {
	$user_log = 'logged';
	$user_array = wp_get_current_user();
	$user_name = $user_array->display_name;
	$user_ID = $user_array->ID;
	
	$user_image_src =  get_user_meta($user_ID, "profile_picture" , true);
	
	$primer_comentario = get_user_meta($user_ID, 'primer_comentario' , true);

}else{
	$user_log = 'notlogged';
	$user_name = '';
	$user_image_src = 'http://www.gob247.org/dev/wp-content/themes/gob247/img/user-default.png';
	$primer_comentario = 'true';
}

$comments_args = array(
	'author_email' => '',
	'ID' => '',
	'karma' => '',
	'number' => '',
	'offset' => '',
	'orderby' => '',
	'order' => 'DESC',
	'parent' => '',
	'post_ID' => '',
	'post_id' => $post_id,
	'post_author' => '',
	'post_name' => '',
	'post_parent' => '',
	'post_status' => '',
	'post_type' => '',
	'status' => '',
	'type' => '',
	'user_id' => '',
	'search' => '',
	'count' => false,
	'meta_key' => '',
	'meta_value' => '',
	'meta_query' => '',
	'date_query' => null, // See WP_Date_Query
);


$comments_array_full = get_comments( $comments_args );

$notes_array = array();
$comments_array = array();

$cant_aportes = 0;
$cant_ajustes = 0;
$cant_bibliografias = 0;
$cant_ejemplos = 0;

$cant_comments = 0;

$last_comment = '';
$last_comment_date = '';
//print_d($comments_array_full);

if ( $comments_array_full ){
	foreach( $comments_array_full as $comment ){
		
		$id = $comment->comment_ID;
		$tipo = get_comment_meta( $id, 'tipo_comentario' , 'true' );
		
		if ( $tipo == 'normal' ){
			$comments_array[] = $comment;
		}else{
			$notes_array[] = $comment;
		}
		
		if ( $tipo == 'aporte' ){
			$cant_aportes++;
		}else if ( $tipo == 'ajuste' ){
			$cant_ajustes++;
		}else if ( $tipo == 'bibliografia' ){
			$cant_bibliografias++;
		}else if ( $tipo == 'ejemplo' ){
			$cant_ejemplos++;
		}
		
		if ( $cant_comments == 0 ){
			$last_comment = $comment;
		}
		
		$user = $comment->user_id;
		
		if ( get_user_meta($user, "profile_picture" , true) ){
			$image_src =  get_user_meta($user, "profile_picture" , true);
		}else{
			$image_src = 'http://www.gob247.org/dev/wp-content/themes/gob247/img/user-default.png';
		}
		
		$cant_comments++;
	}
}


update_field('cantidad_aportes', $cant_aportes , $post_id);
update_field('cantidad_ajustes', $cant_ajustes , $post_id);
update_field('cantidad_bibliografias', $cant_bibliografias , $post_id);
update_field('cantidad_ejemplos', $cant_ejemplos , $post_id);

?>

<script>

var notesArray = [];
var notesArrayChilds = [];
 
<?php
if( $notes_array ){
foreach( $notes_array as $note ){
	
	$id = $note->comment_ID;
	$parrafo_index = get_comment_meta( $id, 'parrafo_index' , 'true' );
	$tipo = get_comment_meta( $id, 'tipo_comentario' , 'true' );
	$highlight = get_comment_meta( $id , 'highlight_span_info' );
	
	$highlight_span_info = $highlight[0];
	
	//echo '//'.$highlight_span_info.'</br>';
	
	$date1 = date('Y-m-d h:i:s');
	$date2 = $note->comment_date;
	
	$diff = abs(strtotime($date2) - strtotime($date1));
	
	$years = floor($diff / (365*60*60*24));
	$months = floor(($diff - $years * 365*60*60*24) / (30*60*60*24));
	$days = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24)/ (60*60*24));
	
	//printf("%d years, %d months, %d days\n", $years, $months, $days);
	
	$note_parent = $note->comment_parent;
	
	$user = $note->user_id;
	
	$user_data = get_user_by( 'id' , $user );
	$name = $user_data->display_name;
	
	if ( get_user_meta($user, "profile_picture" , true) ){
		$image_src =  get_user_meta($user, "profile_picture" , true);
	}else{
		$image_src = 'http://www.gob247.org/dev/wp-content/themes/gob247/img/user-default.png';
	}

?>

	<?php if ( $note_parent == 0 ){ ?>
	notesArray.push({
		Parrafo :	'<?php echo $parrafo_index; ?>',
		Index :		'<?php echo $note->comment_ID; ?>',
		Parent:		'<?php echo $note_parent; ?>',
		Tipo : 		'<?php echo $tipo; ?>',
		Autor :		'<?php echo $name; ?>',
		UserImg:	'<?php echo $image_src; ?>',
		Fecha :		'<?php echo $days; ?>',
		Content :	'<?php echo comment_filters($note->comment_content); ?>',
		Highlight:	'<?php echo $highlight_span_info; ?>'
	});
	<?php }else{ ?>
	notesArrayChilds.push({
		Parrafo :	'<?php echo $parrafo_index; ?>',
		Index :		'<?php echo $note->comment_ID; ?>',
		Parent:		'<?php echo $note_parent; ?>',
		Tipo : 		'<?php echo $tipo; ?>',
		Autor :		'<?php echo $note->comment_author; ?>',
		UserImg:	'<?php echo $image_src; ?>',
		Fecha :		'<?php echo $days; ?>',
		Content :	'<?php echo comment_filters($note->comment_content); ?>',
		Highlight:	'-'
	});
	<?php } ?>


<?php
}
}
?>

</script>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<?php
	$post_id = $post->ID;
	
	$cant_aportes = get_field('cantidad_aportes' , $post_id);
	$cant_ajustes = get_field('cantidad_ajustes' , $post_id);
	$cant_bibliografias = get_field('cantidad_bibliografias' , $post_id);
	$cant_ejemplos = get_field('cantidad_ejemplos' , $post_id);
	
	$print_ult_int = '';
	if ( $last_comment ){
		$last_comment_date = $last_comment->comment_date;
		if ( $last_comment_date ){
			$print_ult_int = tiempo_ultima_interaccion( $last_comment_date );
		}
	}
	
	if ( $post->post_content ){
		$est = tiempo_estimado_lectura( $post->post_content );
	}else{
		$est = '-';
	}
	
	$notas = '';
	
	if ( $coleccion_id != 0 ){
		
		$estasLeyendo = 'Estás leyendo';
		$coleccion_title = get_the_title($coleccion_id);
		$coleccion_url = get_permalink($coleccion_id);
		$coleccion_color = get_field('color' , $coleccion_id);
		
		$notas = get_field('notas_relacionadas' , $coleccion_id );
		$cont_notas = 1;
		if( $notas ){
		foreach( $notas as $nota ){
			if ( $nota->ID == $post_id ){
				break;		
			}
			$cont_notas++;
		}
		}
		
		//print_d($notas);
		
		$cont_notas = $cont_notas.'.';
		
		$image = array();
		
		if ( get_the_post_thumbnail() ){
		
   		    $post_thumbnail_id = get_post_thumbnail_id( $post->ID );
			$image = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
		
		}else{
		
			
			// HERENCIA DESACTIVADA. 
			if ( get_the_post_thumbnail($coleccion_id ) AND false ){
				$post_thumbnail_id = get_post_thumbnail_id( $coleccion_id );
				$image = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
			}else{
				$image[0] = '';
			}
		}
	
		
	}else{
	
		
	
		$coleccion_title = 'Para Ámerica Latina y el Caribe';
		$coleccion_color = '#272433';
		$estasLeyendo = 'Manual de Gobierno Abierto';
		
		if(has_post_thumbnail()){
			$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
			$image = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
		} else {
			$image[0] = '';
		}
		
		$cont_notas = '';
		
	}
	
?>
    <div id="principal" style="background-image:url(<?php echo $image[0]; ?>);">
    	
		<!--  <div class="pliegue"></div> -->
				
		<div class="leftArrow"></div>
		<div class="rightArrow"></div>
        
		<div class="informacion">
        <a href="<?php bloginfo('url'); ?>">
			<?php if(get_field('logonegro')){ ?>
			<img src="<?php bloginfo('template_directory'); ?>/img/gob-247-negro.png" />
			<?php } else { ?>
			<img src="<?php bloginfo('template_directory'); ?>/img/gob-247.png" />
			<?php } ?>
		</a>
        
            <div class="bloque-header single-principal">
     		
            	<?php if ( $coleccion_title != '' ){ ?>          
                <p><?php echo $estasLeyendo ?></p>
                <h1><?php echo $coleccion_title; ?></h1>
                <?php } ?>
            </div>
        
        </div><!-- informacion -->
        
        <div class="titular-out">
        	<div class="bg-transparente" style="background-color:<?php echo $coleccion_color; ?>"></div>
            <div class="titular">
            	<h1><?php echo $cont_notas; ?> <?php the_title(); ?></h1>
				<p class="aportes">
                	<span class="aporte"><?php echo $cant_aportes; ?></span>
                    <span class="ajuste"><?php echo $cant_ajustes; ?></span>
                    <span class="bibliografia"><?php echo $cant_bibliografias; ?></span>
                    <span class="ejemplo"><?php echo $cant_ejemplos; ?></span>
                </p>
                <p><?php echo $print_ult_int; ?> Tiempo de lectura estimado: <?php echo $est; ?></p>
            </div><!-- titular -->
        </div><!-- titular out-->
        
        
    </div><!-- principal -->
	
	<div id="overlay-nota-desp"></div>
    
    <div id="single-out">
    <div id="single-wrapper">
    
            <div id="cursor-msg">	 
            	<div class="bg-transparente"></div>
				<?php if($GLOBALS[ 'msie_8' ] OR $GLOBALS[ 'msie_7' ]  ){ ?>    
            	<p>Su navegador no permite comentar <span>seleccionando</span> el texto.</p>
				<?php } else { ?>
				<p>Para sumar tu aporte <span>selecciona</span> el texto que deseas comentar. También puedes consultar el manual.</p>
				<?php } ?>
			</div><!-- cursor msg -->
        
        <div id="nonce" style="display:none;" data-value="<?php $nonce = wp_create_nonce( 'comment_save_nonce' ); echo $nonce; ?>"></div>
        <div id="current_post_id" style="display:none;" data-value="<?php echo $post->ID; ?>"></div>
        <div id="user_logged" style="display:none;" data-value="<?php echo $user_log; ?>" data-name="<?php echo $user_name; ?>" data-img="<?php echo $user_image_src; ?>" data-primer-comentario="<?php echo $primer_comentario; ?>"></div>
        
        <div class="col izq">
        </div><!-- col izq -->
        
        <div class="col centro">
        
            <div id="highlightMenu">
                <ul>
                    <li>Sumar un:</li>
                    <li><a class="aporte">Aporte</a></li>
                    <li>/</li>
                    <li><a class="ajuste">Ajuste</a></li>
                    <li>/</li>
                    <li><a class="ejemplo">Ejemplo</a></li>
                    <li>/</li>
                    <li><a class="bibliografia">Bibliografía</a></li>
                </ul>
            </div><!-- highlightMenu-->
            
        	<div id="single-content">
            	<?php if ( get_field('convertido') ){ $convertido = true; }else{ $convertido = false; }
				if ( $convertido ){
					$parrafos = get_field('parrafos');
					if($parrafos){
						foreach($parrafos as $parrafo){
                ?>
	                <div data-index="<?php echo $parrafo['identificador']; ?>" id="parrafo-<?php echo $parrafo['identificador']; ?>" class="parrafo-wrapper">
                    
						<?php echo $parrafo['texto']; ?>
					</div>
                <?php
						}
					}
				}else{
               		//the_content();
					echo '<div class="post-sin-content">';
					echo '<h1>Este post no tiene contenido.</h1>';
					echo '</br>';
					echo '<a class="anim" href="'.get_bloginfo('url').'">Volver a Inicio</a>';
					echo '</div>';
				}
				?>
			</div><!-- single content -->
        </div><!-- col centro -->
        
        <div class="col der">
        </div><!-- col der -->
    
    </div><!-- single-out -->  
    
    <?php if ( $convertido ){ ?>
	<div id="comments-out">
    	<div id="comments-wrapper">
        
        	<?php
				$titulo_notas_pie = '';
				$cant_notas_pie = sizeof($comments_array);

				if ( $cant_notas_pie == 0 ){
					$titulo_notas_pie = 'Iniciar notas al pie en este artículo.';
				}else if ( $cant_notas_pie == 1 ){
					$titulo_notas_pie = '1 nota al pie en este artículo.';
				}else if ( $cant_notas_pie > 1 ){
					$titulo_notas_pie = $cant_notas_pie.' notas al pie en este artículo.';
				}
			?>
        	
            <div class="comment-header">
            	<h1><?php echo $titulo_notas_pie; ?></h1>
                <div id="comentar-btn" class="anim">
                <a class="anim">Agregar nota al pie</a>
                </div>
            </div>
          
          <div id="comments">
              
              <div class="comment new der">
              
                    <div class="user">
                        
                        <a href=""><img src="<?php echo $user_image_src; ?>"/></a>
                        
                        <p><?php echo $user_name; ?></p>
                    </div>
                    
                    <div class="comment-texto">
                    	<div class="close-comment"><i class="fa fa-times anim"></i></i></div>
                    	<form action="" method="get">
	                        <textarea name="" cols="" rows=""></textarea>
                            
                            <input class="submit anim" type="button" value="Agregar Comentario" />
                        </form>
                    </div>
              
              </div>
              
			<?php
			$cont_comments = 0;
            foreach( $comments_array as $comment ){
				
                $id = $comment->comment_ID;
                $parrafo_index = get_comment_meta( $id, 'parrafo_index' , 'true' );
                $tipo = get_comment_meta( $id, 'tipo_comentario' , 'true' );
                
                $date1 = date('Y-m-d h:i:s');
                $date2 = $comment->comment_date;
                
                $diff = abs(strtotime($date2) - strtotime($date1));
                
                $years = floor($diff / (365*60*60*24));
                $months = floor(($diff - $years * 365*60*60*24) / (30*60*60*24));
                $days = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24)/ (60*60*24));
				
				$user = $comment->user_id;
				
				$user_data = get_user_by( 'id' , $user );
				$name = $user_data->display_name;

				if ( get_user_meta($user, "profile_picture" , true) ){
					$image_src =  get_user_meta($user, "profile_picture" , true);
				}else{
					$image_src = 'http://www.gob247.org/dev/wp-content/themes/gob247/img/user-default.png';
				}
				
				//echo $cont_comments;
				if ( $cont_comments % 2 == 0 ){
					$pos = 'izq';
				}else{
					$pos = 'der';
				}
				
				
                
            ?>
            
              <div class="comment <?php echo $pos; ?>">
                    
                    <div class="user">
                        
                        <a href=""><img src="<?php echo $image_src; ?>"/></a>
                        
                        <p><?php echo $name; ?>
                        hace <?php echo $days; ?> días</p>
                    </div>
                    
                    <div class="comment-texto">
                            <p><?php echo comment_filters($comment->comment_content); ?></p>
                    </div>
                    
                </div><!-- comment -->
			<?php 
				$cont_comments++;
			}
			?>
            
        </div><!-- comments -->
        </div><!-- comments wrapper -->
    </div><!-- comments out -->
    <?php } ?>
		
        
        <div id="preloader"></div><!-- preloader -->
        
        

<?php 

		if ( $notas ){

			////$post_thumbnail_id = get_post_thumbnail_id( $coleccion_id );
			//$image = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
			
			// Fotos en las colecciones desactivado.
			
			$image = false;
			
			$color = get_field('color' , $coleccion_id);
			
			$date = get_the_date( 'd/n/Y' );
			
			//$coleccion_id = $post->ID;
?>
            <div class="bloque infinite-item">
                
                <div class="pliegue"></div>
                <?php if ( $image ){ ?>
                <div class="img-fondo" style="background-image:url(<?php echo $image[0]; ?>);"></div>
                <?php } ?>
                <div class="color-fondo" style="background-color:<?php echo $color; ?>"></div>
                
                <div class="bloque-header">
                    <p>Colección</p>
                    <h1><a href="<?php echo $coleccion_url; ?>"><?php echo $coleccion_title; ?></a></h1>
                    <p class="publicado">Publicado el <?php echo $date; ?></p>
                </div><!-- bloque header -->
                
				<?php if( $GLOBALS[ 'iPad' ] OR $GLOBALS[ 'AndroidTablet' ]){ ?>
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
                            <h1><?php echo $cont_posts; ?>.&nbsp;<?php the_title(); ?></h1>
                            
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
		}
?>
        
	</div><!-- single out -->
<?php
endwhile;
endif;
?>



<?php get_footer(); ?>
