<?php /* Template Name: Contacto */ ?>
<?php get_header(); ?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

    <div id="principal" class="principal-page">
    	<div class="pliegue"></div>
        <div class="informacion">
        	<a href="<?php bloginfo('url'); ?>"><img src="<?php bloginfo('template_directory'); ?>/img/gob-247.png" /></a>
			<p><?php the_field('texto_propuesta' , 'options'); ?></p>
        </div><!-- informacion -->
        
        
    </div><!-- principal -->

    
    <div id="single-out">
    
    <div id="single-wrapper" class="page-wrapper">
        
        <div class="col">

        	<div id="single-content">
				<h1><?php the_title(); ?></h1>
            	<?php the_content(); ?>
			</div><!-- single content -->
                    	
            <form action="" method="post" id="contacto"  data-url="<?php bloginfo('wpurl'); ?>">
            
            	<div class="form-col">
                    <div class="form-box">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" required="required">
                    </div><!-- / form box -->
                    
                    <div class="form-box">
                        <label for="apellido">Apellido</label>
                        <input type="text" id="apellido" name="apellido" required="required">
                    </div><!-- / form box -->
                </div><!-- form col -->
                
                <div class="form-col">
                    <div class="form-box">
                        <label for="mail">E-mail</label>
                        <input type="email" id="mail" name="mail" required="required">
                    </div><!-- / form box -->
                    
                    <div class="form-box">
                        <label for="pais">País</label>
                        <input type="text" id="pais" name="pais" required="required">
                    </div><!-- / form box -->
                </div><!-- form col -->
                
                <div class="form-box">
                    <label for="consulta">Consulta</label>
                    <textarea rows="" cols="" id="consulta" name="consulta" required="required"></textarea>
                </div><!-- / form box -->
                
				<div class="anim submit-btn">
                	<input class="anim submit" type="submit" name="submit" value="Enviar">
                    <input type="hidden" id="action-hidden" name="action" value="form_send_action" />
                    <input type="hidden" id="nonce-hidden" name="nonce" value="<?php $nonce = wp_create_nonce( 'form_send_nonce' ); echo $nonce; ?>" />
                </div>
                
            </form>

        </div><!-- col centro -->
    
    </div><!-- single-wrapper -->  
   		
        
   <div id="preloader"></div><!-- preloader -->
	</div><!-- single out -->

<?php
endwhile;
endif; ?>

<?php get_footer(); ?>
