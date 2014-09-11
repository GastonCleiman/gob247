var rate_glob = 0;
var dir_glob = '';
var scroller = null;

var highlighter;

var disable_note_hover = false;

var isotope_object;

$(document).ready(function(){
	
	// MENU
	$("a#menu-btn").click(function(){
		var este = $(this);
		var menu = $("#menu-wrapper");
		
		if ( menu.hasClass('off') ){
			menu.removeClass('off');
			//console.log('off click');
			menu.show();
			$(".bg-transparente" , menu ).fadeIn(300, function(){});
			$(".menu" , menu ).animate({ left: 0 }, 300, 'easeInOutQuint', function () {
				menu.addClass('on');
			})
		}else if ( menu.hasClass('on') ){
			menu.removeClass('on');
			//console.log('on click');
			$(".bg-transparente" , menu ).fadeOut(300, function () {
				menu.addClass('off');
				menu.hide();
			});
			$(".menu" , menu ).animate({ left: '-100%' }, 300, 'easeInOutQuint')
		}
	});
	
	$("#menu-wrapper .menu").mCustomScrollbar();
	
	$("#menu-wrapper .menu ul li a.desplegable").click(function(){
		var este = $(this);
		var esteLi = este.parent();
		
		var segundoNivelUL = $("ul.segundo-nivel" , esteLi);
		
		if ( esteLi.hasClass('on') ){
			esteLi.removeClass('on');
			segundoNivelUL.slideUp(400 , function(){
				esteLi.css('height' , '48px');
			});
		}else{
			
			if ( segundoNivelUL.length > 0 ){
				if ( $("#menu-wrapper .menu ul li.on").length > 0 ){
					$("#menu-wrapper .menu ul li.on ul.segundo-nivel").slideUp(400 , function(){
						$("#menu-wrapper .menu ul li.on").css('height' , '48px');
						$("#menu-wrapper .menu ul li.on").removeClass('on');
						esteLi.addClass('on');
						esteLi.css('height' , 'auto');
						segundoNivelUL.slideDown(400);
					});
					
				}else{
					esteLi.css('height' , 'auto');
					segundoNivelUL.slideDown(400);
					esteLi.addClass('on');
				}
			}
		}

	});
	
	// HOME
	
	var doc_ancho = $(document).width();
	if ( $(".bloque-list").length > 0 ){ 
		listas_notas(); 
		
		
		$(document).mousemove(function(e){
			var result = mouse_X( $(this) , e );
			rate_glob = result.rate;
			dir_glob = result.direction;
		});
		
		var bloque_interval = null;
		
		$(document).on( 'mouseenter' , '.bloque-list-wrapper' , function(){ 

				var este = $(this);
				var bloque_list = $('.bloque-list' , este);
				var bloque_list_left = bloque_list.css('left');
				bloque_list_left = parseInt(bloque_list_left.replace('px' , ''));
				var bloque_list_ancho = bloque_list.width();
				var bloque_ancho = este.parent().width();
				
				if ( bloque_list_ancho + 101 > bloque_ancho){
					este.addClass('hover-now');
					setMyInterval(true, rate_glob , dir_glob);
				}else if ( bloque_list_left < 0  ){
					este.addClass('hover-now');
					setMyInterval(true, rate_glob , dir_glob);
				}

		});
		$(document).on( 'mouseleave' , '.bloque-list-wrapper' , function(){
				var este = $(this);				
				este.removeClass('hover-now');
				setMyInterval(false);
		});

		
	}
	
	// HOME TABLET
	
	
	if ( $("ul.bxslider").length > 0 ){
		$('.bxslider').bxSlider({
		  minSlides: 3,
		  maxSlides: 5,
		  slideWidth: 265,
		  slideMargin: 0,
		  pager: false,
		  controls: false,
		  infiniteLoop: false
		});
	}
	
	// SEARCH
	
	if ( $("#search-wrapper").length > 0 ){
		  
		  var search_timer = '';
		  $(document).on( 'mouseenter' , "#search-wrapper a.search-item" , function(){
			  var este = $(this);
			  search_timer = setInterval( function() {
				  search_item_hover( este );
			  } , 300 );
			  
		  });
		  $(document).on( 'mouseleave' , "#search-wrapper a.search-item" , function(){
			  search_item_out();
			  clearInterval( search_timer );
		  });
			
		  var $container = $("#search-wrapper"),
			  $body = $('body'),
			  colW = 302,
			  columns = null;
		  
		  $container.isotope({
			// disable window resizing
			resizable: false,
			masonry: {
			  columnWidth: colW
			},
			itemSelector: '.search-item'
		  });
		  
		  $(window).resize(function(){
			// check if columns has changed
			var currentColumns = Math.floor( ( $body.width() -10 ) / colW );
			if ( currentColumns !== columns ) {
			  // set new column count
			  columns = currentColumns;
			  // apply width to container manually, then trigger relayout
			  $container.width( columns * colW ).isotope('layout');
			}
			
		  }).resize(); // trigger resize to set container width
	
	}
	
	// CONTACTO
	
	if ( $("form#contacto").length > 0 ){
		
		$("form#contacto").validate({
			lang: 'es'
		});
		
		$("form#contacto").on("submit", function(e){
			var este = $(this);
			
			var isValid = $("form#contacto").valid();		
			
			if ( isValid ){
				
				var url = este.attr( "data-url" );
				//alert(url);
				var serialize = este.serialize();
				$.ajax({
					type: 'POST',
					url:  url + '/wp-admin/admin-ajax.php',
					data: serialize,
					success: function(data){
						
						$('.submit').val('Enviando...');
						
						if( data ){ 
						$('#nombre').val('');
						$('#apellido').val('');
						$('#mail').val('');
						$('#pais').val('');
						$('#consulta').val('');
						new Messi('Su mensaje ha sido enviado con exito. Muchas Gracias', {title: 'Mensaje Enviado', titleClass: 'anim success' , modal: true , width: 'auto'});
						$('.submit').val('Enviado');
							
						}else{
							new Messi('Hubo un problema. Intente nuevamente', {title: 'Error', titleClass: 'anim success' , modal: true , width: 'auto'});
							
							$('.submit').val('Intentar de nuevo');
							
						}
					},
					error: function(){ 
						//alert('No funciona');
					}
				});	
			}
			return false;

		});

	}
	
});


