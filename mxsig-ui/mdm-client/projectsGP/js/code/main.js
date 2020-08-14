define(['config','p_users','ui','dialogs','userDetail','graph','uiMapControls','workload','week','division','reports','video'],function(config,p_users,ui,dialogs,userDetail,graph,uiMap,workload,week,division,reports,video){
	var api;
	var mainObject = {
		modules:{
			users:null,
			ui:null
		},
		data:{
			mainUser:{},
			users:{},
			index_user:0,
			loggedIn : false,
			currentActivity:1,
			currentAction:'',
			currentActionData:'',
			module:'',
		},
		init:function(mdmapi){
			var obj = this;
			obj.modules.users = p_users;
			obj.modules.ui = ui;
			obj.modules.dialogs = dialogs;
			obj.modules.userDetail = userDetail;
			obj.modules.graph = graph;
			obj.modules.uiMap= uiMap;
			obj.modules.workload= workload;
			obj.modules.week = week;
			obj.modules.division = division;
			obj.modules.reports = reports;
			obj.modules.video = video;
			
			obj.config = config;
			var server = $.getURLParam('server');
			if(server){
				obj.config.dataSource.server = $.getURLParam('server');
			}
			obj.core = MDM6API;
			
			//iniciacion de modulos
			obj.modules.users.init(obj);
			obj.modules.ui.init(obj);
			obj.modules.dialogs.init(obj);
			obj.modules.userDetail.init(obj);
			obj.modules.graph.init(obj);
			obj.modules.uiMap.init(obj);
			obj.modules.workload.init(obj);
			obj.modules.week.init(obj);
			obj.modules.division.init(obj);
			obj.modules.reports.init(obj);
			obj.modules.video.init(obj);
			//inicio de proyecto con login
			obj.modules.users.login();
		},
		loggedIn:function(data){
			var obj = this;
			obj.modules.ui.createUI();
			obj.modules.ui.reloadInterface(function(){
				var user = obj.data.mainUser;
				setTimeout(function(){
					MDM6('setRestrictedExtent',user.extent);
					setTimeout(function(){
						MDM6('goCoords',user.extent);
					},500);	
				},2000);
			});
			
			
		},
		//	Peticion de Datos **************************************************************************************************
		getData:function(source,params,callback,error,before,complete){
				var obj = this;
				
				//Anexo de parametros que vengan definidos desde fuente de datos
				var s_params = source.params;
				var stringify = source.stringify;
				
				if (!(s_params === undefined)){
					for (var x in s_params){ //anexo de la conifuracion del origen de datos
						params[x] = s_params[x];
					};
				}
				if (!(stringify === undefined) && stringify){
					params = JSON.stringify(params);
				}
				
				var spinner = (source.spinner === undefined)?true:source.spinner;
				//Estructura basica de peticion
				var dataObject = {
					   data: params,
					   success:function(json,estatus){
						   if(json.response){
							  if (!json.response.success){
								  	obj.modules.dialogs.notify('Error',json.response.message,'error');
									if(json.response.message.substr(0,3) == '403'){
										obj.modules.dialogs.notify('Reinicio de sistema','La aplicación se cerrará','warning');
										setTimeout(function(){
											obj.modules.dialogs.logSession();
										},2000);
									}   
							  }else{
								  if(json.response.message && json.response.message != '' && json.response.message.length > 2){ //Omite mensaje OK
									  obj.modules.dialogs.notify('Sistema',json.response.message,'system');
									  
									  if(json.response.message.substr(0,3) == '403'){
										   obj.main.modules.dialogs.logSession();
									   }
								  }
								  callback(json,estatus);
							  }
						   }
					   },
					   beforeSend: function(solicitudAJAX) {
							if (spinner){
								var count = parseInt($('#mdmp_spinner').attr('count'),10);
								count = (count === undefined)?1:count;
								$('#mdmp_spinner').css('display','').attr('count',(count+1));
							}
							if ($.isFunction(before)){
								before(params);
							};
					   },
					   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
						   obj.modules.dialogs.notify('Error de comunicación','El servicio de datos no esta disponible, favor de intentarlo mas tarde','error');
							if ($.isFunction(error)){
								error(errorDescripcion,errorExcepcion);
							};
					   },
					   complete: function(solicitudAJAX,estatus) {
							if (spinner){
							   var count = $('#mdmp_spinner').attr('count');
							   if (!(count === undefined)){
								   count = parseInt(count,10);
								   count--;
								   $('#mdmp_spinner').attr('count',count);
								   if (count <= 0)
									 $('#mdmp_spinner').css('display','none');
							   }
						   }
							if ($.isFunction(complete)){
								complete(solicitudAJAX,estatus);
							};
					   }
				};
				//anexo de la conifuracion del origen de datos
				for (var x in source){ 
					if ( !(/field|name|id|params|stringify/.test(x)))dataObject[x] = source[x];
				};
				jQuery.support.cors = true;
				$.ajax(dataObject);
		}
	}
	return mainObject;
});