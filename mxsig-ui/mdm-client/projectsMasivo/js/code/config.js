define(function(){
	return {
			proyName:'Masivo de Agropecuario',
			dataSource:{
				server:'http://10.1.30.102:8181/agro',
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
						subs:[1],
						createSub:[],
						canView:[0],
						selectionLabel:'',
						id:0,
						sprite:'userPanel-usericon-1',
						canEditCharge:true,
						nameChange:false,
						week:false,
						office:true
						},	
					1:{
						name:'Coordinador de Zona',
						alias:'cz',
						subs:[2],
						createSub:[],
						canView:[1,2,3],
						selectionLabel:'',
						id:1,
						sprite:'userPanel-usericon-1',
						nameChange:false,
						canEditCharge:false,
						week:false,
						office:true
						},
					2:{
						name:'Jefe de Zona',
						alias:'jz',
						subs:[3],
						createSub:[3],
						canView:[],
						selectionLabel:'',
						id:2,
						sprite:'userPanel-usericon-2',
						canEditCharge:true,
						nameChange:false,
						week:false,
						office:true
					 },
					3:{
						name:'Jefe de Entrevistadores',
						alias:'je',
						subs:[4],
						createSub:[4],
						canView:[],
						nameChange:true,
						selectionLabel:'',
						id:3,
						sprite:'userPanel-usericon-3',
						canEditCharge:false,
						week:false, //puede realizar planeacion semanal
						canCut:true, //puede dividir areas
						office:true
					 },
					 4:{
						name:'Entrevistador',
						alias:'e',
						subs:[],
						createSub:[],
						canView:[],
						nameChange:true,
						selectionLabel:'',
						id:3,
						sprite:'userPanel-usericon-3',
						canEditCharge:false,
						canEditProd:true,
						week:true,
						office:false
					 }
				},
				activities:{
					1:{
						id:1,
						name:'Asignación de Cargas',
						endTitle:'Cierre de cargas',
						pathName:'workload',
						canClose:true,
						adminUser:true,
						canEdit:true,
						},
					2:{
						id:2,
						name:'Planeación Semanal',
						endTitle:'Finalizar planeación',
						pathName:'week',
						canClose:true,
						adminUser:false,
						canEdit:true,
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
							'09':'Cuauhtémoc',
							'10':'Victoria de Durango',
							'11':'León de los Aldama',
							'12':'Acapulco de Juárez',
							'13':'Pachuca de Soto',
							'14':'(A.M.) Guadalajara',
							'15':'Ciudad Nezahualcóyotl',
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
							'32':'(A.M.) Zacatecas'
							
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
					baseUrl:'/productos',
				}
			},
			video:{
				videoPath:'projects/video/helpVideo.mp4',
				tracks :[/*{
							timeIni:0,
							timeEnd:10,
							text:'Ingresar el usuario y clave'
						   }*/
						 ]
			}
			
	}
});