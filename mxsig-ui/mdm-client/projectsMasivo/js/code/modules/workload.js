define(function(){
	var structure = {
		user:'',
		data:{
			selected:null,
			assigned:null,
			idle:null,
			summary:null
		},
		editing:false,
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.ranks = obj.main.config.project.ranks;
		},
		//search location extent------------------------------------------------------------------
		locationExtent:function(cvegeo,func){
			var obj = this;
			if(cvegeo.indexOf('--') > -1){
				cvegeo = cvegeo.substr(0,cvegeo.indexOf('--'));	
			}
			
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/find/location/extent/'+cvegeo;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					MDM6('goCoords',data.data.extent);
					if($.isFunction(func)){
						func(data.data);
					}
				}
			});
		},
		// Workload admin ------------------------------------------------------------------
		closeWorkload:function(func){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.flag.url+'/workload/close';//server+'/'+obj.main.config.dataSource.user.workload.url+'/close';
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//New Location assign
		assignNewLocation:function(cvegeo,plancvegeo,func){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/divide/update/locations?cvegeo='+cvegeo+'&plancvegeo='+plancvegeo+'&otherlocation=true';
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.locationExtent(plancvegeo,function(data){});
					
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//Change Location
		assignLocation:function(cvegeo,plancvegeo,func,external){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			var otherLocation = external || false;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/update/locations?user='+user.user+'&cvegeo='+cvegeo+'&plancvegeo='+plancvegeo+'&otherlocation='+otherLocation;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.locationExtent(plancvegeo,function(data){});
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//Productivity--------------------------------------------------------------------------
		changeProdToSelected:function(prod,func,cvegeo){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/update/productivity?user='+user.user+'&productivity='+prod;
			if(cvegeo){
				source.url+= '&cvegeo='+cvegeo
			}
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//ABC-----------------------------------------------------------------------------------
		removeSelectedById:function(id,func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/remove/selected?user='+user.user+'&cvegeo='+id;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		removeAssignedById:function(id,func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/remove/assigned?user='+user.user+'&cvegeo='+id;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		addIdle:function(id,func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/select/idle?user='+user.user+'&cvegeo='+id;
			var params = {};//user:user.user,geom:wkt
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		addSelection:function(user,wkt,func){
			var obj = this;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/select/idle_by_geometry?user='+user.user+'&geom='+wkt;
			var params = {};//user:user.user,geom:wkt
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		remSelection:function(user,wkt,func){
			var obj = this;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/remove/selected_by_geometry?user='+user.user+'&geom='+wkt;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
			
		},
		confirmSelection:function(func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/assign/selected/?user='+user.user;
			var params = {};//user:user.user,geom:wkt
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
			
		},
		clearSelection:function(func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/clear/selected/?user='+user.user;
			var params = {};//user:user.user,geom:wkt
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		remAssigned:function(user,wkt,func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/'+alias+'/remove/assigned_by_geometry/?user='+user.user+'&geom='+wkt;
			var params = {};//user:user.user,geom:wkt
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//UI------------------------------------------------------------------------------------
		show:function(user){
			var main = this.main;
			var obj = this;
			
			obj.editing = true;
			this.user = user;
			$("#panel-right").panel('showInternal','mdmp_panel01');
			obj.createForm();
			this.contentUI();
			this.footerUI();
			this.updateHeader();
		},
		hide:function(){
			var main = this.main;
			var obj = this;
			
			obj.data.selected = null;
			obj.data.assigned = null;
			obj.data.idle = null;
			
			obj.editing = false;
			obj.main.modules.ui.reloadInterface();
			$("#panel-right").panel('hideInternal','mdmp_panel01');
			obj.main.modules.uiMap.switchAction('');
		},
		updateHeader:function(){
			var main = this.main;
			var obj = this;
		
			var user = this.user;
			obj.main.modules.users.getDataUser(user,function(data){
				obj.data.summary = data;
				var est = data.est;
				est = (est === undefined)?'':(est== null)?'0:':est+':';
				
				user.avgCharge = (data.promedio != null)?data.promedio:0;
				user.charge = (data.assigned != null)?data.assigned:0;
				user.selected = (data.selected != null)?data.selected:0;
				$('#workload_header_back').css('background-color',user.color_hex);
				$('#workload_header_name').html(user.userName);
				$('#workload_header_charge').html(est+user.charge+'/'+user.avgCharge);
				obj.updateGraph(user);

				//Boton confirmar carga
				$('#btnAssignSelection').attr('valid',((user.selected+user.charge) <= data.maximo));
				if((user.selected+user.charge) <= data.maximo){
					$('#btnAssignSelection').removeClass('mdm-bg-warning');	
				}else{
					$('#btnAssignSelection').addClass('mdm-bg-warning');		
				}
				
			});
			obj.main.modules.graph.graphUserGral().update();
			obj.main.modules.uiMap.mapRefresh(user.user);
			
		},
		updateGraph:function(user){
				 var obj = this;
				 var cadena = '';
				 var graph = [
							{id:'carga',label:'Carga',value:user.charge,max:user.avgCharge},
							//{id:'promedio',label:'Promedio',value:user.avgCharge,max:user.avgCharge},
							{id:'simulacion',label:'Simulado',value:(user.charge+user.selected),max:user.avgCharge}
						];
				 for (var x in graph){
					var item = graph[x];
					var progress = ((100/item.max)*item.value).toFixed(2);
					var msg = item.label+': '+item.value+'/'+item.max+' ('+progress+'%)';
					if($('#'+item.id+'_progress').attr('id')){
						$('#'+item.id+'_progress').attr('title',msg);
						$('#'+item.id+'_progress').css('width',progress+'%');
						$('#'+item.id+'_progress').html(item.value+'/'+item.max);
						if (progress >= 100)
							$('#'+item.id+'_progress').addClass('mdm-bg-warning');
						else
							$('#'+item.id+'_progress').removeClass('mdm-bg-warning');
						
					}else{
						var warningClass = (progress >= 100)?'mdm-bg-warning':'';
						cadena+= '<div id="'+item.id+'" class="workload-'+item.id+' cw-boxBorder" style="width:100%" title="'+msg+'">';
						cadena+= '	<div id="'+item.id+'_progress" class="workload-transition workload-'+item.id+'-progress cw-boxBorder '+warningClass+'" style="width:'+progress+'%">';
						cadena+= item.value+'/'+item.max;
						cadena+= '  </div>';
						cadena+= '</div>';
						$('#workload_header_graph').html(cadena);
					}
				 }
		},
		createForm:function(){ //obtiene usuario
			var main = this.main;
			var obj = this;
			var cadena = '<div class="workload-form">';
				cadena+= '	<div id="workload_header" class="workload-header">';
				cadena+= '		<div id="workload_header_back" class="workload-header-color" title="Volver a usuarios" alt="Volver a usuarios">';
				cadena+= '			<div class="workload-header-color workloadForm workloadForm-back"></div>';
				cadena+= '		</div>';
				cadena+= '		<div class="workload-header-info">';
				cadena+= '			<div id="workload_header_name" class="workload-header-name">';
				cadena+= '			</div>';
				cadena+= '			<div id="workload_header_graph" class="workload-header-graph">';
				cadena+= '			</div>';
				cadena+= '		</div>';
				cadena+= '		<div class="workload-header-toolBar">';
				cadena+= '			<div id="workload_header_charge" class="workload-header-charge">';
				cadena+= '			</div>';
				cadena+= '			<div id="workload_header_tool" class="workload-header-tool">';
				cadena+= '				<div title="Ver informaci&oacute;n de usuario" id="workload_header_info" class="workloadForm workloadForm-info"></div>';
				cadena+= '				<div title="Ver area de usuario" id="workload_header_zoom" class="workloadForm workloadForm-zoom"></div>';
				cadena+= '			</div>';
				cadena+= '		</div>';
				cadena+= '	</div>';
				cadena+= '	<div class="workload-header-tools">';
				cadena+= '		<div num="01" class="workload-tool workloadForm-btn workload-tool-selected workload-tool-active">';
				cadena+= '			<div class="workloadForm workloadForm-selected"></div>';
				cadena+= '			<label>Selecci&oacute;n</label>';
				cadena+= '		</div>';
				cadena+= '		<div num="02" class="workload-tool workloadForm-btn workload-tool-assigned">';
				cadena+= '			<div class="workloadForm workloadForm-assigned"></div>';
				cadena+= '			<label>Asignados</label>';
				cadena+= '		</div>';
				cadena+= '		<div num="03" class="workload-tool workloadForm-btn workload-tool-free">';
				cadena+= '			<div class="workloadForm workloadForm-free"></div>';
				cadena+= '			<label>Sin asignar</label>';
				cadena+= '		</div>';
				cadena+= '	</div>';
				cadena+= '	<div id="content_panels" class="workload-panels-content">';
				cadena+= '		<div id="content_panel01" class=" workload-content-active workload-content-panel">1</div>';
				cadena+= '		<div id="content_panel02" class="workload-content-panel">2</div>';
				cadena+= '		<div id="content_panel03" class="workload-content-panel">3</div>';
				cadena+= '	</div>';
				cadena+= '	<div class="workload-footer">';
				cadena+= '		<div id="footer_panel01" class="workload-footer-panel workload-footer-active"><div id="workload_footer_panel01"><div id="workload_sel01" class="workload-sel"></div><div id="workload_tools01" class="workload-tools"></div><div id="workload_rem01" class="workload-rem"></div></div></div>';
				cadena+= '		<div id="footer_panel02" class="workload-footer-panel" ><div id="workload_footer_panel02"><div id="workload_sel02" class="workload-sel"></div><div id="workload_rem02" class="workload-rem"></div></div></div>';
				cadena+= '		<div id="footer_panel03" class="workload-footer-panel" ><div id="workload_footer_panel03"><div id="workload_sel03" class="workload-sel"></div><div id="workload_rem03" class="workload-rem"></div></div></div>';
				cadena+= '	</div>';
				cadena+= '</div>'
			
			$('#mdmp_panel_01').html(cadena);
			
			$('.workload-tool').each(function(){
				$(this).click(function(e){
					var num = $(this).attr('num');
					$('.workload-tool-active').removeClass('workload-tool-active');
					$('.workload-content-active').removeClass('workload-content-active');
					$('.workload-footer-active').removeClass('workload-footer-active');
					
					$(this).addClass('workload-tool-active');
					$('#content_panel'+num).addClass('workload-content-active');
					$('#footer_panel'+num).addClass('workload-footer-active');
					e.stopPropagation();
					obj.main.modules.uiMap.switchAction(num);
				});
				
			});
			$('#workload_header_back').click(function(e){
				obj.hide();
				e.stopPropagation();
			});
			$('#workload_header_info').click(function(e){
				obj.main.modules.dialogs.dialogUserDetail(obj.user.user);
				e.stopPropagation();
			});
			$('#workload_header_zoom').click(function(e){
				MDM6('goCoords',obj.user.extent);
				e.stopPropagation();
			});
			
		},
		contentUI:function(user){
				var main = this.main;
				var obj = this;
			
				var user = this.user;
				var alias = main.modules.users.getUserAlias(user.user);
				var dataSource = main.config.dataSource.global;
				var service = main.config.dataSource.user.workload.url;
				var server = main.config.dataSource.server;
				var params = {limit: 20, page: 1, user: user.user};//499};
				//selected
				
				var content = '<div id="content_panel01" class="'+$('#content_panel01').attr('class')+'"></div>';
					content+= '<div id="content_panel02" class="'+$('#content_panel02').attr('class')+'"></div>';
					content+= '<div id="content_panel03" class="'+$('#content_panel03').attr('class')+'"></div>';
					
				$('#content_panels').html(content);
				
				$("#content_panel01").smartDataTable({
										  successBan:'response.success',
										  dataPos:'data',
										  postType:'GET',
										  pageParamLabel:'page',
										  stringify:false,
										  jsonXhrFields:dataSource.xhrFields,
										  searchParams:{urlData:server+'/'+service+'/'+alias+'/find/selected'},
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
													var coords = $('#content_panel01 div[idref='+id+']').attr('extent');
													MDM6('goCoords',coords);
													break;
												case 'data':
													obj.data.selected = opc;
													break;
												case 'remove':
													obj.removeSelectedById(id,function(){
														obj.refreshLists('123');
														obj.updateHeader();	
													});
													break;
												case 'productivity':
													obj.changeProdToSelected(opc,function(){
														obj.refreshLists('1');
														obj.updateHeader();
													},id);
												break;
												case 'locations':
													if(opc == '0'){ //Desea agregar una nueva localidad
														obj.main.modules.dialogs.searchLocation('workload',id,function(cvenom){
															obj.refreshLists('1');
															obj.updateHeader();
														});
													}else{
														obj.assignLocation(id,opc,function(){
															obj.refreshLists('1');
															obj.updateHeader();
														},false);
													}
												break;
											};
										  }
										});
				//Agregado de boton productividad si puede editarla
				if(obj.ranks[obj.user.rightsId].canEditProd){
					$("#content_panel01").append('<div id="btnProductividad"><img src="projects/img/btnProductividad.png"/></div>')
					$('#btnProductividad').click(function(){
							if (obj.data.selected && obj.data.selected.recordCount > 0)
								obj.main.modules.dialogs.changeProductivity();
					});
				}
				
				//Assigned						
				$("#content_panel02").smartDataTable({
										  successBan:'response.success',
										  dataPos:'data',
										  postType:'GET',
										  pageParamLabel:'page',
										  stringify:false,
										  filter:{active:true,field:'search',chartoFilter:4},
										  jsonXhrFields:dataSource.xhrFields,
										  searchParams:{urlData:server+'/'+service+'/'+alias+'/find/assigned'},
										  extraParams:params,
										  canWrite:true,
										  spinnerImg:function(ban){obj.main.modules.ui.spinner(ban); },
										  convertData:function(data){
											var tdata = data; 
											tdata.data.value = tdata.data.records;
											return tdata;
										  },
										  buttonAction:function(id,action,opc){
											switch(action){
												case 'record':
													var coords = $('#content_panel02 div[idref='+id+']').attr('extent');
													MDM6('goCoords',coords);
													break;
												case 'data':
													break;
												case 'remove':
													var isDivided = $('#content_panel02_tableContainer div[idref='+id+'][divide=true]').attr('idref');
													if(isDivided){
														obj.main.modules.dialogs.confirm('Confirmar borrado','Elemento seleccionado esta dividido, al eliminarlo se perderán las divisiones asignadas',function(){
															obj.removeAssignedById(id,function(){
																obj.refreshLists('123');
																obj.updateHeader();	
															});
														});
														
														/*if(confirm('Elemento seleccionado esta dividido, al eliminarlo se perderán las divisiones asignadas')){
															obj.removeAssignedById(id,function(){
																obj.refreshLists('123');
																obj.updateHeader();	
															});
														}*/
													}else{
														obj.removeAssignedById(id,function(){
																obj.refreshLists('123');
																obj.updateHeader();	
														});
													}
												 break;
												 case 'productivity':
													var ageb = obj.decodeId(id);
													obj.changeProductivity(id,opc,'02');
												break;
												case 'tipo':
													var ageb = obj.decodeId(id);
													obj.changeTipoLoc(id,opc);
												break;
											};
										  }
										});
				//Disponibles
				 if (user.rightsId <= 2)
					delete params.user;
					
				$("#content_panel03").smartDataTable({
										  successBan:'response.success',
										  dataPos:'data',
										  postType:'GET',
										  pageParamLabel:'page',
										  stringify:false,
										  filter:{active:true,field:'search',chartoFilter:4},
										  jsonXhrFields:dataSource.xhrFields,
										  searchParams:{urlData:server+'/'+service+'/'+alias+'/find/idle'},
										  extraParams:params,
										  canWrite:true,
										  spinnerImg:function(ban){obj.main.modules.ui.spinner(ban); },
										  convertData:function(data){
											var tdata = data; 
											tdata.data.value = tdata.data.records;
											return tdata;
										  },
										  buttonAction:function(id,action,opc){
											  
											switch(action){
												case 'record':
													var coords = $('#content_panel03 div[idref='+id+']').attr('extent');
													MDM6('goCoords',coords);
													break;
												case 'data':
													break;
												case 'add':
													obj.addIdle(id,function(){
														obj.refreshLists('123');
														obj.updateHeader();	
													});
													break;
												case 'productivity':
													
												break;
												case 'tipo':
													var ageb = obj.decodeId(id);
													obj.changeTipoLoc(id,opc);
												break;
											};
										  }
										});
				
				
		},
		refreshLists:function(opc,user){ //user opcional, si esta esta definida reemplaza el usuario local del modulo
			var main = this.main;
			var obj = this;
			if (opc.indexOf('1') >= 0 && !($("#content_panel01 .smartTableHeader").attr('id') === undefined))
				$("#content_panel01").smartDataTable("initSearch");
			if (opc.indexOf('2') >= 0 && !($("#content_panel02 .smartTableHeader").attr('id') === undefined))
				$("#content_panel02").smartDataTable("initSearch");
			if (opc.indexOf('3') >= 0 && !($("#content_panel03 .smartTableHeader").attr('id') === undefined))
				$("#content_panel03").smartDataTable("initSearch");
			var _user = user || obj.user;
			obj.main.modules.uiMap.mapRefresh(_user);
		},
		footerUI:function(){
			var main = this.main;
			var obj = this;
		
			var user = this.user;
			
			$('#workload_tools01').html(
				'<div title="Asignar elementos de la lista" id="btnAssignSelection" class="workloadForm workloadForm-ok"></div>'+
				'<div title="Limpiar elementos de la lista" id="btnClearSelection" class="workloadForm workloadForm-cancel"></div>'
			);
			
			$('#btnAssignSelection').click(function(e){
				if($(this).attr('valid') == 'true'){
					obj.confirmSelection(function(){
						obj.refreshLists('123');
						obj.updateHeader();
					});
				}else{
					obj.main.modules.dialogs.notify('Carga excedida','La selección supera la carga permitida','error');	
				}
				e.stopPropagation();
			});
			$('#btnClearSelection').click(function(e){
				obj.clearSelection(function(){
					obj.refreshLists('123');
					obj.updateHeader();
				});
				e.stopPropagation();
			});
			
			
			//Seccion de selecccion
			$("#workload_sel01").dropDownImage({sprite:'dropDownImage-plantilla',
											 buttonSide:'right',
											 map_ids:['dropDownImage-add-point','dropDownImage-add-square','dropDownImage-add-poly'],
											 index:1,
											 hightlight_color:'#eee',
											 beforeAction:function(){
												obj.main.modules.uiMap.clearCurrentAction();
											 },
											 onClear:function(){
												 obj.main.modules.uiMap.clearCurrentAction();
											 },
											 onAction:function(status,id){
												if (typeof(id) == 'string'){
													obj.main.data.module = 'selection';
													if (status) 
														obj.main.modules.uiMap.switchAction(id)
													else
														obj.main.modules.uiMap.switchAction('');
													
												}
											  }
											 });
			$("#workload_rem01").dropDownImage({sprite:'dropDownImage-plantilla',
											 buttonSide:'right',
											 map_ids:['dropDownImage-rem-point','dropDownImage-rem-square','dropDownImage-rem-poly'],
											 index:1,
											 hightlight_color:'#eee',
											 beforeAction:function(){
												obj.main.modules.uiMap.clearCurrentAction();
											 },
											 onClear:function(){
												 obj.main.modules.uiMap.clearCurrentAction();
											 },
											 onAction:function(status,id){
												if (typeof(id) == 'string'){
													obj.main.data.module = 'selection';
													if (status) 
														obj.main.modules.uiMap.switchAction(id)
													else
														obj.main.modules.uiMap.switchAction('');
												}
											  }
											 });
			
			//Seccion de asignados
			$("#workload_rem02").dropDownImage({sprite:'dropDownImage-plantilla',
											 buttonSide:'right',
											 map_ids:['dropDownImage-rem-point','dropDownImage-rem-square','dropDownImage-rem-poly'],
											 index:1,
											 hightlight_color:'#eee',
											 beforeAction:function(){
												 obj.main.modules.uiMap.clearCurrentAction();
											 },
											 onClear:function(){
												 obj.main.modules.uiMap.clearCurrentAction();
											 },
											 onAction:function(status,id){
												if (typeof(id) == 'string'){
													obj.main.data.module = 'assigned';
													if (status) 
														obj.main.modules.uiMap.switchAction(id)
													else
														obj.main.modules.uiMap.switchAction('');
												}
											  }
											 });
		}
	}
	return structure;
});