var MDMXSIG_layer_clahabana ={
			settings:{
				 project:'mxsig',
				 sourceDataInfo:'Fuente de los datos',
				 path:'/config/genericthemes/clahabana',
				 uiColors:[  //colores en interfaz
					 '#85A2E4',//color claro
					 '#E97B7B',//color intenso
				 ],
				 cardIndicatorNalDownload:'config/genericthemes/clahabana/docs/clahabana.xlsx',
				 cardIndicatorNalDownloadPDF:'config/genericthemes/clahabana/docs/clahabana.pdf',
				 mainDoc:'config/genericthemes/clahabana/docs/mainDoc.pdf',
				 bootDialog:'config/genericthemes/clahabana/docs/init.html',
				 bootDialogTitle:'Información de ejemplo',
				 cardIndicatorOrder:[
									{id:'label',label:'Indicador'},
									{id:'value',label:'Valor'},
									{id:'liminfconf',label:'Limite inferior de confianza'},
									{id:'limsupconf',label:'Limite superior de confianza '},
									{id:'coefvar',label:'Error estándar'},
									{id:'errorstdr',label:'Coeficiente de variación'}
								],
				 minStrats:1,
				 maxStrats:5,
				 geoTypes:[ 
						{id:'1',val:'DISTRITOS'},
						{id:'2',val:'MANZANAS'}
				 ],
				 source: {  //texto a desplegar en documentos exportados basado en el geoTypes
					'1':'Fuente: Ejemplo basado en Distritos',
					'2':'Fuente: Ejemplo basado en Manzanas',
				 },
				 transparency:100,
				 colorRamps:[
						{id:0,name:'Escarlata',colors:['#FFE0E0','#EBA59B','#CF705F','#B04130','#910A0A']},	
						{id:1,name:'Verdes',colors:['#D8F2ED','#9FC4BE','#6B9993','#3F736D','#144F4A']},
						{id:2,name:'Naranja',colors:['#F5F500','#F5B800','#F57A00','#F53D00','#F50000']},
						{id:3,name:'Azules',colors:['#B6EDF0','#74B4E8','#1F83E0','#1D44B8','#090991']},
						{id:4,name:'Amarillos',colors:['#FFF28C','#DCBB6A','#BE8447','#9F4C25','#801502']},
						{id:5,name:'Grises',colors:['#BDBFBF','#8B8C8C','#656666','#4C4C4C','#292929']}
				 ],
				 numStrats:5,
				 methods:[ 
						/*{name:'cuantiles',title:'Cuantiles'}*/
						//{name:'nei',title:'Rupturas naturales'}
						//{name:'d2r',title:'Dalenius'}*/
						{name:'jenks',title:'Rupturas Naturales'}
						],
				 exportTypes:['xls','csv']
			},
			startingData:{
					tree:[],
					geoIndex:'00',
					geoTree:[],
					geoSelected:['00'],
					geoType:'1',
					index:0,
					strats:5,
					typeVarSelection:'edomun',
					showTotal:'edomun',
					colors:{id:0,name:'Escarlata',colors:['#FFE0E0','#EBA59B','#CF705F','#B04130','#910A0A']},
					selected:null,
					method:'jenks',
					//year:2014,
					varActive:{
								descripcion:"Poblacion total",
								id:1,
								subcat:false,
								theme:true,
								variable:"p4_1"
							}	
			},
			dataSources:{
				exportData:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/export',
					urlGet:'http://mdm5beta.inegi.org.mx:8181/map/export',
					type: 'POST',
					contentType : "application/json; charset=utf-8",
					dataType: "json",
					stringify:true
			    },
				varlist:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/widget/mxsig/indicator', //*
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json",
					params:{alias:'indicadorescuba'}
				},
				geolist:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/namecvegeo',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},
				theme:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/widget/mxsig/theme', //*
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true,
					params:{alias:'distritocuba',proy:'mxsig'},
				},
				getExtent:{
					url:'http://10.1.30.102:8181/map/wkt',
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json",
				},
				themeColor:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/widget/mxsig/colors', //*
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},
				infoPoint:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/widget/mxsig/find', //*
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},
				getCardValues:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/geoelectorales/label',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				}
			}
}