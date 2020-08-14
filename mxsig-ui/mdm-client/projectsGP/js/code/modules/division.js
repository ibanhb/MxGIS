define(function(){
	return{
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.ranks = obj.main.config.project.ranks;
			obj.config = obj.main.config;
		},
		currentData:{
		},
		data:{
		},
		currentCharges:{},
		show:function(data){
			var obj = this;
			obj.user = obj.main.modules.users.getIndexUser();
			obj.main.modules.graph.graphUserGral().close();
			//resetData
			obj.createUI();
		  	obj.main.modules.uiMap.clearCurrentAction();
		},
		hide:function(message){
			var obj = this;
			var main = this.main;
			
				obj.main.modules.ui.reloadInterface();
			obj.editing = false;
			
			obj.main.modules.uiMap.clearCurrentAction();
		},
		createUI:function(){
			var obj = this;
			var btnAccept = false;
			var cadena = '<div class="division-container">';
				cadena+= '	<div class="division-panel-title"><big>Productores</big>';
				cadena+= '	</div>';
				cadena+= '	<div class="division-panel-title"><big>Entrevistadores</big>';
				cadena+= '	</div>';
				cadena+= '	<div id="division_panel1" class="division-panel">';
				cadena+= '		<div class="division-list">';
				cadena+= '			<div id="division_productores">';
				cadena+= '			</div>';
				cadena+= '		</div>';
				cadena+= '		<div class="division-list list-entrevistadores">';
				cadena+= '			<div id="division_entrevistadores">';
				cadena+= '			</div>';
				cadena+= '		</div>';
				cadena+= '	</div>';
				cadena+= '	<div id="division_panel2" class="division-panel" style="display:none"></div>';
				cadena+= '</div>'; 
			
			//----------------------inerta ventana de dialogo -------------------
			var opciones ={
						 modal:true,
						 width:800,
						 height:500,
						 close:function(){
							if(!btnAccept){
								obj.cancelLocationDivision();
							}
						 },
						 buttons:{
							"Aceptar": function() {
									obj.acceptLocationDivision(function(){
										btnAccept = true;
										obj.dialog.dialog( "close" );
									});
							},
							"Cancelar": function() {
								  $( this ).dialog( "close" );
							}
						  }
						}
		  	obj.dialog = obj.main.modules.dialogs.asDialog('Dividir localidad '+obj.currentData.cvegeo,cadena,opciones);
			
			//imprime Usuarios en contenedor
			obj.printUsersList(obj.user);
			
			var currentData = obj.currentData;

			var user = obj.user;
			var dataSource = obj.config.dataSource.global;
			var service = obj.config.dataSource.user.workload.url;
			var server = obj.config.dataSource.server;
			var params = {cvegeo:currentData.cvegeo,limit: 20, page: 1};//499};
			//selected
			
			$("#division_productores").smartDataTable({
									  successBan:'response.success',
									  dataPos:'data',
									  postType:'GET',
									  pageParamLabel:'page',
									  stringify:false,
									  jsonXhrFields:dataSource.xhrFields,
									  searchParams:{urlData:server+'/'+service+'/egp/divide/find/producer'},
									  extraParams:params,
									  canWrite:true,
									  filter:{active:true,field:'search',chartoFilter:4},
									  spinnerImg:function(ban){obj.main.modules.ui.spinner(ban); },
									  convertData:function(data){
										var tdata = data; 
										tdata.data.value = tdata.data.records;
										return tdata;
									  },
									  buttonAction:function(id,action,opc){
										  
										switch(action){
											case 'record':
												/*var coords = $('#content_panel01 div[idref='+id+']').attr('extent');
												MDM6('goCoords',coords);*/
												break;
											case 'data':
												obj.data.selected = opc;
												break;
											case 'add':
												var totalProd = parseInt($('#division_productores div[idref='+id+']').attr('total'),10);
												obj.assignProducerToUser(opc,totalProd,function(){
													obj.refreshLists();	
												});
											break;
											case 'divide':
												var totalProd = parseInt($('#division_productores div[idref='+id+']').attr('total'),10);
												obj.divideProductor(opc,totalProd);
											break;
										};
									  }
									});
		},
		printUsersList:function(user){
			var obj = this;
			var cadena = '';
			//inicia el proceso de carga de todos los usuarios con los datos actuales
			var users = obj.main.modules.users.getIndexUser().childlist;
			var cadena = '';
			for(var x in users){
				var user = users[x];
				
				cadena+= '	<div id="division_user_'+user.user+'" idref="'+user.user+'" class="division-list-item">';
				cadena+= '		<div class="division-list-item-color" style="border-left:4px solid '+user.color_hex+'"><span class="division-charge">...</span></div>';
				cadena+= '		<div class="division-list-item-content">';
				cadena+= '			<div><span class="division-list-item-name">'+user.alias+' '+user.userName+'</span></div>';
				cadena+= '			<div class="division-list-item-gauge"><div class="division-list-item-gauge-progress" style="width:0%;background-color:'+user.color_hex+'"></div></div>';
				cadena+= '		</div>';
				cadena+= '		<div class="division-list-item-edit"><span idref="'+user.user+'" title="Editar Carga" class="edit-division widget_userList userList-big-edit"></span>';
				cadena+= '		</div>';
				cadena+= '	</div>';
					
			}
			$('#division_entrevistadores').html(cadena);
			$('.edit-division').click(function(e){
				var idref = $(this).attr('idref');
				obj.viewChargeEditor(idref);
				e.stopPropagation();
			});
			$('.division-list-item').each(function(index, element) {
					$(this).click(function(e) {
						var idref = $(this).attr('idref');
						obj.currentData.child = obj.main.modules.users.getUser(idref);
						
						$('#division_productores').attr('userselected',true);
						
						$('.division-list-item.selected').removeClass('selected');
						$(this).addClass('selected');
						$('#division_footer').attr('userselected','true');
					});    
			});
			obj.updateAllCharges();
			//.division-charge #carga#
			//.division-list-item-gauge-progress #width progress#

		},
		updateAllCharges:function(){
			var obj = this;
			var list = obj.main.modules.users.getIndexUser().childlist;
			obj.currentCharges = {};
			for(var x in list){
				obj.updateViewCharge(list[x]);	
			}
		},
		updateViewCharge:function(user){
			var obj = this;
			obj.main.modules.users.getDataUser(user,function(data){ //obtiene datos del usuario desde servicio
				var item = data;
				var user = data.user.user;
				var max = item.maximo;
				obj.currentCharges[user] = data;
				
				var selected = (obj.currentData.child)?(obj.currentData.child.user == item.user.user)?' selected ':'':'';
				var progress =(100/max)*(item.selected+item.assigned);
				var charge = (item.selected+item.assigned).ceil(4);
				$('#division_user_'+user+' .division-charge').html(charge);
				$('#division_user_'+user+' .division-list-item-gauge-progress').css('width',progress+'%');
			});
		},
		refreshLists:function(){ //user opcional, si esta esta definida reemplaza el usuario local del modulo
			var main = this.main;
			var obj = this;
			if (!($("#division_productores .smartTableHeader").attr('id') === undefined))
				$("#division_productores").smartDataTable("initSearch");
			
			if (!($("#viewcharge_division_list .smartTableHeader").attr('id') === undefined))
				$("#viewcharge_division_list").smartDataTable("initSearch");
				
			obj.updateAllCharges();
		},
		divideProductor:function(prod,total){
			var obj = this;
			var btnAccept = false;
			var chargeValid = false;
			var proccessUsers = [];
			var processCount = [];
			var list = obj.main.modules.users.getIndexUser().childlist;
			var ranks = obj.ranks;
				
				
			var cadena = '<div id="productor_division_total" class="productor-division-total">0/'+total+'</div>';
				cadena+= '<div class="productor-division">';
				for(var x in list){
					var item = obj.currentCharges[list[x].user];
					var user = item.user;
					var max = item.maximo;
					var selected = (obj.currentData.child)?(obj.currentData.child.user == item.user)?' selected ':'':'';
					var progress =(100/max)*item.assigned;
					var charge = item.assigned;
					
					cadena+= '	<div idref="'+user.user+'" class="divisionProd-list-item '+selected+'">';
					cadena+= '		<div class="divisionProd-list-item-color" style="border-left:4px solid '+user.color_hex+'"><span>'+charge+'</span></div>';
					cadena+= '		<div class="divisionProd-list-item-content">';
					cadena+= '			<div><span class="divisionProd-list-item-name">'+user.alias+' '+user.userName+'</span></div>';
					cadena+= '			<div class="divisionProd-list-item-gauge"><div class="divisionProd-list-item-gauge-progress" style="width:'+progress+'%;background-color:'+user.color_hex+'"></div></div>';
					cadena+= '		</div>';
					cadena+= '		<div class="divisionProd-list-item-edit"><input type="text" idref="'+user.user+'" class="divide-input" placeholder="0"/></span>';
					cadena+= '		</div>';
					cadena+= '	</div>';
				}
				cadena+= '</div>'; 
			
			//----------------------inerta ventana de dialogo -------------------
			var opciones ={
						 modal:true,
						 dialogClass: "no-close",
						 width:400,
						 height:500,
						 close:function(){
							 if(!btnAccept){
								 
							 }
						 },
						 buttons:{
							"Aceptar": function() {
								btnAccept = true;
								saveCharges();
							},
							"Cancelar": function() {
								$( this ).dialog( "close" );
							}
						  }
						}
		  	
			
			
			var saveCharges = function(){
					if(chargeValid){
						var values = [];
							$('.divide-input').each(function(index, element) {
								var val = ($(this).val()=='')?0:parseInt($(this).val(),10);
								var idref = $(this).attr('idref');
								if(val > 0){
									values.push({user:idref,value:val})	
								}
							});	
							processUsers = values;
							for(var x in values){
								var val = values[x];
								obj.assignProducerToUser(prod,val.value,function(data){
									processCount.push(data);
									if(processCount.length == processUsers.length){
										obj.refreshLists();		
										obj.productorDialog.dialog( "close" );
									}
								},val.user); //es una division de carga
							}
					}else{
						obj.main.modules.dialogs.notify('Error en cantidad asignada','La cantidad distribuida debe ser igual a el total del productor','warning');		
					}
				};
			
			
			var checkValues = function(){
				var sum = 0;
				$('.divide-input').each(function(index, element) {
					var val = ($(this).val()=='')?0:parseInt($(this).val(),10);
					sum+= val;
				});
				$('#productor_division_total').html(sum+'/'+total);
				if(sum == total){
					chargeValid = true;	
				}else{
					chargeValid = false;	
				}
			}
			
			//-----------------------------------------------------------------------------------
			obj.productorDialog = obj.main.modules.dialogs.asDialog('Dividir Productor '+prod,cadena,opciones);
			//---------------------------------------------------------------------------------
			
			$('.divide-input').each(function(index, element) {
                $(this).inputNumber({onChange:function(val){
					checkValues();
				}});
            });
			
				
		},
		viewChargeEditor:function(idEditor){
			var obj = this;
			var user = obj.main.modules.users.getUser(idEditor);
			obj.currentData.editingUserCharge = user;
			var list = obj.currentData.userList;
			var ranks = obj.ranks;
				
				
			var cadena = '<div id="viewcharge_division" class="viewcharge-division">';
				cadena+= '	<div id="viewcharge_division_list"></div>';
				cadena+= '</div>'; 
			
			//----------------------inerta ventana de dialogo -------------------
			var opciones ={
						 modal:true,
						 dialogClass: "no-close",
						 width:400,
						 height:500,
						 buttons:{
							"Cerrar": function() {
								$( this ).dialog( "close" );
							}
						  }
						}
			obj.viewCharge = obj.main.modules.dialogs.asDialog('Carga dividida de '+user.userName,cadena,opciones);
			//---------------------------------------------------------------------------------
			
			var dataSource = obj.config.dataSource.global;
			var service = obj.config.dataSource.user.workload.url;
			var server = obj.config.dataSource.server;
			var params = {user:user.user,cvegeo:obj.currentData.cvegeo,limit: 10, page: 1};//499};
			//selected
			
			$("#viewcharge_division_list").smartDataTable({
									  successBan:'response.success',
									  dataPos:'data',
									  postType:'GET',
									  pageParamLabel:'page',
									  stringify:false,
									  jsonXhrFields:dataSource.xhrFields,
									  searchParams:{urlData:server+'/'+service+'/egp/divide/find/workload'},
									  extraParams:params,
									  canWrite:true,
									  filter:{active:true,field:'search',chartoFilter:4},
									  spinnerImg:function(ban){obj.main.modules.ui.spinner(ban); },
									  convertData:function(data){
										var tdata = data; 
										tdata.data.value = tdata.data.records;
										return tdata;
									  },
									  buttonAction:function(id,action,opc){
										  
										switch(action){
											case 'record':
												/*var coords = $('#content_panel01 div[idref='+id+']').attr('extent');
												MDM6('goCoords',coords);*/
												break;
											case 'data':
												obj.data.selected = opc;
												break;
											case 'remove':
												var user = obj.currentData.editingUserCharge;
												var totalProd = parseInt($('#viewcharge_division_list div[idref='+id+']').attr('total'),10);
												obj.removeProducerFromUser(user,opc,totalProd);
											break;
										};
									  }
									});
			
				
		},
		//Base de Datos------------------------------------------------------------------------------------------------------
		//reviza que el area se pueda dividir
		cancelLocationDivision:function(func){
			var obj = this;
			var user = obj.main.modules.users.getIndexUser();
			var data = obj.currentData;
			
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/egp/divide/cancel/producer?cvegeo='+data.cvegeo;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func))
						func();
				}
			});

		},
		acceptLocationDivision:function(func){
			var obj = this;
			var user = obj.main.modules.users.getIndexUser();
			var data = obj.currentData;
			
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/egp/divide/accept/producer?cvegeo='+data.cvegeo;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func))
						func();
				}
			});

		},
		checkForDivision:function(wkt,func){
			var obj = this;
			var user = obj.main.modules.users.getIndexUser();
			var rank = obj.ranks[user.rightsId];
			if(rank.canCut && user.childlist.length > 0){ //solo el jefe de entrevistador puede dividir
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/egp/find/cvegeo?geom='+wkt;
				var params = {};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						obj.currentData = data.data.location;
						obj.show();
					}
				});
			}
		},
		removeProducerFromUser:function(user,idProd,totalProd){
			var obj = this;
			var data = obj.currentData;
			
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/egp/divide/remove/producer?user='+
								user.user+'&cvegeo='+data.cvegeo+'&num_prod='+idProd+'&total_plan='+totalProd;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.refreshLists();
				}
			});
		},
		assignProducerToUser:function(idProd,totalProd,func,charge){
			var obj = this;
			var data = obj.currentData;
			if(obj.currentData.child || charge){
				var user = (!charge)?obj.currentData.child:obj.main.modules.users.getUser(charge); //charge trae el usuario de la carga dividida
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/egp/divide/add/producer?user='+
									user.user+'&cvegeo='+data.cvegeo+'&num_prod='+idProd+'&total_plan='+totalProd+'&divide='+((charge)?'true':'false');
				var params = {};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						if($.isFunction(func)){
							func(data);
						}
					}
				});
			}else{
				obj.main.modules.dialogs.notify('Seleccione entrevistador','Debe seleccionar un entrevistador, para asignarle al productor','warning');	
			}
		},
	}
	
});