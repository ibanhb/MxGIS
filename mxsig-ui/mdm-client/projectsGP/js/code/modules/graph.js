define(function(){
	var mainGraphUser = {};
	return {
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.ranks = obj.main.config.project.ranks;
		},
		graphUserGral:function(){
			var obj = this;
			return{
				create:function(){
					_obj = this;
					if(obj.main.data.currentActivity == 1){
						var user = obj.main.modules.users.getIndexUser();
						var cadena = '<div id="floatGraph" class="mdm-ui-widget">'; //clase que permite hacer que se oculte y presente
							cadena+= '	<span id="graph_btn" class="graph-btn" style="display:none"></span>';
							cadena+= '	<span id="floatGraph_close" class="mdmp_plantilla mdmp_plantilla_house_closeWhite"></span>';
							cadena+= '	<div id="floatGraph_container" class="floatGraph-container"></div>';
							cadena+= '</div>';
							$('#panel-center').append(cadena);
							$('#floatGraph_close').click(function(){
								_obj.close();	
							});
							$('#graph_btn').click(function(){
								_obj.open();	
							});
							this.update();
					}
				},
				close:function(){
					$('#floatGraph_close').fadeOut();
					$('#floatGraph_container').fadeOut();
					$('#floatGraph').animate({width:'70px',height:'70px'},1000,function(){
						$('#graph_btn').fadeIn();
					});
				},
				open:function(){
					$('#graph_btn').fadeOut();
					$('#floatGraph').animate({width:'395px',height:'276px'},1000,function(){
						$('#floatGraph_close').fadeIn();
						$('#floatGraph_container').fadeIn();
					});
					
				},
				update:function(){
					var _obj = this;
					if(obj.main.data.currentActivity == 1){
						
						if($('#graph_btn').attr('id') === undefined ){
								_obj.create();
						}else{
							var user = obj.main.modules.users.getIndexUser();
							mainGraphUser = user;
							
							obj.main.modules.users.getGralDataUser(user,function(data){
									var list = data.childList;
									_obj.graph(list);
							});
						}
					}
				},
				graph:function(list){
					var _obj = this;
					var user = obj.main.modules.users.getIndexUser();
					mainGraphUser = user;
					var a_norm = [],a_exed = [],a_prom = [],a_nom = [];

					for(var x in list){
						var item = list[x];
						item.minima = item.minima || 10;
						var charge = item.charge;
						var max = item.maxima;
						var min = item.minima;
						var color = item.color;
						
						var norm = (charge > min)?min:(charge).ceil(4);
						
						var prom = (charge < min)?0:
												  (charge < max)?(charge-min).ceil(4):
												  				 (max-min).ceil(4);
						var exed = (charge < max)?0:(charge-max).ceil(4);
						
						a_norm.push(norm);
						a_prom.push(prom);
						a_exed.push(exed);
						a_nom.push(item.userName);
					}
					
					var series = [{
							name: 'Excedida',
							data: a_exed,//[5, 3, 4, 7, 2],
							color:'#FF4413'
						}, {
							name: 'Promedio',
							data: a_prom,//[2, 2, 3, 2, 1],
							color:'#E8AE06'
						}, {
							name: 'Normal',
							data: a_norm//[3, 4, 4, 2, 5],
						}]
					
					
					$('#floatGraph_container').highcharts({
						chart: {
							type: 'column'
						},
						title: {
							text: user.alias+' '+user.userName
						},
						xAxis: {
							categories: a_nom//['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
						},
						yAxis: {
							min: 0,
							title: {
								text: 'Nivel de carga asignada'
							},
							stackLabels: {
								enabled: true,
								style: {
									fontWeight: 'bold',
									color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
								}
							}
						},
						/*legend: {
							align: 'right',
							x: -30,
							verticalAlign: 'top',
							y: 18,
							floating: true,
							backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
							borderColor: '#CCC',
							borderWidth: 1,
							shadow: false
						},*/
						tooltip: {
							headerFormat: '<span style="font-size: 8px">{point.x}</span><br/>',
							pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
						},
						plotOptions: {
							column: {
								stacking: 'normal',
								dataLabels: {
									enabled: true,
									color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
									style: {
										textShadow: '0 0 3px black'
									}
								}
							}
						},
						series: series
					});
					
				}
				
			}
		},
		graphUser_pie:function(user,idContainer,func){ //obtiene usuario
			var obj = this;
			user = obj.main.modules.users.getUser(user);
			var currentUser = obj.main.modules.users.getIndexUser();
			var colors = obj.main.modules.users.getChildColors(currentUser);
			var chargeTotal = user.charge;
			
			var pieClick = function(id){
				
			}
			var pieOver = function(id){
				
			}
			var slices =[];
			
			if (user.childlist && user.childlist.length > 0){
				var childs = user.childlist;
				var totalCharge = user.charge;
				var totalSinAsignar = (totalCharge > user.maxCharge)?0:100-parseFloat(((100/user.maxCharge)*user.charge).toFixed(2),10);
				
				
				for (var x in childs){
					var child = childs[x];
					var carga = (totalCharge > 0)?parseFloat(((100/totalCharge)*child.charge).toFixed(2),10):0; 	
					slices.push(
							{id:child.user,
							name: child.userName,
							y: carga,
							sliced: false,
							selected: false,
							color:child.color_hex
							}
							);
				}
				//carga sin asignar
				slices.push({id:user.user,
							name: 'Sin asignar',
							y: totalSinAsignar,
							sliced: false,
							selected: false,
							color:'#97BE0C'
							});	
			}else{
				var carga = (user.charge >user.maxCharge)?100:parseFloat(((100/user.maxCharge)*user.charge).toFixed(2),10);
				slices.push({id:user.user,
							name: 'Asignado',
							y: carga,
							sliced: false,
							selected: false,
							color:'#38a9db'
							});	
				slices.push({id:user.user,
							name: 'Sin asignar',
							y: (100-carga),
							sliced: false,
							selected: false,
							color:'#97BE0C'
							});	
				
			}
			$('#'+idContainer).highcharts({
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				title: {
					text: ''
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: false,
							color: '#000000',
							connectorColor: '#000000',
							format: '<b>{point.name}</b>: {point.percentage:.1f} %'
						}
					}
				},
				series: [{
					type: 'pie',
					name: 'Carga',
					data: slices,
					point:{
						events:{
							click:function(e){
									var id = this.id;
									pieClick(id);
							 },
							mouseOver:function(e){
									var id = this.id;
									pieOver(id);
							 }
						}
					}
				}]
			});
		}
	}
});