$.widget( "custom.userPanel", {
	  timer:1000,
      id:'',
      // default options
      options: {
		  activities:null,
		  currentActivity:null,
		  currentUser:{},
		  userStructure:{},
		  mainUserRights:null,
		  mainUser:null,
		  onAction:function(id,value){
		  }
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass( "custom-userPanel" )
          // prevent double click to select text
          .disableSelection();
        this._refresh();
      },
 		
	  popUpUsers:function(){
		  var obj = this;
		  var userStructure = obj.options.userStructure;
		  var user = obj.options.currentUser;
		  var mainUser = obj.options.mainUser;
		  var userDesc = userStructure;
		  
		  var rights = [];
		  var subs = userStructure[user.rightsId].createSub;
		  
		  for (var x in userStructure){
			   rights[x] = userStructure[x].createSub;  
		  }
		  
		  var cadena = '<div id="'+obj.id+'_pupUp_user" class="userPanel-pupUp-user">';
		  	  var c_rights = rights[user.rightsId]; 
		  	  for (var x in c_rights){
			  	var right = c_rights[x];
				cadena+= '<div class="userPanel_pupUp_btn" idref="'+c_rights[x]+'">';
				cadena+= '	<div class="userPanel-icon widge_userPanel '+userDesc[right].sprite+'"></div>'
				cadena+= '	<label>'+userDesc[right].name+'</label>';
				cadena+= '</div>';
			  }
		  	  cadena+= '</div>';
		  
		  obj.element.append(cadena);
		  $('.userPanel_pupUp_btn').each(function(){
			 $(this).click(function(e){
				 var id = ($(this).attr('idref') === undefined)?$(this).attr('id'):$(this).attr('idref');
				 obj.options.onAction(id);
				 
				$('#'+obj.id+'_pupUp_user').remove();	 
				e.stopPropagation();
			})	  
		 })
		  
		  
		  
		  $('#'+obj.id+'_pupUp_user').mouseleave(function(){
			 obj.timer = setTimeout(function(){
			 	$('#'+obj.id+'_pupUp_user').remove();
				console.log()
		  	 },1800);
			  
		  }).mouseenter(function(){
			 clearTimeout(obj.timer);
		  });
		  
		  obj.timer = setTimeout(function(){
			 $('#'+obj.id+'_pupUp_user').remove();
		  },1800);
		  
	  },
      // called when created, and later when changing options
      _refresh: function() {
		var obj = this;
		var user = obj.options.currentUser;
		
		var userStructure = obj.options.userStructure;
		var rights = [];
		for (var x in userStructure){
		  rights[x] = userStructure[x].createSub;  
		}
		
		var cadena = '';
		var adminUser = obj.options.activities[obj.options.currentActivity].adminUser;
		
		if (adminUser && user.rights.indexOf('w') >= 0){ //tiene permiso de escritura
			right = rights[user.rightsId];
			if (!(right === undefined) && right.length > 0){ //cuenta con subordinados en jerarquia
				cadena+='<div id="'+obj.id+'_addBtn" class="widge_userPanel userPanel-btnAdd"></div>';
			}
		}
		obj.element.html(cadena);
		$('#'+obj.id+'_addBtn').click(function(){
			obj.popUpUsers();
		});
        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-userPanel" )
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
//@ sourceURL=jquery.ui.userPanel.js