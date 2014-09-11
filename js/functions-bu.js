var rate_glob = 0;
var dir_glob = '';
		

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
	
	// HOME
	
	var doc_ancho = $(document).width();
	if ( $(".bloque-list").length > 0 ){ 
		listas_notas(); 
		
		
		$(document).mousemove(function(e){
			var result = mouse_X( $(this) , e );
			//console.log("rate: " + result.rate + "\n" + "direction: " + result.direction);
			rate_glob = result.rate;
			dir_glob = result.direction;
		});

		var scroller = null;
		
		$(".bloque-list-wrapper").hover(function(){

				var bloque_list_ancho = $('.bloque-list' , this).width();
				var bloque_ancho = $(this).parent().width();
				
				if ( bloque_list_ancho > bloque_ancho){
					$(this).addClass('hover-now');
					//console.log('scroller   ' + scroller);
					//$(this).data('scroller', scroller);
					setMyInterval(true, rate_glob , dir_glob);
				}
			
			},
			function(){
				var bloque_list_ancho = $('.bloque-list' , this).width();
				var bloque_ancho = $(this).parent().width();
				
				if ( bloque_list_ancho > bloque_ancho){
					$(this).removeClass('hover-now');
					//var scroller = $(this).data('scroller');
					//console.log('scroller   ' + scroller);
					setMyInterval(false);
				}
		});

		
	}
	
	// SEARCH
	
	if ( $("#search-wrapper").length > 0 ){
		
		  $("#search-wrapper a.search-item").hoverIntent({
			  over: search_item_hover,
			  out: search_item_out
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
	
});


$(window).load(function(){
	
	if ( $("#single-wrapper").length > 0 ){
		columnas_size_single();
		//parrafos_wrapper();
		notes_wrapper();
		
		$('#single-content').on('click', '.highlighted' , function() {
			$('#single-content').getHighlighter().removeHighlights(this);
		});
		
		$('#single-content').textHighlighter({
			onRemoveHighlight: function(highlight) {
			  //return confirm('Do you really want to remove this highlight: "' + $(highlight).text() + '"?');
			  
			  /*var menu = $("#highlightMenu");
			  
			  menu.fadeOut(150 , function(){
				  $(this).removeClass('on');
			  });
			  
			  return true;*/
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
		
		
		$("#highlightMenu ul li a").hoverIntent({
			over: highlightMenu_hover,
			out: highlightMenu_out
		});
		
		
		$(document).on( 'click' , "#highlightMenu.on ul li a", function(){
			var este = $(this);
			var parent = este.parent().parent().parent();
			var este_tipo = este.attr('class');
			
			var current_span = $("span.highlighted.current-highlight");
			current_span.addClass('note-added');
			current_span.addClass( este_tipo+'-highlight');
			
			var span_parent = current_span.parents('.parrafo-wrapper');
			
			var span_parent_id = span_parent.attr('id');
			span_parent_id = span_parent_id.replace('parrafo-' , '');
			//console.log(span_parent_id);
			
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
			
			if ( notes_group.hasClass('noContent') ){
				notes_group.fadeIn(500 , function(){
					animacion_noContent( notes_group );
					$(".notes-btns div a.sumar", notes_group).trigger('click');
				});
			}else if ( notes_group.hasClass('hasContent') ){
				$(".notes-btns."+este_tipo).addClass('from-highlight');
				$(".notes-btns."+este_tipo+" a.ver-mas" , notes_group ).trigger('click');
			}

		});
		
		
		// SINGLE
		
		
		// DESPLEGAR NOTA
		
		$(".note-wrapper .notes-group a.ver-mas").click(function(){
			var este = $(this);
			var notes_group = este.parent().parent(); 
			var note_wrapper = este.parent().parent().parent();
			
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
				cancel_note($("#sumar-nota.note .enviar-btns a.cancelar"));
				
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
				cancel_note($("#sumar-nota.note .enviar-btns a.cancelar"));

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
			
		});
		
		
		// CERRAR NOTA DESDE OVERLAY
		
		$(document).on( 'click' , "#overlay-nota-desp.cancel-on", function(){
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
			cancel_note($("#sumar-nota.note .enviar-btns a.cancelar"));

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
			
		});
		
		
		// AGREGAR NOTA DESDE SUMAR
		$(".note-wrapper .notes-group .notes-btns div a.sumar").click(function(){

			var este = $(this);
			var notes_btns = este.parent().parent();
			
			var notes_group = este.parent().parent().parent();

			cancel_note($("#sumar-nota.note .enviar-btns a.cancelar"));

			var note_input = '<div id="sumar-nota" class="note">';
			note_input += '<div class="note-header"><div class="user-img"><img src="http://www.gob247.org/dev/wp-content/themes/gob247/img/user-default.png"></div>';
			note_input += '<div class="user-text"><p>Hace 0 d. por </p><p>Nahuel</p></div></div><!-- note header -->'
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
				
				$(".notes-out #sumar-nota.note" , notes_group).fadeIn(300 , function(){
					$(".note-content form textarea" , this).focus();
					$(".note-content form textarea" , this).autosize();
				});
			});

		});
		
		
		// AGREGAR NOTA DESDE RESPONDER
		$(".notes-group .notes-out .note .responder-wrapper a.responder").click(function(){
			var este = $(this);
			var esta_note = este.parent().parent();
			var notes_group = este.parent().parent().parent().parent();
			
			cancel_note($("#sumar-nota.note .enviar-btns a.cancelar"));
			
			var note_input = '<div id="sumar-nota" class="note" style="display:none;">';
			note_input += '<div class="note-header"><div class="user-img"><img src="img/user-default.png"></div>';
			note_input += '<div class="user-text"><p>Hace 0 d. por </p><p>Nahuel</p></div></div><!-- note header -->'
			note_input += '<div class="note-content"><form method="get" action="">';
			note_input += '<textarea name="" cols="" rows=""></textarea>';
			note_input += '</form></div><!-- note content -->';
			note_input += '<div class="enviar-btns"><a class="enviar">+ Enviar</a> / <a class="cancelar">Cancelar</a></div>';
			//note_input = '<div class="sub-notes-wrapper"></div><!-- sub notes wrapper --><a href="" class="responder">« Responder</a>';
			note_input += '</div><!-- note -->';

			este.fadeOut(300 , function(){
				este.addClass('oculto');
				$(".sub-notes-wrapper" , esta_note).append(note_input);
				$(".sub-notes-wrapper #sumar-nota.note" , esta_note).fadeIn(300 , function(){
					$(".note-content form textarea" , this).focus();
					$(".note-content form textarea" , this).autosize();
				});
			});
			
		});
		
		
		// CANCELAR NOTA
		$(document).on( 'click' , "#sumar-nota.note .enviar-btns a.cancelar", function(){
			cancel_note( $(this) );
		});
		
		// ENVIAR NOTA 
		$(document).on( 'click' , "#sumar-nota.note .enviar-btns a.enviar", function(){
			send_note( $(this) );
		});


	}
	
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
	var w_3 = w / 3;
	
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

function search_item_hover(){
	var este = $(this);
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
	$(".search-item").fadeTo(150 ,1);
	$(".search-item.related").removeClass('related');
	$(".linea" , this).removeClass('hover');
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
		append_izq += '<div><a class="sumar anim">+ Sumar Nuevos Ejemplos</a><a class="close-note anim"><i class="fa fa-caret-up"></i></a></div>';
		append_izq += '</div><!-- notes btns -->';
		append_izq += '</div><!-- ejemplos wrapper -->';
		
		append_izq += '<div class="bibliografias-wrapper notes-group"><div class="notes-out"></div>';
		append_izq += '<div class="gradient blanco"></div>';
		append_izq += '<div class="notes-btns bibliografia">';
		append_izq += '<a class="ver-mas anim">Ver Bibliografias</a>';
		append_izq += '<div><a class="sumar anim">+ Sumar Nuevas Bibliografias</a><a class="close-note anim"><i class="fa fa-caret-up"></i></a></div>';
		append_izq += '</div><!-- notes btns -->';
		append_izq += '</div><!-- bibliografias wrapper -->';

		append_izq += '</div><!-- note wrapper -->';
		
		append_der = '<div class="note-wrapper" id="note-wrapper-der-parrafo-'+id+'" data-index="'+id+'" style="height:'+este_alt+'px; top:'+este_pos.top+'px">';
		
		append_der += '<div class="aportes-wrapper notes-group"><div class="notes-out"></div>';
		append_der += '<div class="gradient blanco"></div>';
		append_der += '<div class="notes-btns aporte">';
		append_der += '<a class="ver-mas anim">Ver Aportes</a>';
		append_der += '<div><a class="sumar anim">+ Sumar Nuevos Aportes</a><a class="close-note anim"><i class="fa fa-caret-up"></i></a></div>';
		append_der += '</div><!-- notes btns -->';
		append_der += '</div><!-- aportes wrapper -->';
		
		append_der += '<div class="ajustes-wrapper notes-group"><div class="notes-out"></div>';
		append_der += '<div class="gradient blanco"></div>';
		append_der += '<div class="notes-btns ajuste">';
		append_der += '<a class="ver-mas anim">Ver Ajustes</a>';
		append_der += '<div><a class="sumar anim">+ Sumar Nuevos Ajustes</a><a class="close-note anim"><i class="fa fa-caret-up"></i></a></div>';
		append_der += '</div><!-- notes btns -->';
		append_der += '</div><!-- ajustes wrapper -->';

		append_der += '</div><!-- note wrapper -->';
		
		//<div class="gradient blanco"></div>
		
		$("#single-wrapper .col.izq").append( append_izq );
		
		$("#single-wrapper .col.der").append( append_der );
		
		if ( index == (cant_parrafo -1 ) ){
			add_notes();
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

		if ( parent == 0 ){
		
			append_content ='<div class="note" id="'+tipo_clase+'-'+index+'">';
			append_content += '<div class="note-header"><div class="user-img"><img src="'+userImg+'" /></div>';
			append_content += '<div class="user-text"><p>Hace '+fecha+' d. por </p><p>'+autor+'</p></div></div><!-- note header -->';
			append_content += '<div class="note-content">';
			append_content += '<p>'+content+'</p>';
			append_content += '</div><!-- note content --><div class="sub-notes-wrapper"></div><!-- sub notes wrapper -->';
			append_content += '<div class="responder-wrapper"><a class="responder">'+responder_text+'</a></div><!-- responder wrapper -->';
			append_content += '</div><!-- note -->';

			$("#single-wrapper .col."+col+" #note-wrapper-"+col+"-parrafo-"+parrafo_index+".note-wrapper .notes-group."+tipo_note_wrapper+" .notes-out").append(append_content);
			
		}else{
			
			append_content = '<div class="sub-note">';
			append_content += '<div class="note-header"><div class="user-img"><img src="'+userImg+'" /></div>';
			append_content += '<div class="user-text"><p>Hace '+fecha+' d. por </p><p>'+autor+'</p></div></div><!-- note header -->';
			append_content += '<div class="note-content">';
			append_content += '<p>'+content+'</p>';
			append_content += '</div><!-- note content -->';
			append_content += '</div><!-- sub note -->';
	
			//#single-wrapper .col.izq #note-wrapper-izq-parrafo-53d1286404364.note-wrapper .ejemplos-wrapper.notes-group .notes-out #ejemplo-25.note .sub-notes-wrapper
			
			//#single-wrapper .col.izq #note-wrapper-izq-parrafo-53d1286404364.note-wrapper .notes-group.ejemplos-wrapper .notes-out #ejemplo-25.note .sub-notes-wrapper
			
			var temp = $("#single-wrapper .col."+col+" #note-wrapper-"+col+"-parrafo-"+parrafo_index+".note-wrapper .notes-group."+tipo_note_wrapper).find("#"+tipo_clase+"-"+parent+".note");
			
			temp.css('color' , 'red');
			console.log(temp.length);
			
			
			$("#single-wrapper .col."+col+" #note-wrapper-"+col+"-parrafo-"+parrafo_index+".note-wrapper .notes-group."+tipo_note_wrapper+" .notes-out #"+tipo_clase+"-"+parent+".note .sub-notes-wrapper").prepend(append_content);
		}

		
		//alert(notesArray[i]);
		
		if ( i == notesArray.length - 1 ){
			add_notes_labels();
			notes_group_alt();
		}
	}

	
}

function add_notes_labels(){
	
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
		
		$(".notes-group" ,este).addClass('alt-mitad');
		if ( cant_grupos == 1 ){
			if ( $(".notes-group" ,este).height() > este.height() ){
				$(".notes-group" ,este).addClass('alt-full');
			}
		}else if ( cant_grupos == 2 ){
			$(".notes-group" ,este).addClass('alt-mitad');
		}
    });
}

function cancel_note( elemento ){
	if ( elemento.length > 0 ){

		var este_suma = elemento.parent().parent();
		
		var notes_group = este_suma.parent().parent();
		
		if( notes_group.hasClass('noContent') ){
			notes_group.removeAttr('style');
			notes_group.parent().removeClass('desplegado');
			$(".gradient" , notes_group).fadeIn(300);
			$("#overlay-nota-desp").fadeOut(300);
			$("#overlay-nota-desp").removeClass('cancel-on');
		}
			
		  remove_current_span( true );
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
	var este_suma = este.parent().parent();
	
	var este_textarea = $(".note-content form textarea" , este_suma );
	var text = este_textarea.val();
	
	var note_wrapper = este_suma.closest('.note-wrapper');
	var notes_group = este_suma.closest('.notes-group');
	
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
		var note = $(".note" , notes_group ).not("#sumar-nota.note");
		var note_id = note.attr('id');
		note_id = note_id.replace( type+'-' , '' );
	}else{
		var child = false;
		var note_id = -1;
	}
	
	var nonce = $("#single-wrapper #nonce").attr('data-value');
	var post_id = $("#current_post_id").attr('data-value');
	
	if ( text != '' ){
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
				 'parent_id': note_id
		  },
		  success: function(data){
					   //alert(data);
					   if( data ){ 
						  //alert('Funciona');
						  
						  
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
		
		$("#overlay-nota-desp").removeClass('cancel-on');
		
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
	
		
		location.reload();
		
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
						  
						  

					   }else{
						  //alert('No Funciona');
					   }
				   },
		  error: function(){ /*alert('No funciona');*/ }
		});
	   
	}else{

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
			
			//$("span.highlighted.current-highlight").css('background-color' , '#db1347');
			$("span.highlighted.current-highlight").css('background-color' , 'transparent');
			$("span.highlighted.current-highlight").css('color' , '#db1347');
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
	var este = este_;
	if ( este.hasClass('from-highlight') ){
		$("a.sumar" , este).trigger('click');
		este.removeClass('from-highlight')
		var sumar_offset = $("a.sumar" , este).offset();
		$('html , body').animate( {scrollTop: sumar_offset.top } , 500, function() { });
	}
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