requirejs.config({
    paths: {
        config:'../js/code/config',
    }
});
define(['config'],function(config){
    $.when(
			$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/main.css'}).appendTo('head'),
			$.Deferred(function( deferred ){
				$( deferred.resolve );
			})
    ).done(function(){
			console.log('done');
    });
});