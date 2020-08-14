define(function(){
	return{
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.ranks = obj.main.config.project.ranks;
		},
		dialogUserDetail:function(user,func){ //obtiene usuario
				var obj = this;
				obj.main.modules.users.loadUser(user,function(user){ //obtiene datos del usuario desde servicio	
					obj.main.modules.users.getDataUser(user,function(data){ //obtiene datos del usuario desde servicio
							var ranks = obj.ranks;
							var user = obj.main.modules.users.getUser(data.user.user);
							//guarda usuario
							obj.main.modules.workload.user = user;
							
							var path = user.path;
							var father = (path[path.length-1]);
							var grandFather = (path.length > 1)?(path[path.length-2]):null;
							
							var act = obj.main.data.currentActivity;
							
							//acceso a detalle de usuario
							detail = data;
							var sedeId = detail.sedeCvegeo;
							var sedeGeom = detail.sedeGeom;
							var selected = detail.selected; 
						
							//verifica si el usuario es suceptible de extraerse a un nivel superior
							var canExtract = obj.main.modules.users.canExtract(user.user);
							
							var subs = '';
							var childs = user.childlist;
			
							if (childs != null && childs.length > 0){
								for (var x in childs){
									var child = childs[x];
									var extract = (obj.main.modules.users.canExtract(child.user) && act == 1)?'<div title="Extraer usuario" user="'+child.user+'" ischild="true" class="btn_extract_user mdmp_plantilla_btn mdmp_plantilla mdmp_plantilla_house_extract"></div>':'';
									var office = (ranks[child.rightsId].office && act == 1)?//puede tener oficina?
												 (child.flagOfficce)?'<div style="background-color:#F1D9BD" title="Movier Oficina" idref="'+child.user+'" class="btn_rem_office mdmp_plantilla_btn mdmp_plantilla mdmp_plantilla_house_mark" ></div>'://remHouse_mark" ></div>':
																	 '<div title="Agregar oficina" idref="'+child.user+'" class="btn_add_office mdmp_plantilla_btn mdmp_plantilla mdmp_plantilla_house_mark" ></div>'
												 :''; //no puede tener oficina		
									//deshabilitado temporal para oficna
									office = '';
									
									
									subs+= '<div idref="'+child.user+'" class="mdmp-userDetail-item"><div class="mdmp-userDetail-item-color" style="background-color:'+child.color_hex+';"></div><label class="mdmp_plantilla_userDetail_username">'+child.userName+'</label>'+extract+office+'<label class="mdmp_plantilla_userDetail_charge">'+child.charge+'/'+child.maxCharge+'</label></div>';		
								}
							}
							var tools = '';
								if (obj.main.modules.users.canExtract(user.user) && act == 1)
									tools+= '<div title="Extraer usuario" user="'+user.user+'" class="btn_extract_user mdmp_plantilla mdmp_plantilla_house_extract"></div>';
								if (ranks[user.rightsId].office && act == 1 && user.childlist.length == 0){
									if (user.flagOfficce){
										tools+= '<div title="Mover sede en:'+sedeId+'" idref="'+user.user+'" style="background-color:#F1D9BD" class="btn_rem_office mdmp_plantilla mdmp_plantilla_house_mark"></div>';//remHouse_mark" ></div>';
										tools+= '<div title="Ver sede en:'+sedeId+'" extent="'+sedeGeom+'" idref="'+user.user+'" class="btn_view_office mdmp_plantilla mdmp_plantilla_viewHome"></div>';
									}else{
										if (act == 1)
											tools+= '<div title="Agregar oficina" idref="'+user.user+'" class="btn_add_office mdmp_plantilla mdmp_plantilla_house_mark" ></div>';
									}
								}
							
							var cadena = '';
								cadena+= '<div class="mdmp-userDetail-container">';
								cadena+= '	<div class="mdmp-userDetail-title">';
								cadena+= '		<div id="close_userDetail" title="Cerrar panel" class="mdmp_plantilla_btn mdmp_plantilla mdmp_plantilla_house_closeBlack"></div>';
								cadena+= '		<label class="mdmp-userDetail-head-username">'+user.userName+'</label>';
								cadena+= '		<label class="mdmp-userDetail-hrad-charge">'+user.charge+'/'+user.maxCharge+'</label>';
								cadena+= '	</div>';
								cadena+= '	<div id="mdmp_userDetail_graph" class="mdmp-userDetail-graph"></div>';
								cadena+= '	<div class="mdmp-userDetail-tools">'+tools+'</div>';
								if (subs != ''){
									cadena+= '<div class="mdmp-userDetail-subsArea"><div class="mdmp_plantilla mdmp_plantilla_userGroup"></div><label class="mdmp_plantilla_userGroup_title">Subordinados</label>';
									cadena+= '	<div class="mdmp-userDetail-subs">'+subs+'</div>';
									cadena+= '</div>';
								}
								cadena+= '</div>';
								
							$('#mdmp_e_panel_01').html(cadena);
							$('#close_userDetail').click(function(e){
								$("#panel-right").panel('hideExternal','mdmp_e_panel01'); 
								e.stopPropagation();
							});
							
							$('.btn_add_office,.btn_rem_office').each(function(){
								$(this).click(function(e){
									var user = parseInt($(this).attr('idref'),10);
									obj.main.data.currentActionData = {user:user};
									obj.main.modules.uiMap.switchAction('workload-office-add-point');
									obj.main.data.module = 'office';
									$("#panel-right").panel('hideExternal','mdmp_e_panel01'); 
									e.stopPropagation();
								});
							});
							/*$('.btn_rem_office').click(function(e){
								var t_user = parseInt($(this).attr('idref'),10);
								obj.main.data.currentActionData = {user:user.user};
								obj.main.modules.users.removeOfficce(t_user);
								e.stopPropagation();
							});*/
							$('.btn_view_office').click(function(e){
								var extent = $(this).attr('extent');
								MDM6('goCoords',extent);
								e.stopPropagation();
							});
							
							$('.btn_extract_user').click(function(e){
								var user = $(this).attr('user');
								var ischild = ($(this).attr('ischild')?true:false)
								obj.users.extractUser(user,ischild,function(){
									$("#panel-right").panel('hideExternal','mdmp_e_panel01'); 
								});
								e.stopPropagation();
							});
							
								
							$("#panel-right").panel('showExternal','mdmp_e_panel01'); 
							
							setTimeout(function(){
								obj.main.modules.graph.graphUser_pie(user.user,'mdmp_userDetail_graph');
							},450);
							
							
				  });
				},false);
		}
	}
})