define(function(){
	var _obj = {
			init:function(main){
				var obj = this;
				obj.main = main;
				obj.data = obj.main.data;
				obj.ranks = obj.main.config.project.ranks;
			},
			currentWeek:0,
			currentData:{
			},
			divisionData:{
				
			},
			editing:false,
			//Weeks Admin----------------------------------------------------------------------
			checkForDivision:function(wkt,func){
				var obj = this;
				var user = obj.main.modules.users.getIndexUser();
				var rank = obj.ranks[user.rightsId];
				if(rank.canCut && user.childlist.length > 0){ //solo el jefe de entrevistador puede dividir
					var source = $.extend({},obj.main.config.dataSource.global);
					var server = obj.main.config.dataSource.server;
					source.url = server+'/'+obj.main.config.dataSource.user.week.url+'/find?geom='+wkt+'&user='+obj.user.user;
					var params = {};
					obj.main.getData(source,params,function(data){
						if(data.response.success){
							obj.main.modules.uiMap.clearCurrentAction();
							obj.currentData.cutWeek = data.data.location;
							obj.showCutWeek(data.data.location);
						}
					});
				}
			},
			showCutWeek:function(loc){
				var obj = this;
				obj.divisionData = loc;
			
				var total = loc.total_plan;
				var cvegeo = loc.cvegeo;
				var user = obj.user;
				
				var btnAccept = false;
				var chargeValid = false;
				var proccessUsers = [];
				var processCount = [];
				var list =  $.extend([],obj.main.config.project.weeks);
				var ranks = obj.ranks;
					
					
				var cadena = '<div id="productor_division_total" class="productor-division-total">0/'+total+'</div>';
					cadena+= '<div class="productor-division">';
					for(var x in list){
						var item = list[x];
						cadena+= '	<div idref="'+user.user+'" class="divisionProd-list-item">';
						cadena+= '		<div class="week-list-item-color" style="border-left:4px solid '+item.color+'"><span>'+item.id+'</span></div>';
						cadena+= '		<div class="divisionProd-list-item-content">';
						cadena+= '			<div><span class="divisionProd-list-item-name">Semana</span></div>';
						cadena+= '		</div>';
						cadena+= '		<div class="divisionProd-list-item-edit"><input type="text" week="'+item.id+'" idref="'+user.user+'" class="divide-input" placeholder="0"/></span>';
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
									var week = parseInt($(this).attr('week'),10);
									if(val > 0){
										values.push({user:idref,carga:val,semana:week,cvegeo:cvegeo});	
									}
								});	
								obj.saveWeekDivision(values,function(){
									obj.weekDialog.dialog( "close" );
									obj.show(obj.user);
								});
								
						}else{
							obj.main.modules.dialogs.notify('Error en cantidad asignada','La cantidad distribuida debe ser igual a el total','warning');		
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
				obj.weekDialog = obj.main.modules.dialogs.asDialog('Dividir localidad :'+cvegeo,cadena,opciones);
				//---------------------------------------------------------------------------------
				
				$('.divide-input').each(function(index, element) {
					$(this).inputNumber({onChange:function(val){
						checkValues();
					}});
				});
				
					
			},
			closeWeek:function(func){
				var obj = this;
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.flag.url+'/week/close';//server+'/'+obj.main.config.dataSource.user.workload.url+'/close';
				var params = {};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						if($.isFunction(func)){
							func(data.data.value);
						}
					}
				});
			},
			//Database-----------------------------------
			saveWeekDivision:function(list,func){
				var obj = this;
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.week.url+'/set/divide';
				var params = list;
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						if($.isFunction(func))
							func(data);
					}
				});
			},
			getWeekCharges:function(func){  //regresa la carga de todas las semanas del entrevistador
				var obj = this;
				var user = obj.user;
				var parent = obj.main.modules.users.getParentUser(user);
				
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.week.url+'/find/workload';
				var params = {user:obj.user.user};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						if($.isFunction(func))
							func(data);
					}
				});
			},
			selectById:function(id){
				var obj = this;
				var user = obj.user;
				var parent = obj.main.modules.users.getParentUser(user);
				
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.week.url+'/set/mzn/id';
				var params = {user:obj.user.user,cvegeo:id,week:obj.currentWeek};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						obj.refreshLists('12');
						obj.printWeekCharges();
					}
				});
			},
			remById:function(id){
				var obj = this;
				
				var user = obj.user;
				var parent = obj.main.modules.users.getParentUser(user);
				
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.week.url+'/remove/mzn/id';
				var params = {user:obj.user.user,cvegeo:id,week:obj.currentWeek};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						obj.refreshLists('12');
						obj.printWeekCharges();
					}
				});
			},
			selectByGeom:function(wkt){
				var obj = this;
				
				var user = obj.user;
				var parent = obj.main.modules.users.getParentUser(user);
				
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.week.url+'/set/mzn';
				var params = {user:obj.user.user,superior:parent.user,geom:wkt,week:obj.currentWeek};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						obj.refreshLists('12');
						obj.printWeekCharges();
					}
				});
			},
			remByGeom:function(wkt){
				var obj = this;
				
				var user = obj.user;
				var parent = obj.main.modules.users.getParentUser(user);
				
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.week.url+'/remove/mzn';
				var params = {user:obj.user.user,superior:parent.user,geom:wkt,week:obj.currentWeek};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						obj.refreshLists('12');
						obj.printWeekCharges();
					}
				});
			},
			//Control UI -----------------------------------------------------------------------
			show:function(user){
				var obj = this;
				obj.editing = true;
				this.user = user;
				$("#panel-right").panel('showInternal','mdmp_panel02');
				obj.createWeekList();
				
				obj.main.modules.uiMap.mapRefresh(obj.user.user);
				
				/*
				this.contentUI();
				this.footerUI();
				this.updateHeader();
				*/
			},
			hide:function(){
				var main = this.main;
				var obj = this;
				obj.editing = false;
				$("#panel-right").panel('hideInternal','mdmp_panel02');
				obj.main.modules.uiMap.mapRefresh(obj.user.user);
				obj.main.modules.uiMap.clearCurrentAction();
				obj.main.modules.ui.reloadInterface();
				/*obj.data.selected = null;
				obj.data.assigned = null;
				obj.data.idle = null;
				
				obj.editing = false;
				obj.main.modules.ui.reloadInterface();
				
				obj.main.modules.uiMap.switchAction('');*/
			},
			

			showWeekCharge:function(week){
				var obj = this;
				obj.currentWeek = week;
				$("#panel-right").panel('showInternal','mdmp_panel03',true);
				obj.createFormCharge();
			},
			hideWeekCharge:function(){
				var obj = this;
				obj.currentWeek = 0;
				$("#panel-right").panel('hideInternal','mdmp_panel03');
				obj.main.modules.uiMap.clearCurrentAction();
			},
			createWeekList:function(){
				var main = this.main;
				var obj = this;
				var user = obj.user;
				
				var cadena = '<div id="week_list_header" class="week-list-header">';
					cadena+= '	<div id="week_list_back" class="workloadForm workloadForm-back" style="background-color:'+user.color_hex+'"></div>';
					cadena+= '  <div class="week-list-header-content">';
					cadena+= '		<div class="week-list-header-name"><big>Planeación Semanal</big></br><b>'+user.alias+'</b></br>'+user.userName+'</div>';
					cadena+= '		<div class="week-header-btns"><div id="week_btnCut" title="Dividir" class="mdmp_plantilla mdmp_plantilla_cut"></div><div id="week_list_header_charge" class="week-list-header-charge"></div></div>';
					cadena+= '	</div>';
					cadena+= '</div>';
				
				
					cadena+= '<div id="week_list_container" class="week-list-container">';
					cadena+= '</div>';
				
				
				$('#mdmp_panel_02').html(cadena);
				$('#week_list_back').click(function(){
					obj.hide();
				});
				
				$('#week_btnCut').click(function(){
					obj.main.data.module = 'cutWeek';
					obj.main.modules.uiMap.switchAction('workload-mzn-point-cut');
				});
				
				obj.printWeekCharges(); //invoca la carga de los totales semanales
				
			},
			printWeekCharges:function(){
				var obj = this;
				obj.getWeekCharges(function(data){
					data = data.data;
					var weeks = $.extend([],obj.main.config.project.weeks);
					
					for(var x in weeks){
						weeks[x].workload = 0;	
					}
					
					var cadena = '';
					var max = data.maxChargueWeek;
					
					var dataWeeks = data.value;
					var sum = 0;
					for(var x in dataWeeks){
						var item = dataWeeks[x];
						weeks[item.week-1].workload = item.workload;	
						sum+=item.workload;
					}
					
					for(var x in weeks){
						var item = weeks[x];
						var charge = item.workload || 0;
						var progress = (100/max)*charge;
						
						cadena+= '	<div idref="'+(parseInt(x)+1)+'" class="week-list-item">';
						cadena+= '		<div class="week-list-item-color" style="background-color:'+item.color+'"><span>'+item.id+'</span></div>';
						cadena+= '		<div class="week-list-item-content">';
						cadena+= '			<div><span class="week-list-item-name">'+item.name+'</span><span class="week-list-item-value">'+charge+'/'+max+'</span></div>';
						cadena+= '			<div class="week-list-item-gauge"><div class="week-list-item-gauge-progress '+((progress > 100)?'mdm-bg-warning':'')+'" style="width:'+progress+'%;background-color:'+item.color+'"></div></div>';
						cadena+= '		</div>';
						cadena+= '	</div>';
					}
					
					$('#week_list_container').html(cadena);
					
					$('#week_list_header_charge').html(sum);
						
					$('.week-list-item').each(function(index, element) {
						$(this).click(function(){
							var idref = $(this).attr('idref');
							obj.showWeekCharge(idref);
						});
					});

				});
				
				
			},
			createFormCharge:function(){ //obtiene usuario
				var main = this.main;
				var obj = this;
				var user = obj.user;
				var week = obj.main.config.project.weeks[parseInt(obj.currentWeek)-1];
				var cadena = '<div class="week-form">';
					cadena+= '	<div id="week_header" class="week-header">';
					cadena+= '		<div id="week_header_back" class="week-header-color" title="Volver a usuarios" alt="Volver a Semanas" style="background-color:'+week.color+'">';
					cadena+= '			<div class="week-header-color workloadForm workloadForm-back"></div>';
					cadena+= '		</div>';
					cadena+= '		<div class="week-header-info">';
					cadena+= '			<div id="week_header_name" class="week-header-name">Semana '+obj.currentWeek;
					cadena+= '			</div>';
					cadena+= '			<div id="week_header_graph" class="week-header-graph"><b>'+user.alias+'</b></br>'+user.userName;
					cadena+= '			</div>';
					cadena+= '		</div>';
					cadena+= '		<div class="week-header-toolBar">';
					cadena+= '			<div id="week_header_charge" class="week-header-charge">';
					cadena+= '			</div>';
					cadena+= '			<div id="week_header_tool" class="week-header-tool">';
					cadena+= '				<div title="Ver informaci&oacute;n de usuario" id="week_header_info" class="weekForm weekForm-info"></div>';
					cadena+= '				<div title="Ver area de usuario" id="week_header_zoom" class="weekForm weekForm-zoom"></div>';
					cadena+= '			</div>';
					cadena+= '		</div>';
					cadena+= '	</div>';
					cadena+= '	<div class="week-header-tools">';
					cadena+= '		<div num="01" class="week-tool weekForm-btn week-tool-assigned week-tool-active">';
					cadena+= '			<div class="workloadForm workloadForm-assigned"></div>';
					cadena+= '			<label>Asignados</label>';
					cadena+= '		</div>';
					cadena+= '		<div num="02" class="week-tool weekForm-btn week-tool-free">';
					cadena+= '			<div class="workloadForm workloadForm-free"></div>';
					cadena+= '			<label>Sin asignar</label>';
					cadena+= '		</div>';
					cadena+= '	</div>';
					cadena+= '	<div id="week_content_panels" class="week-panels-content">';
					cadena+= '		<div id="week_content_panel01" class="week-content-panel week-content-active">1</div>';
					cadena+= '		<div id="week_content_panel02" class="week-content-panel">2</div>';
					cadena+= '	</div>';
					cadena+= '	<div class="week-footer">';
					cadena+= '		<div id="footer_panel01" class="week-footer-panel week-footer-active">';
					cadena+= '			<div id="week_footer_panel01">';
					cadena+= '				<div id="week_sel01" class="week-sel"></div>';
					//cadena+= '				<div id="week_tools01" class="week-tools"></div>';
					cadena+= '				<div id="week_rem01" class="week-rem"></div>';
					cadena+= '			</div>';
					cadena+= '		</div>';
					cadena+= '		<div id="footer_panel02" class="week-footer-panel"><div id="week_footer_panel02"><div id="week_sel02" class="week-sel"></div><div id="week_rem02" class="week-rem"></div></div></div>';
					cadena+= '	</div>';
					cadena+= '</div>'
				
				$('#mdmp_panel_03').html(cadena);
				
				$('.week-tool').each(function(){
					$(this).click(function(e){
						var num = $(this).attr('num');
						$('.week-tool-active').removeClass('week-tool-active');
						$('.week-content-active').removeClass('week-content-active');
						$('.week-footer-active').removeClass('week-footer-active');
						
						$(this).addClass('week-tool-active');
						$('#week_content_panel'+num).addClass('week-content-active');
						$('#footer_panel'+num).addClass('week-footer-active');
						e.stopPropagation();
						obj.main.modules.uiMap.switchAction(num);
					});
					
				});
				$('#week_header_back').click(function(e){
					obj.hideWeekCharge();
				});
				$('#week_header_zoom').click(function(e){
					MDM6('goCoords',obj.user.extent);
					e.stopPropagation();
				});
				
				obj.contentUI();
				obj.footerUI();
				
			},
			refreshLists:function(opc){ //user opcional, si esta esta definida reemplaza el usuario local del modulo
				var main = this.main;
				var obj = this;
				if (opc.indexOf('1') >= 0 && !($("#week_content_panel01 .smartTableHeader").attr('id') === undefined))
					$("#week_content_panel01").smartDataTable("initSearch");
				if (opc.indexOf('2') >= 0 && !($("#week_content_panel02 .smartTableHeader").attr('id') === undefined))
					$("#week_content_panel02").smartDataTable("initSearch");
				var _user = obj.user;
				obj.main.modules.uiMap.mapRefresh(_user);
			},
			contentUI:function(user){
				var main = this.main;
				var obj = this;
			
				var user = this.user;
				var alias = main.modules.users.getUserAlias(user.user);
				var dataSource = main.config.dataSource.global;
				var service = main.config.dataSource.user.week.url;
				var server = main.config.dataSource.server;
				var params = {limit: 20, page: 1, user: user.user};//499};


				$("#week_content_panel01").smartDataTable({
										  successBan:'response.success',
										  dataPos:'data',
										  postType:'POST',
										  pageParamLabel:'page',
										  stringify:true,
										  filter:{active:true,field:'search',chartoFilter:4},
										  jsonXhrFields:dataSource.xhrFields,
										  searchParams:{urlData:server+'/'+service+'/assignedbyWeek'+'/'+obj.currentWeek},
										  extraParams:params,
										  canWrite:true,
										  spinnerImg:function(ban){
												obj.main.modules.ui.spinner(ban);  
									      },
										  convertData:function(data){
											var tdata = data; 
											tdata.data.value = tdata.data.records;
											return tdata;
										  },
										  buttonAction:function(id,action,opc){
											  
											switch(action){
												case 'record':
													var coords = $('#week_content_panel01 div[idref='+id+']').attr('extent');
													MDM6('goCoords',coords);
													break;
												case 'data':
														$('#week_header_charge').html(opc.recordCount);
													break;
												case 'remove':
													var isDivided = $('#week_content_panel01 div[idref='+id+'][divide=true]').attr('idref');
													if(isDivided){
														obj.main.modules.dialogs.confirm('Confirmar borrado','Elemento seleccionado esta dividido, al eliminarlo se perderán las divisiones asignadas',function(){
															obj.remById(opc);		
														});
													}else{
														obj.remById(opc);		
													}
													/*obj.removeAssignedById(id,function(){
														obj.refreshLists('123');
														obj.updateHeader();	
													});*/
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
				
					
				$("#week_content_panel02").smartDataTable({
										  successBan:'response.success',
										  dataPos:'data',
										  postType:'POST',
										  pageParamLabel:'page',
										  stringify:true,
										  filter:{active:true,field:'search',chartoFilter:4},
										  jsonXhrFields:dataSource.xhrFields,
										  searchParams:{urlData:server+'/'+service+'/assigned/noweek'},
										  extraParams:params,
										  canWrite:true,
										  spinnerImg:function(ban){obj.main.modules.ui.spinner(ban);},
										  convertData:function(data){
											var tdata = data; 
											tdata.data.value = tdata.data.records;
											return tdata;
										  },
										  buttonAction:function(id,action,opc){
											  
											switch(action){
												case 'record':
													var coords = $('#week_content_panel02 div[idref='+id+']').attr('extent');
													MDM6('goCoords',coords);
													break;
												case 'data':
													break;
												case 'add':
													obj.selectById(opc);
													/*obj.addIdle(id,function(){
														obj.refreshLists('123');
														obj.updateHeader();	
													});*/
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
			footerUI:function(){
				var main = this.main;
				var obj = this;
			
				var user = this.user;
				
				$('#week_tools01').html(
					'<div title="Asignar elementos de la lista" id="btnAssignSelection" class="weekForm weekForm-ok"></div>'+
					'<div title="Limpiar elementos de la lista" id="btnClearSelection" class="weekForm weekForm-cancel"></div>'
				);
				
				$('#btnAssignSelection').click(function(e){
					obj.confirmSelection(function(){
						obj.refreshLists('123');
						obj.updateHeader();
					});
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
				$("#week_sel01").dropDownImage({sprite:'dropDownImage-plantilla',
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
														obj.main.data.module = 'selweek';
														if (status) 
															obj.main.modules.uiMap.switchAction(id)
														else
															obj.main.modules.uiMap.switchAction('');
														
													}
												  }
												 });
				$("#week_rem01").dropDownImage({sprite:'dropDownImage-plantilla',
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
														obj.main.data.module = 'selweek';
														if (status) 
															obj.main.modules.uiMap.switchAction(id)
														else
															obj.main.modules.uiMap.switchAction('');
													}
												  }
												 });
				
				
			}
		}
	return _obj;
});