define(['config','graph','getData','users'],function(config,graph,getData,users){
	return{
		init:function(){
			var obj = this;
			obj.config = config;
			//modulos
			obj.graph = graph;
			obj.getData = getData;
			obj.users = users;
			//inicion de modulos
			obj.graph.init(obj);
			obj.users.init(obj);
			
			
			//Inicia elementos de pagina
			obj.createStructure();
			
			//connecting getDataEvents
			obj.getData.message =function(title,text,type){obj.showMessage(title,text,type)}
			obj.getData.spinnerId = 'report_spinner';
			
			//inicia desplegando el estatus general
			obj.users.loadMainStatus();
		},	
		createStructure:function(){
			var obj = this;

			var cadena = '';
				cadena+= '<div class="row">';
				
				cadena+= '	<div class="col s12" >';
				cadena+= '		<nav>';
    			cadena+= '			<div id="report_header" class="nav-wrapper report-header">';
      			cadena+= '				<a href="#!" class="brand-logo">'+obj.config.proyName+'</a>';
      			cadena+= '				<ul class="right hide-on-med-and-down">';
        		//cadena+= '					<li><a href="sass.html"><i class="material-icons left">search</i>Link with Left Icon</a></li>';
        		cadena+= '					<li><a href="#" id="btn_avance_gral" style="display:none"><i class="material-icons right">assessment</i>Avance general</a></li>';
      			cadena+= '				</ul>';
    			cadena+= '			</div>';
  				cadena+= '		</nav>';
				cadena+= '	</div>';
				
				cadena+= '		<div id="report_spinner" style="display:none">';
				cadena+= '			<div class="progress">';
      			cadena+= '				<div class="indeterminate"></div>';
  				cadena+= '			</div>';
				cadena+= '		</div>';
				cadena+= '	</div>';
				cadena+= '	<div class="col s12">';
				cadena+= '		<div id="main_container" class="center-align">';
				cadena+= '		</div>';
				cadena+= '	</div>';
				cadena+= '</div>';
				
			$('body').html(cadena);
			$('#btn_avance_gral').click(function(){
				obj.mainProgress();
			});
			//obj.graph.showMap();
		},
		createInfo:function(){
			var obj = this;
			var cadena = '<div id="results_container" class="container">';
				cadena+= '	<div class="row" id="results_top">';
				cadena+= '		<div id="title_info" class="col s12"></div>';
				cadena+= '		<div class="col s12">';
				cadena+= '			<div class="row">';
				cadena+= '				<div id="edo_list" class="col s6">';
				cadena+= '				</div>';
				cadena+= '				<div id="edo_graph" class="col s6">';
				cadena+= '				</div>';
				cadena+= '			</div>';
				cadena+= '		</div>';
      			//cadena+= '		<div id="results_middle" class="col s12">4</div>';
				//cadena+= '		<div id="results_bottom" class="col s12">5</div>';
				cadena+= '	</div>';
				cadena+= '</div>';
				
				cadena+= '<div id="report_bottom_modal" class="modal bottom-sheet">';
				cadena+= '	<div id="report_bottom_content" class="modal-content">A';
				cadena+= '	</div>';
				cadena+= '</div>';
				
				
				
			$('#main_container').append(cadena);
			obj.mainProgress('results_top');
			$('#btn_avance_gral').fadeIn();
		},
		mainProgress:function(){
			var obj = this;
			if(!$('#main_gauge_progress').attr('id')){
					var _cadena = '<div id="main_gauge_progress" style="width:200px;height:110px"></div>';
					var opciones ={
								 modal:false,
								 width:250,
								 height:180,
								 buttons:{
									/*"Aceptar": function() {
										if($.isFunction(func))
											func();
										$( this ).dialog( "close" );
									},
									"Cancelar": function() {
										  $( this ).dialog( "close" );
									}*/
								  }
								}
				  var dialog = obj.asDialog('Avance total',_cadena,opciones);
				  dialog.parent().css({top:'50px',left:'20px'});
		 }else{
			$('#main_gauge_progress').html('');	 
		 }
		 obj.graph.showMainProgress('main_gauge_progress');
		  
		},
		printUserChilds:function(id,isMain){
			var obj = this;
			obj.users.getUser(id,isMain,function(data){
				var list = data.value;
				
				if(list.length > 0){
					if(isMain)
						obj.users.data.tree = [id];
					
					obj.printTreeUsers();
					
					var cadena = '<ul class="collection with-header">';
					for(var x in list){
						var user = list[x];
						cadena+= '	<li class="collection-item"><div>'+user.userName+' Carga:'+((user.charge).ceil(4).format())+'<a href="#!" class="btnlist-user secondary-content" value="'+user.user+'"><i class="material-icons">send</i></a></div></li>';
					}
						cadena+= '</ul>';	
					
					$('#report_bottom_content').append(cadena);
					$('#report_bottom_modal').openModal();
					
					$('.btnlist-user').each(function(index, element) {
						$(this).click(function(e){
							var val = $(this).attr('value');
							obj.printUserChilds(val);
							e.stopPropagation();
						});
					});
				
				}else{
					obj.showMessage('Notificacion','NO existen usuarios para listar','system');
				}
			});
		},
		printTreeUsers:function(){
			var obj = this;
			var tree = obj.users.data.tree;
			var edoname = obj.config.project.tabular_edo[tree[0]];
			var cadena = '<nav>';
				cadena+= '	<div class="nav-wrapper">';
				cadena+= '	  <div class="col s12">';
				for(var x in tree){
					var user = tree[x];
					cadena+= '		<a href="#!" class="breadcrumb" value="'+user+'">'+((x=='0')?edoname:user)+'</a>';
				}
				cadena+= '	  </div>';
				cadena+= '	</div>';
				cadena+= '  </nav>';
			
			$('#report_bottom_content').html(cadena);
		},
		asDialog:function(title,content,options){
			var r = null;
			$(function() {
				var today       = new Date();
				var time        = today.getTime();
				var seconds = today.getSeconds(); 
				var semilla     = Math.floor(Math.random()*10000);
				var serie =seconds+''+semilla;
				
				var cadena = '<div id="'+serie+'" title="'+title+'">'+content+'</div>';
				$('body').append(cadena);
				$( "#"+serie ).dialog({
				  resizable: false,
				  height:(typeof(options.height) != 'undefined')?options.height:250,
				  width:(typeof(options.width) != 'undefined')?options.width:230,
				  modal: (typeof(options.modal) != 'undefined')?options.modal:true,
				  buttons:(typeof(options.buttons) != 'undefined')?options.buttons:{},
				  close: function(ev, ui){ $(this).remove();if($.isFunction(options.close)){options.close()}}
				});
				r = $( "#"+serie );
				//   buttons:{
				//	"Delete all items": function() {
				//	  $( this ).dialog( "close" );
				//	},
				//	Cancel: function() {
				//	  $( this ).dialog( "close" );
				//	}
				//  }
			});
			return r;
		},
		showMessage:function(title,text,type){
			 var types = {information:'color:yellow',error:'color:red',warning:'color:yellow',system:'color:blue'};
			 var cadena = '<big class="report-message-title" title" style="'+types[type]+'">'+title+'</big>';
			 	 cadena+= '<blockquote><label class="report-message-content">'+text+'</label></blockquote>';
			 Materialize.toast(cadena, 4000) // 4000 is the duration of the toast	
		}
	}
});