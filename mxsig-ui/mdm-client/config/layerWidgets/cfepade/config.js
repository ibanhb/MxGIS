// JavaScript Document
window.layerWidgets.cfepade.config = {
		    settings:{
				 project:'mxsig',
				 sourceDataInfo:'Fuente de los datos',
				 mainDoc:'config/layerWidgets/cfepade/docs/mainDoc.pdf', //documento de descarga ubicado en los botones principales
				 methodologicalDocument:'config/layerWidgets/cfepade/docs/DocMet_FEPADE_VF.pdf',
				 userManual:'config/layerWidgets/cfepade/docs/Manual_Usuario_FEPADE.pdf',
				 bootDialog:'config/layerWidgets/cfepade/docs/init.html',  //documento html que funge como mensaje de información
				 bootDialogTitle:'Fiscalía Especializada para la Atención de los Delitos Electorales',  //titulo de la ventana emergente con el mensaje de información
				 docPath:'docs/cfepade', //path archivos para metadatos
				 layerMapName:{
					nal:'MAPAESTATAL',
					lv1:'MAPADISTRITO'
				 },
				 mapDefaultLayers:'d100,d503', //capas por defecto que son enviadas al momento de tematizar
				 cardIndicatorOrder:[  //orden de impresion en tabulado de resultados
									{id:'label',label:'Indicador'},
									{id:'value',label:'Valor'}
								],
				 transparency:100, //transparencia por defecto del tema pintado en mapa
				 colorRamps:[
					 	{id:0,name:'Amarillos',colors:['#FFF28C','#DCBB6A','#BE8447','#9F4C25','#801502']}, //la primer rampa de color debe estar sincronizada con el mapserver
						{id:1,name:'Verdes',colors:['#D8F2ED','#9FC4BE','#6B9993','#3F736D','#144F4A']},
						{id:2,name:'Naranja',colors:['#F5F500','#F5B800','#F57A00','#F53D00','#F50000']},
						{id:3,name:'Azules',colors:['#B6EDF0','#74B4E8','#1F83E0','#1D44B8','#090991']},
						{id:4,name:'Escarlata',colors:['#FFE0E0','#EBA59B','#CF705F','#B04130','#910A0A']},	
						{id:5,name:'Grises',colors:['#BDBFBF','#8B8C8C','#656666','#4C4C4C','#292929']}
				 ],
				 numStrats:3,
				 methods:[ 
						/*{name:'cuantiles',title:'Cuantiles'},
						{name:'nei',title:'N.E.I'},
						{name:'d2r',title:'Dalenius'},
						*/
						{name:'jenks',title:'R. Naturales'}
						],
				 minStrats:1,
				 maxStrats:3,
				 //Valores fijos -------------------------------------------------------------------
				 geoLevels:[],// Carga dinamica de valores desde servicio de action 
				 exportTypes:['xls','csv'], //formatos de exportación que serán solicitados al momento de presentar los datos.
				 varByLevel:{  //indicadores precargados con los que se tematizará al seleccionar un corte geográfico al inicio
					 nal:{
						descripcion:"Fiscalía Especializada para la Atención de Delitos Electorales",
						id:351,
						metadata:false,
						subcat:true,
						theme:true,
						variable:"cent_ci_tot_hpd",
						geoLevel:'nal',
						parent:344,
						idTab:351,
						filters: [{field: "superior", value: "0"}]
						
					 },
					 lv1:{
						descripcion:"Fiscalía Especializada para la Atención de Delitos Electorales",
						id:6,
						metadata:false,
						subcat:true,
						theme:true,
						variable:"cdis_ci_tot_den",
						geoLevel:1,
						parent:1,
						idTab:6,
						filters:[{field: "cdis_ci_pef", value: "si"}]
					 }
				 }
				 //----------------------------------------------------------------------------------
			},
			startingData:{ 
					varActive:null,
					colors:{id:0,name:'Escarlata',colors:['#FFF28C','#DCBB6A','#BE8447','#9F4C25','#801502']},
					method:'jenks',
					strats:5,
					geoLevelActive:1, //debe ser acorde a la posicion de la primer variable activa
					//Valores Fijos----------------------------------------------
					geoIndex:0,  //valor de carga inicial, 0 es inicio del arbol geográfico
					geoSelected:['0'],
					geoType:'1',
					index:0,
					showTotal:'',
					typeVarSelection:'',
					selected:null,
					geoLevel:0,
					currentMapTheme:null,
					tree:[]
					//------------------------------------------------------------
			},
			dataSources:{
				exportData:{
					url:'export',
					urlGet:'export',
					type: 'POST',
					contentType : "application/json; charset=utf-8",
					dataType: "json",
					stringify:true
			    },
				varlist:{
					url:'widget/mxsig/indicator', //*
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json",
					params:{alias:'indicadoresfepade'}
				},
				getGeoConfig:{
					url:'widget/mxsig/actions',
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json",
					params:{
						project:'fepade'
					}
				},
				geolist:{
					url:'widget/mxsig/catcvegeo',
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json"
				},
				theme:{
					url:'widget/mxsig/theme', //*
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true,
					params:{proy:'mxsig'},
				},
				getExtent:{
					url:'widget/mxsig/wkt',  //*
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json",
				},
				themeColor:{
					url:'widget/mxsig/colors', //*
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},
				infoPoint:{
					url:'widget/mxsig/find', //*
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},
				getCardValues:{
					url:'widget/mxsig/label/sublevels ',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true,
					params:{aliasIndicators:'indicadoresfepade'},

				},
				getTabulated:{
					url:'widget/mxsig/tabulated', //*
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					params:{alias:'indicadoresfepade'},
					stringify:true
				}
			}
} 
window.layerWidgets.cfepade.widgetLoaded = true;
//@ sourceURL=config_catastro.js