$(window).load(function(){
	
	preloader_general('off');
	
	if ( $("#single-wrapper").length > 0 ){
		columnas_size_single();
		//parrafos_wrapper();
		notes_wrapper();
		
		$('#single-content').on('click', '.highlighted' , function() {
			$('#single-content').getHighlighter().removeHighlights(this);
		});

		$(document).on( 'click' , "span.highlighted.current-highlight" , function(){	  
			remove_current_span( true );
			hide_highlight_menu();
		});
		
		
		$("#highlightMenu").bind( "clickoutside", function(event){
			var target = $(event.target);
			if ( $(this).hasClass('on') ){
				if ( !target.parent().hasClass('parrafo-wrapper') ){
					highlighter.removeHighlights();
				}
				hide_highlight_menu();
			}
		});
		
		
		if ( $("#highlightMenu").length > 0 ){
		$('#single-content').textHighlighter({
			onRemoveHighlight: function(highlight) {
			  //return confirm('Do you really want to remove this highlight: "' + $(highlight).text() + '"?');

			  return true;
			},
			onBeforeHighlight: function(range) {
			  //return confirm('Do you really want to highlight this text: "' + range + '"?');
			  
			  $("span.highlighted")
			  
			  return true;
			},
			onAfterHighlight: function(highlight ,highlights, range) {
	
					var current_span = $("span.highlighted.current-highlight");
					
					if ( !current_span.hasClass('note-added') ){
						current_span.contents().unwrap();
					}
					
					$("span.highlighted.current-highlight").removeClass('current-highlight');
					
					var menu = $("#highlightMenu");
					
					var este = $(highlight);
					var este_alt = este.height();
					var este_pos = este.position();
					var este_top = este_pos.top;
					var este_left = este_pos.left;
					
					este.addClass('current-highlight');
					//console.log('este_top  '+este_top);
					//console.log('este_left  '+este_left);
					
					if ( menu.hasClass('on') ){
						menu.fadeOut(150 , function(){
							menu.css('top' , este_top + este_alt + 4);
							menu.css('left' , este_left);
							menu.fadeIn(500 , function(){
								$(this).addClass('on')
							});
						});					
					}else{				
						menu.css('top' , este_top + este_alt + 4);
						menu.css('left' , este_left);
						menu.fadeIn(500 , function(){
							$(this).addClass('on')
						});
					}
				//highlightMenu();
			  //alert('You have selected "' + range + '" and created ' + highlights.length + ' highlight(s)!');
			}
		});

		highlighter = $('#single-content').getHighlighter();
		
		}
		
		$("a#removeHigh").click(function(){
			highlighter.removeHighlights();
		});
		
		
		
		$("#highlightMenu ul li a").hoverIntent({
			over: highlightMenu_hover,
			out: highlightMenu_out
		});
		
		// MOSTRAR HIGHLIGHTS REPLEGADO
		$(document).on( 'mouseenter' , ".note-wrapper .notes-group.hasContent" , function(){
			var este = $(this);
			if ( !este.hasClass('mostrando') ){
				highlight_desserialize_group( este );
			}
		});
		$(document).on( 'mouseleave' , ".note-wrapper .notes-group.hasContent" , function(){
			highlight_serialize( $(this) );
		});		
		
		
		// MOSTRAR HIGHLIGHTS DESPLEGADO
		$(document).on( 'mouseenter' , ".note-wrapper.desplegado .notes-group.hasContent.mostrando .notes-out .note" , function(){
			if ( !$(this).hasClass('sumar-nota') ){
				highlight_desserialize( $(this) );
			}
		});
		$(document).on( 'mouseleave' , ".note-wrapper.desplegado .notes-group.hasContent.mostrando .notes-out .note" , function(){
			highlight_serialize( $(this) );
		});
		
		
		$(document).on( 'click' , "#highlightMenu.on ul li a", function(){
					
			var logged_flag = $("#user_logged").attr('data-value');
			
			if ( logged_flag == 'logged' ){
			
				var este = $(this);
				var este_tipo = este.attr('class');
				var parent = este.closest('#highlightMenu');
				
				var current_span = $("span.highlighted.current-highlight");
				current_span.addClass('note-added');
				current_span.addClass( este_tipo+'-highlight');
				
				var span_parent = current_span.closest('.parrafo-wrapper');
				var span_parent_id = span_parent.attr('data-index');
				
				parent.fadeOut(150 , function(){
					$(this).removeClass('on');
				});
				
				var col = '';
				
				if ( este_tipo == 'ajuste' || este_tipo == 'aporte' ){
					col = 'der';
				}else{
					col = 'izq';
				}
	
				var notes_group = $("#note-wrapper-"+col+"-parrafo-"+span_parent_id+".note-wrapper ."+este_tipo+"s-wrapper.notes-group");
				
				/*console.log('este_tipo   '+este_tipo);
				console.log('span_parent_id   '+span_parent_id);
				console.log("#note-wrapper-"+col+"-parrafo-"+span_parent_id+".note-wrapper ."+este_tipo+"s-wrapper.notes-group");*/
				
				disable_note_hover = true;
				
				if ( notes_group.hasClass('noContent') ){
					notes_group.fadeIn(500 , function(){
						animacion_noContent( notes_group );
						$(".notes-btns div a.sumar", notes_group).trigger('click');
					});
				}else if ( notes_group.hasClass('hasContent') ){
					$(".notes-btns."+este_tipo , notes_group).addClass('from-highlight');
					$(".notes-btns."+este_tipo+" a.ver-mas" , notes_group ).trigger('click');
				}
			}else{// NO ESTA LOGUEADO
				no_log_msg();
			}

		});


		// SINGLE
		
		$("#single-content").mouseenter(function(ev_parrafo){
			
			var este = $(this);
			var mouseX = ev_parrafo.pageX;
			var mouseY = ev_parrafo.pageY;
			var offset = $("#single-wrapper").offset();
			var relX = mouseX - offset.left;
			var relY = mouseX - offset.top;
			$("#cursor-msg").css('left' , relX + 50 );
			$("#cursor-msg").css('top' , relY + 10 );
			
			var primer_comentario = $("#user_logged").attr('data-primer-comentario');
			
			if ( primer_comentario == 'true' ){	
			
				este.mousemove(function(e){
					relX = e.pageX - offset.left;
					relY = e.pageY - offset.top;
					$("#cursor-msg").css('left' , relX + 50 );
					$("#cursor-msg").css('top' , relY + 10 );
				});	
	
				$("#cursor-msg").delay(100).fadeTo(10 , 1);		
			}else{
				$("#cursor-msg").css('display' , 'none');
			}			
			
		});
		
		$("#single-content").mouseleave(function(e){
			//$("#cursor-msg").fadeTo(10 , 0);
			$("#cursor-msg").hide();
		});	
		
		// ANIM NOTAS PARRAFOS
		
		$("#single-content .parrafo-wrapper").hoverIntent({
			over: anim_notas_parrafo_hover,
			out: anim_notas_parrafo_out/*,
			sensitivity: 3,
			interval : 50*/
		});
		
		// DESPLEGAR NOTA
		
		$(".note-wrapper .notes-group a.ver-mas").click(function(){
			
			var este = $(this);
			var notes_group = este.closest('.notes-group'); 
			var note_wrapper = este.closest('.note-wrapper');
			
			remove_current_span();
			hide_highlight_menu();
			
			if ( !note_wrapper.hasClass('desplegado') ){
				
				$("#overlay-nota-desp").fadeIn(300);
				
				note_wrapper.addClass('desplegado');
				notes_group.addClass('mostrando');

				var notes_group_cur_alt = notes_group.height();
				notes_group.attr('data-alt-prev' , notes_group_cur_alt);
				notes_group.css('height', 'auto');
				var notes_group_auto_alt = notes_group.height();
								
				var note_wrapper_cur_alt = note_wrapper.height();
				note_wrapper.attr('data-alt-prev' , note_wrapper_cur_alt);
				note_wrapper.css('height', 'auto');
				var note_wrapper_auto_alt = note_wrapper.height();
				
				notes_group.height(notes_group_cur_alt);
				note_wrapper.height(note_wrapper_cur_alt);
				
				/*console.log('notes_group_cur_alt '+notes_group_cur_alt);
				console.log('notes_group_auto_alt '+notes_group_auto_alt);
				console.log('note_wrapper_cur_alt '+note_wrapper_cur_alt);
				console.log('note_wrapper_auto_alt '+note_wrapper_auto_alt);*/
				
				if ( notes_group_auto_alt > notes_group_cur_alt ){
					
					note_wrapper.animate({height: note_wrapper_auto_alt}, 500 ,function(){});
					notes_group.delay(100).animate({height: notes_group_auto_alt}, 500 ,function(){
						note_wrapper.css('height', 'auto');
						notes_group.css('height', 'auto');
						
						$(".notes-btns a.ver-mas" , notes_group).fadeOut(150, function(){
							$(".notes-btns div" , notes_group).fadeIn(300 , function(){
								from_Highlight( $(".notes-btns" , notes_group) );
							});
							$("#overlay-nota-desp").addClass('cancel-on');
						});
						
					});
				}else{
					
						note_wrapper.css('height', 'auto');
						
						$(".notes-btns a.ver-mas" , notes_group).fadeOut(150, function(){
							$(".notes-btns div" , notes_group).fadeIn(300 , function(){
								from_Highlight( $(".notes-btns" , notes_group) );
							});
							$("#overlay-nota-desp").addClass('cancel-on');
						});
				}
				
				$(".gradient" , notes_group).fadeOut(1000);

			}else{
				
				var notes_group_prev_alt = $(".notes-group.mostrando" , note_wrapper).attr('data-alt-prev');
				$(".notes-group.mostrando" , note_wrapper).removeAttr('data-alt-prev');
				
				// RESETEA SI HAY UN INPUT PARA SUMAR NOTA 
				cancel_note($(".sumar-nota.note .enviar-btns a.cancelar"));
				
				// EL QUE YA ESTA DESPLEGADO
				$(".notes-group.mostrando" , note_wrapper).animate({height: notes_group_prev_alt}, 500 ,function(){
					$(".notes-group.mostrando .gradient").fadeIn(1000);
					$(".notes-group.mostrando .notes-btns div").fadeOut(150, function(){			
						$(".notes-group.mostrando .notes-btns a.ver-mas").fadeIn(300 , function(){

							$(".notes-group.mostrando" , note_wrapper).removeClass('mostrando');
						
							// AL QUE LE HICISTE CLICK;
							
							var notes_group_cur_alt = notes_group.height();
							notes_group.attr('data-alt-prev' , notes_group_cur_alt );
							
							notes_group.addClass('mostrando');

							notes_group.css('height', 'auto');
							var notes_group_auto_alt = notes_group.height();
							notes_group.height(notes_group_cur_alt);
							
							notes_group.animate({height: notes_group_auto_alt}, 500 ,function(){
								
								var note_wrapper_cur_alt = note_wrapper.height();
								note_wrapper.css('height', 'auto');
								var note_wrapper_auto_alt = note_wrapper.height();
								note_wrapper.height(note_wrapper_cur_alt);
								
								note_wrapper.animate({height: note_wrapper_auto_alt}, 500 ,function(){
									note_wrapper.css('height', 'auto');
									notes_group.css('height', 'auto');
								});
								
								$(".notes-btns a.ver-mas" , notes_group).fadeOut(150, function(){
									$(".notes-btns div" , notes_group).fadeIn(300 , function(){
										from_Highlight( $(".notes-btns" , notes_group) );
									});
								});
							});
							
							$(".gradient" , notes_group).fadeOut(1000);
						});
						
					});
				});
				
			}
			
			
			// DEJA VISIBLE EL CURRENT PARRAFO
			var current_parrafo_id = note_wrapper.attr('data-index');
			$("#single-content .parrafo-wrapper").not("#single-content #parrafo-"+current_parrafo_id+".parrafo-wrapper").fadeTo(300 , 0.2 );
			
		});
		

		// CERRAR NOTA DESDE FLECHA
		
		$(".note-wrapper .notes-group .notes-btns div a.close-note").click(function(){
			
			var este = $(this);
			var notes_group = este.parent().parent().parent(); 
			var note_wrapper = este.parent().parent().parent().parent();

			if ( note_wrapper.hasClass('desplegado') && notes_group.hasClass('mostrando') ){

				var note_wrapper_cur_alt = note_wrapper.height();
				note_wrapper.height(note_wrapper_cur_alt);
				var note_wrapper_prev_alt = note_wrapper.attr('data-alt-prev');
				note_wrapper.removeAttr('data-alt-prev');
								
				var notes_group_cur_alt = notes_group.height();
				notes_group.height(notes_group_cur_alt);
				var notes_group_prev_alt = notes_group.attr('data-alt-prev');
				notes_group.removeAttr('data-alt-prev');			

				
				// RESETEA SI HAY UN INPUT PARA SUMAR NOTA 
				cancel_note($(".sumar-nota.note .enviar-btns a.cancelar"));

				notes_group.animate({height: notes_group_prev_alt}, 500 ,function(){
					notes_group.removeClass('mostrando');
					$(".notes-btns div" , notes_group).fadeOut(150, function(){
						$(".notes-btns a.ver-mas" , notes_group).fadeIn(300);
					});
				});
				note_wrapper.delay(100).animate({height: note_wrapper_prev_alt}, 500 ,function(){
					note_wrapper.removeClass('desplegado');
				});
				$(".gradient" , notes_group).fadeIn(300);
				$("#overlay-nota-desp").fadeOut(300);
			}
			
			// RESETEA VISIBILIDAD PARRAFOS
			$("#single-content .parrafo-wrapper").fadeTo(300 , 1 );
			
		});
		
		
		// CERRAR NOTA DESDE OVERLAY
		
		$(document).on( 'click' , "#overlay-nota-desp.cancel-on" , function(){
		//$("#overlay-nota-desp.cancel-on").click(function(){
			
			$(this).removeClass('cancel-on');
			
			var note_wrapper = $(".note-wrapper.desplegado");
			var notes_group = $(".notes-group.mostrando" , note_wrapper);

			var note_wrapper_cur_alt = note_wrapper.height();
			note_wrapper.height(note_wrapper_cur_alt);
			var note_wrapper_prev_alt = note_wrapper.attr('data-alt-prev');
			note_wrapper.removeAttr('data-alt-prev');
							
			var notes_group_cur_alt = notes_group.height();
			notes_group.height(notes_group_cur_alt);
			var notes_group_prev_alt = notes_group.attr('data-alt-prev');
			notes_group.removeAttr('data-alt-prev');			

			
			// RESETEA SI HAY UN INPUT PARA SUMAR NOTA 
			cancel_note($(".sumar-nota.note .enviar-btns a.cancelar"));

			notes_group.animate({height: notes_group_prev_alt}, 500 ,function(){
				notes_group.removeClass('mostrando');
				$(".notes-btns div" , notes_group).fadeOut(150, function(){
					$(".notes-btns a.ver-mas" , notes_group).fadeIn(300);
				});
			});
			note_wrapper.delay(100).animate({height: note_wrapper_prev_alt}, 500 ,function(){
				note_wrapper.removeClass('desplegado');
			});
			$(".gradient" , notes_group).fadeIn(300);
			$("#overlay-nota-desp").fadeOut(300);
			
			// RESETEA VISIBILIDAD PARRAFOS
			$("#single-content .parrafo-wrapper").fadeTo(300 , 1 );
			
		});
		
		
		// AGREGAR NOTA DESDE SUMAR
		$(".note-wrapper .notes-group .notes-btns div a.sumar").click(function(){

			var este = $(this);
			var notes_btns = este.parent().parent();
			
			var notes_group = este.parent().parent().parent();

			cancel_note($(".sumar-nota.note .enviar-btns a.cancelar"));
			
			var user_name = $("#user_logged").attr('data-name');
			var user_img = $("#user_logged").attr('data-img');

			var note_input = '<div class="note sumar sumar-nota">';
			note_input += '<div class="note-header"><div class="user-img"><img src="'+user_img+'"></div>';
			note_input += '<div class="user-text"><p>'+user_name+'</p><p></p></div></div><!-- note header -->'
			note_input += '<div class="note-content"><form method="get" action="">';
			note_input += '<textarea name="" cols="" rows=""></textarea>';
			note_input += '</form></div><!-- note content -->';
			note_input += '<div class="enviar-btns"><a class="enviar">+ Enviar</a> / <a class="cancelar">Cancelar</a></div>';
			//note_input = '<div class="sub-notes-wrapper"></div><!-- sub notes wrapper --><a href="" class="responder">« Responder</a>';
			note_input += '</div><!-- note -->';

			if( notes_group.hasClass('noContent') ){
				/*notes_group.css('height' , 'auto');
				notes_group.parent().addClass('desplegado');
				$(".gradient" , notes_group).fadeOut(300);
				$("#overlay-nota-desp").fadeIn(300);
				$("#overlay-nota-desp").addClass('cancel-on');*/
				
				animacion_noContent( notes_group );
				
			}
			$("div" , notes_btns).fadeOut(300 , function(){
				$("div" , notes_btns).addClass("oculto");
				$(".notes-out" , notes_group ).append(note_input);
				
				$(".notes-out .sumar-nota.note" , notes_group).fadeIn(300 , function(){
					$(".note-content form textarea" , this).focus();
					$(".note-content form textarea" , this).autosize();
				});
			});

		});
		
		
		// AGREGAR NOTA DESDE RESPONDER
		$(".notes-group .notes-out .note .responder-wrapper a.responder").click(function(){
			var logged_flag = $("#user_logged").attr('data-value');
			if ( logged_flag == 'logged' ){
					
				var este = $(this);
				var esta_note = este.parent().parent();
				var notes_group = este.parent().parent().parent().parent();
				
				cancel_note($(".sumar-nota.note .enviar-btns a.cancelar"));
				
				var user_name = $("#user_logged").attr('data-name');
				var user_img = $("#user_logged").attr('data-img');
				
				var note_input = '<div class="note sumar-nota">';
				note_input += '<div class="note-header"><div class="user-img"><img src="'+user_img+'"></div>';
				note_input += '<div class="user-text"><p>'+user_name+'</p><p></p></div></div><!-- note header -->'
				note_input += '<div class="note-content"><form method="get" action="">';
				note_input += '<textarea name="" cols="" rows=""></textarea>';
				note_input += '</form></div><!-- note content -->';
				note_input += '<div class="enviar-btns"><a class="enviar">+ Enviar</a> / <a class="cancelar">Cancelar</a></div>';
				//note_input = '<div class="sub-notes-wrapper"></div><!-- sub notes wrapper --><a href="" class="responder">« Responder</a>';
				note_input += '</div><!-- note -->';
	
				este.fadeOut(300 , function(){
					este.addClass('oculto');
					$(".sub-notes-wrapper" , esta_note).append(note_input);
					$(".sub-notes-wrapper .sumar-nota.note" , esta_note).fadeIn(300 , function(){
						$(".note-content form textarea" , this).focus();
						$(".note-content form textarea" , this).autosize();
					});
				});
	
			}else{// NO ESTA LOGUEADO
				no_log_msg();
			}			
		});
		
		
		// CANCELAR NOTA
		$(document).on( 'click' , ".sumar-nota.note .enviar-btns a.cancelar", function(){
			cancel_note( $(this) );
		});
		
		// ENVIAR NOTA 
		$(document).on( 'click' , ".sumar-nota.note .enviar-btns a.enviar", function(){
			send_note( $(this) );
		});


		$("#comments-wrapper .comment-header #comentar-btn a").click(function(){
			var logged_flag = $("#user_logged").attr('data-value');
			
			if ( logged_flag == 'logged' ){
			
				if ( !$(this).hasClass('active') ){
					$(this).addClass('active');
					
					var comments_wrapper = $(this).parent().parent().parent();
					
					var comment_new = $("#comments .comment.new" , comments_wrapper );
					var comment_first = comment_new.next('.comment');
					
					if( comment_first.hasClass('izq') ){
						comment_new.addClass('der');
					}else{
						comment_new.addClass('izq');
					}
					
					$('textarea' , comment_new).val('');
					
					comment_new.delay(100).slideDown(350, function(){
						comment_new.addClass('on');
						
						$('textarea' , comment_new).focus();
						var offset = $('#comments-out').offset();
						//console.log(offset.top);
						$('html , body').animate({ scrollTop: offset.top} , 750 );;
					});
				
				}
			}else{// NO ESTA LOGUEADO
				no_log_msg();
			}
		});
		
		$("#comments-wrapper #comments .comment.new .comment-texto .close-comment").click(function(){
			$("#comments .comment.new").slideUp(350, function(){
				$(this).removeClass('on');
				$("#comentar-btn a").removeClass('active');
			});
		});
		
		$(".comment.new .comment-texto form input.submit").click(function(){
			send_note( $(this) );
		});
		
	}// IF IS SINGLE ( si hay single wrapper )
	
});


