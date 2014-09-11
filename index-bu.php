<?php get_header(); ?>

<script>
$(document).ready(function(e) {
	
	if ( window.location.hash ){
    	var hash = window.location.hash;
		//console.log(hash);
		if ( hash == '#goColecciones'){
			var offset = $("#colecciones-out").offset();
			$('html , body').animate({ scrollTop: offset.top } , 800 );
		}
	}
	
});
</script>

    <div id="principal">
        <div class="informacion">
        <a href="<?php bloginfo('url'); ?>"><img src="<?php bloginfo('template_directory'); ?>/img/gob-247.png" /></a>
        
        <p>El gobierno abierto es la doctrina política que sostiene que los temas de gobierno y administración pública deben ser abiertos a todos los niveles posibles en cuanto a transparencia, esto debe ir unido a la creación de espacios permanentes de participación ciudadana y colaboración ciudadana. </p>
        
        <a href="http://www.iadb.org/es/banco-interamericano-de-desarrollo,2837.html" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/img/bid.png" /></a>
        </div>
        
        <div class="triangulos"></div>
    </div><!-- principal -->
	
    
    <div id="colecciones-out">
<?php
	$cont_cats = 1;
	$categories = get_categories(array('exclude' => 1));	
	foreach ( $categories as $cat ){
		
		$cat_id = $cat->term_id;
		
		if ( get_field('imagen' , 'category_'.$cat_id) ){
			$image = wp_get_attachment_image( get_field('imagen' , 'category_'.$cat_id) , 'full' );
		}else{
			$image = '';
		}
		
		$cat_color = get_field('color' , 'category_'.$cat_id);
?>
    <div class="bloque" data-id="lista-<?php echo $cont_cats; ?>">
    	
        <div class="pliegue"></div>
        <?php if ( $image ){ ?>
        <div class="img-fondo" style="background-image:url(<?php echo $image[0]; ?>);"></div>
        <?php } ?>
        <div class="color-fondo" style="background-color:<?php echo $cat_color; ?>"></div>
        
        <div class="bloque-header">
        	<p>Estas Leyendo</p>
            <h1><?php echo $cat->name; ?></h1>
            <p class="publicado">Publicado el 12/4/2014</p>
        </div><!-- bloque header -->
        
        <div class="bloque-list-wrapper" id="lista-<?php echo $cont_cats; ?>">        
        <div class="bloque-list">
        
			<?php
			
			$cont_posts = 1;
            $the_query = new WP_Query( array( 'post_type' => 'post' , 'posts_per_page' => -1 , 'order' => 'ASC', 'cat' => $cat_id ) );
           
            if ( $the_query->have_posts() ) {
                while ( $the_query->have_posts() ) {
                    $the_query->the_post();
			?>
            
                <a href="<?php the_permalink(); ?>" class="nota-box">
                    <h1><?php the_title(); ?></h1>
                    
                    <p>Último interacción, hace <span>12 horas</span>.</p>
                    <p>Tiempo de lectura estimado: <span>3</span> minutos</p>
                    
                    <div class="index">
                        <div class="index-top">
                            <h1><?php echo $cont_posts;?>.</h1>
                            <p>1 3 5 0</p>
                        </div>
                        <div class="linea"></div>
                        <p>Iniciar »</p>
                    </div>
                </a><!-- nota box -->
            
            <?php
			$cont_posts++;
                }
            }
            wp_reset_postdata();
            ?>
                        
        </div><!-- bloque list -->
        </div><!-- bloque list wrapper-->
        
    </div><!-- bloque -->

<?php
	$cont_cats++;
	}// END FOR EACH CATS
?> 
    </div> 
    
<?php get_footer(); ?>
