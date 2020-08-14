$.widget( "custom.inputNumber", {
      id:'',
	  value:'',
      // default options
      options: {
		  value:0,
		  type:'integer',
		  precision:4,
		  onChange:function(val){}
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass( "custom-inputNumber" );
          // prevent double click to select text
		  	var obj = this;
			var input = obj.element;
			input.focus(function(){
					if (this.value == '0'){
						this.value = '';	
					}
				});
			input.blur(function(){
					if (this.value == ''){
						this.value = '0';	
					}
				});
			input.keypress(function(event) {
					var banInt = (obj.options.type == 'integer')?true:false;
					if (banInt){
						if ((event.which == 46) || (event.which < 48 || event.which > 57)) {
						  event.preventDefault();
						}
					}else{
						var banPres = (this.value.indexOf('.') < 0)?true:
									   (this.value.split('.')[1].length <  obj.options.precision)?true:false;
						
						if (!banPres || (event.which != 46 || input.val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
						  event.preventDefault();
						}
					}
			  }).keyup(function(){
					if (parseFloat(this.value,10) >= 0)
						obj.options.onChange(parseFloat(this.value,10),obj.element);
			  });
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        // trigger a callback/event
        this._trigger( "change" );
		//this.element.val(this.options.value);
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-inputNumber" )
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