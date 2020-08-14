define(function(){
	return {
			proyName:'Grandes Productores Agropecuario',
			dataSource:{
				server:'http://10.1.30.102:8181/gpagro',
				global:{
					url:'',
                    contentType : "application/json;charset=utf-8",
					type: 'POST',
					dataType: "json",
					xhrFields: { withCredentials: true },
					stringify:true
					
				},
				user:{
					login:{
						url:'login'
					},
					logout:{
						url:'logout'
					},
					office:{
						url:'office/add'
					},
					add:{
						url:'addUser'
					},
					remove:{
						url:'deleteUser'
					},
					changeName:{
						url:'edit/name'
					},
					changeColor:{
						url:'changeColor'
					},
					schema:{
						url:'schema'
					},
					summaryUser:{
						url:'user/summary'
					},
					summaryGral:{
						url:'summary'	
					},
					flag:{
						url:'flag'	
					},
					workload:{
						url:'workload'	
					},
					week:{
						url:'week'	
					}
				}
			},
			project:{
				rankSettings:{
					3:{
						canDrag:false
					  }
				},
				ranks:{
					0:{
						name:'Jefe de Control',
						alias:'jc',
						subs:[1], //cual es el o los usuarios inmediatos subordinados
						createSub:[],
						canView:[1,2,3], //Este usuario al logearse hasta donde puede ver
						selectionLabel:'',
						id:0,
						sprite:'userPanel-usericon-1',
						canEditCharge:false, //puede editar las cargas a este perfil
						nameChange:false, //puede cambiarse el nombre a este perfil
						week:false, //puede tener carga semanal
						office:false //debe tener oficina
						},	
					1:{
						name:'Coordinador de Zona',
						alias:'cz',
						subs:[2],
						createSub:[2],
						canView:[],
						selectionLabel:'',
						id:1,
						sprite:'userPanel-usericon-1',
						nameChange:false,
						canEditCharge:false,
						week:false,
						office:false
						},
					2:{
						name:'J.Entrevistadores G.P.',
						alias:'jegp',
						subs:[3],
						createSub:[3],
						canView:[],
						selectionLabel:'',
						id:2,
						sprite:'userPanel-usericon-2',
						canEditCharge:false,
						nameChange:true,
						canCut:true, //puede dividir areas
						week:false,
						office:true
					 },
					3:{
						name:'Entrevistador G.P.',
						alias:'egp',
						subs:[4],
						createSub:[],
						canView:[],
						nameChange:true,
						selectionLabel:'',
						id:3,
						sprite:'userPanel-usericon-3',
						canEditCharge:true,
						week:true, //puede realizar planeacion semanal
						office:false
					 },
				},
				activities:{
					1:{
						id:1,
						name:'Asignación de Cargas',
						endTitle:'Cierre de cargas',
						pathName:'workload',
						canClose:true,
						adminUser:true,
						canEdit:true
						},
					2:{
						id:2,
						name:'Planeación Semanal',
						endTitle:'Finalizar planeación',
						pathName:'week',
						canClose:true,
						adminUser:false,
						canEdit:true
						},
					3:{
						id:3,
						name:'Actividad Finalizada',
						endTitle:'Actividad Finalizada',
						pathName:'planning',
						adminUser:false,
						canClose:false,
						canEdit:false
						}	
				},
				tabular_edo:{
							'01':'Aguascalientes',
							'02':'Tijuana',
							'03':'La Paz',
							'04':'San Francisco de Campeche',
							'05':'(A.M.) Torreón',
							'06':'Colima',
							'07':'Tuxtla Gutiérrez',
							'08':'Chihuahua',
							'09':'Ciudad de México Norte',
							'10':'Victoria de Durango',
							'11':'León de los Aldama',
							'12':'Acapulco de Juárez',
							'13':'Pachuca de Soto',
							'14':'(A.M.) Guadalajara',
							'15':'México Oriente',
							'16':'Morelia',
							'17':'(A.M.) Cuernavaca',
							'18':'Tepic',
							'19':'(A.M.) Monterrey',
							'20':'Oaxaca de Juárez',
							'21':'Heroica Puebla de Zaragoza',
							'22':'(A.M.) Querétaro',
							'23':'Cancún',
							'24':'San Luis Potosí',
							'25':'Culiacán Rosales',
							'26':'Hermosillo',
							'27':'Villahermosa',
							'28':'Nuevo Laredo',
							'29':'Tlaxcala de Xicohténcatl',
							'30':'(A.M.) Veracruz',
							'31':'Mérida',
							'32':'(A.M.) Zacatecas',
							'33':'Ciudad de México Sur',
							'34':'México Poniente'
				},
				weeks:[
					{id:1,name:'Semana 01',color:'#f7fb00'},
					{id:2,name:'Semana 02',color:'#9BCD00'},
					{id:3,name:'Semana 03',color:'#00DAB5'},
					{id:4,name:'Semana 04',color:'#A0DCF3'},
					{id:5,name:'Semana 05',color:'#0099FF'},
					{id:6,name:'Semana 06',color:'#7D84EA'},
					{id:7,name:'Semana 07',color:'#A45CE4'},
					{id:8,name:'Semana 08',color:'#EC9ACF'},
					{id:9,name:'Semana 09',color:'#E17F1D'},
					{id:10,name:'Semana 10',color:'#EA5127'}
					],
				productivity:[
						{id:1,label:'Productividad Mínima'},
						{id:2,label:'Productividad Mínima Media'},
						{id:3,label:'Productividad Media'},
						{id:4,label:'Productividad Media Máxima'},
						{id:5,label:'Productividad Máxima'}
				],
				reports:{
					//baseUrl:'http://10.153.3.5:8181/agro_gproductores/reportAgro', //ruta donde se encuentram los reportes y a donde apuntarán los links de los mismos
					baseUrl:'/productos', //ruta donde se encuentram los reportes y a donde apuntarán los links de los mismos
				 	phases:{'CZ':{base:0,phases:2},'JC':{base:2,phases:3}},
					maxPhases:5, //numero total de fases a completar, suma base y fase del perfil superior
					colorRamp:[
						{from:0,to:10,color:'#FFFFFF'},
						{from:10.1,to:20,color:'#FFBF00'},
						{from:20.1,to:30,color:'#FFE51E'},
						{from:30.1,to:40,color:'#F3FF35'},
						{from:40.1,to:50,color:'#CEFF45'},
						{from:50.1,to:60,color:'#A5FF4B'},
						{from:60.1,to:70,color:'#77FF45'},
						{from:70.1,to:80,color:'#A2E9FF'},
						{from:80.1,to:90,color:'#68BCFF'},
						{from:90.1,to:100,color:'#2A8EFF'},
					],
					regionals:[ //listado de regionales para la obtencion de datos de diferentes estados
						{
							url:'http://10.4.1.212:8080/agro',
							edos:['19','05','28'],
							name:'Noroeste'
						},
						{
							url:'http://10.51.10.212:8080/agro',
							edos:['10','08','32'],
							name:'Norte'
						},
						{
							url:'http://10.31.31.212:8080/agro',
							edos:['26','02','03','25'],
							name:'Noreste'
						},
						{
							url:'http://10.7.1.212:8080/agro',
							edos:['14','06','16','18'],
							name:'Occidente'
						},
						{
							url:'http://10.6.1.212:8080/agro',
							edos:['24','01','11','22'],
							name:'Centro Norte'
						},
						{
							url:'http://10.84.1.212:8080/agro',
							edos:['15','12','17'],
							name:'Centro Sur'
						},
						{
							url:'http://10.11.3.212:8080/agro',
							edos:['21','13','29','30'],
							name:'Oriente'
						},
						{
							url:'http://10.153.3.5:8181/agro',
							edos:['20','07','27'],
							name:'Sur'
						},
						{
							url:'http://10.13.1.212:8080/masivo_reportes',
							edos:['31','04','23'],
							name:'Sureste'
						},
						{
							url:'http://10.10.10.212:8080/masivo_reportes',
							edos:['09'],
							name:'Centro'
						}
					]
				}
			},
			video:{
				videoPath:'projects/video/helpVideo.mp4', //video a cargar al pulsar el botón de ayuda
				tracks :[/*{  //determina los textos e intervalos en los que aparece en el video
							timeIni:0,
							timeEnd:10,
							text:'Ingresar el usuario y clave'
						   }*/
						 ]
			}
			
	}
});