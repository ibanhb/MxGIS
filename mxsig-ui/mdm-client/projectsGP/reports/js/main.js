requirejs.config({
    paths: {
        config:'../../js/code/config',
		ui:'ui',
		graph:'graph',
		getData:'getData',
		users:'users',
		shim:{
			ui:{deps:['graph']}
		}
    }
});
define(['config','ui'],function(config,ui){
    $.when(
			$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/main.css'}).appendTo('head'),
			$.Deferred(function( deferred ){
				$( deferred.resolve );
			})
    ).done(function(){
			ui.init();
    });
});