$(window).resize(function(){
	var ancho_ventana = $(window).width();
	
	if ( $("#single-wrapper").length > 0 ){
		columnas_size_single();
		
		actualizar_notes_wrapper();
	}

});

function setMyInterval(activar){

	if(activar){
		scroller = setInterval( function() {
			//console.log("---");
			moverFondo($(".bloque-list-wrapper.hover-now") );
		} , 30 );
	} else {
		clearInterval( scroller );
	}			

}


// ANCHOS PARA LAS LISTAS DE NOTAS DE LA HOME
function listas_notas(){
	$(".bloque-list").each(function(index, element) {
		var este = $(this);
		var ancho_nota = $(".nota-box" , este).width();
		var marginLeft_nota = parseInt( $(".nota-box" , este).eq(1).css('margin-left') );
        var cant_notas = $(".nota-box" , este).length;
		
		var total_ancho = ancho_nota * cant_notas;
		var total_margin = marginLeft_nota * ( cant_notas - 1 );
		
		este.width( (total_ancho + total_margin) );
		este.fadeIn(300);
    });
}


function mouse_X( elemento , evento ){
	var este = elemento;
	var mouseX = evento.pageX ;
	var w = este.width();
	var w_3 = w / 3.8;
	
	var rate_fun = 0;
	var direction_fun = '';
	
	if ( mouseX <= w_3 ) {
		rate_fun = (w_3 - mouseX + 1)/w_3;
		direction_fun = 'left';
	}else if ( mouseX >= ( w_3 * 2 ) ) {
		rate_fun = ((w_3 - mouseX + 1 )/w_3) + 1 ;
		direction_fun = 'right';
	}
	
	//console.log("rate   " +rate);
	//console.log(direction);
	
	var result = {
		rate:rate_fun,
		direction:direction_fun
	}
	
	return result;
}


