var evento = function(){
};

var getContenido = function(){
  return '<div id="mdmp_georss"><div>';
};

var projectParams = {
  'panel':{
                        'right':{
                                  width:'300px',
                                  content:getContenido(),
                                  load:function(){
                                        $.when(
                                            $.getScript("projects/js/main.js"),
                                            $.Deferred(function( deferred ){
                                                $( deferred.resolve );
                                            })
                                        ).done(function(){
                                            //se ejecuta inicio de app desde archivo principal de proyecto
                                            p_main.init();
                                        });  
                                  },
								internals:[ 
								   {id:'mdmp_panel01',content:'<div id="mdmp_panel_01"></div>'},
								   {id:'mdmp_panel02',content:'<div id="mdmp_panel_02"></div>'},
								   {id:'mdmp_panel03',content:'<div id="mdmp_panel_03"></div>'}
                                ],
                                externals:[
                                    {id:'mdmp_e_panel01',content:'<div id="mdmp_e_panel_01"></div>'},
									{id:'mdmp_e_panel02',content:'<div id="mdmp_e_panel_02"></div>'},
									{id:'mdmp_e_panel03',content:'<div id="mdmp_e_panel_03"></div>'}
								]
							}
  },
  'aditionalLayers':[
	  {
		type:'Wms',
		label:'escuelas',		             
		url:'http://10.152.11.5/fcgi-bin/ms62/mapserv.exe?map=/opt/map/mdm60/mdm6masivoagro.map&',
		layer:'',
		tiled:false,
		format:'png'
	  }
	],
                    
  'onLoad':           evento,
  'onMoveEnd':function(){},
  'onZoomEnd':function(){},
  'onIdentify':function(){},
  'btnTogglePanels':true
};
if(typeof(projectParams) != "undefined"){
   MDM6('init',projectParams);
}


//Define MapConfig



var MapConfig = {
		defaultLayers:['c100'],
        layers:[
            {
                    type:'Wms',
                    label:'Vectorial',		             
		    		url:'http://10.152.11.5/fcgi-bin/ms62/mapserv.exe?map=/opt/map/mdm60/mdm6gproductoresagro.map&',
                    tiled:false,
                    format:'png'
            }
			
        ],
        projection:"EPSG:4326",
        initialExtent:{lon:[-12<0.9103, 10.9999 ],lat:[-83.3810,34.5985]},
        restrictedExtent:{lon:[-120.9103, 10.9999 ],lat:[-83.3810,34.5985]},
        resolutions:[4891.969809375,2445.9849046875,1222.99245234375,611.496226171875,305.7481130859375,152.87405654296876,76.43702827148438,38.21851413574219,19.109257067871095,9.554628533935547,4.777314266967774,2.388657133483887,1.1943285667419434,0.5971642833709717,0.29858214168548586],//,0.14929107084274293],0.07464553542137146
        buffers:{
                limit:'1000'
        }
		
    }

//Define Controls COnfig
var controlConfig = {
			ui:{	denueTurista:false, //herramienta ¿Que hay aqui?
					miniBaseMap:true,
					startupTotorial:false,
					layersBar:false, //barra de temas
					autoOpenThemeBar:false,
					toolBar:false,
					tool_gps:false //GPS
				},
			map:{
					geolocation:false,
					identify:{
						enable:true,
						createMarker:true
					}
				},
			system:{
					activeCookie:false
				}
		}

