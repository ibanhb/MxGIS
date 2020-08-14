define(function(){
	return{
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.ranks = obj.main.config.project.ranks;
		},
		//stage control
		getUserStage:function(func){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.flag.url+'/stage';
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data);
					}	
				}
			});
		},
		//Getting data from user
		loadUser:function(user,func,updateIndex){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.schema.url;
			var params = {user:user.user,idFigura:user.rightsId};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if(data.data.value.user == obj.main.data.mainUser.user)
						obj.main.data.mainUser = data.data.value;
					
					obj.updateUserTree(data.data.value);
					if(updateIndex === undefined || updateIndex == true)
						obj.data.index_user = data.data.value.user;
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		_loadUser:function(user,func){ //gets user's schema from user but dont update user tree
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.schema.url;
			var params = {user:user.user,idFigura:user.rightsId};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		getDataUser:function(user,func){ //Detalle para graficado individual
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.summaryUser.url+'/'+user.user+'/'+user.rightsId;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.updateUserTree(data.data.value);
					data.data.value.user = user;
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//Graph
		getGralDataUser:function(user,func){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			var alias = obj.ranks[user.rightsId].alias;
			source.url = server+'/'+obj.main.config.dataSource.user.summaryGral.url+'/'+alias+'/'+user.user;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					data.data.value.user = user;
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		//Modify Users
		addOffice:function(user,wkt,func){
			var obj = this;
			var user = obj.main.modules.users.getUser(user.user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.office.url;
			var params = {user:user.user,geom:wkt};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data.value);
					}
				}
			});
		},
		changeName:function(user,newName,func){
			var obj = this;
			var user = obj.main.modules.users.getUser(user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.changeName.url+'/'+newName+'/'+user.user+'/'+user.rightsId;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.loadUser(user,function(){
						obj.main.modules.ui.updateForm();
					},false); //no actualizar index
				}
			});
		},
		changeColor:function(user,color){
			var obj = this;
			var user = obj.main.modules.users.getUser(user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.changeColor.url;
			var params = {id:user.user,color_hex:color};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.loadUser(obj.main.modules.users.getIndexUser(),function(){
						obj.main.modules.ui.updateForm();
					})
				}
			});
		},
		getChildColors:function(user){
			var obj = this;
			var colors = [];
			var user = obj.getUser(user.user);
			var users = user.childlist;
			if (!(users === undefined) && (users.length > 0)){
				for (var x in users){
					if (!(users[x].color_hex === undefined))
					  colors.push(users[x].color_hex);	
				}
			}
			return colors;
		},
		getUserAlias:function(user){
			var obj = this;
			var user = obj.getUser(user);
			return obj.ranks[user.rightsId].alias;
		},
		//ABC Users-------------------------------------------------------------------
		addUser:function(id){
			var obj = this;
			var user = obj.main.modules.users.getUser(obj.data.index_user);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.add.url;
			var params = {superior:user.user,idFigura:id};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.loadUser(user,function(){
						obj.main.modules.ui.updateForm();
					})
				}
			});
		},
		removeUser:function(id){
			var obj = this;
			var user = obj.main.modules.users.getUser(id);
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.remove.url+'/'+user.user+'/'+user.rightsId;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.loadUser(obj.getIndexUser(),function(){
						obj.main.modules.ui.updateForm();
					});
				}
			});
		},
		//--------------------Login Secuences-----------------------------------------
		login:function(){
			var obj = this;
			var cadena = '<div id="p_login_panel">';
				cadena+= '	<div class="pzi-10000 ui-widget-overlay"></div>';
				cadena+= '	<div class="pzi-10000 p_modal_center">';
				cadena+= '		<div class="p_modal_panel_content">';
				cadena+= '			<div><input type="text" id="p_username" class="p_input_text" placeholder="Nombre de usuario"/></div>';
				cadena+= '			<div><input type="password" id="p_password" class="p_input_text" placeholder="Clave de usuario"/></div>';
				cadena+= '			<div><input id="p_login_btn" type="button" class="css_button" value="Ingresar" ></div>';
				cadena+= '		</div>';
				cadena+= '	</div>';
				cadena+= '</div>';
			$('body').append(cadena);
			$('#p_username').focus().bind("keypress", function(evt){
					var otherresult = 12;
					if(window.event != undefined){
						otherresult = window.event.keyCode;
					}
					var charCode = (evt.which) ? evt.which : otherresult;  
					if(charCode == 13){
							$('#p_login_btn').click();
					}
			});
			$('#p_password').bind("keypress", function(evt){
					var otherresult = 12;
					if(window.event != undefined){
						otherresult = window.event.keyCode;
					}
					var charCode = (evt.which) ? evt.which : otherresult;  
					if(charCode == 13){
							$('#p_login_btn').click();
					}
			});
			
			$('#p_login_btn').click(function(){
				var username = $("#p_username").val();
				var password = $("#p_password").val();
				var loginUser = {username:username,password:password}
				obj.checkLogin(loginUser);
			});
			//----------------------------------------------------------
			var username= $.getURLParam('username');
			var password=$.getURLParam('password');
			if(username && password){
				var loginUser = {username:username,password:password};
				obj.checkLogin(loginUser);
			}
			//-----------------------------------------------------------
			setTimeout(function(){
				$('#p_username').focus();
			},200);
		},
		checkLogin:function(userLogin){
			var obj = this;
			if(userLogin){
				var source = $.extend({},obj.main.config.dataSource.global);
				var server = obj.main.config.dataSource.server;
				source.url = server+'/'+obj.main.config.dataSource.user.login.url;
				var params = {user:userLogin.username,password:userLogin.password};
				obj.main.getData(source,params,function(data){
					obj.loginSuccess(data);
				});
			}
		},
		loginSuccess:function(data){
			if(data){
				var obj = this;
				var success = false;
				if(data.response){
						success = data.response.success;
						if(data.response.success){
							obj.main.data.loggedIn = true;
							obj.data.mainUser = data.data.value;
							obj.data.mainUser.rights = 'rw'; //temp
							obj.data.users = [data.data.value];
							obj.data.index_user = data.data.value.user;
							obj.main.loggedIn();
						}	
				}
				if(success){
					$('.p_modal_panel_content').effect('fade',500,function(){
						$('#p_login_panel').remove();
					});	
				}else{
					$('.p_modal_center').effect('shake',500,function(){
						$('#p_username').focus();
					});//remove();
				}
				/*$('.toggle_panels').show();
				$('.repleg').click();*/
			}
		},
		logOut:function(func,message){
			var obj = this;
			var source = $.extend({},obj.main.config.dataSource.global);
			var server = obj.main.config.dataSource.server;
			source.url = server+'/'+obj.main.config.dataSource.user.logout.url;
			var params = {};
			obj.main.getData(source,params,function(data){
				if(data.response.success){
					obj.main.data.loggedIn = false;
					message = message || 'Ha cerrado su sesión';
					
					obj.main.modules.dialogs.logSession(message);
					
					if($.isFunction(func))
						func(data);
				}
			});
		},
		//control de datos locales--------------------------------------------------------------------------------------------------------------------------
		updateUserTree:function(user,_tree,level){
			var obj = this;
			var tree = (_tree === undefined)?obj.main.data.users:_tree;
			var levelCounter = (level === undefined)?0:level;
			var ban = false;
			for (var x in tree){
				var t_user = tree[x];
				if (t_user.user == user.user){
					tree[x] = user;
					tree[x].level = levelCounter;
					tree[x].canWeek = obj.ranks[user.rightsId].week;
					tree[x].canCharge = obj.ranks[user.rightsId].canEditCharge;
					
					var childs = tree[x].childlist;
					if (!(childs === undefined) && (childs != null) && (childs.length > 0)){ //si el usuario tiene hijos
						for (var y in childs){
							childs[y].canWeek = obj.ranks[childs[y].rightsId].week;	
							childs[y].canCharge = obj.ranks[childs[y].rightsId].canEditCharge;
						}
					}
					
					ban = true;
				}else{
					var childs = t_user.childlist;
					if (!(childs === undefined) && (childs != null) && (childs.length > 0)){ //si el usuario tiene hijos
						ban = obj.updateUserTree(user,childs,(levelCounter+1));
					}
				}
				if (ban) break;
			}
			return ban;
		},
		getParentUser:function(user){
			var obj = this;
			user = obj.main.modules.users.getUser(user);
			var path = user.path;
			return (path[path.length-1]) || user;
		},
		getMainUser:function(){
			var obj = this;
			return(obj.main.data.mainUser);
		},
		getIndexUser:function(){
			var obj = this;
			return(obj.getUser(obj.data.index_user));
		},
		canExtract:function(user){
			var obj = this;
			var user = obj.getUser(user);
			var path = user.path;
			var father = (path[path.length-1]);
			var ranks = obj.ranks;
			var grandFather = (path.length > 1)?(path[path.length-2]):null;
			
			//verificar si el abuelo existe y este puede adoptar al usuario
			var gfAdopt = (grandFather == null)?false:
						  (ranks[grandFather.rightsId].createSub.indexOf(user.rightsId) >= 0)?true:false;
			return gfAdopt;
		},
		getUser:function(id,_path,_tree){
				var obj = this;
				if(typeof(id) == 'object'){
					id = id.user;	
				}
				
				var firstLevel = (_tree === undefined);
				var tree = (_tree === undefined)?obj.data.users:_tree;
				var user = null;
				for (var x in tree){
					var t_user = tree[x];
					var path = (_path === undefined)?[]:_path;
					if (t_user.user == id){
						user = tree[x];
						user.path = path;
					}else{
						var childs = t_user.childlist;
						if (!(childs === undefined) && (childs != null) && (childs.length > 0)){ //si el usuario tiene hijos
							path.push(t_user);
							user = obj.getUser(id,path,childs);
							if (user == null){
								path.pop(); //agrega al inicio
							}
						}
					}
					if (user != null){break;}
				}
				return user;
		}
	}
});