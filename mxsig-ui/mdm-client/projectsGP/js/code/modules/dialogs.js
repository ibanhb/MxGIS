define(function(){
	return{
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
		},
		confirm:function(title,text,func,height){
			var obj = this;
			height = height || 200;
			
			var _cadena = '<blockquote><h3>'+text+'</h3></blockquote>';
			var opciones ={
						 modal:true,
						 width:350,
						 height:height,
						 buttons:{
							"Aceptar": function() {
								if($.isFunction(func))
									func();
								$( this ).dialog( "close" );
							},
							"Cancelar": function() {
								  $( this ).dialog( "close" );
							}
						  }
						}
		  var dialog = obj.asDialog(title,_cadena,opciones);
		},
		gralDialog:function(title,cadena,func){
			var obj = this;
			var opciones ={
						 modal:true,
						 width:600,
						 height:400,
						 buttons:{
							"Aceptar": function() {
									if($.isFunction(func)){
										func();
									}	
									$( this ).dialog( "close" );
							},
							"Cancelar": function() {
								  $( this ).dialog( "close" );
							}
						  }
						}
		  var dialog = obj.asDialog(title,cadena,opciones);	
		},
		searchLocation:function(type,terreno,func){
			var obj = this;
			var cadena = '';
			cadena = '<div class="location-search-cotainer">';
			cadena+= 	'<span class="mdmp_plantilla mdmp_plantilla_viewHome"></span><label>Introdusca almenos 5 digitos de la clave de la localidad que desea buscar</label>';
			cadena+= 	'<div><input id="input_search_location" placeholder="Buscar localidad" type="text" /></div>';
			cadena+= '</div>';
	
			var opciones ={
						 modal:true,
						 width:260,
						 height:150,
						 buttons:{
							 
							"Aceptar": function() {
								if($('#input_search_location').val() != '' &&  //no se permite casillas vacias en captura
								   $('#input_search_location').attr('svalue') && //debio de haber seleccionado un elemento de la busqueda
								   $('#input_search_location').attr('svalue') != '' && //la seleccion de la busqueda no puede ser un elemento vacio
								   $('#input_search_location').val() == $('#input_search_location').attr('svalue')){//lo seleccionado con lo que existe en la casilla debe coincidir
										var cvegeo = $('#input_search_location').val();
										if(type == 'division'){
											obj.main.modules.workload.assignNewLocation(terreno,cvegeo,function(){
												if($.isFunction(func)){
													func(cvegeo);
												}	
											});
										}else{
											obj.main.modules.workload.assignLocation(terreno,cvegeo,function(){
												if($.isFunction(func)){
													func(cvegeo);
												}	
											},true);
										}
										//$("#tempColorSelector").('destroy');
										$( this ).dialog( "close" );
								   }else{
										obj.modules.dialogs.notify('Selección de localidad','Favor de buscar y seleccionar una localidad','system');   
								   }
							},
							"Cancelar": function() {
								  $( this ).dialog( "close" );
							}
						  }
						}
		  var dialog = obj.asDialog('Busque una localidad ',cadena,opciones);	
		  
		  obj.main.modules.division.captureLocation($('#input_search_location'));
		  		  
		},
		changeProductivity:function(func){
			var obj = this;
			var user = obj.main.modules.workload.user;
			var data = obj.main.modules.workload.data.selected;
			
			
			
			
			var _cadena = '<div id="mdmp_changeProductivity" ></div>';
			var opciones ={
						 modal:true,
						 width:350,
						 height:350,
						 buttons:{
							"Aceptar": function() {
								var prod = $('#selectprod option:selected').val();
								obj.main.modules.workload.changeProdToSelected(prod,function(){
									obj.main.modules.workload.refreshLists('1');
									obj.main.modules.workload.updateHeader();
								});
								$( this ).dialog( "close" );
							},
							"Cancelar": function() {
								  $( this ).dialog( "close" );
							}
						  }
						}
		  var dialog = obj.asDialog('Cambiar productividad a seleccion',_cadena,opciones);
		  
		  //contenido interno
		  var listPos = [{val:'1',label:'Minima'},
						 {val:'2',label:'Minima Media'},
						 {val:'3',label:'Media'},
						 {val:'4',label:'Media Maxima'},
						 {val:'5',label:'Máxima'}];
						 
		  var cadena = '';
			  for(var x in listPos){
					var val = listPos[x];
					cadena+= '	<option id="prod_'+val.val+'" value="'+val.val+'" '+((x == 0)?'selected="selected"':'')+'>'+val.label+'</option>';
			  }
			  cadena = '<select id="selectprod" class="changeprod" size="6">'+cadena+'</select>';
			  cadena = 	 '<h4>Seleccione la productividad a asignar a los '+data.recordCount+' elementos contenidos dentro de la selección.</h4>'+cadena;
		  
		  $('#mdmp_changeProductivity').html(cadena);
		}
		,
		changeColor:function(user){
			var obj = this;
			var user = obj.main.modules.users.getUser(user);
			var currentUser = obj.main.modules.users.getIndexUser();
			var colors = obj.main.modules.users.getChildColors(currentUser);
			
			var cadena = '<div id="mdmp_changeColor" ></div>';
			var selectedColor = user.color_hex;
			var opciones ={
						 modal:true,
						 baseColors:['green', 'blue', 'yellow', 'orangered', 'deeppink', 'darkred'],
						 width:260,
						 height:400,
						 buttons:{
							"Aceptar": function() {
								obj.main.modules.users.changeColor(user.user,selectedColor,function(){
									obj.main.modules.users.loadUser(currentUser);	
								});
								//$("#tempColorSelector").('destroy');
								$( this ).dialog( "close" );
							},
							"Cancelar": function() {
								  $( this ).dialog( "close" );
							}
						  }
						}
		  var dialog = obj.asDialog('Cambiar color a usuario '+user.userName,cadena,opciones);
		  $('#mdmp_changeColor').colorSelector({
				markedColors:colors,
				colorAction:function(color){
					selectedColor = color;
				}
			});
		},
		changeUserName:function(data){
			var obj = this;
			var currentuser = obj.main.modules.users.getIndexUser();
			var user = obj.main.modules.users.getUser(data);
			var list = currentuser.childlist;
			var listPos = [1,2,3,4,5,6];
			if (list){
				for(var x in list){
					var item = list[x];
					var username = item.userName.substring(item.userName.length-2,item.userName.length);
					var num = parseInt(username,10);
					var pos = listPos.indexOf(num);
					if(pos > -1){
						listPos.splice(pos,1);	
					}
				}
			}

			var cadena = '';
			for(var x in listPos){
				var val = listPos[x];
				cadena+= '	<option id="'+val+'" value="'+val+'" '+((cadena=='')?'selected="selected"':'')+'>0'+val+'</option>';
			}
			cadena = '<select id="selectname_selector" class="changename-select" size="5">'+cadena+'</select>';
	
			var opciones ={
						 modal:true,
						 width:260,
						 height:325,
						 buttons:{
							"Aceptar": function() {
								var newName = parseInt($('#selectname_selector option:selected').val(),10);
								obj.main.modules.users.changeName(user.user,newName);
								$( this ).dialog( "close" );
							},
							"Cancelar": function() {
								  $( this ).dialog( "close" );
							}
						  }
						}
		  var dialog = obj.asDialog('Nuevo numero para '+user.userName,cadena,opciones);	
			
		},
		//-----------------------Cierre de sesión-------------------------------------
		logSession:function(text){
			var main = this.main;
			var obj = this;

			var mttoMsg = '<div style="float:left;width:100%;font-size:150%">'+main.config.proyName+'</div></br>';
				mttoMsg+= '<div style="float:left;" class="'+((text)?'':'mdmp_plantilla mdmp_plantilla_timeout_big')+'"></div>';
				mttoMsg+= '<label style="float:left;">'+((text)?text:'Su sesi&oacute;n ha expirado')+'</label>';
				mttoMsg+= '<button id="mdmp_mtto_reload" style="margin-left: 43px;">Volver a sistema</button>';
			var mttoActive = ($('#mdmp_mtto').attr('id') === undefined)?false:true;
			if (!mttoActive){
				main.loggedIn=false;
				var cadena = '<div style="font-size:135%;position:absolute; top:50%; height:1px; width:100%">';
					cadena+= '		<div style="margin-left:auto; margin-right:auto; width:1px;">';
					cadena+= '			<div id="mdmp_mtto" class="mdmp_mtto_form">';
					cadena+= '			<img src="projects/img/logo-gris.jpg" class="img"/>';
					cadena+= 			'<center>'+mttoMsg+'</center>';
					cadena+= '			</div>';
					cadena+= '		</div>';
					cadena+= '</div>';
				
				$('body').html(cadena);
			}else{
				$('#mdmp_mtto').html(mttoMsg);		
			}
			$('#mdmp_mtto_reload').click(function(){
				location.reload();
			});
			
		},
		//base dialogos
		asDialog:function(title,content,options){
			var r = null;
			$(function() {
				var today       = new Date();
				var time        = today.getTime();
				var seconds = today.getSeconds(); 
				var semilla     = Math.floor(Math.random()*10000);
				var serie =seconds+''+semilla;
				
				var cadena = '<div id="'+serie+'" title="'+title+'">'+content+'</div>';
				$('body').append(cadena);
				$( "#"+serie ).dialog({
				  resizable: false,
				  height:(typeof(options.height) != 'undefined')?options.height:250,
				  width:(typeof(options.width) != 'undefined')?options.width:230,
				  modal: (typeof(options.modal) != 'undefined')?options.modal:true,
				  buttons:(typeof(options.buttons) != 'undefined')?options.buttons:{},
				  close: function(ev, ui){ $(this).remove();if($.isFunction(options.close)){options.close()}}
				});
				r = $( "#"+serie );
				//   buttons:{
				//	"Delete all items": function() {
				//	  $( this ).dialog( "close" );
				//	},
				//	Cancel: function() {
				//	  $( this ).dialog( "close" );
				//	}
				//  }
			});
			return r;
		},
		notify:function(title,text,type,info){
			var tmessage = {
							warning:'awesome ok',
							error:'awesome error',
							notification:'awesome ok',
							system:'awesome blue',
							};
							
				icons = {
							warning:'fa fa-warning',
							error:'fa fa-error',
							notification:'fa fa-notification',
							system:'fa fa-notification',
						}
							
			icon = icons[type];
			type = tmessage[type];
			info = info || '';
			var _ob = {
						content:{
							title:title,
							message:text,
							info:info,
							delay:5500,
							icon:icon
						},
						position:'top right',
						outEffect:'slideTop',
						inEffect:'slideTop',
						theme:type
					};
			
			if (info == '')
				delete _ob.info;
			
			$.amaran(_ob);
			
		}	
		
	}
});