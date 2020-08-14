$.widget( "custom.ccnago_catastro", {
  // default options
  options: {
	  config:null,
	  onActive:function(){
		  
	  },
	  onClose:function(){
		  
	  }
  },
  geoStructure:{
	  tree:[],
	  ids:[]
  },
  currentData:null,
  currentTreeVar:null,
  themeCreated:false, 
  hasChanged:false,
  showStratsMessage:false,
  firstBoot:true,
  // the constructor
  setDefaultVarByLevel:function(){
	  var obj = this;
	  var cData = obj.currentData;
	  var level = cData.geoLevelActive;
	  var isNal = (cData.geoSelected.join() == '00');
	  var lvlName = (isNal)?'nal':'lv'+level;
	  var varLevels = obj.options.config.settings.varByLevel;
	  cData.varActive = varLevels[lvlName];
	  cData.indicatorLevelParent = cData.varActive.parent;
	  var idTab =  cData.varActive.idTab;
  },
  _create: function() {
	var obj = this;
	  
	obj.id = obj.element.attr('id');
	//load Data configuration   Proceso de carga inicial ---------------------------------------------------------------------------------------------------
	obj.loadConfiguration(function(geoLevels){
			obj.processGeoLevels(geoLevels.data.data);
			//changeDefault geo  
			var pos = MDM6('getMyLocation');

			//obj.options.config.startingData.geoSelected = ['00'];//[pos.cityCode];
			obj.element.attr('cantheme',false); //deshabilita paneles si viene en 00
			setTimeout(function(){  //abre la configuración
				obj.openConfig();
				setTimeout(function(){
					$("#ccnago_catastro_geo_content").Popup({content:'Seleccione una entidad para comenzar',showOn:'now',highlight :false,time:6000});
				},1500);
			},1500);
			obj.currentData = $.extend({},true,obj.options.config.startingData);
			obj.setDefaultVarByLevel();
		
			obj.settings = $.extend({},true,obj.options.config.settings);
			obj.element
			  // add a class for theming
			  .addClass( "custom-ccnago_catastro toolCustomIdentify ccnago_catastro-animated" ).attr('collapsed','true').attr('seltab','geo').attr('changed','false').attr('geotype',obj.currentData.geoType)
			  .attr('infopanel','data')
			  // prevent double click to select text
			  .disableSelection();
			obj.id = obj.element.attr('id');

			obj.element.addClass('no-print');

			obj.options.onStart();  
			obj.createUI();

			//obj.gotoMyLocation();

			obj.options.onActive();  

			obj._refresh();

			var url = obj.options.config.settings.bootDialog;
			obj.openDialog(url,obj.options.config.settings.bootDialogTitle);
		
	}); //fin de proceso de carga inicial -----------------------------------------------------------------------------------------------------------------
  },
	
  // called when created, and later when changing option
  _refresh: function() {
	  // trigger a callback/event
	  var obj = this;
	  
	  
	  
  },

  // events bound via _on are removed automatically
  // revert other modifications here
  _destroy: function() {
	this.options.onClose();
	this.onClose();
	this.element
	  .removeClass( "custom-ccnago_catastro" )
	  .enableSelection();
  },

  // _setOptions is called with a hash of all options that are changing
  // always refresh when changing options
  _setOptions: function() {
	// _super and _superApply handle keeping the right this-context
	this._superApply( arguments );
	this._refresh();
  },
  getCurrentGeoLevel:function(){
	  var obj = this;
	  var levels = obj.options.config.settings.geoLevels;
	  var level = obj.currentData.geoLevel;
	  var r = null;
	  for(var x in levels){
		  if(levels[x].level == (level+1)){
			  r = levels[x];
			  break;
		  }
	  }
	  return r;
  },
  processGeoLevels:function(geoLevels){
	  var obj = this;
	  var levels = obj.options.config.settings.geoLevels;
	  var getGeoLevel = function(level){
		  var r = null;
		  for(var x in geoLevels){
			  if(geoLevels[x].level == level){
				  r = geoLevels[x];
				  break;
			  }
		  }
		  return r;
	  }
	  for(var x in geoLevels){
	  	
		 var elem = geoLevels[x];
		 var sub = elem.level_theme;
		 if(sub){
			 var list = sub.split(',');
			 var tlist = [];
			 for(var y in list){
				 item = getGeoLevel(list[y]);
				 tlist.push({id:item.alias,label:item.label})
				 
			 }
		 }
		 elem.themes = tlist;
		 levels.push(elem);
	  }
  },
  loadConfiguration:function(func){
	 	var obj = this;
		var cData = obj.currentData;

		var ds = obj.options.config.dataSources;
		var dataSource = $.extend(true,{},ds.getGeoConfig);
		 obj.getData(dataSource,{},function(data){
			 if($.isFunction(func))
				 func(data);
	 	});
  },
  // _setOption is called for each individual option that is changing
  _setOption: function( key, value ) {
	// prevent invalid color values
	this._super( key, value );
  },
  gotoMyLocation:function(){
	var obj = this;
	var pos = MDM6('getMyLocation');
	//obj.options.extent('POINT('+pos.lon+','+pos.lat+')');
	obj.gotoExtent(pos.cityCode);
  },
	
  getVarsData:function(){
	var obj = this;
	if(obj.element.attr('collapsed') == 'true'){
		return obj.currentData;
	}else{
		return obj.backupData;
	}
  },
  //------------------------
	updateRampStrat:function(){
		var obj = this;
		var cd = obj.currentData; 
		var strats = cd.strats;
		
		var cadena = '';
		cadena += '<div class="ccnago_catastro-header-colors-years-label"><div id="ccnago_catastro-year-min" class="ccnago_catastro-header-year-label-left"></div><div id="ccnago_catastro-year-max" class="ccnago_catastro-header-year-label-right"></div></div>';

		var colors = obj.currentData.colors.colors;
		for (var x in colors) {
			if(parseInt(x,10) < strats){
				var color = colors[x];
				cadena += '<div class="ccnago_catastro-header-colors-item" style="background-color:' + color + ';width:' + Math.floor(100 / strats) + '%"></div>';
			}
		}
		cadena += '</div>';
		
		$('#ccnago_catastro_color_container').html(cadena);

	},
   createUI:function(){
	  var obj = this;
	  var cd = obj.currentData;  
	  obj.printGeoList();
	  var 	cadena = '<div id="ccnago_catastro_header" class="ccnago_catastro-header ccnago_catastro-resize ccnago_catastro-transition">';
			cadena+=	'<div id="ccnago_catastro_header_click_collapsed"></div>';
	   		cadena+=	'<div id="ccnago_catastro_header_logoLeft" idref="" class="ccnago_catastro-logo-left"></div>';
	   		cadena+=	'<div id="ccnago_catastro_header_title" class="ccnago_catastro-truncate-text"><div id="ccnago_catastro_var_title">Seleccione una variable</div><div id="ccnago_catastro_subvar_title_container"><div id="ccnago_catastro_subvar_title"></div></div></div>';
	   		cadena+=	'<div class="ccnago_catastro-header-btns">';
	   		cadena+=	'	<div id="ccnago_catastro_header_btnRight" idref="" class="ccnago_catastro-header-btn">';
			cadena+=	'		<div id="ccnago_catastro_header_btnRight_modify" idref="" class="ccnago_catastro-header-btn-inner sprite-ccnago_catastro sprite-ccnago_catastro-modify"></div>';
	   		cadena+=	'		<div id="ccnago_catastro_header_btnRight_ok_nm" idref="" class="ccnago_catastro-header-btn-inner sprite-ccnago_catastro sprite-ccnago_catastro-down"></div>';
			cadena+=	'		<div id="ccnago_catastro_header_btnRight_ok_n" idref="" class="ccnago_catastro-header-btn-inner sprite-ccnago_catastro sprite-ccnago_catastro-down"></div>';
	   		cadena+=	'	</div>';
	   		cadena+=	'	<div id="'+obj.id+'_header_btnRight_close" idref="" class="ccnago_catastro-header-btnRight-close ccnago_catastro-header-btn-inner sprite-ccnago_catastro sprite-ccnago_catastro-info"></div>';
	   		cadena+=	'</div>';
			cadena+=	'<div class="ccnago_catastro-header-colors" id="ccnago_catastro_color_container">';
	   		/*cadena+=	'<div class="ccnago_catastro-header-colors-years-label"><div id="ccnago_catastro-year-min" class="ccnago_catastro-header-year-label-left"></div><div id="ccnago_catastro-year-max" class="ccnago_catastro-header-year-label-right"></div></div>';

			var colors = obj.currentData.colors.colors;
	   		for(var x in colors){
				var color = colors[x];
				cadena+=	'<div class="ccnago_catastro-header-colors-item" style="background-color:'+color+';width:'+Math.floor(100/colors.length)+'%"></div>';
			}
	   
			cadena+=	'</div>';*/
	   
	  		cadena+= '	</div>';
			cadena+= '<div id="ccnago_catastro_panels_container" class="ccnago_catastro-panels-container ccnago_catastro-animated" panel="vars" style="padding-top:2px";>';
	   		cadena+= '	<div id="ccnago_catastro_container" class="ccnago_catastro-container ccnago_catastro-tab-container" parents="false" typeselection="'+obj.currentData.typeVarSelection+'">';

	   		cadena+= '		<div id="ccnago_catastro_geo_content_options" class="ccnago_catastro-geo-content-options ccnago_catastro-resize ccnago_catastro-animated">';
			cadena+= '			<div idref="edomun" id="ccnago_catastro_tool_total" class="ccnago_catastro-tool-option ccnago_catastro-tool-total">TOTAL</div>';
	   		cadena+= '			<div idref="edo" id="ccnago_catastro_tool_edo" class="ccnago_catastro-tool-option ccnago_catastro-tool-total">EDO</div>';
	   		cadena+= '			<div idref="mun" id="ccnago_catastro_tool_mun" class="ccnago_catastro-tool-option ccnago_catastro-tool-total">MUN</div>';
			cadena+= '		</div>';
			
	   		cadena+= '		<div id="ccnago_catastro_content" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-content"></div>';
	   		cadena+= '		<div id="ccnago_catastro_bk_btn" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-bk-btn"><div class="ccnago_catastro-bk-btn-icon sprite-ccnago_catastro sprite-ccnago_catastro-bback"></div></div>';
			cadena+= '	</div>';
	   		cadena+= '	<div id="ccnago_catastro_geo_container" class="ccnago_catastro-geo-container ccnago_catastro-tab-container">';
			cadena+= '		<div id="ccnago_catastro_geo_bk_btn" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-geo-bk-btn"><div class="ccnago_catastro-geo-bk-btn-icon sprite-ccnago_catastro sprite-ccnago_catastro-bback"></div></div>';
	   		cadena+= '		<div id="ccnago_catastro_geo_content" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-geo-content"></div>';
	   		cadena+= '		<div id="ccnago_catastro_geo_type" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-geo-type">';
			cadena+= '		</div>';
			cadena+= '	</div>';
	   		cadena+= '	<div id="ccnago_catastro_conf_container" class="ccnago_catastro-conf-container ccnago_catastro-tab-container">';
			cadena+= '		<div id="ccnago_catastro_conf_content" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-conf-content"></div>';
			cadena+= '	</div>';
	   		cadena+= '	<div id="ccnago_catastro_info_container" class="ccnago_catastro-info-container ccnago_catastro-tab-container">';
			cadena+= '		<div id="ccnago_catastro_info_content" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-info-content"></div>';
	   		cadena+= '		<div id="ccnago_catastro_info_tabulated" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-info-tabulated"></div>';
	   		cadena+= '		<div id="ccnago_catastro_info_graph" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-info-graph"></div>';
			cadena+= '	</div>';

			/*cadena+= '<div id="ccnago_catastro_info_container" class="ccnago_catastro-info-container ccnago_catastro-tab-container">';
			cadena+= '		<div id="ccnago_catastro_info_content" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-info-content"></div>';
	   		cadena+= '		<div id="ccnago_catastro_info_tabular" class="ccnago_catastro-resize ccnago_catastro-animated ccnago_catastro-info-graph"></div>';
			cadena+= '	</div>';*/
	   		cadena+= '</div>';
	   
	   		cadena+= '<div id="ccnago_catastro_toolbar_container" class="ccnago_catastro-toolbar-container ccnago_catastro-animated">';
	   		cadena+= '	<div id="ccnago_catastro_tab_geo" idref="geo" class="ccnago_catastro-resize ccnago_catastro-tab"><div class="sprite-ccnago_catastro-globe"></div><div>Geográfico</div></div>';
	   		cadena+= '	<div id="ccnago_catastro_tab_vars" idref="var" class="ccnago_catastro-resize ccnago_catastro-tab"><div class="sprite-ccnago_catastro-vars"></div><div>Indicador</div></div>';
	   		cadena+= '	<div id="ccnago_catastro_tab_graph" idref="graph" class="ccnago_catastro-resize ccnago_catastro-tab"><div class="sprite-ccnago_catastro-graph"></div><div>Estratos</div></div>';
	   		cadena+= '	<div id="ccnago_catastro_tab_info" idref="info" class="ccnago_catastro-resize ccnago_catastro-tab"><div class="sprite-ccnago_catastro-binfo"></div><div>Detalle</div></div>';
	   		cadena+= '	<div id="ccnago_catastro_tab_bottom_container" idref="_info" class="ccnago_catastro-tab-bottom-container ccnago_catastro-animated">';
			cadena+= '		<a href="'+obj.settings.mainDoc+'" target="_blank"><div id="ccnago_catastro_tab_pdfdoc" idref="pdfdoc" class="ccnago_catastro-resize sprite-ccnago_catastro-doc-pdf"></div></a>';
			cadena+= '	</div>';
	   		cadena+= '	<div class="ccnago_catastro-disable-toolbars"></div>';
			cadena+= '</div>';

	  obj.element.html(cadena);
	   
	  //obj.updateRampStrat(); 
	  	
	   $('.ccnago_catastro-tool-option').each(function(){
		  $(this).click(function(){
			 var idref = $(this).attr('idref');
			 
			 if(idref != obj.currentData.typeVarSelection){
				obj.hasChanged = true;	  
				$('#ccnago_catastro_container').attr('typeselection',idref);
				 obj.currentData.typeVarSelection = idref;
				 obj.updateHeader();
				 
				 obj.prepareTheme();
			 }
		  });
	   });
	   $('#ccnago_catastro_header_click_collapsed').click(function(){
			$('#ccnago_catastro_header_btnRight').click();	   
	   });
	   
	   $('#'+obj.id+'_header_btnRight_close').click(function(e){
		   var url = obj.options.config.settings.bootDialog;
		   obj.openDialog(url,obj.options.config.settings.bootDialogTitle);
		   e.stopPropagation();
	   });
	   
	   $('.ccnago_catastro-tab').each(function(){
		   $(this).click(function(e){
			   var idref = $(this).attr('idref');
			   obj.element.attr('seltab',idref);
			   e.stopPropagation();
		   })
	   });
	   
	   
	  $('#ccnago_catastro_header').click(function(e){
			  if($('#ccnago_catastro_panels_container').height() == 0){
				//obj.openConfig();
				e.stopPropagation();
			  }
   	 });

	  
	  $('#ccnago_catastro_header_btnRight').click(function(){
		  if($('#ccnago_catastro_panels_container').height() == 0){
			obj.openConfig();
		  }else{
			obj.closeConfig();
		  }
	   });
	   $('#ccnago_catastro_geo_bk_btn').click(function(){
		   if(obj.currentData.geoLevel > 0){
			  obj.currentData.geoLevel--;
			  obj.currentData.geoIndex = obj.geoStructure.tree[obj.currentData.geoLevel].parent;
			  obj.printGeoList();
			  //obj.currentData.tree.pop();
			  
		   }
	   });
	   $('#ccnago_catastro_bk_btn').click(function(){
		   if(obj.currentData.tree.length > 1){
			  obj.currentData.tree.pop();
			  if(obj.currentData.tree.length <= 1){
				  $('#ccnago_catastro_container').attr('parent','false');
			  }
			  obj.loadTree(obj.currentData.tree[obj.currentData.tree.length-1].id,true);
		   }
	   });
	  
	  obj.element.fadeIn();
	  
  },
//print geoTypes
 printGeoTypes:function(){
	var obj = this;
	var geo = obj.currentData.geoSelected[0]; 
	var cData = obj.currentData;
	var level = obj.currentData.geoLevel;
	var geoLevels = obj.options.config.settings.geoLevels;
	var currentMapTheme = obj.currentData.currentMapTheme;
	if(!currentMapTheme){
		obj.currentData.currentMapTheme = geoLevels[level].themes[0].id;
		currentMapTheme = geoLevels[level].themes[0].id;
	}
	var canBeSelected = function(id){
		var r = false;
		if(obj.backupData && obj.backupData.geoLevel == cData.geoLevel){
			var types = geoLevels[level].themes;
			for(var x in types){
				if(types[x].id == currentMapTheme)
					r = true;
			}
		}
		return r;
	}
	 
	var list = geoLevels[level].themes;
	var cadena = '';
	 
	for(var x in list){
		var sItem = list[x];
		var isSelected = (currentMapTheme == sItem.id && canBeSelected())?'selected':'';

		cadena+= '<div idref="'+sItem.id+'" class="ccnago_catastro-geotype-item '+isSelected+'">'+sItem.label+'</div>';
	}
	

	$('#ccnago_catastro_geo_type').html(cadena);
	$('.ccnago_catastro-geotype-item').each(function(){
		$(this).click(function(){
			if(canBeSelected()){
				var idref = $(this).attr('idref');
				obj.currentData.currentMapTheme = idref;
				$('.ccnago_catastro-geotype-item.selected').removeClass('selected');
				$(this).addClass('selected');
				obj.updateHeader();
				obj.prepareTheme();
			}
		});
	});
	
 },
 //--------- Vars Display-----------------------------------------------------------------
  reloadTree:function(){
	  var obj = this;
	  var id = obj.currentData.tree[obj.currentData.tree.length-1].id;
	  obj.loadTree(id,true);
  },
  loadTree:function(id,reload){
	  var obj = this;
	  var cData = obj.currentData;
	  var currentLevelData = obj.getCurrentGeoLevel().level;
	  var ds = obj.options.config.dataSources;
	  var dataSource = $.extend(true,{},ds.varlist);

	  var params = {
		  		id:id,
		  		level:(cData.geoLevelActive == 'nal')?1:cData.geoLevelActive+1
		  }

	  if(!reload || obj.currentData.tree.length == 0){
		  obj.getData(dataSource,params,function(data){
			   //si el elemento es una recarga no agrega el elemento al arbol de peticiones
			  if(data.data && data.data.data){
				   var list = data.data.data || [];
				   
				  for(var x in list){
					  list[x].geoLevel = cData.geoType;
				  }

				   obj.currentData.tree.push({id:id,list:list});
				   //si hay mas de un nivel, coloca el boton de regreso
				   $('#ccnago_catastro_container').attr('parent','false');
				   if(obj.currentData.tree.length > 1){
						$('#ccnago_catastro_container').attr('parent','true');
				   }
				   
				   if(data && data.data && list){
					   obj.printItemList(list);
				   }
			   }
			   
		  });
	  }else{
		  obj.printItemList(obj.currentData.tree[obj.currentData.tree.length-1].list);
	  }
  },
  getTreeVars:function(){
  	var obj = this;
  	var r = null;
  	var svars = [];
  	if(obj.currentData.tree.length > 1){

	  var ttree = $.extend({},obj.currentData.tree);
	  var svars = [];
	  var size = function(){var c = 0; for(var x in ttree){c++;}return c}();
	  var count = 0;
	  for(var x in ttree){
		  var item = ttree[x];
		  var sel = (size-1 > parseInt(x))?ttree[parseInt(x)+1].id:null;
		  var list = item.list;
		  if(sel){
			  for(var y in list){
				  if(list[y].id == sel){
						svars.push(list[y]);  
					break;
				  }
			  }
		  }else{
			 /* if(count == 0){
				  svars.push(list[y].descripcion);  
			  }*/
		  }

		  count++;
	  }
	  //svars.splice(-1,1);
	}else{

	}
	return svars;
  },
  updateHeader:function(){
	var obj = this;
	var _var = obj.currentData.varActive;
	  
	//actualiza variable que determina si se presentarán o no los totales
	var geoType = obj.currentData.geoType;
	var typeVar = obj.currentData.typeVarSelection;
	obj.currentData.showTotal = 'mun';

	if(geoType == 'edo'){
		obj.currentData.showTotal = typeVar;
	}

	obj.element.attr('geotype',obj.currentData.geoType);

	if(obj.currentData.tree > 0 || obj.currentData.tree.length > 0 ){
	 $('#ccnago_catastro_var_title').html(_var.descripcion);
	}

	var svars = [];
	if(obj.currentData.tree.length > 1){

	  var ttree = $.extend({},obj.currentData.tree);

	  
	  var size = function(){var c = 0; for(var x in ttree){c++;}return c}();
	  var count = 0;
	  for(var x in ttree){
		  var item = ttree[x];
		  var sel = (size-1 > parseInt(x))?ttree[parseInt(x)+1].id:null;
		  var list = item.list;
		  if(sel){
			  for(var y in list){
				  if(list[y].id == sel){
					svars.push(list[y].descripcion);  
					break;
				  }
			  }
		  }else{
			 /* if(count == 0){
				  svars.push(list[y].descripcion);  
			  }*/
		  }
		  count++;
		  
	  }
	  //svars.splice(-1,1);
	}
	 
//	var endText = 'a nivel '+obj.options.config.settings.geoTypes[parseInt(obj.currentData.geoType)-1].val;
	  
//	$('#ccnago_catastro_subvar_title').html(svars.join('/')+' '+endText);

	$('#ccnago_catastro_subvar_title').html(svars.join('<br/>'));
	//obj.findCurrentValue();
	obj.element.attr('changed',obj.hasChanged);
	//imprime valores de tema en min max
  },
  printItemList:function(list){
	  var obj = this;
	  var cadena = '';
	  var count = 0;
	   for (var x in list){
		   var item = list[x];
		   var active = (obj.currentData.varActive && obj.currentData.varActive.id == item.id);
		   var canSelect = (item.theme);
			cadena+= '<div class="ccnago_catastro-list-item" idref="'+item.id+'"><label class="ccnago_catastro-info-grid-container-icons">';
		   
		   if(item.metadata)
			cadena+= '	<span idref="'+item.variable+'" class="ccnago_catastro-info-var-icon sprite-ccnago_catastro-info"></span>';
		    cadena+= 	item.descripcion+'</label>';

			if(canSelect){
				if(!active){
					cadena+= '	<div idref="'+item.id+'" class="ccnago_catastro-item-check sprite-ccnago_catastro sprite-ccnago_catastro-circle"></div>';   
				}else{
					cadena+= '	<div idref="'+item.id+'" class="ccnago_catastro-item-check sprite-ccnago_catastro sprite-ccnago_catastro-ok"></div>';   
				}
			}
			obj.findCurrentValue();
			
			if(item.subcat){
				cadena+= '<div idref="'+item.id+'" class="ccnago_catastro-item-forward sprite-ccnago_catastro sprite-ccnago_catastro-forward"></div>';   
				obj.findCurrentValue();
			}
			cadena+= '</div>';
	   }
	   $('#ccnago_catastro_content').html(cadena);
	  
	   $('.ccnago_catastro-info-var-icon').each(function(){
		  $(this).click(function(){
			  var idref = $(this).attr('idref');
			  obj.openMetadataVar(idref);
		  });
	   });
	  
	   $('.ccnago_catastro-item-check').each(function(index, element) {
		   $(this).click(function(e){
				var idref = $(this).attr('idref');
				obj.selectVar(idref);
				obj.currentTreeVar = obj.getTreeVars();
				e.stopPropagation();
		   })
		});
	   
	   $('.ccnago_catastro-item-forward').each(function(index, element) {
		   $(this).click(function(e){
				var idref = $(this).attr('idref');
			   	obj.selectIndex(idref);
				e.stopPropagation();
		   })
		});
  },
  getVar:function(id){
	  var obj = this;
	  var r = null;
	  var list = obj.currentData.tree[obj.currentData.tree.length-1].list;
	  for(var x in list){
		  var item = list[x];
		  if(item.id == id){
			 r = item; 
			 break;
		  } 
	  }
	  return r;
  },
//------------------Geo display---------------------------------------	
 gotoExtent:function(cvegeo){
	var obj = this;
	var ds = obj.options.config.dataSources;
	 
	var cData = obj.currentData; 
	var alias = obj.options.config.settings.geoLevels[cData.geoLevel].alias;
	 
	var dataSource = $.extend(true,{},ds.getExtent);
	  obj.getData(dataSource,{alias:alias, cve:cvegeo},function(data){
		  if(data.response.success){
				var extent = data.data.data.extent;
			  	obj.options.extent(extent);
		  }
	  });
 },
 getGeoListItems:function(func){
	var obj = this;
	var cData = obj.currentData;
	 
	obj.getGeoList(obj.currentData.geoIndex,function(data){
		if(data && data.data){
			var list = 	data.data;
			/*if(cData.geoLevel == 0){
				list.push([{childs:false,cvegeo:"00",nombre:"Nacional"}]);
			}*/
			func(list);
		}
	});
	
 },
 printGeoList:function(isRefresh){
	var obj = this;
	 
	 var printList = function(list){
		if(list.length > 0){
			var cadena = '';
			for(var x in list){
					var item = list[x];

					item.nombre = item.Nombre;
					var isChild = (obj.currentData.geoLevel > 0);
					$('#ccnago_catastro_geo_container').attr('parent',isChild);
				
					var isSelected = (obj.currentData.geoSelected.indexOf(item.cvegeo) >= 0);
					cadena+= '<div class="ccnago_catastro-geoEdo-item" label="'+item.nombre.toLowerCase()+'" idparent="'+parent+'"  idref="'+item.cvegeo+'" '+((isSelected)?'selected="selected"':'')+'>';
					cadena+= '	<div class="ccnago_catastro-geoEdo-item-label">'+item.nombre+'</div>';
					cadena+= '	<div class="ccnago_catastro-geoEdo-icon" idref="'+item.cvegeo+'">';
					cadena+= '		<div class="ccnago_catastro-geoEdo-icon-sel sprite-ccnago_catastro-circle"></div>';
					cadena+= '		<div class="ccnago_catastro-geoEdo-icon-unsel sprite-ccnago_catastro-ok"></div>';
					cadena+= '	</div>';
					
					//comentado VER MAS...
					if(item.childs){ //preenta icono de avanzar solo cuando llega hasta nivel de municipio
						cadena+= '	<div idref="'+item.cvegeo+'" class="ccnago_catastro-geo-seemore">';
						cadena+= '		<div idref="'+item.cvegeo+'"class="ccnago_catastro-geoEdo-icon-seemore sprite-ccnago_catastro-forward"></div>';
						cadena+= '	</div>';
					}
					cadena+= '</div>';
			 }
			$('#ccnago_catastro_geo_content').html(cadena);
			
			$('.ccnago_catastro-geoEdo-icon').each(function(){
				$(this).click(function(e){
					var idref = $(this).attr('idref');
					obj.currentData.strats = 5; 
					obj.currentData.geoLevelActive = (idref == '00')?'nal':obj.currentData.geoLevel+1;
					obj.selGeoItem(idref);
					obj.currentTreeVar=null;
					e.stopPropagation();
				})
			});
			$('.ccnago_catastro-geo-seemore').each(function(index, element) {
			   $(this).click(function(e){
					var idref = $(this).attr('idref');
					obj.currentData.geoIndex = idref;
				    obj.currentData.tempGeoLevel = obj.currentData.geoLevel+1; 
				    obj.printGeoList();
					e.stopPropagation();
			   })
			});
			
		}
	}
	obj.getGeoListItems(function(list){
		printList(list);
		obj.printGeoTypes(); 
		obj.updateHeader();
	});
 },
 selGeoItem:function(idgeo){
	 var obj = this;
	 var gsel = obj.currentData.geoSelected;
	 var cData = obj.currentData;
	 
	 //reinicio de selección para limitar a 1
	 gsel = [idgeo];
	 
	 obj.element.attr('cantheme',true);
	 obj.gotoExtent(idgeo);
	 
	 obj.hasChanged = true;
	 obj.currentData.geoSelected = gsel;
	 obj.updateHeader();
	 //Validacion de corte geografico nacional
	 if(obj.checkVarIntegrity()){
	 	obj.options.systemMessage('Se cambio el indicador acorde a la selección geográfica estatal',{width:240,height:120,title:'Información'});
		obj.currentData.index = 0;
		obj.setDefaultVarByLevel();
		obj.currentData.tree = [];
		obj.loadTree(obj.currentData.index,true);
		obj.prepareTheme();
	 }else{
		obj.options.systemMessage('Se cambio el indicador acorde a la selección geográfica',{width:240,height:120,title:'Información'});
		obj.currentData.index = 0;
		obj.setDefaultVarByLevel();
		obj.currentData.tree = [];
		obj.loadTree(obj.currentData.index,true);
		obj.prepareTheme(); 
	 }
	 obj.printGeoList('refresh');
 },
 checkVarIntegrity:function(){
	 var obj = this;
	 var cData = obj.currentData;
	 var isNal = (cData.geoSelected.join() == '00');
	 var geoLevelActive = cData.geoLevelActive;
	 return geoLevelActive == cData.varActive.geoLevel;
 },
 getGeoList:function(parent,func){
	  var obj = this;
	  var tree = obj.geoStructure.tree;
	  var geoIds = obj.geoStructure.ids;
	  var cData = obj.currentData;
	  var ds = obj.options.config.dataSources;
	  var geoLevels =  obj.options.config.settings.geoLevels;
	  if(!cData.tempGeoLevel)cData.tempGeoLevel = cData.geoLevel;
	 
	  
	  /*var func = geo.callback;*/
	  
	  var obj = this;
	  var dataSource = $.extend(true,{},ds.geolist);
	 
	  var tree = obj.geoStructure.tree;
	  var ids = geoLevels;
	  var params = {
	  			id:cData.geoIndex,
	  			alias:ids[cData.tempGeoLevel].alias,
		  		level:ids[cData.tempGeoLevel].level
	  		};
	  obj.getData(dataSource,params,function(data){
		  if(data.response.success){
			  	var tree = obj.geoStructure.tree;
			  	cData.geoLevel = cData.tempGeoLevel;
			  	cData.tempGeoLevel = null;
			  
			  	if((tree.length-1) > cData.geoLevel)
					tree = tree.splice(tree.length-1,1);
					
			    tree[cData.geoLevel] = {index:cData.geoLevel,parent:cData.geoIndex,list:data.data};
				if ($.isFunction(func)){
					func(data.data);
			    }
		  }
	  });
  },
spinner:function(option){
	var obj = this;
	if(option == 'show'){
		if(!$('#ccnago_catastro_spinner_panel').attr('id')){
			var w = obj.element.width();
			var h = obj.element.height();
			var cadena = '<div id="ccnago_catastro_spinner_panel" class="ccnago_catastro-spinner-panel" count="1" style="width:'+w+'px;height:'+h+'px">';
				cadena+= '	<div class="ui-widget-overlay ccnago_catastro-block-overlay"></div>';
				cadena+= '	<div class="ccnago_catastro-spinner-image-container"><span class="ccnago_catastro-spinner-image"></div>';
				cadena+= '<div>';

			obj.element.append(cadena);	
		}else{
			var count = parseInt($('#ccnago_catastro_spinner_panel').attr('count'),10);
			$('#ccnago_catastro_spinner_panel').attr('count',count+1);

		}
	}else{
		if($('#ccnago_catastro_spinner_panel').attr('id')){
			var count = parseInt($('#ccnago_catastro_spinner_panel').attr('count'),10);
			if(count > 1){
				$('#ccnago_catastro_spinner_panel').attr('count',count-1);	
			}else{
				$('#ccnago_catastro_spinner_panel').remove();
			}
		}
	}
},
// Print theme detail
printThemeDetail:function(){
	var obj = this;
	var theme = obj.currentData.theme;
	var cdata =  obj.currentData;
	var cData = obj.currentData;
	var geoLevelActive = cdata.geoLevelActive;
	var detail = theme.detail;
	var strats = theme.boundaries;
	var colors = obj.currentData.colors.colors;
	var cadena = '';
	
	var geoType = ['Municipio','Seccion'];
		geoType = geoType[parseInt(cdata.geoType)-1];

	if (geoLevelActive == "nal") {
		geoType = "Entidades Federativas";
	}
	
	
	for(var x in strats){
		var strat = strats[x];
		var w = (100/strats.length)-1;
		var color = colors[x];
		cadena+='<div idstrat="'+strat.stratum+'" class="ccnago_catastro-strat-item-selector '+((x=='0')?'selected':'')+'" style="width:'+w+'%">';
		cadena+='	Estrato '+strat.stratum;
		cadena+='	<span class="ccnago_catastro-strat-selector-color" style="background-color:'+color+'">';//style="background-color:rgb('+strat.rgb.split(' ').join()+')">';
		cadena+='</div>';
	}
	
		cadena+= '<div class="ccnago_catastro-strat-table-container">';
		cadena+= '	<table id="ccnago_catastro_strat_table" class="ccnago_catastro-strat-table" strat="e1" width="100%">';
		cadena+= '	<tr class="ccnago_catastro-table-head"><td>'+geoType+'</td><td align="right">Valor</td></th></tr>';

	for(var x in detail){
		var itemx = detail[x];
		var strat = itemx.stratum;
		var stratDetail = itemx.cvegeo;
		for (var y in stratDetail){
			var itemy = stratDetail[y];
			
			cadena+= '<tr idstrat="e'+strat+'"><td>'+itemy.nombre+'</td><td align="right">'+itemy.indicador+'</td></tr>';	
		}
	}
	cadena+='</table></div>';
	
	
	cadena+='<div class="ccnago_catastro-strat-table-export-container">';
	//Salto a grafica
	cadena+='<div id="ccnago_catastro_switchtograph_btn" class="ccnago_catastro-switchtograph-btn sprite-ccnago_catastro-graph-mini"></div>';
	cadena+='<div id="ccnago_catastro_switchtotabular_btn" class="ccnago_catastro-switchtograph-btn sprite-ccnago_catastro-grid"></div>';
	
	var exportList = obj.settings.exportTypes;
	for(var x in exportList){
		cadena+='<div idref="'+exportList[x]+'" class="ccnago_catastro-export-type-item sprite-ccnago_catastro-doc-'+exportList[x]+'"></div>';
	}
	cadena+='</div>';
	
	
	$('#ccnago_catastro_info_content').html(cadena);
	
	
	//area de grafica
	cadena = '<div id="ccnago_catastro_info_graph_container" class="ccnago_catastro-info-graph-container"></div>'
	cadena+=' <div id="ccnago_catastro_switchtodata_btn" class="ccnago_catastro-switchtograph-btn sprite-ccnago_catastro-sleft"></div>';
	$('#ccnago_catastro_info_graph').html(cadena);

	//area de tabulated
	cadena = '<div id="ccnago_catastro_info_tabulated_container" class="ccnago_catastro-info-tabulated-container"><div>Seleccione las variables de indicadores</div></div>'
	cadena+='<div class="ccnago_catastro-strat-table-export-container">';
	cadena+='<div id="ccnago_catastro_switchtodatatabulated_btn" class="ccnago_catastro-switchtograph-btn sprite-ccnago_catastro-sleft"></div>';
	cadena+='<div idref="xls" class="ccnago_catastro-switchtograph-btn ccnago_catastro-export-type-item-tabulated sprite-ccnago_catastro-doc-xls"></div>';
	cadena+='<div idref="csv" class="ccnago_catastro-switchtograph-btn ccnago_catastro-export-type-item-tabulated sprite-ccnago_catastro-doc-csv"></div>';
	cadena+='</div>';
	
	obj.loadTabulated();

	$('#ccnago_catastro_info_tabulated').html(cadena);

	//area de Tabular
	$('#ccnago_catastro_info_tabular').html(cadena);

	
	$('#ccnago_catastro_switchtograph_btn').click(function(){
		$('#'+obj.id).attr('infopanel','graph');
	});

	$('#ccnago_catastro_switchtodatatabulated_btn').click(function(){
		$('#'+obj.id).attr('infopanel','data');
	});

	
	$('#ccnago_catastro_switchtotabular_btn').click(function(){
		$('#'+obj.id).attr('infopanel','tab');	
	});
	

	$('#ccnago_catastro_switchtodata_btn').click(function(){
		$('#'+obj.id).attr('infopanel','data');
	});
	
	
	$('.ccnago_catastro-export-type-item').each(function(){
		$(this).click(function(){
			var idref = $(this).attr('idref');
			obj.exportStrats(idref);
		});
	});

	$('.ccnago_catastro-export-type-item-tabulated').each(function(){
		$(this).click(function(){
			var idref = $(this).attr('idref');
			obj.exportTabulated(idref);
		});
	});
	
	
	
	$('.ccnago_catastro-strat-item-selector').each(function(){
		$(this).click(function(){
			var idstrat = $(this).attr('idstrat');
			$('.ccnago_catastro-strat-item-selector.selected').removeClass('selected');
			$(this).addClass('selected');
			$('#ccnago_catastro_strat_table').attr('strat','e'+idstrat);
		});
	});
	
	//Print min max
	obj.updateRampStrat();
	$('#ccnago_catastro-year-min').html(obj.formatMoney(theme.min)); //using sugar format
	$('#ccnago_catastro-year-max').html(obj.formatMoney(theme.max));
	  //ccnago_catastro-year-max


	obj.createGraph();
	
},
//print panel config
  createRampColor:function(ramp){
	  	var obj = this;
		var colorRamps = obj.settings.colorRamps;
		var currentRamp = obj.currentData.colors;
		var colors = ramp.colors;
		var snum = obj.settings.numStrats;
		var cadena= '<div idref="'+ramp.id+'" class="ccnago_catastro-strats-colorRamp" '+((currentRamp.id == ramp.id)?'selected="selected"':'')+'>';
			for(var x in colors){
				var width = 100/snum;
				cadena+='<div class="ccnago_catastro-strats-ramp-color" style="background-color:'+colors[x]+';width:'+width+'%"></div>';	
			}
			cadena+='</div>';
		return cadena; 
 },
 printConfig:function(){
	 var obj = this;
	 var cd = obj.currentData; 
	 var colorRamps = obj.settings.colorRamps;
	 
	 var cadena = '';
	 if(cd.theme){	//si hay tema para desplegar
			 cadena+= '<div id="'+obj.id+'_graph_strat'+'" class="ccnago_catastro-graph-strat"></div>'; 
			 cadena+= '<div class="ccnago_catastro-strats-transparency-container">';
			 cadena+= '		<div class="ccnago_catastro-strats-transparency-title">Transparencia</div>';
			 cadena+= '		<div id="ccnago_catastro_strats_trasparencyControl" class="ccnago_catastro-strats-transparency-tool"></div>';
			 cadena+= '</div>';

			 cadena+= '<div class="ccnago_catastro-theme-normalInfo ccnago_catastro-theme-info">';
			 cadena+= '		<div><b>Total:</b><label>'+obj.formatMoney(cd.theme.indicator)+'<label></div>';
			 cadena+= '		<div><b>Elementos:</b><label>'+obj.formatMoney(cd.theme.n)+'</label></div>';
			 cadena+= '		<div><b>D.Estd:</b><label>'+obj.formatMoney(cd.theme.sd)+'<label></div>';
			 cadena+= '</div>';

			 cadena+= '<div class="ccnago_catastro-theme-mainInfo ccnago_catastro-theme-info">';
			 cadena+= '		<div><b>Media:</b><label>'+obj.formatMoney(cd.theme.mean)+'<label></div>';
			 cadena+= '		<div><b>Mediana:</b><label>'+obj.formatMoney(cd.theme.median)+'<label></div>';
			 cadena+= '		<div><b>Moda:</b><label>'+obj.formatMoney(cd.theme.mode)+'<label></div>';
			 cadena+= '</div>';


			 cadena+=	'<div class="ccnago_catastro-strat-method ccnago_catastro-animated">';

			var methods = obj.settings.methods; //print methods
		 	 var widthMethod = Math.floor(100/(methods.length))-2;
			 for(var x in methods){
				var method = methods[x];
				if(method.title =="R. Naturales"){
					method.title = "Rupturas naturales";
				}
				cadena+=	'<div style="width:'+widthMethod+'%" val="'+method.name+'" class="ccnago_catastro-strat-item '+((method.name == cd.method)?'selected':'')+'">'+method.title+'</div>';
			 }
			 cadena+=	'</div>';

		   var minStrats = obj.settings.minStrats;
		   var maxStrats = obj.settings.maxStrats;

			cadena+= '	<div class="ccnago_catastro-strats-strat-title">No.Estratos</div>';
			cadena+= '	<div id="ccnago_catastro_strats_data_config_strats" class="ccnago_catastro-strats-data-config-strats">';
					   for(var x = minStrats; x <= maxStrats;x++){
							cadena+= '<div idref="'+x+'" class="ccnago_catastro-strats-strat-item '+((x == cd.strats)?'selected':'')+'">'+x+'</div>';
					   }
			cadena+= '	</div>';


		/*	 cadena+=	'<div class="ccnago_catastro-years ccnago_catastro-animated">';
			 cadena+=	'	<div class="ccnago_catastro-years-title">Año</div>';

			 var years = obj.settings.years;  
			 for(var x in years){
				var year = years[x];
				cadena+=	'<div val="'+year+'" class="ccnago_catastro-years-item '+((year == cd.year)?'selected':'')+'">'+year+'</div>';
			 } 
			 cadena+=	'</div>';*/


			//cadena+=	'<div class="ccnago_catastro-config-titles"><label></label></div>'; 
			cadena+=	'<div class="ccnago_catastro-strats-currentRamps-container">';

			 for(var x in colorRamps){
					var ramp = colorRamps[x];   
					cadena+= obj.createRampColor(ramp); 
			 }
			 cadena+=	'</div>';
	 }
	 
	 $('#ccnago_catastro_conf_container').html(cadena);
	 
	$('.ccnago_catastro-strats-strat-item ').each(function(index, element) {
		$(this).click(function(e){
			$('.ccnago_catastro-strats-strat-item.selected').removeClass('selected');
			$(this).addClass('selected');
			obj.showStratsMessage = true;
			obj.currentData.strats = parseInt($(this).attr('idref'),10);
			obj.hasChanged = true;
			obj.updateHeader();
			obj.prepareTheme();
		});
	});
	 
	 
	 $( "#ccnago_catastro_strats_trasparencyControl" ).slider({
		  range: "max",
		  min: 1,
		  max: 100,
		  value: obj.settings.transparency,
		  slide: function( event, ui ) {
			obj.options.onTransparency(ui.value);
		  }
	 });
	 
	 $('.ccnago_catastro-strats-colorRamp').each(function(){
			$(this).click(function(){
				
				$('.ccnago_catastro-strats-colorRamp[selected=selected]').each(function(index, element) {
						$(this).removeAttr('selected');
				});
				$(this).attr('selected','selected');
				var idref = $(this).attr('idref');
	   			
				obj.rollbackColor = $.extend(true,{},obj.currentData.colors);
				obj.currentData.colors = obj.settings.colorRamps[parseInt(idref,10)];
				obj.changeColorMap();
				obj.hasChanged = true;
				obj.updateHeader();
				obj.printGraphData();
				
				obj.prepareTheme();
				//obj.
				//hemeStats();
			})   
	   })
	 
	 
	 
	 $('.ccnago_catastro-strat-item').each(function(index, element) {
      		/*$(this).click(function(){
				var val = $(this).attr('val');
				$('.ccnago_catastro-strat-item.selected').removeClass('selected');
				$(this).addClass('selected');
				
				obj.currentData.method = val;
				obj.hasChanged = true;
				obj.updateHeader();
				
				obj.prepareTheme();
				
		    });  
		    */
      });
	 /* $('.ccnago_catastro-years-item').each(function(index, element) { 
      		$(this).click(function(){
				var val = $(this).attr('val');
				$('.ccnago_catastro-years-item.selected').removeClass('selected');
				$(this).addClass('selected');
				
				cd.year = parseInt(val,10);
				obj.hasChanged = true;
				obj.updateHeader();
				
				obj.prepareTheme();
				
		    });  
      });*/
	 
	 //print Graph
	 obj.printGraphData();
 },
 changeColorMap:function(){
	  var obj = this;
	  var data = obj.currentData;
	  var theme = data.theme;
	  var strats = theme.boundaries;
	  var colors = data.colors.colors; 
	  var dataSource = $.extend(true,{},obj.options.config.dataSources.themeColor);

	  var params = { 
					"id": theme.id, 
					 "variable": data.varActive.variable, 
				     "boundaries":[]
				    }
	  for(var x in strats){
		    var item = $.extend(true,{},strats[x]);
			var rgb = obj.hexToRgb(colors[x]);
			item.rgb = rgb.r+' '+rgb.g+' '+rgb.b
			params.boundaries.push(item);  
	  }
		obj.getData(dataSource,params,function(data){
			if(data.response.success){
				obj.options.refreshMap();	
			}
		});
  },
//---------------------------------------------------------------------	
  getData:function(source,params,callback,error,before,complete){
		var obj = this;
		if(source){
			
			var spinner = this.spinner;
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
			//Estructura basica de peticion
			var dataObject = {
				   data: params,
				   success:function(json,estatus){callback(json,estatus);},
				   beforeSend: function(solicitudAJAX) {
						obj.spinner('show');
						if ($.isFunction(before)){
							before(params);
						};
				   },
				   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
						if ($.isFunction(error)){
							error(errorDescripcion,errorExcepcion);
						};
				   },
				   complete: function(solicitudAJAX,estatus) {
						obj.spinner('hide');
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
	},
	prepareTheme:function(){
		var obj = this;
		var cData = obj.currentData;
		var cvar = cData.varActive.variable;
		var geoLevels = obj.options.config.settings.geoLevels;
		//tema actual;
		var currentMapTheme = obj.currentData.currentMapTheme;
		if(obj.backupData != null){
			if(!currentMapTheme || obj.backupData.geoLevel != obj.currentData.geoLevel){
			obj.currentData.currentMapTheme = geoLevels[obj.currentData.geoLevel].themes[0].id;
			currentMapTheme = geoLevels[obj.currentData.geoLevel].themes[0].id;
		}else{
			obj.currentData.currentMapTheme = geoLevels[obj.currentData.geoLevel].themes[0].id;
			currentMapTheme = geoLevels[obj.currentData.geoLevel].themes[0].id;
			}
		}

		
			
			if(!cData.geoSelected)cData.geoSelected = ['00'];

			var dataSource = $.extend(true,{},obj.options.config.dataSources.theme);
			var currentLevelData = obj.getCurrentGeoLevel();
			var isNal = (cData.geoSelected.join() == '00');
		
		    cData.currentMapTheme = (isNal)?'censosgobcatastroentidad':'censosgobcatastromunicipio';
			var params = {
					ent:cData.geoSelected.join(),
					variable:cvar,
					estratos:cData.strats,
					level:currentLevelData.level,
					tipoConsulta:cData.method,
					field:currentLevelData.field_where,
					alias:cData.currentMapTheme
			}
			
			var themeParams = null;
			
			obj.getData(dataSource,params,function(data){
					obj.hasChanged = false;
					obj.updateHeader();
					var treecl = obj.currentTreeVar;
					if(data.response.success){
						
						obj.backupData = $.extend({},obj.currentData);
						var vals = data.data;
						var idTheme = data.data.id;

						//configuracion de URL para peticion de capa en mapa
						var themeParams = {'LAYERS':obj.options.config.settings.mapDefaultLayers}
						var layerMapThemes = obj.options.config.settings.layerMapName;
						for(var x in layerMapThemes){
							var item = layerMapThemes[x];
							themeParams[item] = 0;
						}
						
						if(isNal){
							themeParams[layerMapThemes['nal']] = idTheme;
								if(obj.currentData.tree.length <= 1 ){
									if(cData.varActive.censo === undefined){
										$('#ccnago_catastro_subvar_title').html('');
									}else{
		 							$('#ccnago_catastro_subvar_title').html(cData.varActive.censo+'<br/>'+cData.varActive.subtitle);
		 						}
							}
						}else{
							var lvl = 'lv'+currentLevelData.level;
							themeParams[layerMapThemes[lvl]] = idTheme;
							if(obj.currentData.tree.length <= 1 ){
									if(cData.varActive.censo === undefined){
										$('#ccnago_catastro_subvar_title').html('');
									}else{
		 							$('#ccnago_catastro_subvar_title').html(cData.varActive.censo+'<br/>'+cData.varActive.subtitle);
		 						}
							}
						}
						//---------------------------------------------------------------------
						/*var levels = obj.options.config.settings.geoLevels;
						for(var x in levels){
							var alist = levels[x].themes;
							for(var y in alist){
								var alias = alist[y].id;
								if(alias == cData.currentMapTheme){
									themeParams[alias] = idTheme;
								}else{
									themeParams[alias] = 0;
								}
							}
						}*/
						//themeParams[cData.currentMapTheme] = idTheme; //temp
						obj.options.refreshMap(themeParams);
						
						
						
						obj.currentData.theme = vals;
						obj.printThemeDetail();

						obj.checkThemeColor();
						if(obj.stratChanged && obj.showStratsMessage){
							var estratos = obj.currentData.strats;
							var estrata = "";
							if(estratos < 2){
								estrata = "estrato";
							}else{ 
								estrata = "estratos";
							}

							obj.options.systemMessage('Para este filtro solo se pueden usar hasta '+obj.currentData.strats+ ' '+estrata ,{width:240,height:120,title:'Información'});
						}
						obj.showStratsMessage = false;


						obj.stratChanged = false;
						obj.printGraphData();
						obj.printConfig();
						obj.printGeoTypes();
						obj.themeCreated = true;
						//obj.gotoExtent(cData.geoSelected.join())
					}else{
						if(!data.response.success && data.response.message == '409' && obj.currentData.strats > 1){ //409 intentar con menos estratos
							obj.currentData.strats--;
							obj.prepareTheme();
							obj.stratChanged = true;
						}else{
							obj.currentData =  obj.backupData;
							obj.loadTree(obj.currentData.index);
							obj.backupData = null;
							obj.options.systemMessage('No se puede tematizar la variable: '+cData.varActive.descripcion,{width:240,height:120,title:'Información'});
							obj.updateHeader();
							obj.printGeoList();
							obj.loadTree(obj.currentData.index,true);

						}
						//obj.options.refreshMap(themeParams);
					}
				},function(){ //error
					if(obj.backupData != null){
						obj.currentData =  obj.backupData;
						obj.backupData = null;
						obj.updateHeader();
						obj.printGeoList();
						obj.loadTree(obj.currentData.index,true);

						obj.options.systemMessage('Error al tematizar con los valores seleccionados',{width:240,height:120,title:'Información'});
					}else{
						obj.options.systemMessage('Error al tematizar',{width:240,height:120,title:'Información'});	
					}
				});
	},
	clearThemeLayer:function(){
		var obj = this;
		var themeParams = {'LAYERS':''}
		themeParams['MAPAESTATAL'] = 0;//(cData.geoType == 'edo')?idTheme:0;
		themeParams['MAPAMUNICIPAL'] = 0;//(cData.geoType == 'mun')?idTheme:0;;
		themeParams['MAPALOCALIDAD'] = 0;
		themeParams['MAPAAGEB'] = 0;
		themeParams['MAPADISTRITO'] = 0; //temp
		themeParams['MAPASECCION'] = 0;

		obj.options.refreshMap(themeParams);
	},
	onClose:function(){ //when destroy object
		var obj = this;
		var themeParams = {'LAYERS':'d100,d101,d102,d109'}
			themeParams['MAPAESTATAL'] = 0;
			themeParams['MAPAMUNICIPAL'] =0;
			themeParams['MAPALOCALIDAD'] = 0;
			themeParams['MAPAAGEB'] = 0;
		obj.options.refreshMap(themeParams);
	},
	checkThemeColor:function(){
		var obj = this;
		var cData = obj.currentData;
		if(cData.colors.id != 0){
			obj.changeColorMap();
		}
	},
  // Exportz|
	exportStrats:function(type){
	  var obj = this;
	  var data = obj.currentData;
	  var theme = data.theme;
	  if(theme){
	  	  var varActive = obj.backupData.varActive.descripcion;
	  	  var geoType = obj.currentData.geoType;
	  	  var typeVar = obj.backupData.typeVarSelection;		  
		  var detail = theme.detail;
		  
		  var columns = ['Estrato','Clave Geográfica','Nombre','Valor'];
		  var values = [];
		  
		  for (var x in detail){
				var item = detail[x];  
				var geos = item.cvegeo;
				for(var y in geos){
					var geo_item = geos[y];
					values.push([item.stratum,geo_item.cvegeo,geo_item.nombre,geo_item.indicador]);
				}
		  }
		  //Agregar fuente y variable tematizada
		  var sourceCredits = {};
		  
		  var typeVar = obj.backupData.typeVarSelection;
		  var postList = {
					'edomun':'estatales, municipales y delegacionales',
					'edo':'estatales',
					'mun':'municipales y delegacionales',
		  }

		  //varActive+= ' '+postList[typeVar];
		  
		  values.push([]);

		  obj.currentData.showTotal = 'mun';
			if(geoType == 'edo'){
				obj.currentData.showTotal = typeVar;
			}
			obj.element.attr('geotype',obj.currentData.geoType);
			  
			if(obj.currentData.tree.length > 1){

			  var ttree = $.extend({},obj.currentData.tree);

			  var size = function(){
			  	var c = 0; for(var x in ttree){
			  		c++;
			  	}
			  	return c
			  }();
			  var count = 0;
			  for(var x in ttree){
				  var item = ttree[x];
				  var sel = (size-1 > parseInt(x))?ttree[parseInt(x)+1].id:null;
				  var list = item.list;
				  if(sel){
					  for(var y in list){
						  if(list[y].id == sel){
							values.push([list[y].descripcion]); 
							break;
						  }
					  }
				  }else{
				  }
				  count++;
				  
			  }

			}
		  values.push(['Indicador:'+varActive]);

		  
		  var ds = $.extend({},true,obj.options.config.dataSources.exportData);
		  var params = {title:'Detalle de Estratos',columns:columns,values:values};
		  obj.getData(ds,params,function(data){
			  if(data && data.response.success){
			  	var url = ds.urlGet+'/'+type+'/'+data.data.id;
			  	window.location.assign(url);
			  }
		  });
		  //obj.getData();
	  }
  },

   // Exportz|
	exportTabulated:function(type){
	  var obj = this;
	  var cData = obj.currentData;
	  var currentMapTheme = cData.currentMapTheme;
	  var cvegeo = cData.geoSelected;
	  var idTab = cData.varActive.idTab;
	  var geoLevelActive = cData.geoLevelActive;
	  var ds = obj.options.config.dataSources;
	  var dataSource = $.extend(true,{},ds.getTabulated);
	  var getTreeVars  = obj.getTreeVars();
	  var currentLevelData = obj.getCurrentGeoLevel();
	  var isNal = (cData.geoSelected.join() == '00');
	  cData.currentMapTheme = (isNal)?'censosgobcatastroentidad':'censosgobcatastromunicipio';
	  var data = obj.currentData;
	  var theme = data.theme;
	  var geoType = obj.currentData.geoType;
	  var typeVar = obj.currentData.typeVarSelection;
	  var treecl = obj.currentTreeVar;
	  var id;


	  //Validar si se ha creado el id para tabulado, recurrir a valores por defecto
	  if(treecl){
    		id = treecl[1].id;
		}else {
			//var treeVars = getTreeVars[1];
			id=idTab;
			treecl = []
		}

		if(isNal) {
    		level = 1;
		}else {
			level = 2;
		}

	  /*if(id === undefined){
	  	obj.options.systemMessage('Error, seleccione indicadores',{width:240,height:120,title:'Error'})
	  }
	  */

	  var paramstabulated = {
		  		id:id,
		  		level:level,
				cvegeo:cvegeo[0],
				aliaslevel:currentMapTheme,
				field:currentLevelData.field_where
		}

		  var _var = data.varActive.descripcion;  
		  var detail = theme.detail;

		 obj.getData(dataSource,paramstabulated,function(data){
			var list = data.data.data;
			var note = data.data.note;
			this.list = list;

		  var columns = [];
		  var row = list[0];
		  for(var x in row){
		  	if(x=="cvegeo"){
				x="Clave Geoestadística";
			}
				columns.push(x);
		  }

		//impresion de valores
		var matrix =[];
		for(var x in list){
			var row = list[x];
			var r = [];
			for(var y in row){
				var val = row[y];
				r.push(val);
			}
			matrix.push(r);
		}
		var nota = Object.values(note);
		matrix.push(nota);

	  if(theme){

		  var varActive = obj.backupData.varActive.descripcion;		  
		  var typeVar = obj.backupData.typeVarSelection;
		  
		  matrix.push([]);

			obj.currentData.showTotal = 'mun';
			if(geoType == 'edo'){
				obj.currentData.showTotal = typeVar;
			}
			obj.element.attr('geotype',obj.currentData.geoType);
			
			if(treecl.length > 1){

			  //var ttree = $.extend({},obj.currentData.tree);

			  var size = function(){
			  	var c = 0; for(var x in treecl){
			  		c++;
			  	}
			  	return c
			  }();
			  var count = 0;
			  for(var x in treecl){
				  var item = treecl[x];
				  matrix.push([item.descripcion]);
			  }

			}
			matrix.push(['Indicador:'+varActive]);
		  
		  var ds = $.extend({},true,obj.options.config.dataSources.exportData);
		  var params = {title:'Detalle de Tabulado',columns:columns,values:matrix};
		  obj.getData(ds,params,function(data){
			  if(data && data.response.success){
			  	var url = ds.urlGet+'/'+type+'/'+data.data.id;
			  	window.location.assign(url);
			  }
		  });
	  }
	});
		 
  },
	openMetadataVar:function(_var){
		var obj = this;
		var path = obj.settings.docPath;
		var geoLevelActive = obj.currentData.geoLevelActive;
		var geoType = obj.currentData.geoType;
		var geografico = '';

		if(geoLevelActive == "nal"){
			geografico = '_estatal';
		}


		var doc = path+'/'+_var+geografico+'.html';
		var file='<iframe src="'+doc+'" width="100%" height="370px" class="ccnago_catastro-metadata-frame"></iframe>';

		obj.options.systemMessage(file,{width:600,height:420,title:'Metadatos',buttons:{}});
	},
  //Funciones para la tematización
	selectVar:function(id){
		var obj = this;
		obj.currentData.varActive = obj.getVar(id);
		obj.hasChanged = true;
		obj.updateHeader();
		obj.reloadTree();
		obj.prepareTheme();
	},
	selectIndex:function(id){
		var obj = this;
		obj.currentData.index = id;
		obj.loadTree(id);   
	},
	openConfig:function(){
		var obj = this;
		obj.backupData = $.extend({},obj.currentData);
		obj.element.attr('collapsed','false');
		setTimeout(function(){
			obj.options.detectCollision(obj.element);
		},1200);
		//carga arbol en posición
		obj.loadTree(obj.currentData.index,true);
		obj.printConfig();
		obj.updateHeader();
	},
	cancelModify:function(){
		var obj = this;
		obj.hasChanged = false;
		obj.currentData = obj.backupData;
		obj.reloadTree();
		obj.printThemeDetail();
		obj.printGeoList(true); //just refresh
		obj.backupData = null;
		obj.closeConfig();
	},
	closeConfig:function(){
		var obj = this;
		obj.element.attr('collapsed','true');
		//obj.prepareTheme(); deshabilitado para el procesamiento del tema inmediato
	},
	printGraphData:function(){
		var obj = this;
		var data = obj.currentData;
		var colors = data.colors.colors;
		var theme = data.theme;
		if(theme){
		  var detail = theme.detail
		  var title = data.varActive.descripcion;  
		  var cadena = '';	
		 //var graphObj = obj.crateGraphData(detail,title);	 //grafica anterior, bloquedas por el momento Marzo 2017
		  for (var x in detail){
			  var item = detail[x];
			   var color = colors[x]
			  cadena+= '<div class="ccnago_catastro-stratum-detail-item">';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-color" style="background-color:'+color+';"></div>';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-info">';
			  cadena+= '			<div class="ccnago_catastro-stratum-detail-item-info-vals">';
			  cadena+= '				<label class="ccnago_catastro-stratum-detail-item-info-label">Estrato</label>';
			  cadena+= '				<label class="ccnago_catastro-stratum-detail-item-info-value">'+item.stratum+'</label>';
			  cadena+= '			</div>';
			  cadena+= '			<div class="ccnago_catastro-stratum-detail-item-info-vals">';
			  cadena+= '				<label class="ccnago_catastro-stratum-detail-item-info-label">Frecuencia</label>';
			  cadena+= '				<label class="ccnago_catastro-stratum-detail-item-info-value">'+(item.cvegeo.length)+'</label>';
			  cadena+= '			</div>';
			  cadena+= '		</div>';
			  cadena+= '</div>';
		  }
		  //elementos extra
		      cadena+= '<div class="ccnago_catastro-stratum-detail-item">';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-color ccnago_catastro-confiden-bg"></div>';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-info">';
			  cadena+= '			<div class="ccnago_catastro-stratum-detail-item-info-vals special">';
			  cadena+= '				<label class="ccnago_catastro-stratum-detail-item-info-label">No aplica</label>';
			  cadena+= '			</div>';
			  cadena+= '		</div>';
			  cadena+= '</div>';
			  cadena+= '<div class="ccnago_catastro-stratum-detail-item">';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-color ccnago_catastro-confiden-bg-no"></div>';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-info">';
			  cadena+= '			<div class="ccnago_catastro-stratum-detail-item-info-vals special">';
			  cadena+= '				<label class="ccnago_catastro-stratum-detail-item-info-label">No se sabe</label>';
			  cadena+= '			</div>';
			  cadena+= '		</div>';
			  cadena+= '</div>';
			  cadena+= '<div class="ccnago_catastro-stratum-detail-item">';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-color" style="background-color:#FFF;border:1px solid #adadad"></div>';
			  cadena+= '	  	<div class="ccnago_catastro-stratum-detail-item-info">';
			  cadena+= '			<div class="ccnago_catastro-stratum-detail-item-info-vals special">';
			  cadena+= '				<label class="ccnago_catastro-stratum-detail-item-info-label">No contesto Cuestionario</label>';
			  cadena+= '			</div>';
			  cadena+= '		</div>';
			  cadena+= '</div>';
			
			
		  $('#'+obj.id+'_graph_strat').html(cadena);
		}
	},
	crateGraphData:function(data,title){
		var obj = this;
		//obtieniendo colores
		
		var colors = obj.currentData.colors.colors;
		
		//Creando datos
		var listSerie = [{
							name:'Estratos',
							colorByPoint: true,
							data:[]
						}];
		var listDrillDown =  {
						drillUpButton: {
							relativeTo: 'spacingBox',
							position: {
								y: 0,
								x: 0
							}
						},
						series: []
					}
		
		for(var x in data){
			var sum = 0;
			var item = data[x];
			var id = item.stratum;
			
			//drillSerie
			var dserie ={
						name: 'Estrato '+id,
						id: 'estrato'+id,
						data: []
			};
			for(var y in item.cvegeo){
				var yitem = item.cvegeo[y];
				sum+=parseInt(yitem.indicador,10);
				dserie.data.push({
					name: yitem.cvegeo,
					label: yitem.nombre,
					y: parseInt(yitem.indicador,10),
					drilldown: 'estrato'+id
				});
			}
			listDrillDown.series.push(dserie);
			
			listSerie[0].data.push({
				name: 'E'+id,
				label: 'E'+id,
				y: sum,
				drilldown: 'estrato'+id
			})
		}
		
		var gobj = {
			chart: {
				type: 'bar'
			},
			title: {
				text: ''
			},
			colors: colors,
			subtitle: {
				//text: 'Clic en las columnas para ver los detalles.'
			},
			xAxis: {
				type: 'category'
			},
			yAxis: {
				title: {
					text: ''
				}

			},
			legend: {
				enabled: false
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: false,
						format: '{point.y:.1f}%'
					}
				}
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span style="color:{point.color}">{point.label}</span>: <b>{point.y}</b><br/>'
			},

			series: listSerie,
			drilldown: listDrillDown
		}
		
		
		Highcharts.setOptions({
				lang:{drillUpText: "Regresar a {series.name}"},
				
		});
		
		Highcharts.chart(obj.id+'_graph_strat', gobj);
		
	},
	formatMoney:function(nStr){
            nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
  },
  //COLOR FUNCTIONS
  hexToRgb:function(hex) { //#FFFFFF
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
  },
  openDialog:function(url,title){
	  var obj = this; 
	  
		  if(!$('#ccnago_catastro-Info-dialog').attr('id')){
			  var cadena = '<div title="'+title+'" id="ccnago_catastro-Info-dialog"><div id="ccnago_catastro-html-doc"></div></div>';
			  $('#panel-center').append(cadena);
			  $('#ccnago_catastro-Info-dialog').dialog({
				    dialogClass: 'ccnago_catastro-Info-dialogContainer',
					width:550,
					height:470,
				  	modal:true,
					close: function(event, ui)
					{
						$(this).dialog('destroy').remove();
					}
			  });
		  }else{
			  $('#ccnago_catastro-Info-dialog').html('<div id="ccnago_catastro-html-doc"></div>').dialog();
		  }
	  
	  	  $('#ccnago_catastro-html-doc').load(url);
   },
  	
//Control de ficha *********************************************************************************************************************
	onIdentify:function(identifyData){
		var obj = this;
		
		if(obj.themeCreated){  //la identificacion solo si se ha creado un tema
			var pos = identifyData;
			var cData = obj.currentData;
			var ds = obj.options.config.dataSources;
			var dataSource = $.extend(true,{},ds.infoPoint);
			var currentLevelData = obj.getCurrentGeoLevel();
			
			var types = [null,'distrito','seccion'];
			var params = {
					cvegeo:cData.geoSelected[0],
					level:cData.geoLevel+1,
					point:'POINT('+pos.lon+' '+pos.lat+')',
					alias:cData.currentMapTheme,
					field:currentLevelData.field_where
			  }
			  obj.getData(dataSource,params,function(data){
				  if(data && data.data && data.data.data){
					  obj.getCardData(data.data.data,function(data){
						  obj.printCardData(data);
					  });
				  }else{
					  obj.options.onIdentifyFail(identifyData);
				  }
			  });
		}else{
			obj.options.onIdentifyFail(identifyData);
		}
	},
    getCardData:function(geo,func){
		var obj = this;
		var cData = obj.currentData;
		var ds = obj.options.config.dataSources;
		var dataSource = $.extend(true,{},ds.getCardValues);
		
		var geoLevels = obj.options.config.settings.geoLevels;
		var currentLevelData = obj.getCurrentGeoLevel();
		
		//obtener padre en el arbol de indicadores
		var layerMapLevels = obj.options.config.settings.varByLevel;
		var parent = null;
		var isNal = (cData.geoSelected.join() == '00');
		var level = 1;
		if(isNal){
			parent =  layerMapLevels['nal'].parent;
			level = 1;
		}else{
			var lvl = 'lv'+currentLevelData.level;
			parent =  layerMapLevels[lvl].parent;
			level = 2;
		}
		var tree = cData.tree
		if(tree.length > 1){
			parent = tree[1].id;
		}

		//
		
		
		var params = {
				higher:parent,
				id:geo.cvegeo,
				level:level,
				alias:cData.currentMapTheme
		 }
		  obj.getData(dataSource,params,function(data){
			  if(data.data){
				  data.data.geoName = geo.Nombre;
				func(data.data);
			  }
		  });
	},
	
	printCardData:function(data){
		var obj = this;	
		var cdata =  obj.currentData;
		var dataExport = [];
		
		var geoType = ['Distrito','Seccion'];
			geoType = geoType[parseInt(cdata.geoType)-1];
		
		var dialogTitle = data.geoName;
		
		if($('#toolccnago_catastro_info').attr('id'))
			$('#toolccnago_catastro_info').remove();
		
		
		var cadena = '<div id="toolccnago_catastro_info" title="'+dialogTitle+'"><div id="toolccnago_catastro_info_content"></div></div>';
			$("#panel-center").append(cadena);
		
		$('#toolccnago_catastro_info').dialog({
			resizable:false,
			width:800,
			modal: true,
			height:550,
			buttons: {
				"Cerrar": function() {
				  $( this ).dialog( "close" );
				}
			  },
			close:function(){obj.options.onCloseIdentify()}
		});
		var resume = data.general;
		var list = data.indicators;
		
		cadena = '<div id="ccnago_catastro_card_header"></div>';
		cadena+= '<div class="ccnago_catastro-card-title-indicators">Indicadores</div>';
		cadena+= '<div id="ccnago_catastro_card_indicators_container" class="ccnago_catastro-animated">';
		cadena+= '	<div id="ccnago_catastro_card_indicators_closebtn"><span class="sprite-ccnago_catastro-sleft"></span><span class="sprite-ccnago_catastro-sright"></span></div>';
		cadena+= '	<div id="ccnago_catastro_card_indicators"></div>';
		cadena+= '</div>';
		cadena+= '<div id="ccnago_catastro_card_values" class="ccnago_catastro-animated"></div>';
		cadena+= '<div id="ccnago_catastro_card_toolbar"></div>';
		
		$('#toolccnago_catastro_info_content').html(cadena);
		
		
		//encabezado
		cadena = '<table class="ccnago_catastro-table-color">';
		cadena+= '<thead><tr><td>Dato</td><td>Valor</td></tr></thead><tbody>';
		dataExport.push(['Información general']);
		dataExport.push(['Dato','Valor']);
		
		for(var x in resume){
			var item = resume[x];
			cadena+= '<tr><td>'+item.label+'</td><td>'+item.value+'</td></tr>';
			dataExport.push([item.label,item.value]);
		}
		cadena+= '</tbody></table>';
		dataExport.push(['','']);
		$('#ccnago_catastro_card_header').html(cadena);
		
		//menú lateral
		var count = 1;
		cadena = '<ul>';
		for(var x in list){
			var item = list[x];
			cadena+= '<li class="'+((x==0)?'active ':'')+'geoelectoral-card-var ccnago_catastro-animated" pos="'+x+'"><div idref="'+item.field+'" class="ui-icon ui-icon-info ccnago_catastro-card-varid"></div><label>'+item.label+'</label></li>';
			count++;
		}
		cadena+= '</ul>'
		$('#ccnago_catastro_card_indicators').html(cadena);
		
		$('.ccnago_catastro-card-varid').each(function(){
			$(this).click(function(){
				var idref = $(this).attr('idref');
			  	obj.openMetadataVar(idref);
			});
		});
		
		//Contenido desglozado
		var indOrder = obj.options.config.settings.cardIndicatorOrder;
		
		cadena = '';
		count = 1;
		dataExport.push(['Indicadores','']);
		for(var x in list){
			var item = list[x];
			cadena+= '<div id="geoelectoral_ind_'+x+'" class="ccnago_catastro-card-block"><div pos="'+x+'" class="ccnago_catastro-card-title">'+count+'. '+item.label+'</div>';
			dataExport.push([item.label]);
			cadena+= 	'<div class="ccnago_catastro-card-blockcontent">';
			cadena+= 	'<table class="ccnago_catastro-table-color"><tbody>';
			
			var head = [];
			cadena+= 	'<thead><tr>';
			var _count = 0;
			for (var y in indOrder){
				var _item = indOrder[y]; 
				cadena+= '<td '+((_count == 0)?'class="geolectoral-card-table-labelcolumn"':'')+'>'+_item.label+'</td>';
				head.push(_item.label);
				_count++;
			}
			dataExport.push(head);
			
			cadena+= 	'</tr></thead>';
			
			cadena+= 	'<tbody>';
			for(var y in item.value){  //extrae fila
				var _item = item.value[y];
				
				var content = [];
				cadena+= 	'<tr>';
				//impresion de columnas
				for(var z in indOrder){
					var zitem = indOrder[z];
					var elem = _item[zitem.id];
					var alignNumber = '';
					
					if($.isNumeric(elem)){
						alignNumber = 'style="text-align:right"';
							if((elem).isInteger()){
								elem = elem.format();
							}else{
								elem = elem.format(2);
							}
					}
					
					cadena+= '<td '+alignNumber+'>'+elem+'</td>';	
					content.push(elem);
				}
				cadena+= 	'</tr>';
				dataExport.push(content);
				
			}
			cadena+= '</tbody></table>';
			cadena+= '</div></div>';
			dataExport.push(['']);
			count++;
		}
		$('#ccnago_catastro_card_values').html(cadena);
		
		
		//Exportación
		var exportList = obj.settings.exportTypes;
		cadena = '';
		for(var x in exportList){
			cadena+='<div idref="'+exportList[x]+'" class="ccnago_catastro-card-export-type-item sprite-ccnago_catastro-doc-'+exportList[x]+'"></div>';
		}
		//inclusión de descarga nacional
		cadena+='</div>';
		
		$('#ccnago_catastro_card_toolbar').html(cadena);
		
		$('.ccnago_catastro-card-export-type-item').each(function(){
			$(this).click(function(){
				var idref = $(this).attr('idref');
				obj.exportIndicators(idref,dataExport);
			});
			
		});
		
		
		
		obj.setCardEvents();	
	},
	exportIndicators:function(type,edata){
	  var obj = this;
	  var cdata = obj.currentData;

	  var ds = $.extend({},true,obj.options.config.dataSources.exportData);
	  var params = {title:'Información',columns:['',''],values:edata};
	  obj.getData(ds,params,function(data){
		  if(data && data.response.success){
			var url = ds.urlGet+'/'+type+'/'+data.data.id;
			window.location.assign(url);
		  }
	  });
	  //obj.getData();
	},
	setCardEvents:function(){
		var obj = this;
		var scrollpos = [];
		var count = 0;
		var fix = 0;
		
		var jumpScrollToVar = function(pos){
			var pos = (pos === undefined)?$('.geoelectoral-card-var.active').attr('pos'):pos;
			var top = scrollpos[parseInt(pos)];
			$('#ccnago_catastro_card_values').animate({scrollTop:top}, 500, 'swing', function() { 
			});
		}
		$('.ccnago_catastro-card-title').each(function(){
			var top = $(this).position().top;
			if(count == 0)
				fix = top;
			scrollpos.push(top-fix);
			count++;
		});
		
		$('#ccnago_catastro_card_values').scroll(function(){
			var scroll = $('#ccnago_catastro_card_values').scrollTop();
			for(var x in scrollpos){
				if((scrollpos[x]-scroll)>=0){
					if((scrollpos[x]-scroll) > $('#ccnago_catastro_card_values').height())
						x--;
					
					$('.geoelectoral-card-var.active').removeClass('active');
					$('.geoelectoral-card-var[pos='+x+']').addClass('active');
					break;
				} 
			}
		});
		$('.geoelectoral-card-var').each(function(){
			$(this).unbind('click');
			$(this).click(function(){
				var pos = $(this).attr('pos');
				
				jumpScrollToVar(pos);
				
				/*
				var top = scrollpos[parseInt(pos)];
				$('#ccnago_catastro_card_values').animate({scrollTop:top}, 500, 'swing', function() { 
				});
				*/
				
				//$('#ccnago_catastro_card_values').scrollTop(top);
			})
		});
		
		$('#ccnago_catastro_card_indicators_closebtn').unbind('click');
		$('#ccnago_catastro_card_indicators_closebtn').click(function(){
			var status = $('#toolccnago_catastro_info_content').attr('status');
			if(status != 'collapsed'){
				$('#toolccnago_catastro_info_content').attr('status','collapsed');
			}else{
				$('#toolccnago_catastro_info_content').attr('status','expanded');
			}
			setTimeout(function(){
				obj.setCardEvents();
				$('.geoelectoral-card-var.active').click();
			},1200);
			
		});
		
	},  
	loadTabulated:function(){ 
	  var obj = this;
	  var cData = obj.currentData;
	  var varActive = cData.varActive;
	  var currentMapTheme = cData.currentMapTheme;
	  var cvegeo = cData.geoSelected;
	  var idTab = cData.varActive.idTab;
	  var geoLevelActive = cData.geoLevelActive;
	  var ds = obj.options.config.dataSources;
	  var dataSource = $.extend(true,{},ds.getTabulated);
	  var cadena = '';
	  var getTreeVars  = obj.getTreeVars();
	  var currentLevelData = obj.getCurrentGeoLevel();
	  var isNal = (cData.geoSelected.join() == '00');
	  var treecl = obj.currentTreeVar;
	  cData.currentMapTheme = (isNal)?'censosgobcatastroentidad':'censosgobcatastromunicipio';

	  //Validar si se ha creado el id para tabulado, recurrir a valores por defecto
	  if(treecl===null){
	  		treecl=null;
    		id=idTab;
		}else {
			//var treeVars = getTreeVars[1];
			id = treecl[1].id;
		}

		if(isNal) {
    		level = 1;
		}else {
			level = 2;
		}
	  
	  var params = {
		  		id:id,
		  		level:level,
				cvegeo:cvegeo[0],
				aliaslevel:currentMapTheme,
				field:currentLevelData.field_where
		}

		  	obj.getData(dataSource,params,function(data){
				  var list = data.data.data;
				  var nota = data.data.note;
				  var headers = {};
					cadena+= '<div class="ccnago_catastro-info-content-tabulate">';
					cadena+= '	<table style="width:100%;" id="ccnago_catastro_tabulador_table"><tr>';

				  //impresion de headers
				  var row = list[0];
				  for(var x in row){
				  	if(x=="cvegeo"){
				  		x="Clave Geoestadística";
				  	}
				  	cadena+= '<th style="font-size:9px;">'+x+'</th>';
				  }
				  
				  cadena+= '</tr>';
				  //impresion de valores
				  for(var x in list){
					  	  var row = list[x];
					  	  cadena+= '<tr class="ccnago_catastro-detail-data-row" '+((row.cvegeo)?' cvegeo="'+row.cvegeo+'" ':'')+'>';
						  for(var y in row){
						  	var val = row[y];
						  	cadena+= '<td align="right" style="font-weight:bold;color:#000">'+val+'</td>';

						  }
						  cadena+= '</tr>';  
					}

					var notes = (Object.values(nota));
					cadena+= '<tr>';
					cadena+= '<td class="ccnago_catastro-info-grid-container-note nohover" colspan="100">'+notes+'</td>';
					cadena+= '</tr>';  
					cadena+='</table>'
					//cadena+='<div class="ccnago_catastro-info-grid-container-note">*Nota '+notes+'</div>'
					cadena+='</div>';
					$('#ccnago_catastro_info_tabulated_container').html(cadena);

					$('.ccnago_catastro-detail-data-row').each(function(){
						$(this).click(function(){
							var cvegeo = $(this).attr('cvegeo');
							if(cvegeo)
								obj.gotoExtent(cvegeo);
							})
					});
		  	}); 	
  },findCurrentValue:function(){
	var obj = this;
	var _var = obj.currentData.varActive;
	  
	var geoType = obj.currentData.geoType;
	var typeVar = obj.currentData.typeVarSelection;
	obj.currentData.showTotal = 'mun';
	if(geoType == 'edo'){
		obj.currentData.showTotal = typeVar;
	}
	obj.element.attr('geotype',obj.currentData.geoType);
	  
  
	var svars = [];
	if(obj.currentData.tree.length > 1){

	  var ttree = $.extend({},obj.currentData.tree);

	  
	  var size = function(){var c = 0; for(var x in ttree){c++;}return c}();
	  var count = 0;
	  for(var x in ttree){
		  var item = ttree[x];
		  var sel = (size-1 > parseInt(x))?ttree[parseInt(x)+1].id:null;
		  var list = item.list;
		  if(sel){
			  for(var y in list){
				  if(list[y].id == sel){
					svars.push(list[y].descripcion);  
					break;
				  }
			  }
		  }else{
		  }
		  count++;
		  
	  }
	}

	if(obj.currentData.tree.length > 1 ){
	 $('#ccnago_catastro_var_title').html('<div style="font-style:oblique">'+_var.descripcion+'</div');
	}
	
	//'<div style="font-style:oblique>'+svars.join+'<br/>+</div>'
	$('#ccnago_catastro_subvar_title').html('<div style="font-style:oblique">'+svars.join('<br/>')+'</div');
	

  },
  findCurrentId:function(id){
  	var ids;
	var obj = this;
	  if((obj.currentData.tree.length) > 1){
	  	ids = obj.currentData.tree[ (obj.currentData.tree.length) - 1].id;
	  }
	  return ids;
  },
	// Grafica
	createGraph: function (options) {
		var obj = this;
		
		var theme = obj.currentData.theme;
		var cdata =  obj.currentData;
		var detail = theme.detail;
		var strats = theme.boundaries;
		
		
		
		var geoType = ['Distrito','Seccion'];
			geoType = geoType[parseInt(cdata.geoType)-1];
		
		/*var geoTypes = obj.options.config.settings.geoTypes;
			geoTypes = geoTypes[parseInt(cdata.geoType)-1].val;*/
		
		var varName = cdata.varActive.descripcion;
		
		//series
		var dataSeries = [];
		for(var x in detail){
			var list = detail[x].cvegeo;
			for(var y in list){
				var item = list[y];
				dataSeries[parseInt(item.nombre,10)-1] = ({
					name:item.nombre,
					y:parseFloat(item.indicador,10)
				});
			}
		}
		
		//series
		var dataSeriesX = [];
		var dataSeriesY = [];
		for(var x in detail){
			var list = detail[x].cvegeo;
			for(var y in list){
				var item = list[y];
				dataSeriesX.push(item.nombre);
				dataSeriesY.push(parseFloat(item.indicador,10));
			}
			
		}
		
		var width = 568;//($(window).width() * 0.7);
		var height = 325;//500 + ((s.length) * 350);
		
		if(dataSeriesY.length > 15){
			height = 150+(dataSeriesY.length)* 20;
		}
		
		
	
		Highcharts.chart('ccnago_catastro_info_graph_container', {
			exporting: { enabled: false },
			chart: {
				type: 'bar',
				height: height,
				width: width
			},
			title: {
				text: varName
			},
			subtitle: {
				text: null
			},
			xAxis: {
				categories: dataSeriesX,
    			title: {
      			text: null
    			}
			},
			yAxis: {
				min: 0,
				title: {
					text: '',
					align: 'high'
				},
				labels: {
					overflow: 'justify',
					formatter: function () {
						var ret,
							numericSymbols = ['mil', 'M', 'G', 'T', 'P', 'E'],
							i = numericSymbols.length;
						if (this.value >= 1000) {
							while (i-- && ret === undefined) {
								multi = Math.pow(1000, i + 1);
								if (this.value >= multi && numericSymbols[i] !== null) {
									ret = (this.value / multi) + numericSymbols[i];
								}
							}
						}
						return (ret ? ret : this.value);
					}
				}
			},
			legend: {
				enabled: false
			},
			labels: {
					overflow: 'justify',
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: false,
						format: '{point.y}'
					}
				}
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span>{point.name}</span>: <b>{point.y}</b><br/>'
			},

			series: [{
			    name: 'Valor',
        		data: dataSeriesY,
        		colorByPoint: true
    			}
  			]
		});
		
	}
  
});
//@ sourceURL=jquery.ui.ccnago_catastro.js