// MOVER FONDOS
function moverFondo( elemento ){
	
	rate = rate_glob;
	direction = dir_glob;
	
	var este = elemento;
	var maxspeed = 10;
	var bloque_list_wrapper_parent = $(".bloque-list-wrapper.hover-now").width();
	var bloque_list_ancho = $(".bloque-list-wrapper.hover-now .bloque-list").width();
	
	var left = $(".bloque-list" , este).css('left');
	left = parseInt(left.replace("px", ""));
		
	
	//console.log("left    " + left );
	//console.log("bloque_list_ancho    " + bloque_list_ancho );
	//console.log("left mas bloque list     " + ( bloque_list_ancho + left ));
	//console.log("bloque_list_wrapper_parent     " + ( bloque_list_wrapper_parent));

	if ( left >= 0 && direction == 'left' ) {
		left = 0;
	}else if ( ( bloque_list_ancho + left ) <= ( bloque_list_wrapper_parent - 100 ) && direction == 'right' ){
		left = left;
	}else{
		left+= maxspeed * rate;
	}
	$(".bloque-list" , este).css('left',left);
}

function search_item_hover( este_ ){	
	var este = este_;
	var mostrar_elem = $(".mostrar" , este);
	var classes = mostrar_elem.attr("class");
	//console.log('classes    '+classes);
	var classesArray = classes.split(' ');
	//console.log('classesArray    '+classesArray);
	var cant_clases = classesArray.length;
	var i;
	for (i = 0; i < cant_clases; ++i) {
		if ( classesArray[i] != 'mostrar' ){
			$(".mostrar."+classesArray[i]).parent().addClass('related');
		}
		
		if ( i == cant_clases - 1 ){
			$(".search-item").not(".related").fadeTo(300 , 0.3);
		}
	}
	
	$(".linea" , este).addClass('hover');
}
function search_item_out(){
	$(".search-item").fadeTo(50 ,1);
	$(".search-item.related .linea").removeClass('hover');
	$(".search-item.related").removeClass('related');
}

