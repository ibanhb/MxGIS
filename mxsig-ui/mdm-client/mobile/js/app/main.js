requirejs.config({
    urlArgs: "ver=" + (new Date()).getTime(),
    paths: {
        mdmVersion:'../../config/mdmVersion'
    }
});
define(['mdmVersion'],function(version){
    $.when(
				/*$('<link>', {rel: 'stylesheet',type: 'text/css',href:'js/frameworks/OpenLayers/theme/default/style.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/main.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/htmlObjectsMod.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/effects.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/header.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/print.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/plantillas/mainSprite.css'+'?ver='+mdmVersion}).appendTo('head'),
				*/
				$.Deferred(function( deferred ){
					$( deferred.resolve );
				})
    ).done(function(){
                        requirejs.config({
                        urlArgs: "ver=" + mdmVersion,
                        baseUrl: ((typeof apiUrl!=='undefined')?((apiUrl)?apiUrl:''):'')+'js/',
                        paths: {
							config:'../config/config',
							core:'app/core'
                            /*openLayers:'libs/ol/OpenLayers',
                            config:'../../../config/config',
                            tree:'../config/tree',
                            ui:'core/ui/ui'*/
                        },
                        shim: {
                            /*tmsReader:{
                                exports:'tmsReader',
                                deps:['OpenLayers']
                            }*/
                       }
                });
                require(['config','core'],function(config,core) {
                   core.init();
                });
                        
    });
    
});