$.widget( "custom.myWidget", {
  // default options
  options: {
  },

  // the constructor
  _create: function() {
	this.element
	  // add a class for theming
	  .addClass( "custom-myWidget" )
	  // prevent double click to select text
	  .disableSelection();
	 this.id = this.element.attr('id');
	 

	this._refresh();
  },

  // called when created, and later when changing options
  _refresh: function() {
	// trigger a callback/event
  },

  // events bound via _on are removed automatically
  // revert other modifications here
  _destroy: function() {
	this.element
	  .removeClass( "custom-myWidget" )
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