function isotope_update( newElements , $container ){
	
	$container.isotope( 'appended', $( newElements ) ); 
}

function columnas_size_single(){	

	var wrapper = $("#single-wrapper");
	var wrapper_ancho = wrapper.width();
	var centro = $(".col.centro" , wrapper );
	var centro_alt = centro.height();
	var centro_ancho = centro.width();
	
	var resto_ancho = wrapper_ancho - centro_ancho - 18 - 18 - 2; // 18 Margen de las columnas - 2 para compensar 

	//console.log('wrapper_ancho  '+wrapper_ancho);	
	//console.log('resto_ancho  '+resto_ancho);
	//console.log('resto_ancho  2 '+resto_ancho/2);
	
	$(".col.izq" , wrapper ).height(centro_alt);
	$(".col.izq" , wrapper ).width(resto_ancho/2);
	
	$(".col.der" , wrapper ).height(centro_alt);
	$(".col.der" , wrapper ).width(resto_ancho/2);
}

function parrafos_wrapper(){
	
	// ESTA FUNCION ENVUELVE A TODOS LOS ELEMENTOS DEL CONTENEDOR CENTRAL EN DIVS
	
	// RECORRE TODOS LOS CHILD DEL CONTENEDOR
	var cant_children = $('#single-content').children().length;
	$('#single-content').children().each(function ( i ) {
		var parent_max = $('#single-content');
		var parent_max_id = parent_max.attr('id');
		
		var este = $(this);
		var parent_este = este.parent();
		var parent_este_id = parent_este.attr('id');
	
		if ( parent_este_id == parent_max_id ){
			//alert(este.text()); // "this" is the current element in the loop
			este.wrap( '<div class="parrafo-wrapper" id="parrafo-'+i+'" data-index="'+i+'"></div>' );
		}
		
		if ( i == (cant_children -1 ) ){
			notes_wrapper();
		}
	});
}

function notes_wrapper(){
	// AGREGA LOS CONTENEDORES DE NOTAS
	
	var cant_parrafo = $("#single-content .parrafo-wrapper").length;
	
	$("#single-content .parrafo-wrapper").each(function(index, element) {
		var este = $(this);
		var este_alt = este.height();
		var este_pos = este.position();
		
		var id = este.attr('data-index');
		
		var append_izq = '';
		var append_der = '';
		
		append_izq = '<div class="note-wrapper" id="note-wrapper-izq-parrafo-'+id+'" data-index="'+id+'" style="height:'+este_alt+'px; top:'+este_pos.top+'px">';
		
		append_izq += '<div class="ejemplos-wrapper notes-group"><div class="notes-out"></div>';
		append_izq += '<div class="gradient blanco"></div>';
		append_izq += '<div class="notes-btns ejemplo">';
		append_izq += '<a class="ver-mas anim">Ver Ejemplos</a>';
		append_izq += '<div><a class="sumar anim"></a><a class="close-note anim">Replegar</a></div>';
		append_izq += '</div><!-- notes btns -->';
		append_izq += '</div><!-- ejemplos wrapper -->';
		
		append_izq += '<div class="bibliografias-wrapper notes-group"><div class="notes-out"></div>';
		append_izq += '<div class="gradient blanco"></div>';
		append_izq += '<div class="notes-btns bibliografia">';
		append_izq += '<a class="ver-mas anim">Ver Bibliografias</a>';
		append_izq += '<div><a class="sumar anim"></a><a class="close-note anim">Replegar</a></div>';
		append_izq += '</div><!-- notes btns -->';
		append_izq += '</div><!-- bibliografias wrapper -->';

		append_izq += '</div><!-- note wrapper -->';
		
		append_der = '<div class="note-wrapper" id="note-wrapper-der-parrafo-'+id+'" data-index="'+id+'" style="height:'+este_alt+'px; top:'+este_pos.top+'px">';
		
		append_der += '<div class="aportes-wrapper notes-group"><div class="notes-out"></div>';
		append_der += '<div class="gradient blanco"></div>';
		append_der += '<div class="notes-btns aporte">';
		append_der += '<a class="ver-mas anim">Ver Aportes</a>';
		append_der += '<div><a class="sumar anim"></a><a class="close-note anim">Replegar</a></div>';
		append_der += '</div><!-- notes btns -->';
		append_der += '</div><!-- aportes wrapper -->';
		
		append_der += '<div class="ajustes-wrapper notes-group"><div class="notes-out"></div>';
		append_der += '<div class="gradient blanco"></div>';
		append_der += '<div class="notes-btns ajuste">';
		append_der += '<a class="ver-mas anim">Ver Ajustes</a>';
		append_der += '<div><a class="sumar anim"></a><a class="close-note anim">Replegar</a></div>';
		append_der += '</div><!-- notes btns -->';
		append_der += '</div><!-- ajustes wrapper -->';

		append_der += '</div><!-- note wrapper -->';
		
		//<div class="gradient blanco"></div>
		
		$("#single-wrapper .col.izq").append( append_izq );
		
		$("#single-wrapper .col.der").append( append_der );
		
		if ( index == (cant_parrafo -1 ) ){
			add_notes();
			add_notes_group_labels();
			notes_group_alt();
		}
	});
}

