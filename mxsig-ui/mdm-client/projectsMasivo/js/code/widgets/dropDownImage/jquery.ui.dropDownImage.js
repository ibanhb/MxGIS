$(function() {
    // the widget definition, where "custom" is the namespace,
    // "colorize" the widget name
    $.widget( "custom.dropDownImage", {
      innerTime:0,
      // default options
      options: {
		title:'',
        sprite: '',
        sprite_x:0,
        sprite_y:0,
        width: 45,
        height: 45,
        orientation:'right',
        buttonSide:'right',
        background_color:'',
        background_color_opc:'#FFF',
        border_color:'none',
        border_color_opc:'#AAA',
        hightlight_color:'#DDD',
        hightlight_color_selected:'#FFF',
        map_ids:['1','2','3'],
        index:0,
        value:'',
        selected:false,
        // callbacks
        onAction: function(status,id){},
		onClear:function(){},
		beforeAction: function(status,id){},
        random: null
      },
	  getValue:function(){
		  var obj = this;
		  return {id:obj.options.index,item:obj.options.map_ids[obj.options.index]}  ;
	  },
      // the constructor
      panelOptions:function(opc){
        var obj = this;
        if (opc == 'show'){
			var forced = obj.options.force;
				forced = (forced === undefined)?'':forced;
				
            obj.innerTime = setTimeout(function(){obj.panelOptions('hidde')},1500);
            var position = obj.element.offset();
            var itemsHeight = $('#'+obj.element.attr('id')+'_items').height();
            var ventana = $(window).height();
			
			var banUp = (position.top+obj.options.height) < (ventana-itemsHeight);
			if (forced != ''){
				if (forced == 'up'){
					banUp = false;	
				}
				if (forced == 'down'){
					banUp = true;	
				}
			}
			var banDown = (!banUp);
			
            if (banUp){
                $('#'+obj.element.attr('id')+'_items').css('top',(obj.options.height+1)+'px');
            }else{
                $('#'+obj.element.attr('id')+'_items').css('top','-'+((itemsHeight+1))+'px');
            }
			
            $('#'+obj.element.attr('id')+'_items').css('display','');
            $('#'+obj.element.attr('id')+'_items').bind('mouseenter',function(){
               clearTimeout(obj.innerTime); 
            }).bind('mouseleave',function(){
                obj.innerTime = setTimeout(function(){obj.panelOptions('hidde')},500);
            });
            
        }else{
             $('#'+obj.element.attr('id')+'_items').css('display','none').unbind('mouseenter').unbind('mouseleave');;
             clearTimeout(obj.innerTime); 
        }
      },
      _create: function() {
        var obj = this;
        obj.options.value = obj.options.map_ids[obj.options.index];
        var container = '<div id="'+obj.element.attr('id')+'_container" style="width:'+(obj.options.width+18)+'px;height:'+obj.options.height+'px;overflow:hidden;z-index:2;'+
                        'border:1px solid '+obj.options.border_color+';background-color:'+obj.options.background_color+';'+
                        '" class="ui-corner-all"></div>';
        obj.element.html(container);
        obj.element.css('width',obj.options.width+18+'px')
                    .css('height',obj.options.height+'px');
         
		if (obj.options.title != ''){
			obj.element.attr('title',obj.options.title);
			obj.element.attr('alt',obj.options.title);
		}
            
        var cadena = '';
        for(var x =0; x < obj.options.map_ids.length;x++){
            var pos_x = (obj.options.orientation == 'right')?(x*obj.options.width):0;
            var pos_y = (obj.options.orientation == 'down')?(x*obj.options.height):0;
            
            var position = {x:obj.options.sprite_x+pos_x,y:obj.options.sprite_y+pos_y};
            var spritePos = 'background-image: url(\''+obj.options.sprite+'\');width:'+obj.options.width+'px;height:'+obj.options.height+'px; background-position: -'+position.x+'px -'+position.y+'px;';
            
			cadena+= '<div pos="'+x+'" class="'+obj.element.attr('id')+'_items'+' '+obj.options.sprite+' '+obj.options.map_ids[x]+' " style="background-color:'+obj.options.background_color_opc+';"></div>';
			
			//cadena+= '<div pos="'+x+'" class="'+obj.element.attr('id')+'_items'+'" style="background-color:'+obj.options.background_color_opc+';background-repeat:no-repeat;'+spritePos+'"></div>';
        }
        //encierraElementos en bloque
        var items = '<div id="'+obj.element.attr('id')+'_items" style="display:none;z-index:1;position:absolute;top:'+(obj.options.height-2)+'px;'+((obj.options.buttonSide=='left')?'right':'left')+':0px;width:'+obj.options.width+'px; height'+(obj.options.height*obj.options.map_ids.length)+';border:1px solid '+obj.options.border_color_opc+'">'+cadena+'</div>';
        //agrega elemento para marcar la selección
        var seleccionado = '<div id="'+obj.element.attr('id')+'_selected" class="ui-corner-all '+obj.options.sprite+' '+obj.options.map_ids[obj.options.index]+'" pos="1" style="background-color:'+((obj.options.selected)?obj.options.hightlight_color:obj.options.background_color)+';float:'+((obj.options.buttonSide=='left')?'right':'left')+'"></div>';
        //Agrega boton de plegar/replegar
        var button = '<div id="'+obj.element.attr('id')+'_btn" style="top:0px;float:'+obj.options.buttonSide+'; width:15px;height:'+obj.options.height+'px"><span style="margin-top:'+((obj.options.height/2)-7)+'px" class="ui-icon ui-icon-triangle-1-s"></span></div>';
        //agrega cadena a elemento
        $('#'+obj.element.attr('id')+'_container').html(seleccionado+button);
        obj.element.append(items);
        this._refresh();
        
        $("#"+obj.element.attr('id')+'_btn').click(function(){
            var status = $('#'+obj.element.attr('id')+'_items').css('display');
            if (status == 'none'){
                obj.panelOptions('show');
            }else{
                obj.panelOptions('hidde');
            }
        });
        
        
        $("#"+obj.element.attr('id')+'_selected').mouseover(function(){
           $(this).css('background-color',obj.options.hightlight_color);    
        }).mouseleave(function(){
           if (!obj.options.selected){
             $(this).css('background-color',obj.options.background_color);    
           }else{
             $(this).css('background-color',obj.options.hightlight_color_selected);    
           }
        }).click(function(){
				var state = !(obj.options.selected);
                obj.options.beforeAction();
				obj.options.selected = state;
                obj.options.onAction(obj.options.selected,obj.options.value);
                obj._refresh();
                obj.panelOptions('hidde');
				
				if (!state)
					obj.options.onClear();
				
					
        });
        
        $("#"+obj.element.attr('id')+'_btn').mouseover(function(){
           $(this).css('background-color',obj.options.hightlight_color);    
        }).mouseleave(function(){
           $(this).css('background-color',obj.options.background_color);    
        }).click(function(e){
            
        	e.stopPropagation();
        });
        
        $("."+obj.element.attr('id')+'_items').each(function(){
            $(this).click(function(e){
               obj.options.index = parseInt($(this).attr('pos'),10);
               obj.options.value = obj.options.map_ids[obj.options.index];
               obj.options.beforeAction();
			   obj.options.selected = true;
               obj.options.onAction(obj.options.selected,obj.options.value);
               obj._refresh();
               $("#"+obj.element.attr('id')+'_btn').click();
			   e.stopPropagation();
            });
            $(this).mouseover(function(){
               $(this).css('background-color',obj.options.hightlight_color);    
            }).mouseleave(function(){
               $(this).css('background-color',obj.options.background_color_opc);    
            });
        })
        
      },
      // called when created, and later when changing options
      _refresh: function() {
        var obj = this;
        obj.options.value = obj.options.map_ids[obj.options.index];
        var pos_x = (obj.options.orientation == 'right')?(obj.options.index*obj.options.width):0;
        var pos_y = (obj.options.orientation == 'down')?(obj.options.index*obj.options.height):0;
        var position = {x:obj.options.sprite_x+pos_x,y:obj.options.sprite_y+pos_y};
        
		for (var x in obj.options.map_ids){
			$("#"+obj.element.attr('id')+'_selected').removeClass(obj.options.map_ids[x]);
		}
		$("#"+obj.element.attr('id')+'_selected').addClass(obj.options.map_ids[obj.options.index]);
		
		
		//$("#"+obj.element.attr('id')+'_selected').css('background-position','-'+position.x+'px -'+position.y+'px');
        // trigger a callback/event
        
        $('#'+obj.element.attr('id')+'_selected').css('background-color',((obj.options.selected)?obj.options.hightlight_color_selected:obj.options.background_color))
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
       this.element.html();
       this.element.attr(css,'');
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
    
     
  });
//@ sourceURL=jquery.dropDownImage.js