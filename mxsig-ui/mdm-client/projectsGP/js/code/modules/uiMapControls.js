define(function(){
	return{
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.ranks = obj.main.config.project.ranks;
		},
		displayCurrentAction:function(action,clear){
			var main = this.main;
			var obj = this;
			if (clear === undefined){
				classIcon = '';
				switch (action){
					case 'workload-mzn-point-lock':classIcon = 'mdmp_plantilla mdmp_plantilla_mzn_point_trans';break;
					case 'mdmp_plantilla_cut':classIcon = 'mdmp_plantilla mdmp_plantilla_cut_big';break;
					case 'workload-mzn-point-cut':classIcon = 'mdmp_plantilla mdmp_plantilla_cut_big';break;
					case 'workload-office-add-point':classIcon = 'mdmp_plantilla mdmp_plantilla_sede_trans';break;
					case 'dropDownImage-add-point': classIcon = 'mdmp_plantilla mdmp_plantilla_addPoint_trans';break	
					case 'dropDownImage-add-square': classIcon = 'mdmp_plantilla mdmp_plantilla_addRect_trans';break	
					case 'dropDownImage-add-poly': classIcon = 'mdmp_plantilla mdmp_plantilla_addPoly_trans';break	
					case 'dropDownImage-rem-point': classIcon = 'mdmp_plantilla mdmp_plantilla_remPoint_trans';break	
					case 'dropDownImage-rem-square': classIcon = 'mdmp_plantilla mdmp_plantilla_remRect_trans';break	
					case 'dropDownImage-rem-poly': classIcon = 'mdmp_plantilla mdmp_plantilla_remPoly_trans';break	
				}
				
				var cadena = '<div id="mdmp_currentAction" style="display:none"><div class="mdmp-currentAction-color"></div>';
					cadena+= '	<div id="mdmp_currentAction_icon" class="mdmp_currentAction-icon '+classIcon+'"></div>';
					cadena+= '	<div id="mdmp_currentAction_close" class="mdmp_currentAction-close ui-icon ui-icon-circle-close"></div>';
					cadena+= '</div>';
				
				$('#panel-center').append(cadena);
				$('#mdmp_currentAction_close').click(function(e){
					obj.clearCurrentAction();
					e.stopPropagation();
				});
				$('#mdmp_currentAction').fadeIn();
			}else{
				$('#mdmp_currentAction').remove();
			}
		},
		switchAction:function(action){
				var main = this.main;
				var obj = this;
				var typeFeature = (action.indexOf('point') >= 0)?
								 'point':
								 (action.indexOf('poly') >= 0)?
								 'polygon':
								 (action.indexOf('square') >= 0)?
								 'square':null;
				if (typeFeature != null){
					obj.main.data.currentAction = action;
					obj.displayCurrentAction(action); //despliega action actual
					MDM6('enableCustomTool',
						{
							control:typeFeature,
							active:true,
							event:function(e){
								obj.onFeatureCreate(e)
							},
							onDeactivate:function(){
								obj.switchAction('');
							}
						}); 		
					obj.toggleControls(false);
				}else{
					obj.clearCurrentAction();
				}
		},
		clearCurrentAction:function(){
				var main = this.main;
				var obj = this;
				
				obj.main.data.currentActionData = null;
				obj.displayCurrentAction('',false);
				var action = obj.main.data.currentAction;
				var typeFeature = (action.indexOf('point') >= 0)?
								 'point':
								 (action.indexOf('poly') >= 0)?
								 'polygon':
								 (action.indexOf('square') >= 0)?
								 'square':null;
				
				MDM6('enableCustomTool',
						{
							control:typeFeature,
							active:false,
							event:function(e){
								obj.onFeatureCreate(e);
							},
							onDeactivate:function(){
								obj.switchAction('');
							}
						});
						
				obj.toggleControls(true);
				
				
				obj.main.data.currentAction = '';
				obj.main.data.module = '';
				$( ":custom-dropDownImage" ).dropDownImage( "option",{selected:false});
		},
		onFeatureCreate:function(data){
				var main = this.main;
				var obj = this;
				var action = obj.main.data.currentAction;
				var module = obj.main.data.module;
				var typeFeature = (action.indexOf('point') >= 0)?
								 'point':
								 (action.indexOf('poly') >= 0)?
								 'polygon':
								 (action.indexOf('square') >= 0)?
								 'square':null;
				var action = (action.indexOf('add') >= 0)?
								 'add':
								 (action.indexOf('rem') >= 0)?
								 'rem':
								 (action.indexOf('mzn') >= 0)?
								 'mzn':null;
				//si es oficina obtiene usuario desde datos;
				
				if (typeFeature != null && action != null){
						obj.routerActions(module,action,data);
				}
		},
		routerActions:function(mode,action,wkt,params){
			var obj = this;
			var user = obj.main.modules.workload.user;
			
			switch (mode){
				case 'selection':
					switch (action){
						case 'confirm':
							obj.main.modules.workload.confirmSelection(user,wkt,function(){
								obj.main.modules.workload.refreshLists('123');
								obj.main.modules.workload.updateHeader();
							});
						break;
						case 'add':
							obj.main.modules.workload.addSelection(user,wkt,function(){
								obj.main.modules.workload.refreshLists('123');
								obj.main.modules.workload.updateHeader();
							});
						break;
						case 'rem':
							obj.main.modules.workload.remSelection(user,wkt,function(){
								obj.main.modules.workload.refreshLists('123');
								obj.main.modules.workload.updateHeader();
							});
						break;
					}
				break;
				case 'assigned':
					if (action == 'rem'){
						obj.main.modules.workload.remAssigned(user,wkt,function(){
							obj.main.modules.workload.refreshLists('123');
							obj.main.modules.workload.updateHeader();
						});
					}
				break;
				case 'office':
					var user = obj.main.modules.users.getUser(obj.main.data.currentActionData.user);
					obj.main.modules.users.addOffice(user,wkt,function(){
						obj.main.modules.ui.reloadUsers();
						obj.clearCurrentAction();
						obj.main.modules.dialogs.notify('Se agregó la Sede','Se agregó la sede de forma satisfactoria','notification');	
						
					});
				break;
				case 'cut':
					obj.main.modules.division.checkForDivision(wkt);
				break;
				case 'cutWeek':
					obj.main.modules.week.checkForDivision(wkt);
				break;
				case 'division':
					switch (action){
						case 'add':
							obj.main.modules.division.addTerrain(wkt);
						break;
						case 'rem':
							obj.main.modules.division.remTerrain(wkt);
						break;
					}
				break;
				case 'selweek':
					switch (action){
						case 'add':
							obj.main.modules.week.selectByGeom(wkt);
						break;
						case 'rem':
							obj.main.modules.week.remByGeom(wkt);
						break;
					}
				break;
				
			}
		},
		workloadByFeature_:function(mode,action,wkt,params){
				var main = this.main;
				var obj = this;
				var url = '';
				var user = obj.user;
				var alias = '';
				var selectionLabel = '';
				var lockAgeb = obj.lockAgeb;
				
				if (mode != 'lock' && mode == 'office' && obj.currentActionData != null){
					user = main.getUser(obj.currentActionData.user);
				}
				
				if (user != ''){
					alias = main.getUserAlias(user.user);
					selectionLabel = main.rankData.ranks[user.rightsId].selectionLabel;
				}
				
				var params = (params === undefined)?{}:params;
				var loginSource = {};
			
				switch (mode){
					case 'selection':
						$.extend(loginSource,main.dataSource.adminAgeb);
						switch (action){
							case 'confirm':
								url = '/assign/selected?user='+user.user;
								//params.user = user.user;
								//params.geom = wkt;
							break;
							case 'add':  //miestra seleccion
								action = 'confirm';
								url = '/select/idle_by_geometry?user='+user.user+'&geom='+wkt;//'/'+alias+'/add';
								params = {};	
							break;
							case 'rem':
								url = '/remove/selected_by_geometry?user='+user.user+'&geom='+wkt;
								params = {};
							break;
						}
					break;
					case 'assigned':
						$.extend(loginSource,main.dataSource.adminAgeb);
						if (action == 'rem'){
								url = '/remove/assigned_by_geometry?user='+user.user+'&geom='+wkt;
								params = {};
						}
					break;
					case 'office':
						$.extend(loginSource,main.dataSource.sede);
						if (action == 'add'){
								var userData = obj.currentActionData;
								url = '/add';
								params = {user:userData.user,geom:wkt};
						}
					break;
					case 'lock': case 'cut':
						$.extend(loginSource,main.dataSource.global);
						var userData = obj.currentActionData;
						/*var postFijo = (mode == 'cut' && obj.lockAgeb != '')?'mzn/cvegeo/'+obj.lockAgeb:'ageb/cvegeo';
						url = '/workload/asesor/'+postFijo;*/
						var jc = main.localData.currentUser;
						url = '/workload/censor/mzn/cvegeo';
						params = {user:jc.user,geom:wkt};
						
					break;
				}
				loginSource.url+=url;
				main.getData(loginSource,params,function(data){
					if (data.response.success){
						if (/confirm|rem/.test(action) && mode == 'selection'){
							obj.refreshLists('123');
							obj.updateHeader();
						}
						if (action == 'add' && mode == 'selection'){
							//Confirmacion de tipo de localidad y productividad
								var geom = 	data.data.union;
								if (geom != null){
									data.data.wkt = wkt;
									main.dialogs.dialogConfirmSelectionAgeb(user,mode,action,data.data);
								}else{
									$("#mdmp_currentAction").effect( "shake",'slow');		
								}
						}
						if (action == 'rem' && mode == 'assigned'){
							obj.refreshLists('123');
							obj.updateHeader();
						}
						if(mode == 'office'){
							main.message('<b>'+user.userName+'</b> Sede :<b>'+data.data.message+'</b>');
							obj.clearCurrentAction();
						}
						if(mode == 'lock'){
							var cve = data.data.cvegeo;
							if (!(cve === undefined) && cve != null){
								var mzn = obj.decodeId(data.data.cvegeo);
								obj.lockAgeb = mzn.ent+mzn.mun+mzn.loc+mzn.ageb;
								obj.lockAgebDB(
								function(){
									obj.displayLockAgeb();
									main.updateHeader();
									obj.clearCurrentAction();	
								})
							}else{
								$("#mdmp_currentAction").effect( "shake",'slow');		
							}
						}
						if(mode == 'cut'){
							obj.cutMzn(data);
							obj.clearCurrentAction();
						}
						//actualiza mapa
						var poinUser = (obj.user != '')?obj.user.user:main.localData.currentUser.user;
						if (mode != 'cut')
							main.mapRefresh(poinUser);
						
					}else{
						$("#mdmp_currentAction").effect( "shake",'slow');	
					}
						
				},function(){ //si error
					$("#mdmp_currentAction").effect( "shake",'slow');
				},null,null,
				function(){ //si sucess false
					$("#mdmp_currentAction").effect( "shake",'slow');
				}
				);
				
		},
		toggleControls:function(ban){
			var obj = this;
			if(ban){
				$('.mdm-ui-widget.mdmp-hidde-control').each(function(index, element) {
                    $(this).removeClass('mdmp-hidde-control');
                });
			}else{
				$('.mdm-ui-widget').each(function(index, element) {
                    $(this).addClass('mdmp-hidde-control');
                });
			}
		},
		mapRefresh:function(user){
				var obj = this;
				user = user || obj.main.modules.users.getIndexUser();
				user = obj.main.modules.users.getUser(user);
				var  mainUser = obj.main.modules.users.getMainUser();
				var path = user.path;
				var father = (path[path.length-1]) || user;
				var grandFather = (path.length > 1)?(path[path.length-2]):null;
				var week = (obj.main.modules.week.editing)?1:0;
				var params = {
						USER: user.user, //
						FIGURA:user.rightsId,
						ZONE:user.edo,
						MAINUSER:mainUser.user,
						PARENT:father.user,
						SZ:20,
						WEEK:week
					}
				
				
				MDM6('setParams',{layer:'Vectorial',params:params});
				
				/*
				
						
				if (data === undefined && obj.currentLayerValues != null){
					data = obj.currentLayerValues.user;
				}
		
				var user = obj.getUser(data); //extrae usuario de datos locales
				var path = user.path;
				var parent = (path === undefined || path.length == 0)?
							 user:
							 path[path.length-1];
		
				var sizefeatures = ($("#mdmp_feature_scale").attr('style') === undefined)?{id:2,item: "mdmp_plantilla_feature_big"}:$("#mdmp_feature_scale").dropDownImage('getValue');
					sizefeatures = (3-(sizefeatures.id))*obj.featureSize;
				
				var params = {user:user.user,figura:user.rightsId,zone:user.city,parent:parent.user,sz:sizefeatures,edicion:obj.editing};
				
				//control de panatalla de semanas
				params.week = 0;
				if (obj.editingWeek){
					params.week = 1;
				}
				//check if filter is current applied to a user and add param to map
				if(obj.filtered){
					var newParam = obj.filterMapParam;
					for(var x in newParam){
						params[x] = newParam[x];	
					}	
				}
				
				
				obj.currentLayerValues = params;
				
				//var capa1 = {'map.layer[c2001].class[0].style[0]':'SIZE+200'}
				//params['map.layer[c2001].class[3].style[0]']='SYMBOL+tagua+SIZE+'+sizefeatures;
				
				
				MDM6('setParams',{layer:'Vectorial',params:params})
				var alias = obj.getUserAlias(user.user);
				
				if (user.rightsId <= 3 && user.childlist != null && user.childlist.length > 0){
					var params = {type:alias,id:user.user};
					MDMGrapher('Execute',params);
				}else{
					MDMGrapher('Clear');	
				}
				*/
				
			}
	}
});