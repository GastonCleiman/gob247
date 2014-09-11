<?php get_header(); ?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

    <div id="principal" class="principal-page">
    	<div class="pliegue"></div>
        <div class="informacion">
        	<a href="<?php bloginfo('url'); ?>"><img src="<?php bloginfo('template_directory'); ?>/img/gob-247.png" /></a>
			<p><?php the_field('copete'); ?></p>
        </div><!-- informacion -->
        
       
    </div><!-- principal -->

    
    <div id="single-out">
    
    <div id="single-wrapper" class="page-wrapper">
        
        <div class="col">
        	<div id="single-content">
            	<h1><?php the_title(); ?></h1>
				<?php the_content(); ?>
			</div><!-- single content -->
        </div><!-- col centro -->
    
    </div><!-- single-wrapper -->  
   		
        
   <div id="preloader"></div><!-- preloader -->
	</div><!-- single out -->
<?php
endwhile;
endif;
?>


<?php get_footer(); ?>
