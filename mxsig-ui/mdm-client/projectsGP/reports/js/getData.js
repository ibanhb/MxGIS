define(function(){
	return{
		spinnerId:'',
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
				var time = new Date();
				var dataObject = {
					   data: params,
					   success:function(json,estatus){
						   if (spinner){
							   obj.hideSpinner();
						    }
						   if(json.response){
							   json.time =  new Date() - time;
							  if (!json.response.success){
								  	obj.modules.dialogs.notify('Error',json.response.message,'error');
									if(json.response.message.substr(0,3) == '403'){
										obj.message('Reinicio de sistema','La aplicación se cerrará','warning');
										setTimeout(function(){
											obj.modules.dialogs.logSession();
										},2000);
									}   
							  }else{
								  if(json.response.message && json.response.message != '' && json.response.message.length > 2){ //Omite mensaje OK
									  obj.message('Sistema',json.response.message,'system');
									  
									  if(json.response.message.substr(0,3) == '403'){
										  // obj.main.modules.dialogs.logSession();
									   }
								  }
								  callback(json,estatus);
							  }
						   }
					   },
					   beforeSend: function(solicitudAJAX) {
							if (spinner){
								obj.showSpinner();
							}
							if ($.isFunction(before)){
								before(params);
							};
					   },
					   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
						   obj.message('Error de comunicación','El servicio de datos no esta disponible, favor de intentarlo mas tarde','error');
							if ($.isFunction(error)){
								error(errorDescripcion,errorExcepcion);
							};
							if (spinner){
							   obj.hideSpinner();
						    }
					   },
					   complete: function(solicitudAJAX,estatus) {
							
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
		},
		showSpinner:function(){
			var obj = this;
			var spinner = $('#'+obj.spinnerId);
			var count = parseInt(spinner.attr('count') || 0,10);
			spinner.css('display','').attr('count',(count+1));	
		},
		hideSpinner:function(){
			var obj = this;
			var spinner = $('#'+obj.spinnerId);
			var count = spinner.attr('count');
		    if (!(count === undefined)){
			   count = parseInt(count,10);
			   count--;
			   spinner.attr('count',count);
			   if (count <= 0)
				 spinner.css('display','none');
		    }
		},
		message:function(title,text,type){
			
		}
	}
})
