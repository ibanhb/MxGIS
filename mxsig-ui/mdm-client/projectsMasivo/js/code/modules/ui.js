define(function(){
	var local = {
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.config = obj.main.config;
			obj.ranks = obj.main.config.project.ranks;
			
			obj.defineWindowCloseEvent();
		},
		defineWindowCloseEvent:function(){
			var obj = this;
			window.addEventListener("beforeunload", function (e) {
			  if(obj.main.data.loggedIn){
				  var confirmationMessage = "Se cerró la sesión en el sistema";
				  obj.main.modules.users.logOut('Su sesión ha sido cerrada');
				  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
				  return confirmationMessage;
			  }//Webkit, Safari, Chrome
			});
		},
		closeCurrentStage:function(activity){
			var obj = this;
			switch(activity){
				case '1':
					obj.main.modules.workload.closeWorkload(function(){
						if(obj.main.data.currentActivity == 1){
							$('#floatGraph').fadeOut(function(){$(this).remove();})	
						}
						obj.main.modules.dialogs.notify('Fin de Actividad','Se ha concluido la actividad de forma satisfactoria','notification');	
						obj.reloadInterface();
					});
				break;
				case '2':
					obj.main.modules.week.closeWeek(function(){
						obj.main.modules.dialogs.notify('Fin de Actividad','Se ha concluido la actividad de forma satisfactoria','notification');	
						obj.reloadInterface();
					});
				break;
			}
		},
		updateMainUser:function(func){
			var obj = this;
			var user = obj.main.modules.users.getMainUser();
			obj.main.modules.users._loadUser(user,function(data){
				var exclude = ['childlist'];
				var mainUser = obj.main.data.mainUser;
				var topUser = obj.main.data.users[0];
				mainUser = data;
				for (var x in data){
					if (exclude.indexOf(x) < 0)
						topUser[x] = data[x];	
				}
				if($.isFunction(func)){
					func();	
				}
			});
		},
		reloadUsers:function(func){
			var obj = this;
			var user = obj.main.modules.users.getIndexUser();
			obj.main.modules.users.loadUser(user,function(){
				obj.updateForm();
				if($.isFunction(func)){
					func();	
				}
			});
		},
		reloadInterface:function(func){
			var obj = this;
			obj.updateMainUser(function(){
				obj.main.modules.users.getUserStage(function(data){
					obj.main.data.currentActivity = data.stage;
					obj.reloadUsers(function(){
						obj.main.modules.uiMap.mapRefresh(obj.main.modules.users.getIndexUser()); 
						if($.isFunction(func)){
							func();	
						}	
					});
				});
			});
		},
		updateForm:function(){
			var obj = this;
			var user = obj.main.modules.users.getIndexUser();
			var mainUser = obj.main.data.mainUser;
			var ranks = obj.main.config.project.ranks;
			var currentActivity = obj.data.currentActivity;
	
			$("#mdmp_headerPanel").ecoPanel({mainUser:mainUser,numAct:currentActivity});
			$("#eco_users").userList({user:user,users:user.childlist,currentActivity:currentActivity});
			$("#mdmp_panelsContainer").panelList('updatePanel',{id:'listUsers',user:user,act:currentActivity});
			$("#mdmp_footer").userPanel({currentUser:user,currentActivity:currentActivity});
			
			obj.main.modules.graph.graphUserGral().update();
			
			obj.main.modules.uiMap.mapRefresh(user);
			//obj.loadReports();
		},
		createUI:function(){
			var obj = this;
			//createFloatGraph
			/*if(obj.main.data.currentActivity == 1){
				obj.main.modules.graph.graphUserGral().create();
			}*/
			
			var container = $('#mdmp');
			var user = obj.main.modules.users.getIndexUser();
			var mainUser = obj.data.mainUser;
			var ranks = obj.main.config.project.ranks;

			var cadena = '';
				//Tabs
				//fin newPanel
				cadena+= '<div id="mdmp_headerPanel">';
				cadena+= '</div>';
				cadena+= '<div id="mdmp_panelsContainer">';
				cadena+= '</div>';
				cadena+= '<div id="mdmp_footer">';
				cadena+= '</div>';
				container.html(cadena);	
				
				cadena = '<div id="mdmp_btnHelp"></div><div id="mdmp_btnLogout"></div>'; //anexo de boton de cierre de sesión
				$('#header .headerBackground').append(cadena);
				$('#panel-right').append('<div id="mdmp_spinner" count="0" style="display:none"><div></div></div>');
				$('#mdmp_btnLogout').click(function(){
					obj.main.modules.users.logOut('Su sesión ha sido cerrada de forma satisfactoria');
				});
				$('#mdmp_btnHelp').click(function(){
					obj.main.modules.video.show();
				});
				
				
				cadena = '<div id="mdmp_feature_scale" class="mdmp-feature-scale"></div>';
				$('#panel-center').append(cadena);
				
				
				//Widgets
				var graph = {1:  //num actividad
							  [{id:'carga',label:'Carga',field:'charge',maxField:'maxCharge',separator:'/'}],
							 2:  //num actividad
							  [{id:'carga',label:'Carga',field:'chargueWeek'}],
							 3:  //num actividad
							  [{id:'carga',label:'Cargas',field:'charge',field2:'chargueWeek',separator:':'}],
							};
							
				var tools = [
							{id:'lock',sprite:'widget_ecoPanel ecoPanel_med_lock',title:'Fijar Ageb',stage:[1],func:function(){
								//return (obj.workload.lockAgeb == '');
							 }},
							{id:'cut',sprite:'widget_ecoPanel ecoPanel_med_cut',title:'Dividir Terreno',stage:[1],func:function(){
								var user = obj.main.modules.users.getIndexUser();
								var rank = obj.ranks[user.rightsId];
								return (rank.canCut && user.childlist.length > 0); //herramienta activa solo si cuenta con el atributo de corte en el rank y tiene hijos
							 }},
							{id:'report',sprite:'widget_ecoPanel ecoPanel_med_report',title:'Ver productos',stage:[1,2,3]}
							//{id:'help',sprite:'widget_ecoPanel ecoPanel_med_help',title:'Ver ayuda',stage:[1,2,3]},
							]
				var panels = [{
								id:'reports',
								title:'Reportes',
								height:200,
								type:'instance',
								opened:false,
								content:'Contenido Metadata'},
							   {
								id:'listUsers',
								title:'',
								type:'persistent-level',
								content:'<div id="eco_users"></div>',
								level:0
								}
						 ];				
				
				$("#mdmp_headerPanel").ecoPanel({
						  mainUser:obj.data.mainUser,
						  numAct:obj.data.currentActivity,
						  activities:obj.main.config.project.activities,
						  //tools:['cut','lock','report'],
						  tools:tools,
						  graphVals:graph,
						  ranks:ranks,
						  rankSettings:obj.main.config.project.rankSettings,
						  zoneConvertion:obj.main.config.project.tabular_edo,
						  onAction:function(id,value){
							  switch (id){
								case 'report':
									obj.main.modules.reports.listReports();
									$("#mdmp_panelsContainer").panelList('switchPanel','reports');				
								break;
								case 'act_end':
									obj.closeCurrentStage(value);
								break;
								case 'zone':
									MDM6('goCoords',user.extent);
								break;
								case 'cut':
									obj.main.data.module = 'cut';
									obj.main.modules.uiMap.switchAction('workload-mzn-point-cut');
								break;
								case 'lock':
									obj.workload.module = 'lock';
									obj.workload.switchAction('workload-mzn-point-lock');
								break;
							  }
						  }
				});
				//Panels
				$("#mdmp_panelsContainer").panelList({panels:panels,
													  act:obj.data.currentActivity,
													  user:user,
													  mainUserRights:mainUser.rights,
													  onAction:function(id, value){
														 switch (id){
															case 'listUsers':
																var userLine = obj.main.modules.users.getUser(obj.data.index_user).path;
																if  (value > 0 && !(userLine === undefined) && userLine.length > 0){
																	var user = obj.main.modules.users.getUser(userLine[userLine.length-1].user);
																	obj.main.modules.users.loadUser(user,function(){
																		obj.updateForm();	
																	});
																}
															break; 
															case 'info':
																var user = obj.main.modules.users.getUser(value);
																obj.main.modules.userDetail.dialogUserDetail(user);
															break; 
														 }
													  }
				});
				$("#mdmp_panelsContainer").panelList('updatePanel',{id:'listUsers',user:obj.main.modules.users.getUser(user.user),act:obj.data.currentActivity});
				//carga de primeros usuarios con delay debido a transition de css
				//setTimeout(function(){
				$("#eco_users").userList(
						{
						activities:obj.main.config.project.activities,
						currentActivity:obj.data.currentActivity,
						users:user.childlist,
						user:user,
						userStructure:ranks,
						mainUserRights:mainUser.rights,
						onAction:function(id,value){
							switch(id){
							case 'element':
								var m_user = obj.data.mainUser;
								var user = obj.main.modules.users.getUser(value); 
								var canView = ranks[m_user.rightsId].canView;
								//verifica si el usuario tiene permiso de ver el contenido del usuario
								if (canView.indexOf(user.rightsId) > -1){
									if(user.flagOfficce){
										obj.main.modules.users.loadUser(obj.main.modules.users.getUser(value),function(){
											obj.updateForm();	
										});
									}else{
										obj.main.modules.dialogs.notify('Definir Sede','Defina la oficina del usuario '+user.userName,'warning');	
									}
								}
							break;
							case 'close':
								obj.main.modules.users.removeUser(value);
							break;
							case 'move':
								obj.users.moveUser(value.user,value.target);
							break;
							case 'extent':
								MDM6('goCoords',value);
							break;
							case 'color':
								obj.main.modules.dialogs.changeColor(value);
							break;
							case 'edit':
								obj.editing = true;
								var user = obj.main.modules.users.getUser(value);
								if(user.flagOfficce || user.rightsId == 4){
									obj.main.modules.workload.show(user);
								}else{
									obj.main.modules.dialogs.notify('Definir Sede','Defina la oficina del usuario '+user.userName,'warning');
								}
							break;
							case 'week':
								var user = obj.main.modules.users.getUser(value);
								obj.main.modules.week.show(user);
							break;
							case 'info':
								var user = obj.main.modules.users.getUser(value);
								obj.main.modules.userDetail.dialogUserDetail(user);
							break;
							case 'rename':
								obj.main.modules.dialogs.changeUserName(value);
							break;
							}
							}
						}
					);
				//},500);
					
				$("#mdmp_footer").userPanel({
						activities:obj.main.config.project.activities,
						currentActivity:obj.data.currentActivity,
						currentUser:user,
						mainUserRights:mainUser.rights,
						mainUser:mainUser,
						userStructure:ranks,
						onAction:function(id){
							obj.main.modules.users.addUser(id);
							//obj.addUser(id);	
						}
				});
				
				
				
		},
		spinner:function(ban){
			if(ban){
				var count = parseInt($('#mdmp_spinner').attr('count'),10);
				count = (count === undefined)?1:count;
				$('#mdmp_spinner').css('display','').attr('count',(count+1));
			}else{
				var count = $('#mdmp_spinner').attr('count');
			    if (!(count === undefined)){
				   count = parseInt(count,10);
				   count--;
				   $('#mdmp_spinner').attr('count',count);
				   if (count <= 0)
					 $('#mdmp_spinner').css('display','none');
			    }
			}
		}
	}
	return local;
});