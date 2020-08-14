$.widget( "custom.ecoPanel", {
      id:'',
	  tools:{
		edit:{id:'edit',sprite:'widget_ecoPanel ecoPanel_med_edit',title:'Editar carga',stage:[]},
		report:{id:'report',sprite:'widget_ecoPanel ecoPanel_med_report',title:'Ver productos',stage:[1,2,3]},
		help:{id:'help',sprite:'widget_ecoPanel ecoPanel_med_help',title:'Ver ayuda',stage:[1,2,3]},
		cut:{id:'cut',sprite:'widget_ecoPanel ecoPanel_med_cut',title:'Dividir manzana',stage:[1]}
	  },
      // default options
      options: {
		  numAct:1,
		  mainUser:{
			    id:'',
			  	color:'',
				rightsId:1,
				zone:'',
				idZone:'',
				charge:0
		  },
		  zoneConvertion:{},
		  activities:{
		  },
		  graphVals:[
		  ],
		  ranks:{
		  },
		  rankSettings:{
		  },
		  tools:['edit','report'],
		  onAction:function(id,value){
		  }
		  
			 
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass( "custom-ecoPanel cw-boxBorder" )
          // prevent double click to select text
          .disableSelection();
        this._refresh();
      },
	  
	  getTools:function(){
		  var obj = this;
		  var tools = obj.tools;
		  var insetTools = obj.options.tools;
		  var user = obj.options.mainUser;
		  var act = obj.options.numAct;
		  var cadena = '';

		  for (var x in insetTools){
				var tool = insetTools[x];
				var funBan = (tool.func === undefined)?true:
							 ($.isFunction(tool.func))?tool.func():false;
				if (tool.stage.indexOf(act) >= 0 && funBan)  // puede presentarse la herramienta en la actividad actual?
					cadena+= '<div id="'+obj.id+'_'+tool.id+'" title="'+tool.title+'" alt="'+tool.title+'" idref="'+tool.id+'" value="'+user.id+'" opc class="ecoPanel-btn ecoPanel_tool '+tool.sprite+'"></div>';
		  }
		 return cadena; 
	  },
      getGraph:function(){
		 var obj = this;
		 var graph = obj.options.graphVals[obj.options.numAct];
		 var user = obj.options.mainUser;
		 var cadena = '';
		 /*
		 {label:'A',value:55,max:200},
		 {label:'B',value:350,max:400},
		 {label:'C',value:425,max:500}
		 */
		 cadena+= '<div class="ecoPanel-charge-display cw-boxBorder">'+user.charge+'</div>';
		 
			var progress = 0;
			var msg ='';
			var valText = '';
		
		 switch (obj.options.numAct){
			case 1:
				var maxValue = user.avgCharge;
				progress = (100/maxValue)*user.charge;	
				msg = 'Carga : '+user.charge+'/'+maxValue+' ('+progress.toFixed(1)+'%)';
				valText = user.charge+'/'+maxValue;
			break;
			case 2:
				msg = 'Carga semanal : '+((user.chargueWeek != null)?user.chargueWeek:0);
				valText = (user.chargueWeek != null)?user.chargueWeek:0;
			break;
			case 3:
				msg = 'Cargas: '+((user.chargueWeek != null)?user.chargueWeek:0);
				valText = user.charge+':'+((user.chargueWeek != null)?user.chargueWeek:0);
			break;
		 }
		
		
		cadena+= '<div class="ecoPanel-carga cw-boxBorder" style="width:100%" alt="'+msg+'" title="'+msg+'">';
		cadena+= '	<div class="ecoPanel-carga-progress cw-boxBorder '+((progress > 100)?'mdm-bg-warning':'')+'" style="width:'+progress+'%">';
		cadena+= 	valText;
		cadena+= '  </div>';
		cadena+= '</div>';
		 
		 
		 return cadena;
	  },
      // called when created, and later when changing options
      _refresh: function() {
		var obj = this;
        // trigger a callback/event
		var user = obj.options.mainUser;
		var rank = obj.options.ranks[obj.options.mainUser.rightsId];
		var act = obj.options.activities[obj.options.numAct];
		
		var endAct = (act.canClose)?'<div id="ecoPanel_act_end" idref="act_end" value="'+act.id+'" title="Concluir actividad" alt="Concluir actividad" class="ecoPanel-btn ecoPanel-act-end widget_ecoPanel ecoPanel_med_endAct"></div>':'';
		
		var cadena = '<div class="ecoPanel-content cw-boxBorder">';
			cadena+= '	<div id="ecoPanel_color" class="ecoPanel-color" style="background-color:'+user.color_hex+'"></div>';
			cadena+= '	<div id="ecoPanel_info_content" class="ecoPanel-info-content cw-boxBorder">';
			cadena+= '		<div id="ecoPanel_info_text" class="ecoPanel-info-text cw-boxBorder">';
			cadena+= '			<div id="ecoPanel_rankName" class="ecoPanel-rankName">';
			cadena+=			rank.name;
			cadena+= '			</div>';
			cadena+= '			<div id="ecoPanel_zone" class="ecoPanel-zone">';
			cadena+= '				<div id="ecoPanel_zone_icon" alt="Ver" title="Ver" idref="zone" value="'+user.idZone+'" class="ecoPanel-btn ecoPanel-zone-icon widget_ecoPanel ecoPanel_sh_mark">';
			cadena+= '				</div>';
			cadena+= '				<div id="ecoPanel_zone_name" title="'+user.city+'" alt="'+user.city+'" class="ecoPanel-zone-name">';
			cadena+= 				obj.options.zoneConvertion[user.city];
			cadena+= '				</div>';
			cadena+= '			</div>';
			cadena+= '		</div>';
			cadena+= '		<div id="ecoPanel_info_graph" class="ecoPanel-info-graph">';
			cadena+=		obj.getGraph();
			cadena+= '		</div>';
			cadena+= '	</div>';
			cadena+= '	<div id="ecoPanel_tools" class="ecoPanel-tools cw-boxBorder">';
			cadena+= '		<div id="ecoPanel_act" class="ecoPanel-act">';
			cadena+= '			<div id="ecoPanel_act_num" idref="act_num" value="'+act.id+'" class="ecoPanel-btn cw-boxBorder ecoPanel-act-num widget_ecoPanel ecoPanel_bg_num">';
			cadena+=			act.id;
			cadena+= '			</div>';
			cadena+= '			<div class="ecoPanel-act-toolbar cw-boxBorder">';
			cadena+= '				<div id="ecoPanel_act_des" class="ecoPanel-act-des cw-boxBorder">';
			cadena+= '					<div id="ecoPanel_act_title" class="ecoPanel-act-title">';
			cadena+=					'Actividad actual';
			cadena+= '					</div>';
			cadena+= '					<div id="ecoPanel_act_name" class="ecoPanel-act-name">';
			cadena+=					act.name;
			cadena+= '					</div>';
			cadena+= '				</div>';
			cadena+= 				endAct;
			cadena+= '			</div>';
			cadena+= '		</div>';
			cadena+= '		<div id="ecoPanel_act_tools" class="ecoPanel-act-tools">';
			cadena+=		obj.getTools();
			cadena+= '		</div>';
			cadena+= '	</div>';
			cadena+= '</div>';
			
		obj.element.html(cadena);
		$('.ecoPanel-btn').each(function(){
			$(this).click(function(e){
				var id = ($(this).attr('idref') === undefined)?$(this).attr('id'):$(this).attr('idref');
				var val = $(this).attr('value');
				
				obj.options.onAction(id,val);
				e.stopPropagation();
			});
		})
		
		this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-ecoPanel" )
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
//@ sourceURL=jquery.ui.ecoPanel.js