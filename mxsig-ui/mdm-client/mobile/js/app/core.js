requirejs.config({
	paths: {
        ui:'app/modules/ui/ui'
		//map:'app/map/map',
    }
});
define(['ui'],function(ui){
//define(["map","ui","request"], function(map,ui,request){
        return {
            init:function(){
                        ui.init();
                      //  map.init();
                    }
        }
        
});
