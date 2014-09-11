<?php get_header(); ?>
    
    
    <div id="principal">
        <div class="informacion">
        <a href="<?php bloginfo('url'); ?>"><img src="<?php bloginfo('template_directory'); ?>/img/gob-247.png" /></a>
        
        <p>Resultados de busqueda para:</p>
        
        
        <form role="search" method="get" action="<?php echo home_url( '/' ); ?>">
            <input type="text" value="" name="s" placeholder="Buscador" />
            <input class="submit" type="submit" value="" />
        </form>
        
        
        <a href="http://www.iadb.org/es/banco-interamericano-de-desarrollo,2837.html" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/img/bid.png" /></a>
        </div>
        
        <div class="triangulos"></div>
    </div><!-- principal -->

	<div id="search-wrapper" class="infinite-wrapper">
    
	<?php
		global $wp_query;
		$args = array_merge( $wp_query->query_vars, array( 'post_type' => 'post' ) );
		query_posts( $args );
    	if ( have_posts() ) : while ( have_posts() ) : the_post();
		
		$post_id = $post->ID;
		
		$postcats = get_the_category( $post_id );
		$cont_cats = 0;
		$cats_div = '';
		
		if ($postcats) {
			$cats_div = '<div class="mostrar';
			foreach( $postcats as $cat) {
				
				if ( $cat->term_id != 1 ){
					
					if( $cont_cats == 0){
						$color = get_field('color' , 'category_'.$cat->term_id );
						
						if ( $color == '' ){ $color = '#272433'; }
					}
					
					$cats_div .= ' '.$cat->slug;
				}
			}
			$cats_div .= '">';
		}else{
			$cats_div = '<div class="mostrar">';
		}
		
		
		
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
    	
        <a href="<?php the_permalink(); ?>" class="search-item infinite-item">
        <?php echo $cats_div; ?>
            <div class="search-content">
            <div class="search-item-header">
	            <h1><?php the_title(); ?></h1>
                <p><?php echo $print_ult_int; ?></p>
                <p>Tiempo de lectura estimado: <?php echo $est; ?></p>
                
                <p class="aportes">
                	<span class="aporte"><?php echo $cant_aportes; ?></span>
                    <span class="ajuste"><?php echo $cant_ajustes; ?></span>
                    <span class="bibliografia"><?php echo $cant_bibliografias; ?></span>
                    <span class="ejemplo"><?php echo $cant_ejemplos; ?></span>
                </p>
            </div>
            </div><!-- search content -->
            <div class="linea" style="background-color:<?php echo $color;?>;"></div>
        </div><!-- mostrar -->  
        </a><!-- search item -->
        
	<?php endwhile; ?>
    <?php endif; ?> 

	<div id="infinite-nav" style="display:none;">
    	<?php next_posts_link('<span>Más</span>'); ?>
    </div>
	
    <div id="preloader"></div><!-- preloader -->
    
    </div><!-- search wrapper -->    

<?php get_footer(); ?>
