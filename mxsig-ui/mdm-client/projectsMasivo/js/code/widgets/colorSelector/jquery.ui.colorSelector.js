$.widget( "custom.colorSelector", {
      id:'',
	  colorRamp:[],
      // default options
      options: {
		  inputColor:'',
		  markedColors:[],
		  
		  baseColors:['red', 'orange','purple', 'blue' ,'cyan','green', 'yellow'],//'Set3',
		  mode:'lab',
		  mosaicNum:200,
		  colorAction:function(color){},
		  chroma:null
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        obj.colorRamp = [];
        this.element
          // add a class for theming
          .addClass( "custom-colorSelector" )
          // prevent double click to select text
          .disableSelection();
		  if ($.isFunction(chroma)){
		   	obj._refresh();
		  }else{
			console.log('colorSelector, no se encontro la librería chroma.js: https://github.com/gka/chroma.js');
		  }
      },
 	  createRampColor:function(){
		var obj = this;
		//var scale = chroma.scale(obj.options.baseColors).mode(obj.options.mode);
		var scale = chroma.scale(obj.options.baseColors);
		for (var x = 0; x < obj.options.mosaicNum;x++ ){
			var a = scale(x/obj.options.mosaicNum).hex();
			obj.colorRamp.push({color:a});
		}
		
		return obj.colorRamp;
	  },
	  createForm:function(){
		var obj = this;
		var ramp = obj.createRampColor();
		var marked = obj.options.markedColors;
		var cadena = '';
			cadena+= '<div class="colorSelector-leftBar">';
			cadena+= '	<div id="'+obj.id+'_autoselect" title="Autoseleccionar color" alt="Autoseleccionar color" class="colorSelector-leftBarIcon widget_colorSelector colorSelector-selector"></div>';
			cadena+= '  <div class="colorSelector-usedColor" title="Colores usados actualmente" alt="Colores usados actualmente">';
			cadena+= '		<div class="colorSelector-usedColorIcon widget_colorSelector colorSelector-colorBlack"></div>';
			cadena+= '		<div class="colorSelector-usedColors">';
			//colores usados
							for (var y in marked){
								cadena+= '<div title="'+marked[y]+'" alt="'+marked[y]+'" class="colorSelector-color" style="background-color:'+marked[y]+';"></div>';
							}
			cadena+= '		</div>';
			cadena+= '	</div>';
			cadena+= '</div>';
			
			
			cadena+= '<div class="colorSelector-suggestion">';
			cadena+= '	<div class="colorSelector-colorSuggestion"></div>';
			cadena+= '</div>';
			
			cadena+= '<div class="colorSelector-colorContainer">';
		
		for (var x in ramp){
			var color = ramp[x];
			var cmark = '';
			for (var y in marked){
				if (marked[y] == color.color){
					cmark = 'colorSelector-markUsed';
					ramp[x].marked = true;
				}
			}
			cadena+= '<div idpos="'+x+'" color="'+color.color+'" class="colorSelector-color '+cmark+'" style="background-color:'+color.color+';" title="'+color.color+'" alt="'+color.color+'" ></div>';
		}
			cadena+='</div>';
			
		return cadena;  
	  },
	  autoSelectColor:function(){
		var obj = this;
		var ramp = obj.colorRamp;
		var index = [];
		var count = 0;
		for (var x in ramp){ //rastreo de segmentos libres en rampa de color
			var color = ramp[x];	
			var mark = color.marked;
			if (!(mark === undefined) || (x == (ramp.length-1))){
				var adjust = (x == (ramp.length-1))?1:0;
				if (count > 0){
					index.push({color:color.color,start:(x-count),size:count+adjust})
				}
				count = -1;
			}
				count++;
			
		}
		var result = '';
		var resultIndex = 0;
		if (index.length > 0){
			var maxSize = {size:0};
			for (var x in index){ //buscar segmento mayor
				var seg = index[x];
				if (seg.size > maxSize.size){
					maxSize = seg;	
				}
			}
			if(maxSize.size > 0){ //si el segmento encontrado es mayor a 0
				var size = maxSize.size;
				//Seleccion de color dependiendo de el tamaño del bloque
				var indexColor = (size <= 9)?maxSize.start+Math.floor(size/2): 
									maxSize.start+4;
				result = ramp[indexColor].color;
				resultIndex = indexColor;
			}
			
		}else{ //si no hay marca alguna devuelve la primer posicion de la rampa
			result = ramp[0].color;				
		}
		
		if (result != ''){
			$('#'+obj.id+' .colorSelector-colorSuggestion').css('background-color',result).html('Color Sugerido');
			$('.colorSelector-color[idpos="'+resultIndex+'"]').addClass('colorSelector-automaticSelection');
			
		}
		
		obj.options.colorAction(result);
		return result;
	  },
      // called when created, and later when changing options
      _refresh: function() {
		var obj = this;
		var ramp = obj.colorRamp;
		obj.element.html(obj.createForm());
		
		$('.colorSelector-colorContainer .colorSelector-color').each(function(){
			$(this).click(function(e){
				$('#'+obj.id+' .colorSelector-automaticSelection').removeClass('colorSelector-automaticSelection');
				$(this).addClass('colorSelector-automaticSelection');
				var idpos = parseInt($(this).attr('idpos'),10);
				$('#'+obj.id+' .colorSelector-colorSuggestion').css('background-color',ramp[idpos].color).html('');
				
				obj.options.colorAction(ramp[idpos].color);
				e.stopPropagation();
			})
		});
		$('#'+obj.id+'_autoselect').click(function(e){
			$('#'+obj.id+' .colorSelector-automaticSelection').removeClass('colorSelector-automaticSelection');
			obj.autoSelectColor();	
			e.stopPropagation();
		});
		if (obj.options.inputColor == ''){
			obj.autoSelectColor();
		}else{
			$('#'+obj.id+' .colorSelector-color[color="'+obj.options.inputColor+'"]').click();
		}
        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-colorSelector" )
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
//@ sourceURL=jquery.ui.colorSelector.js