function actualizar_notes_wrapper(){
	// ACTUALIZA LOS TAMAÑOS DE LOS CONTENEDORES DE NOTAS EN EL RESIZE
	
	$("#single-content .parrafo-wrapper").each(function(index, element) {
		var este = $(this);
		var este_alt = este.height();
		var este_pos = este.position();

/*		$("#single-wrapper .col.izq #note-wrapper-izq-parrafo-"+index+".note-wrapper").css({
			'height' : este_alt,
			'top' 	 : este_pos.top
		});
		
		$("#single-wrapper .col.der #note-wrapper-der-parrafo-"+index+".note-wrapper").css({
			'height' : este_alt,
			'top' 	 : este_pos.top
		});*/
		$("#single-wrapper .col.izq #note-wrapper-izq-parrafo-"+index+".note-wrapper.desplegado").css({
			'height' : 'auto',
			'top' 	 : este_pos.top
		});
		
		$("#single-wrapper .col.der #note-wrapper-der-parrafo-"+index+".note-wrapper.desplegado").css({
			'height' : 'auto',
			'top' 	 : este_pos.top
		});
	});
}

function add_notes(){
	// AGREGA LAS NOTAS EN CADA COLUMNA
	var i;
	for (i = 0; i < notesArray.length ; i++) {
		var index = notesArray[i]['Index'];
		var parent = notesArray[i]['Parent'];
		var parrafo_index = notesArray[i]['Parrafo'];
		var tipo = notesArray[i]['Tipo'];
		var tipo_clase = tipo.toLowerCase();
		var autor = notesArray[i]['Autor'];
		var userImg = notesArray[i]['UserImg'];
		var fecha = notesArray[i]['Fecha'];
		var content = notesArray[i]['Content'];
		//var highlight = notesArray[i]['Highlight'];
		
		var append_content = '';
		var col = '';
		var tipo_note_wrapper = '';
		var responder_text = '';
		
		if ( tipo_clase == 'aporte'){
			col = 'der';
			tipo_note_wrapper = 'aportes-wrapper';
		}else if ( tipo_clase == 'ajuste' ){
			col = 'der';
			tipo_note_wrapper = 'ajustes-wrapper';
		}else if ( tipo_clase == 'ejemplo'){
			col = 'izq';
			tipo_note_wrapper = 'ejemplos-wrapper';
		}else if ( tipo_clase == 'bibliografia' ){
			col = 'izq';
			tipo_note_wrapper = 'bibliografias-wrapper';
		}

		if ( col == 'der' ){
			responder_text = 'Responder »';
		}else if ( col == 'izq' ){
			responder_text = '« Responder';
		}
		
			append_content ='<div class="note parent" id="'+tipo_clase+'-'+index+'" data-array-id="'+i+'">';
			append_content += '<div class="note-header"><div class="user-img"><img src="'+userImg+'" /></div>';
			append_content += '<div class="user-text"><p>'+autor+'</p><p>Hace '+fecha+' d.</p></div></div><!-- note header -->';
			append_content += '<div class="note-content">';
			append_content += '<p>'+content+'</p>';
			//append_content += '<p class="highlight_info">'+highlight+'</p>';
			append_content += '</div><!-- note content --><div class="sub-notes-wrapper"></div><!-- sub notes wrapper -->';
			append_content += '<div class="responder-wrapper"><a class="responder">'+responder_text+'</a></div><!-- responder wrapper -->';
			append_content += '</div><!-- note -->';

			$("#single-wrapper .col."+col+" #note-wrapper-"+col+"-parrafo-"+parrafo_index+".note-wrapper .notes-group."+tipo_note_wrapper+" .notes-out").append(append_content);

		
		//alert(notesArray[i]);
		
		if ( i == notesArray.length - 1 ){
			add_notes_childs();
		}
	}

	
}


function add_notes_childs(){
	// AGREGA LAS NOTAS EN CADA COLUMNA
	var i;
	for (i = 0; i < notesArrayChilds.length ; i++) {
		var index = notesArrayChilds[i]['Index'];
		var parent = notesArrayChilds[i]['Parent'];
		var parrafo_index = notesArrayChilds[i]['Parrafo'];
		var tipo = notesArrayChilds[i]['Tipo'];
		var tipo_clase = tipo.toLowerCase();
		var autor = notesArrayChilds[i]['Autor'];
		var userImg = notesArrayChilds[i]['UserImg'];
		var fecha = notesArrayChilds[i]['Fecha'];
		var content = notesArrayChilds[i]['Content'];
		
		var append_content = '';
		var col = '';
		var tipo_note_wrapper = '';
		var responder_text = '';
		
		if ( tipo_clase == 'aporte'){
			col = 'der';
			tipo_note_wrapper = 'aportes-wrapper';
		}else if ( tipo_clase == 'ajuste' ){
			col = 'der';
			tipo_note_wrapper = 'ajustes-wrapper';
		}else if ( tipo_clase == 'ejemplo'){
			col = 'izq';
			tipo_note_wrapper = 'ejemplos-wrapper';
		}else if ( tipo_clase == 'bibliografia' ){
			col = 'izq';
			tipo_note_wrapper = 'bibliografias-wrapper';
		}

		if ( col == 'der' ){
			responder_text = 'Responder »';
		}else if ( col == 'izq' ){
			responder_text = '« Responder';
		}
		
			
			append_content = '<div class="sub-note">';
			append_content += '<div class="note-header"><div class="user-img"><img src="'+userImg+'" /></div>';
			append_content += '<div class="user-text"><p>'+autor+'</p><p>Hace '+fecha+' d.</p></div></div><!-- note header -->';
			append_content += '<div class="note-content">';
			append_content += '<p>'+content+'</p>';
			append_content += '</div><!-- note content -->';
			append_content += '</div><!-- sub note -->';
			
			$("#single-wrapper .col."+col+" #note-wrapper-"+col+"-parrafo-"+parrafo_index+".note-wrapper .notes-group."+tipo_note_wrapper+" .notes-out #"+tipo_clase+"-"+parent+".note .sub-notes-wrapper").prepend(append_content);
		
		//alert(notesArray[i]);
		
		if ( i == notesArrayChilds.length - 1 ){
			
		}
	}

	
}


function add_notes_group_labels(){
	
	// AGREGA LA ETIQUETA DEL TIPO DE NOTAS Y LA CANTIDAD , SI NO TIENE LO ESCONDE

	$(".notes-group").each(function(index, element) {
        var este = $(this);
		var cant_notes = $(".note" , este).length;
		var tipo = '';
		
		if( cant_notes > 0 ){		
			este.addClass('hasContent');
			
			if ( este.hasClass('aportes-wrapper') ){
				tipo = 'Aporte';
			}else if ( este.hasClass('ajustes-wrapper') ){
				tipo = 'Ajuste';
			}else if ( este.hasClass('bibliografias-wrapper') ){
				tipo = 'Bibliografia';
			}else if ( este.hasClass('ejemplos-wrapper') ){
				tipo = 'Ejemplo';
			}
			
			var append_content = '<div class="note-code"></div>';
			append_content += '<div class="tipo-wrapper"><p>'+tipo+'</p><span>'+cant_notes+'</span></div>';
			
			este.prepend(append_content);
				
		}else{
			este.addClass('noContent');
		}
    });
}

