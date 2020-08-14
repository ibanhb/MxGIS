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
			productivity:3,
			location:'',
			child:null,
			assigned : 0,
			total:-1
		},
		data:{
		},
		show:function(data){
			var obj = this;
			//resetData
			obj.currentData = {
								productivity:3,
								location:'',
								child:null
								}
			
			obj.editing = true;
			this.user = obj.main.modules.users.getIndexUser();
			$("#panel-right").panel('showInternal','mdmp_panel02');
			obj.createDivisionList(data);
			
			
			obj.main.modules.uiMap.clearCurrentAction();
		},
		hide:function(message){
			var obj = this;
			var main = this.main;
			
			if(message === undefined){ //si no se ha definido mensaje
				if(obj.isFinish()){ //si ya esta terminada la asignación
					obj.main.modules.dialogs.notify('División concluida','La división fue efectuada con éxito','notification');	
				}else{
					obj.cancelDivision(function(){
							obj.main.modules.dialogs.notify('División inconclusa','Se cancelaron las cargas de division asignadas','system');	
							obj.main.modules.ui.reloadInterface();
					});
				}
			}else{
				obj.main.modules.ui.reloadInterface();
			}
			obj.editing = false;
			obj.main.modules.uiMap.clearCurrentAction();
			$("#panel-right").panel('hideInternal','mdmp_panel02');
			$("#mdmp_panel02").html('');
		},
		isFinish:function(){
			var obj = this;
			var ban = false;
			if(obj.currentData.location != '')
				if(obj.currentData.assigned >= obj.currentData.total)
					ban = true;
			
			return ban;
		},
		createDivisionList:function(data){
				var obj = this;
				obj.data = data;
				var main = this.main;

				var user = obj.user;
				var prod = obj.config.project.productivity;
				
				
				var divisions = $.extend([],obj.main.config.project.divisions);
				var cadena = '<div id="division_list_header" class="division-list-header">';
					cadena+= '	<div id="division_list_back" class="workloadForm workloadForm-back" style="background-color:'+user.color_hex+'"></div>';
					cadena+= '  <div class="division-list-header-content">';
					cadena+= '		<div class="division-list-header-name"><big>División de terreno</big></br><b>'+data.cvegeo+'</b></br>Total:<span id="divisionTotal">'+data.totalPlan+'</span></div>';
					cadena+= '	<div class=""division-list-header-combos">';
					
					cadena+= '	<select id="division-productivity">';
					for(var x in prod){
						var item = prod[x];
						var selected = (item.id == obj.currentData.productivity)?'selected="selected"':'';
						cadena+= '<option value="'+item.id+'" '+selected+'>'+item.label+'</option>';
					}
					cadena+= '	</select>';
					
					var list = data.location.list;
					cadena+= '	<select id="division-location">';
					
					cadena+= '<option value="-1" '+((obj.currentData.location == '')?'selected="selected"':'')+'>Seleccione localidad</option>';
					
					for(var x in list){
						var item = list[x];
						var selected = (item.value == obj.currentData.location)?'selected="selected"':'';
						cadena+= '<option value="'+item.value+'" '+selected+'>'+item.label+'</option>';
					}
					cadena+= '	</select>';
					cadena+= '	<span id ="division_search_location" class="division-search-location widget_userList userList-sh-extent" class=""></span>';
					
					cadena+= '	</div>';
					cadena+= '	</div>';
					cadena+= '</div>';
					cadena+= '<div id="division_list_container" class="division-list-container">';
					cadena+= '</div>';
					
					
					cadena+= '	<div id="division_footer" class="division-footer" userselected="'+((obj.currentData.child != null)?'true':'false')+'">';
					cadena+= '		<div id="footer_panel01" class="division-footer-panel"><div id="division_footer_panel01"><div id="division_sel01" class="division-sel"></div><div id="division_tools01" class="division-tools">';
					cadena+= '			<div title="Cancelar División" id="btnClearDivision" class="workloadForm workloadForm-cancel"></div>';
					cadena+= '		</div><div id="division_rem01" class="division-rem"></div></div></div>';
					cadena+= '	</div>';
					
			
				
			$('#mdmp_panel_02').html(cadena);
			obj.printUsersList(); //imprime usuarios con cargas
			//Eventos
			//Buscar Localidades
			$('#division_search_location').click(function(e) {
                obj.main.modules.dialogs.searchLocation('division',obj.data.cvegeo,function(cvenom){
					var cve = cvenom.substr(0,cvenom.indexOf('-'));
					
					$('#division-location option:selected').removeAttr('selected');
					$('#division-location option[external=true]').remove();
					$('#division-location').append('<option value="'+cve+'" external="true" selected="selected">'+cvenom+'</option>');
					
					obj.currentData.location = cve;
					obj.printUsersList();	
				});
            });
			
			$('#btnClearDivision').click(function(e){
				obj.cancelDivision();
				obj.hide('noMessage');
			});
			$('#division-productivity').change(function(e) {
                var val = parseInt($('#division-productivity option:selected').val());
				obj.currentData.productivity = val;
				var cvegeo = obj.data.cvegeo;
				obj.changeProdToSelected(val,cvegeo,function(data){
						obj.main.modules.workload.refreshLists('1',obj.user);
				});
            });
			$('#division-location').change(function(e) {
                var val = $('#division-location option:selected').val();
				var cvegeo = obj.data.cvegeo;
				obj.assignLocation(val,cvegeo,function(data){
						obj.currentData.location = data.location;
						obj.main.modules.workload.refreshLists('1',obj.user);
				}); //envia parametro de other location
            });
			
			$('#division_list_back').click(function(){
					if(!obj.isFinish()){
						obj.main.modules.dialogs.confirm('Confirmar eliminación','Se eliminará las cargas de división asignadas, ¿esta seguro(a) de proceder?',function(){
							obj.hide();		
						});
					}else{
						obj.hide();
					}
			});
			
			//Seccion de selecccion
			$("#division_sel01").dropDownImage({sprite:'dropDownImage-plantilla',
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
													obj.main.data.module = 'division';
													if (status) 
														obj.main.modules.uiMap.switchAction(id)
													else
														obj.main.modules.uiMap.switchAction('');
													
												}
											  }
											 });
			$("#division_rem01").dropDownImage({sprite:'dropDownImage-plantilla',
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
													obj.main.data.module = 'division';
													if (status) 
														obj.main.modules.uiMap.switchAction(id)
													else
														obj.main.modules.uiMap.switchAction('');
												}
											  }
											 });
			
			
		},
		printUsersList:function(){
			var obj = this;
			var cadena = '';
			
			obj.getCurrentCharges(function(data){
				var user = $.extend({},true,obj.user);
				var list = $.extend([],true,user.childlist);
				var workload = data.workload;
				var sum = 0;
				
				for(var u in list){	
					var uItem = list[u];
					uItem.divisionCharge = 0;	
					
				}
				
				for(var x in workload){
					var item = workload[x];
					if(item){
						for(var u in list){	
							var uItem = list[u];
							if (uItem.user == item.user){
								uItem.divisionCharge = item.workload;	
								sum+= item.workload;
							}
						}
							
					}	
				}
				
				var max = obj.data.totalPlan;
				$('#divisionTotal').html(sum+'/'+max);
				
				//actualiza valores
				obj.currentData.assigned = sum;
				obj.currentData.total = max;
				
				if(sum == max){
					$('#division-location').show();
					$('#division_search_location').show();
				}else{
					$('#division-location').hide();
					$('#division_search_location').hide();
					obj.currentData.location = '';
				}
				
				
				for(var x in list){
					var item = list[x];
					var charge = item.divisionCharge || 0;
					var selected = (obj.currentData.child)?(obj.currentData.child.user == item.user)?' selected ':'':'';
					var progress = (100/max)*charge;
					
					cadena+= '	<div idref="'+item.user+'" class="division-list-item '+selected+'">';
					cadena+= '		<div class="division-list-item-color" style="background-color:'+item.color_hex+'"><span>'+charge+'</span></div>';
					cadena+= '		<div class="division-list-item-content">';
					cadena+= '			<div><span class="division-list-item-name">'+item.alias+' '+item.userName+'</span>';
					cadena+= '			<span id="division_item_charge_'+item.user+'" class="division-list-item-charge"><img src="projects/img/circularPreloader.gif"></span></div>';
					cadena+= '			<div class="division-list-item-gauge"><div class="division-list-item-gauge-progress" style="width:'+progress+'%;background-color:'+item.color_hex+'"></div></div>';
					cadena+= '		</div>';
					cadena+= '	</div>';
				}
				//actualiza summary
				for(var x in list){
					var item = list[x];
					obj.loadIndividualSummary(item);
				};
				
				$('#division_list_container').html(cadena);
				
				$('.division-list-item').each(function(index, element) {
						$(this).click(function(e) {
							var idref = $(this).attr('idref');
							obj.currentData.child = obj.main.modules.users.getUser(idref);
							$('.division-list-item.selected').removeClass('selected');
							$(this).addClass('selected');
							$('#division_footer').attr('userselected','true');
						});    
				});
			
			});
			
		},
		loadIndividualSummary:function(user,func){
			var obj = this;
			obj.main.modules.users.getDataUser(user,function(data){
				$('#division_item_charge_'+user.user).html(data.assigned);
			});
		},
		triggerLocationChange:function(func){ //si la localidad ha sido seleccionada, dispara la actualización de la misma
			var obj = this;
			if(obj.currentData.location != ''){
				var cvegeo = obj.data.cvegeo;
				obj.assignLocation(obj.currentData.location,cvegeo,function(data){
					obj.currentData.location = data.location;
					if($.isFunction(func)){
						func(data.data);
					}	
				});	
			}
		},
		//control location search
		captureLocation:function(element){
			var obj = this;
			var main = obj.main;
			var rlist = [];
			element.autocomplete({ 
				source: function(request, response){
					obj.locationSearch(request.term,function(data){
						var list = data;
						rlist = list;
						var r = [];
						for(var x in list){
							var item = list[x];
							var oitem = {id:item.substr(0,item.indexOf('-')),label:item}
							//var point = 'POINT('+item.coord_merc.split(',')[1]+' '+item.coord_merc.split(',')[0]+')'
							r.push({label:item,obj:oitem});
						}
						response(r);
					});
				},
				minLength: 5,
				select: function( event, ui ) {
					if(ui.item){
						element.attr('svalue',ui.item.label);
						//obj.onClickRoute(ui.item.obj)
					}
				},
				open: function() {
					$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				},
				close: function() {
					$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
				}
			});
		},
		
		//-BD-----------------------------------------------------------------------
		// Location Search -----------------------------------------------------------------
		locationSearch:function(text,func){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/find/location/'+text;//server+'/'+obj.main.config.dataSource.user.workload.url+'/close';
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.plancve);
					}
				}
			});
		},
		//Get user charges
		getCurrentCharges:function(func){
			var obj = this;
			var terreno = obj.data.cvegeo;
			var user = obj.user;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/divide/workLoad?cvegeo='+terreno;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data);
					}
				}
			});
		},
		//Cancel Division
		cancelDivision:function(func){
			var obj = this;
			var terreno = obj.data.cvegeo;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/cancel/divide/control?cvegeo='+terreno;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//Change Location
		assignLocation:function(localidad,terreno,func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/divide/update/locations?cvegeo='+terreno+'&plancvegeo='+localidad+'&otherlocation=false';
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.main.modules.workload.locationExtent(localidad,function(data){});
					if($.isFunction(func)){
						func(data.data);
					}
				}
			});
		},
		//Productivity--------------------------------------------------------------------------
		changeProdToSelected:function(prod,terreno,func){
			var obj = this;
			var user = obj.user;
			var alias = obj.main.modules.users.getUserAlias(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/divide/update/productivity?cvegeo='+terreno+'&productivity='+prod;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//Agregar y Quitar por Geometría
		addTerrain:function(wkt,func){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			var child = obj.currentData.child;
			var geom = obj.data.cvegeo;
			
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/set/divide/control?user='+child.user+'&cvegeo='+obj.data.cvegeo+'&geom='+wkt;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.main.modules.uiMap.mapRefresh(obj.user);
					obj.triggerLocationChange();
					obj.printUsersList();
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		remTerrain:function(wkt,func){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			var child = obj.currentData.child;
			var geom = obj.data.cvegeo;
			
			source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/remove/divide/control?user='+child.user+'&cvegeo='+obj.data.cvegeo+'&geom='+wkt;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.main.modules.uiMap.mapRefresh(obj.user);
					obj.triggerLocationChange();
					obj.printUsersList();
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//reviza que el area se pueda dividir
		checkForDivision:function(wkt,func){
			var obj = this;
			var user = obj.main.modules.users.getIndexUser();
			var rank = obj.ranks[user.rightsId];
			if(rank.canCut && user.childlist.length > 0){ //solo el jefe de entrevistador puede dividir
				var child = user.childlist[0];
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.workload.url+'/e/find/cvegeo?user='+child.user+'&geom='+wkt;
				var params = {};
				obj.main.getData(source,params,function(data){
					if(data.response.success){
						obj.main.modules.uiMap.clearCurrentAction();
						obj.main.modules.uiMap.mapRefresh(user.user);
						obj.show(data.data);
						if($.isFunction(func)){
							func(data.data.value);
						}
					}
				});
			}
		}
	}
});