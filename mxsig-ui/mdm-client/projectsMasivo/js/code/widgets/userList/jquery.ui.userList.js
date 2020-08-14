$.widget( "custom.userList", {
      id:'',
      // default options
      options: {
		  activities:null,
		  currentActivity:null,
		  users:[],
		  user:null,
		  mainUserRights:'',
		  userRelation:{
			  1:[2,3],
			  2:[3]
		  },
		  warningTolerance:4,
		  userStructure:{},
		  onAction:function(id,value){}
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass( "custom-userList cw-boxBorder" )
          // prevent double click to select text
          .disableSelection();
        this._refresh();
      },
	  dragDropClass:function(id){
		var obj = this;
		var relations = obj.options.userRelation;
		var users = obj.options.users;
		
		var relation = relations[id];
		var dragDropClass = '';
		
		for (var x in relations){  //rastreo para detectar si alguien me puede contener
			var ritem = relations[x];
			for (var y in ritem){
				if (ritem[y] == id){ //puede ser contenido
					
					for (var u in users){
						if (users[u].rightsId == x){ //hay alguien en mi nivel que me puede contener
							dragDropClass = 'draggable';
							break;			
						}
					}
					
				}
			}
		}
		if (dragDropClass == ''){ //ratrear si puede contener a alguien
			for (var x in relation){
				for (var u in users){
					if (users[u].rightsId == relation[x]){ //hay alguien en mi nivel a quien puedo contener
						dragDropClass = 'droppable';
						break;			
					}
				}		
			}
		}
		return dragDropClass;
	  },
 	  createList:function(){
		var obj = this;
		var user = obj.options.user;
		var users = obj.options.users;
		var cadena = '';
		var canEdit = obj.options.activities[obj.options.currentActivity].canEdit;
		var nameChange = obj.options.activities[obj.options.currentActivity].nameChange;
		var adminUser = obj.options.userStructure[user.rightsId].createSub.length > 0;//obj.options.activities[obj.options.currentActivity].adminUser;
		for (var x in users){
			var user = users[x];	
			var id = user.user;
			var chainDown = (x != (users.length-1))?'dottedLine-continue':'dottedLine-corner';
			var nunProgress = ((100/user.avgCharge)*user.charge).toFixed(1);
			var progressColor = (nunProgress < (100-(obj.options.warningTolerance/2)))?'':(nunProgress <= (100+(obj.options.warningTolerance/2)))?'userList-bg-ok':'userList-bg-warning';
			var progress = '<div class="userList-progress-value '+progressColor+'"  style="background-color:'+user.color_hex+';width:'+nunProgress+'%;"></div>';
			var draggedClass = (obj.dragDropClass(user.rightsId) == 'draggable')?'userList-bg-move':'';
			
			var btnAct = '';
			var labelValue = '';
			if (canEdit){
				switch (obj.options.currentActivity){
					case 1:
						//si el usuario puede manipular la carga
						//if(user.canCharge){
							btnAct = (user.chargeEnabled)?'<div id="userList_item_edit" idref="edit" value="'+user.user+'"  title="Editar carga" alt="Editar carga" class="userList-btn userList-item-edit widget_userList userList-big-edit">':'';				
						//}
						labelValue = user.charge+' / '+user.avgCharge;
					break;
					case 2:
						if (user.canWeek){
							btnAct = (!user.banWeek)?'<div id="userList_item_week" idref="week" value="'+user.user+'"  title="Editar carga semanal" alt="Editar carga semanal" class="userList-btn userList-item-edit widget_userList userList-big-week">':
													  '<div id="userList_item_week" idref="week" value="'+user.user+'"  title="Editar carga semanal" alt="Editar carga semanal" class="userList-btn userList-item-edit widget_userList userList-big-week-ok">';
						}
						labelValue = (user.chargueWeek != null)?user.chargueWeek:0;
					break;
					case 3:
						labelValue = user.charge+':'+((user.chargueWeek != null)?user.chargueWeek:0);
					break;
				}
			}
			
			var banSubs = (user.flagSub)?'userList-btn':''; //puede tener subordinados
			var nameChange = obj.options.userStructure[user.rightsId].nameChange;
			var btnClose = (adminUser)?'<div idref="close" title="Eliminar usuario" value="'+user.user+'" class="userList-btn widget_userList userList-sh-close"></div>':'';
			var btnExtent = (user.extent != null)?'<div idref="extent" title="Ver carga" value="'+user.extent+'" class="userList-btn widget_userList userList-sh-extent"></div>':'';
			
			nameChange = (nameChange)?'<span idref="rename" value="'+user.user+'" class="userList-btn userList-changename ui-icon ui-icon-pencil" title="Cambiar nombre" />':'';
			
			
			cadena+= '<div id="element_'+id+'" idpos="'+x+'" class="userList-item cw-boxBorder '+chainDown+'">';
			cadena+= '	<div id="userList_item_'+user.user+'"  idref="'+user.user+'" class="userList-item-body '+obj.dragDropClass(user.rightsId)+'">';
			cadena+= '		<div class="userList-item-content cw-boxBorder userList-transition" style="background-color:'+user.color_hex+'">';
			cadena+= '			<div title="Cambiar Color" idref="color" value="'+user.user+'" class="userList-btn userList-item-color"></div>';
			cadena+= '			<div class="userList-item-info cw-boxBorder '+draggedClass+' '+banSubs+'" idref="element" value="'+user.user+'">';
			cadena+= '				<div class="userList-item-content-top cw-boxBorder">';
			cadena+= '					<div class="userList-item-name cw-boxBorder ">'+nameChange;
			cadena+= '						<label class="'+banSubs+'" idref="element" value="'+user.user+'">'+user.alias+'</label>';
			cadena+= '					</div>';
			cadena+= '					<div class="userList-item-tools cw-boxBorder">';
			cadena+= 						btnClose;
			cadena+= 						btnExtent;
			cadena+= '						<div idref="info" title="Ver detalle" value="'+user.user+'" class="userList-btn widget_userList userList-sh-info"></div>';
			cadena+= '					</div>';
			cadena+= '				</div>';
			cadena+= '				<div class="userList-item-content-middle cw-boxBorder '+banSubs+'" idref="element" value="'+user.user+'">';
			cadena+= '					<div class="userList-item-userName cw-boxBorder">';
			cadena+=					user.userName;
			cadena+= '					</div>';
			cadena+= '					<div class="userList-item-charge cw-boxBorder">';
			cadena+=					labelValue;
			cadena+= '					</div>';
			cadena+= '				</div>';
			cadena+= '				<div class="userList-item-content-bottom cw-boxBorder" title="'+nunProgress+'%" alt="'+nunProgress+'%">';
			cadena+= '					<div class="userList-item-progress-container cw-boxBorder" style="display:'+((obj.options.currentActivity == 1)?'':'none')+'">';
			cadena+= '						<div class="userList-item-progress cw-boxBorder ">';
			cadena+=						progress;
			cadena+= '						</div>';
			cadena+= '					</div>';
			cadena+= '				</div>';
			cadena+= '			</div>';
			cadena+= '		</div>';
			cadena+= '	</div>';
			cadena+= 	btnAct;
			cadena+= '	</div>';
			cadena+= '</div>';
		}
		return cadena;
		
	  },
	  reload:function(){
		this._refresh();  
	  },
      // called when created, and later when changing options
      _refresh: function() {
		var obj = this;
		obj.element.html(obj.createList());
		
		//acciones de botones
		$('.userList-btn').each(function(){
			$(this).click(function(e){
				if(e.target === this){
					var id = ($(this).attr('idref') === undefined)?$(this).attr('id'):$(this).attr('idref');
					var val = $(this).attr('value');
					obj.options.onAction(id,val);
					e.stopPropagation();
				}
			});
		})
		//asignacion de arrastre
		$( '#'+obj.id+' .draggable' ).draggable({ revert: "invalid" });
		$( '#'+obj.id+' .droppable' ).droppable({
			  greedy: true,
			  activeClass: "userList-dropArea",
			  hoverClass: "userList-over-dropArea",
			  drop: function( event, ui ) {
				var _this = $(this);
				var _forein = ui.draggable;
				var container = $('#element_'+_forein.attr('idref'));
				var idref = _forein.attr('idref');
				obj.options.onAction('move',{user:idref,target:_this.attr('idref')});
				container.fadeOut('slow');
			  }
		});/*
		$('.userList-changename').each(function(){
			$(this).click(function(e){
				var idref = $(this).attr('idref');
				obj.options.onAction('rename',{user:parseInt(idref,10),father:obj.options.user});
				e.stopPropagation();
			});	
		});
		$('.userList-item-color').each(function(){
			$(this).click(function(e){
				var idref = $(this).attr('idref');
				obj.options.onAction('color',{user:parseInt(idref,10),father:obj.options.user});
				e.stopPropagation();
			});	
		});*/
		
		
		
        // trigger a callback/event
        this._trigger( "change" );
		
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-userList" )
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
//@ sourceURL=jquery.ui.userList.js