function notes_group_alt(){
	
	//DECIDE LA ALTURA DE LOS GRUPOS DE NOTAS , SEGUN SI HAY DE DOS TIPO O UNO
	
	$(".note-wrapper").each(function(index, element) {
        var este = $(this);
		var cant_grupos = $(".notes-group.hasContent" ,este).length;
		
		var este_alt = este.height();
		var note_group_alt = $(".notes-group" ,este).height();
		
		$(".notes-group" ,este).addClass('alt-mitad');
		if ( cant_grupos == 1 ){
			if ( note_group_alt > este_alt ){
				$(".notes-group" ,este).addClass('alt-full');
				$(".notes-group" ,este).css('height' , $(".notes-group" ,este).height() );
				$(".notes-group" ,este).attr('data-alt-prev' , $(".notes-group" ,este).height() );
			}
		}else if ( cant_grupos == 2 ){
			$(".notes-group" ,este).addClass('alt-mitad');
			$(".notes-group" ,este).css('height' , $(".notes-group" ,este).height() );
			$(".notes-group" ,este).attr('data-alt-prev' , $(".notes-group" ,este).height() );
		}
    });
}

function cancel_note( elemento ){
	if ( elemento.length > 0 ){
		
		disable_note_hover = false;
		
		var este_suma = elemento.parent().parent();
		
		var notes_group = este_suma.parent().parent();
		
		if( notes_group.hasClass('noContent') ){
			notes_group.removeAttr('style');
			notes_group.parent().removeClass('desplegado');
			$(".gradient" , notes_group).fadeIn(300);
			$("#overlay-nota-desp").fadeOut(300);
			$("#overlay-nota-desp").removeClass('cancel-on');
		}
			
		  //remove_current_span( true );
		  highlighter.removeHighlights();
		  hide_highlight_menu();
		
		este_suma.fadeOut(300 , function(){
			este_suma.remove();
			
			var elem_oculto = '';
			
			if ( $(".notes-btns.oculto").length > 0 ){
				elem_oculto = $(".notes-btns.oculto");
			}else if ( $(".notes-btns .oculto").length > 0 ){
				elem_oculto = $(".notes-btns .oculto");
			}else if ( $(".notes-out .note a.responder.oculto").length > 0 ){
				elem_oculto = $(".notes-out .note a.responder.oculto");
			}
			
			elem_oculto.fadeIn(300 , function(){});
			elem_oculto.removeClass('oculto');
		
		});
	}
}


function send_note( este_ ){
	var este = este_;
	
	var logged_flag = $("#user_logged").attr('data-value');
	
	if ( logged_flag == 'logged' ){
	
		if ( este.hasClass('submit') && este.is('input') ){// si es un comentario comun
			
			var form = este.parent();
		
			var este_textarea = $("textarea" , form );
			var text = este_textarea.val();
			var parrafo_index = '-';
			var type = 'normal';
			var child = 'false';
			var note_id = '0';
			var highlight_span_info = '-';
			
		}else{
		
			var este_suma = este.parent().parent();
			
			var este_textarea = $(".note-content form textarea" , este_suma );
			var text = este_textarea.val();
			
			var note_wrapper = este_suma.closest('.note-wrapper');
			var notes_group = este_suma.closest('.notes-group');
			var note = este_suma.closest('.note.parent');
			
			var parrafo_index = note_wrapper.attr('data-index');
			var type = '';
		
			if ( notes_group.hasClass('aportes-wrapper') ){
				type = 'aporte';
			}else if ( notes_group.hasClass('ajustes-wrapper') ){
				type = 'ajuste';
			}else if ( notes_group.hasClass('bibliografias-wrapper') ){
				type = 'bibliografia';
			}else if ( notes_group.hasClass('ejemplos-wrapper') ){
				type = 'ejemplo';
			}else{
				type = 'normal';
			}
		
			if ( este_suma.parent().hasClass("sub-notes-wrapper") ){
				var child = true;
				//var note = $(".note" , notes_group ).not(".sumar-nota.note");
				var note_id = note.attr('id');
				//console.log("note_id  "+note_id);
				note_id = note_id.replace( type+'-' , '' );
				//console.log("note_id  "+note_id);
			}else{
				var child = false;
				var note_id = -1;
			}
			
			var highlight_span_info = highlighter.serializeHighlights();
			//console.log('highlight_span_info  '+highlight_span_info);
	
		}
		
		var nonce = $("#single-wrapper #nonce").attr('data-value');
		var post_id = $("#current_post_id").attr('data-value');
	
		if ( text != '' ){

			preloader_general('on' , true);
			
			$.ajax({
			  type: 'POST',
			  url:  'http://www.gob247.org/dev/wp-admin/admin-ajax.php',
			  data: { 
					 'action': 'comment_save_action',
					 'nonce' : nonce,
					 'id'	: post_id,
					 'text': text,
					 'parrafo_index' : parrafo_index,
					 'type': type,
					 'child': child,
					 'parent_id': note_id,
					 'highlight_span_info' : highlight_span_info
			  },
			  success: function(data){
						   //alert(data);
				   if( data ){ 
						//alert('Funciona');						  
						location.reload();
				   }else{
					  //alert('No Funciona');
				   }
			   },
			  error: function(){ /*alert('No funciona');*/ }
			});
		   
		}else{
	
		}
		
	}else{// NO ESTA LOGUEADO
		no_log_msg();
	}
}

function highlightMenu_hover(){
	var este = $(this);
	var parent = este.parent().parent().parent();
	
	if ( parent.hasClass('on') ){
		
		var este_tipo = este.attr('class');
		
		if ( este_tipo == 'aporte' ){
			$("span.highlighted.current-highlight").css('background-color' , '#ffb400');
			$("span.highlighted.current-highlight").css('color' , 'inherit');
			$("span.highlighted.current-highlight").css('text-decoration' , 'none');
		}else if ( este_tipo == 'ajuste' ){
			
			$("span.highlighted.current-highlight").css('background-color' , '#ff0044');
			$("span.highlighted.current-highlight").css('color' , 'inherit');
			$("span.highlighted.current-highlight").css('text-decoration' , 'line-through');
		}else if ( este_tipo == 'bibliografia' ){
			$("span.highlighted.current-highlight").css('background-color' , '#00b4ff');
			$("span.highlighted.current-highlight").css('color' , 'inherit');
			$("span.highlighted.current-highlight").css('text-decoration' , 'none');
		}else if ( este_tipo == 'ejemplo' ){
			$("span.highlighted.current-highlight").css('background-color' , '#7DD709');
			$("span.highlighted.current-highlight").css('color' , 'inherit');
			$("span.highlighted.current-highlight").css('text-decoration' , 'none');
		}
		
	}
}

function highlightMenu_out(){
}

function from_Highlight( este_ ){
	//console.log('from_Highlight');
	var este = este_;
	if ( este.hasClass('from-highlight') ){
		$("a.sumar" , este).trigger('click');
		este.removeClass('from-highlight')
		var sumar_offset = $("a.sumar" , este).offset();
		$('html , body').animate( {scrollTop: sumar_offset.top } , 500, function() { });
	}
}

