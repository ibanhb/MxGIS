$.widget( "custom.panelList", {
      id:'',
	  icons:{
		  		instance:'panelList-close',
				persistent:'panelList-point'
	  		},
      // default options
      options: {
		  act:null,
		  user:null,
		  panels:[],
		  speedCourtain:350
      },
	  //Construccion de paneles
	  updatePanel:function(data){
		
		var obj = this;	  
		var user = data.user;
		var act = data.act;

		obj.options.user = user;
		
	    var id = data.id;
		var panels = obj.options.panels;
		var panel = {};
		
		for (var x in panels){
			if (panels[x].id == id){
				panel  = panels[x];	
			}
		}
		
		var valText = ''
		switch (act){
			case 1:
				valText = user.charge+'/'+user.maxCharge;
			break;
			case 2:
				valText = (user.chargueWeek != null)?user.chargueWeek:0;
			break;
			case 3:
				valText = user.charge+':'+((user.chargueWeek != null)?user.chargueWeek:0);
			break;
		 }
		
		
		if (panel.type == 'persistent-level'){
			var lvl = user.path;
			var label = user.userName;
			var classIcon = (lvl.length == 0)?'panelList-point':'panelList-back';

			$('#'+id).attr('level',lvl.length);
			$('#'+id+'_header_icon').removeClass('panelList-point panelList-back')
									.addClass(classIcon);
			$('#'+id+'_header_info').attr('idref',user.user);
			$('#'+id+'_header_title').html(label);
			$('#'+id+'_header_toolset').html(valText);
		}
		  
	  },
	  getPanels:function(){
		  var obj = this;
		  var panels = obj.options.panels;
		  var user = obj.options.user;
		  if (user == null)user=-1;
		  /*
		  {id:'reports',title:'Reportes',height:300,type:'instance'},
		  {id:'listUsers',title:'Juan perez de la Serna',height:'',type:'persistent'}
		  
		  */
		  
		  var cadena = '';
		  for (var x in panels){
			  	var panel = panels[x];
				var attrs = '';
				var icon = ' panelList-close ';
				var style= '';
				var contentStyle='';
				switch (panel.type){
					case 'instance':
						icon = ' panelList-close';
						style = (!panel.opened)?' display:none':'';
					break;
					case 'persistent-level':
						attrs+= ' level = "'+panel.level+'" ';
						icon = (panel.level == 0)?' panelList-point':' panelList-back';
						contentStyle = (!(panel.height == undefined))?' height:'+panel.height+'px;overflow-y:auto;overflow-x:hidden;':'';
					break;
					case 'courtain':
						icon = (panel.opened)?' panelList-up ':' panelList-down ';
						style = (!panel.opened)?' height:39px':'';
					break;
				}
				
				cadena+='<div id="'+panel.id+'" style="'+style+'" class="panelList-panel" opened="'+panel.opened+'" '+attrs+' type="'+panel.type+'">';
				cadena+='	<div id="'+panel.id+'_header" class="panelList-header cw-shadow">';
				cadena+='		<div class="panelList-header-icon" idref="'+panel.id+'" type="'+panel.type+'"><div id="'+panel.id+'_header_icon"  class="panelList-plantilla '+icon+'"></div></div>';
				cadena+='		<div class="panelList-header-info panelList-plantilla panelList-info" idref="'+user.user+'" id="'+panel.id+'_header_info"></div>';
				cadena+='		<div class="panelList-header-title" id="'+panel.id+'_header_title">'+panel.title+'</div>';
				cadena+='		<div class="panelList-header-toolset" id="'+panel.id+'_header_toolset"></div>';
				cadena+='	';
				cadena+='	</div>';  
				cadena+='	<div id="'+panel.id+'_content" style="'+contentStyle+'" class="panelList-content">'+panel.content+'</div>';  
				cadena+='</div>';
				
		  }
		  
		  return cadena;
	  },
	  showPanel:function(id){
		  var element = $('#'+id);
		  if (element.attr('opened') != 'true'){
			  if (element.attr('enable') == 'true' || element.attr('enable') == undefined){
				  element.attr('enable','false');
				  $('#'+id).slideDown('slow',function(){
					  element.attr('enable','true');
					  element.attr('opened','true');
				  });
			  }
	  	  }
	  },
	  hidePanel:function(id){
		  var element = $('#'+id);
		  if (element.attr('opened') == 'true'){
			  if (element.attr('enable') == 'true' || element.attr('enable') == undefined){
				  element.attr('enable','false');
				  $('#'+id).slideUp('slow',function(){
					  element.attr('enable','true');
					  element.attr('opened','false');
				  });
			  }
	  	  }
	  },
	  switchPanel:function(id){
		  var obj = this;
		  if ($('#'+id).attr('opened') == 'true'){
			obj.hidePanel(id);	
		  }else{
			obj.showPanel(id);	
		  }
	  },
	  openPanel:function(id){
		  var obj = this;
		  var element = $('#'+id);
		  if (element.attr('enable') == 'true' || element.attr('enable') == undefined){
			  element.attr('enable','false');
			  var height = element.height();
			  var targetHeight = $('#'+id+'_content').height()+35;
			  element.css('height',height+'px')
					 .animate({'height':targetHeight+'px'},obj.options.speedCourtain,function(){
						element.attr('enable','true')
						.css('height','')
						.attr('opened','true');
						if ($('#'+id).attr('type') == 'courtain')
							$('#'+id+'_header_icon').addClass('panelList-up').removeClass('panelList-down');
					  });
		  }
	  },
	  closePanel:function(id){
		  var obj = this;
		  var element = $('#'+id);
		  if (element.attr('enable') == 'true' || element.attr('enable') == undefined){
			  element.attr('enable','false');
			  var height = element.height();
			  element.css('height',height+'px')
					 .animate({'height':'29px'},obj.options.speedCourtain,function(){
						element.attr('enable','true')
						.attr('opened','false');
						if ($('#'+id).attr('type') == 'courtain')
							$('#'+id+'_header_icon').addClass('panelList-down').removeClass('panelList-up');
					  });
		  }
		  		
	  },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass( "custom-panelList cw-boxBorder" )
          // prevent double click to select text
          .disableSelection();
		  
		  var panels = obj.getPanels();
          obj.element.html(panels);
		  
		  $('#'+obj.id+' .panelList-header-icon[type="instance"]').each(function(){
				$(this).click(function(e){
					var id = $(this).attr('idref');
					/*
					if ($('#'+id).attr('opened') == 'true'){
						obj.closePanel(id);	
					}else{
						obj.openPanel(id);	
					}*/
					obj.hidePanel(id);	
				});
		  });
		  
		  $('#'+obj.id+' .panelList-header-icon[type="courtain"]').each(function(){
				$(this).click(function(e){
					var id = $(this).attr('idref');
					if ($('#'+id).attr('opened') == 'true'){
						obj.closePanel(id);	
					}else{
						obj.openPanel(id);	
					}
				});
		  });

		  $('#'+obj.id+' .panelList-header-icon').each(function(){
			  $(this).click(function(e){
				  	var level = $('#'+$(this).attr('idref')).attr('level');
					if (!(level === undefined) && (parseInt(level) > 0 )){
						obj.options.onAction($(this).attr('idref'),parseInt(level));
					}
					e.stopPropagation();
			  });
		  });
		  
		  $('#'+obj.id+' .panelList-header-info').each(function(){
			    $(this).click(function(e){
					var user = parseInt($(this).attr('idref'),10);
					obj.options.onAction('info',user);
					e.stopPropagation();
		  		});
		  });
		  
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-panelList" )
          .enableSelection()
          .css( "background-color", "transparent" );
        },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        this._super( key, value );
      }
    });
//@ sourceURL=jquery.ui.panelList.js