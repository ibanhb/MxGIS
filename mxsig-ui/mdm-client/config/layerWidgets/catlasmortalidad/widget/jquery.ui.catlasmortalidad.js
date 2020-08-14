$.widget( "custom.catlasmortalidad", {
  // default options
  isOpen:false,
  //
  options: {
	  path:null
  },
  currentData:{
	  indicator:null,
	  year:null,
	  
	  
  },
  onFullOpen:function(){
	  var obj=this;
	  obj.header.update();
	  obj.element.attr('collapsed','false');
  },
  beforeClose:function(){
	  
  },
  open:function(){
	  var obj = this;
	  var element = obj.element;
	  if(!obj.isOpen){
		  element.animate({height:'600'},400,function(){
			  obj.isOpen = true;
			  obj.onFullOpen();
		  });
	  }
  },
  close:function(){
	  var obj = this;
	  var element = obj.element;
	  var heightHeader = 103;//obj.header.height+19;
	  obj.beforeClose();
	  if(obj.isOpen){
		  element.animate({height:heightHeader},400,function(){
			  obj.isOpen = false;
			  obj.element.attr('collapsed','true');
		  });
	  }
  },
  // the constructor
  _create: function() {
	var obj = this;
	this.id = this.element.attr('id');
	var id = this.id;
	this.element
	  // add a class for theming
	  .addClass( 'custom-'+id )
	  // prevent double click to select text
	  .disableSelection();
	 this.id = this.element.attr('id');
	obj.element.attr('collapsed','true');
	  
	obj.loadFiles(function(){
		obj.createUI();	
		obj._refresh();
	});
  },

  // called when created, and later when changing options
  _refresh: function() {
	// trigger a callback/event
  },
  loadFiles:function(func){
	  var obj = this;
	  var path = obj.options.path;
		$.when(
			$.getScript(path+'widget/header/header.js'),
			$('<link>', {rel: 'stylesheet',type: 'text/css',href:path+'widget/header/header.css'}).appendTo('head'),
            $.Deferred(function( deferred ){
               $( deferred.resolve );
            })
        ).done(function(){
			//se asigna la variable del archivo a una variable local para enlazar el funcionamiento
			obj.header = window.layerWidgets.catlasmortalidad.w_header;
			obj.header.init(obj);
			func();
		});
  },
  //---------------------------------CODE---------------------------------------------------------------
  createUI: function () {
		var obj = this;
		var cd = obj.currentData;
	  	var id = obj.id;

		//obj.printGeoList();
		var cadena = '<div id="'+id+'_header" class="'+id+'-header widget-header"></div>';
		cadena += '<div id="'+id+'_content"></div>';
		obj.element.html(cadena);
	  
	  	obj.header.update();
  },
	
	
 //-----------------------------------------------------------------------------------------------------
  // events bound via _on are removed automatically
  // revert other modifications here
  _destroy: function() {
	var id = this.id;
	this.element
	  .removeClass( 'custom-'+id )
	  .enableSelection();
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
	// prevent invalid color values
	this._super( key, value );
  }
});
//@ sourceURL=config/layerWidgets/widget/catlasmortalidad/jquery.ui.catlasmortalidad.js