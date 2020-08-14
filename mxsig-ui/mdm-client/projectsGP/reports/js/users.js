define(function(){
	var _obj = {
		data:{
			edoData:{},
			tree:{}
		},
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.config = obj.main.config;
		},
		//--------Detalle de usuarios------------------------------
		getUser:function(id,main,func){
			var obj = this;
			if(main){
					obj.getMainUser(id,function(data){
						func(data);
					});
			}else{
					obj.getEdoUser(id,function(data){
						func(data);
					});
			}
		},
		getEdoUser:function(user,func){
			var obj = this;
			var ent = obj.data.tree[0]; //toma estado almacenado
			
			var regional = obj.getRegional(ent);
			
			var source = $.extend({},obj.main.config.dataSource.global);
			source.type = 'GET';
			source.stringify = false;
			var server = regional.url;
			
			source.url = server+'/getHistorialByUser/'+user;
			var params = {};
			obj.main.getData.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data);	
					}
				}
			});
		},
		getMainUser:function(ent,func){
			var obj = this;
			var regional = obj.getRegional(ent);
			
			var source = $.extend({},obj.main.config.dataSource.global);
			source.type = 'GET';
			source.stringify = false;
			var server = regional.url;
			
			source.url = server+'/getCzByEnt/'+ent;
			var params = {};
			obj.main.getData.getData(source,params,function(data){
				if(data.response.success){
					if($.isFunction(func)){
						func(data.data);	
					}
				}
			});
		},
		//---------------------------------------------------------
		loadMainStatus:function(){
			var obj = this;
			var regionals = obj.config.project.reports.regionals;
			//reinicia datos 
			for(var x in regionals){
				regionals[x].data = null;
			}
			var cadena = '<div id="connections_regionals" class="collection">';
			//dispara actualizacion de datos desde servers
			for(var x in regionals){
				var ip = regionals[x].url;
					ip = ip.split('/')[2];
				var name = regionals[x].name+'</br><small>'+ip+'</small>';
				cadena+= '<a href="#!" class="collection-item" id="regional_connection_'+x+'">'+name+'<span class="badge"><img src="img/spinner_hor.gif" /></span></a>';
				obj.getRegionalData(x,function(data){
					obj.updateRegional(data);
					var segundos = data.time/1000;
					$('#regional_connection_'+data.pos+' span').html('<div class="connection-ok-indicator">'+segundos+' s.</div>');
					var a = obj.checkMainDataStatus();
					if(obj.checkMainDataStatus()){
						$('#connections_regionals').fadeOut(1000,function(){
						});
						setTimeout(function(){
							obj.main.graph.showMap();
							obj.main.createInfo();	
						},1000)
					}
				},function(pos){
					obj.updateRegional({data:'error',pos:pos});
					if(obj.checkMainDataStatus()){
						$('#connections_regionals').fadeOut(1000,function(){
						});
						setTimeout(function(){
							obj.main.graph.showMap();
							obj.main.createInfo();	
						},1000)
					}
					$('#regional_connection_'+pos+' span').html('<div class="connection-error-indicator"></div>');
				});
			}
			cadena+= '</div>';
			$('#main_container').html(cadena);
			
		},
		getRegionalData:function(pos,func,error){
			var obj = this;
			
			var source = $.extend({},obj.main.config.dataSource.global);
			source.type = 'GET';
			source.stringify = false;
			
			var regionals = obj.config.project.reports.regionals;
			var regional = regionals[pos];
			var server = regional.url;
			
			source.url = server+'/userinfo/all';
			var params = {};
			obj.main.getData.getData(source,params,function(data){
				if(data.response.success){
					data.data.time = data.time;
					data.data.pos = pos;
					if($.isFunction(func)){
						func(data.data);	
					}
				}
			},function(){ //si hay error
				if($.isFunction(error)){
					error(pos);
				}
			}
			);
		},
		updateRegional:function(data){
			var obj = this;
			var pos = data.pos;
			if(data.data == 'error'){
				data.error = true;
			}
			var regionals = obj.config.project.reports.regionals;
			regionals[pos].data = data;
		},
		checkMainDataStatus:function(){
			var obj = this;
			var regionals = obj.config.project.reports.regionals;;
			var rdy = true;
			for(var x in regionals){
				if (!regionals[x].data){
					rdy = false;
					break;	
				}
			}
			return rdy;
		},
		getRegional:function(edo){
			var obj = this;
			var regionals = obj.config.project.reports.regionals;
			var _regional = null;
			for(var x in regionals){
				var regional = regionals[x];
				if($.inArray(edo,regional.edos)){
					_regional = regional;
					break;
				}
			}
			return _regional;
		},
		getEdos:function(){
			var obj = this;
			var edos = null;
			
			var phases = obj.main.config.project.reports.phases;
			var maxPhase = obj.main.config.project.reports.maxPhases;
			if(obj.checkMainDataStatus()){
				var regionals = obj.config.project.reports.regionals;
				for(var x in regionals){
					var regional = regionals[x];
					var data = regional.data;
					if(data && !data.error){
						var list = data.info;
						if(list.length > 0){
							var currentEdo = null;
							for(var y in list){
								var edo = list[y];
								currentEdo = edo.cvegeo;
								var type = edo.username.substr(0,2);
								var phase = phases[type];
								//el maximo progreso en todas las fases dividido entre la fase actual + el progreso actual
								//al resultado se convierte en porcentaje
								if(!edos) edos = {};
								if(!edos[edo.cvegeo]){
									edos[edo.cvegeo] = {list:[],sum_progress:0,progress:0};
								}
								edo.real_progress = (((phase.base+edo.stageNumber-1)*100)+edo.progress)/(maxPhase*100)*100 ;
								edos[edo.cvegeo].list.push(edo);
								edos[edo.cvegeo].sum_progress+= (((phase.base+edo.stageNumber-1)*100)+edo.progress)/(maxPhase*100)*100 ;
								edos[edo.cvegeo].progress = edos[edo.cvegeo].sum_progress / edos[edo.cvegeo].list.length;
							}
						}
						
					}	
				}
			}
			return edos;
		}
	}
	return _obj;
});