function highlight_desserialize( element ){
	if ( !disable_note_hover ){
		//console.log('in');
		highlighter.removeHighlights();
		var este = element;
		
		var data_array_id = este.attr('data-array-id');
		//console.log('data_array_id '+data_array_id);
		
		if ( data_array_id != 'undefined' ){
			var highlight = notesArray[data_array_id]['Highlight'];
			//console.log(highlight);
			
			if( highlight != '[]' ){	
				highlighter.deserializeHighlights(highlight);
			}
		}
	}
}
function highlight_serialize( element ){
	if ( !disable_note_hover ){
		var spanHigh = $("span.highlighted.current-highlight");
		if ( spanHigh.length > 0 ){
			//console.log("OUT");
			highlighter.removeHighlights();
		}
	}
}

function highlight_desserialize_group( element ){
	var highlight_array = '';
	highlighter.removeHighlights();
	var cant_notas = $(".notes-out .note.parent" , element).length;

	$(".notes-out .note.parent" , element).each(function(index ) {
		var este = $(this);
		var data_array_id = este.attr('data-array-id');	
		if ( data_array_id != 'undefined' ){
			
			var highlight_temp = notesArray[data_array_id]['Highlight'];
			var cant_chars = highlight_temp.length;
			var highlight_temp = highlight_temp.substring(1 , (cant_chars - 1));
			
			if ( index == 0 ){
				highlight_array += '[';
			}
			
			highlight_array += highlight_temp;
			
			if ( index != cant_notas -1 ){
				highlight_array += ',';
			}else{
				highlight_array += ']';
				if( highlight_array != '[]' ){	
					highlighter.deserializeHighlights(highlight_array);
				}
			}
		}
		
	});
}

function remove_current_span( fromCancel ){
	var current_span = $("span.highlighted.current-highlight");
	
	if ( fromCancel ){
		current_span.contents().unwrap();
	}else{
		if ( !current_span.hasClass('note-added') ){
			current_span.contents().unwrap();
		}
	}
}

function hide_highlight_menu(){
	$("#highlightMenu").fadeOut(150 , function(){
		$(this).removeClass('on');
	});
}

function anim_notas_parrafo_hover(){
	var este = $(this);	
	var index = este.attr('data-index');
	var note_izq = $("#note-wrapper-izq-parrafo-"+index+".note-wrapper");
	var note_der = $("#note-wrapper-der-parrafo-"+index+".note-wrapper");
	
	note_izq.animate({ left: -20 }, 500 , 'easeInOutQuint' , function(){ });
	note_der.animate({ left: 20 }, 500 , 'easeInOutQuint' , function(){ });
}
function anim_notas_parrafo_out(){	
	var este = $(this);
	var index = este.attr('data-index');
	var note_izq = $("#note-wrapper-izq-parrafo-"+index+".note-wrapper");
	var note_der = $("#note-wrapper-der-parrafo-"+index+".note-wrapper");
	
	note_izq.animate({ left: 0 }, 500 , 'easeInOutQuint' , function(){ });
	note_der.animate({ left: 0 }, 500 , 'easeInOutQuint' , function(){ });
}

function animacion_noContent( notes_group_ ){

	var notes_group = notes_group_;
	var note_wrapper = notes_group.parent();
	
	if ( !note_wrapper.hasClass('desplegado') ){
		
		$("#overlay-nota-desp").fadeIn(300 , function(){
			$("#overlay-nota-desp").addClass('cancel-on');
		});
		
		note_wrapper.addClass('desplegado');
		//notes_group.removeClass('noContent');
		notes_group.addClass('mostrando');
		
		note_wrapper.css('height', 'auto');
		notes_group.css('height', 'auto');
		
		$(".gradient" , notes_group).fadeOut(300);

	}

}

function preloader_general( accion , scroll ){

	if ( accion == 'off' ){
		$("#preloader").fadeOut(500);
	}else if ( accion == 'on' ){
		
		if( scroll ){
			var offset = $("#single-out").offset();
			$("html,body").animate({scrollTop: offset.top} , 1000);
		}
		$("#preloader").fadeIn(500);
	}
}

function no_log_msg(){
	new Messi('Para poder interactuar con esta nota usted debe iniciar sesión.</br><ul class="messi-login"><li><i class="fa fa-facebook-square"></i></li><li><i class="fa fa-twitter-square"></i></li><li><i class="fa fa-google-plus-square"></i></li></ul>', {title: '' , modal: true , width: 'auto' , modalOpacity: '0.8' , padding : '18px 50px 38px'});
}


// CONSOLE LOG PARA QUE NO ANDE PARA IE 
function myLog(consoleMSG){
	
	if(ie){
	} else {
	console.log(consoleMSG);
	}
}


var ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;

}());


// FUNCIONES LOGIN REDES SOCIALES

function forceLogin(email,id,first_name,last_name,country,source,avatar) {

	security = $('#security').val();
	redirect = $('#redirect').val();
	
	preloader_general('on' , false);
	
	$.ajax({
    type: 'POST',
    dataType: 'json',
    url:  ajaxurl,
    data: { 
           'action': 'ajax_rrss',
           'username': email,
           'uid' : id,
           'nombre': first_name,
           'apellido': last_name,
           'redirect': redirect,
           'avatar': avatar,
           'source': source,
           'security': security
	},
    success: function(data){
	       /* $("#ajaxLoginLoader").hide(); */
	       if (data.loggedin == 1){

				location.reload();
			  
	       } else {
			   	
				preloader_general('off' , false);
				new Messi('' + data.message, {title: 'Hubo un error en iniciar sesión.', modal: true, titleClass: 'anim error' , width: 'auto' , modalOpacity: '0.8' });
	       }
    },
    error: function(){
 		   preloader_general('off' , false);
    	   new Messi('No se pudo conectar. Intente nuevamente.' , {title: 'Error Usuario/Password', modal: true, titleClass: 'anim error', width: 'auto' , modalOpacity: '0.8' });
    	   }
	});
}


function disconnect_social( source , url , token ){

	preloader_general('on' , false);
	
	if( source == "facebook" ){
		//console.log("facebok");
		
		FB.logout(function() {
			location = url;
		});
		
		setInterval(function(){location = url}, 3000);
	
	}else if( source == 'google'){
		
		var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +token;
	  
		// Realiza una solicitud GET asíncrona.
		$.ajax({
		  type: 'GET',
		  url: revokeUrl,
		  async: false,
		  contentType: "application/json",
		  dataType: 'jsonp',
		  success: function(nullResponse) {
			// Lleva a cabo una acción ahora que el usuario está desconectado
			// La respuesta siempre está indefinida.
			
			location = url;
		  },
		  error: function(e) {
			// Gestiona el error
			// console.log(e);
			// Puedes indicar a los usuarios que se desconecten de forma manual si se produce un error
			// https://plus.google.com/apps
		  }
		});
		
	}else{
		location = url;
	}
	
}



$(window).scroll(function(){
	if ( $('#principal').length > 0 ){
	parallax();
	}
});

function parallax(){
    var scrolled = $(window).scrollTop();
	var pos_marco_y = 0 + scrolled * 0.15;
	
	//console.log(pos_marco_y);
	
	if ( pos_marco_y >= 100 ){
    	pos_marco_y = 100;
	}

	$('#principal').css('background-position', "50% " + pos_marco_y + '%');

}