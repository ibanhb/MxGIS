define(function(){
	var _obj = {
		init:function(main){
			this.main = main;
			this.config = main.config;
		},
		showMap:function(){
			var obj = this;
			var edos = obj.main.config.project.tabular_edo;
			var edosData = obj.main.users.getEdos();
			var phases = obj.main.config.project.reports.phases; //datos de pasos por etapa
			var colorRamp = obj.main.config.project.reports.colorRamp; //datos de pasos por etapa
			var etapas = obj.main.config.project.activities; //vector de etapas
			
			var edosGraph = [];
			for(var x in edosData){
				var edo = edosData[x];
				var regional = obj.main.users.getRegional(x);
				var progress = edo.progress;
				edosGraph.push({
								cvegeo:x,
								value:progress,
								name:edos[x],
								regional:regional.name,
								});
			}
			
			
			var dataClases = [];
			//color de las etapas
			for(var x in colorRamp){
				var color = colorRamp[x];
				dataClases.push({from:color.from,to:color.to,color:color.color});
			}
			
			$('#main_container').html('<div id="map_graph" class="report-map-container" style="display:none">Mapa</div></div>');
			$('#map_graph').fadeIn(1500);
			$.getJSON('data/mx_edos_mer_divisionEspecial.geojson', function (geojson) {
		
				// Initiate the chart
				$('#map_graph').highcharts('Map', {
		
					title : {
						text : 'Grafica de Avance General'
					},
		
					mapNavigation: {
						enabled: true,
						buttonOptions: {
							verticalAlign: 'bottom'
						},
						enableDoubleClickZoomTo: true
					},
					/*colorAxis: {
						dataClasses: dataClases
					},*/
					colorAxis: {
						min: 0,
						max: 100,
						stops: [
							[0, '#EFEFFF'],
							[0.5, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
						]
					},
		
					series : [{
						data : edosGraph,
						mapData: geojson,
						joinBy: ['CVE_ENT', 'cvegeo'],
						name: 'Avance',
						states: {
							hover: {
								color: '#BADA55'
							}
						},
						dataLabels: {
							enabled: true,
							format: '{point.CVE_ENT}'
						},
						tooltip: {
            					useHTML: true,
								pointFormat: '<small><b>{point.options.name}</b></small>:'+
											 '{point.value}%',
								valueDecimals: 2
						},
						point: {
								events: {
									click: function(status){
											obj.printEdoStatus(status.currentTarget.CVE_ENT);
										}
								}
						}
					}]
				});
			});
			setTimeout(function(){
				$('#map_graph').highcharts().mapZoom(5, 100, 100);
			},1000);
			
			//----
		},
		printEdoStatus:function(ent){
			var obj = this;
			var edos = obj.main.users.getEdos()[ent];
			var edos_tab = obj.main.config.project.tabular_edo;
			var cadena = '';
			$('#title_info').html('<h5>'+edos_tab[ent]+'</h5>');
			for(var x in edos.list){
				var edo = edos.list[x];
				var stage = obj.main.config.project.activities[edo.stageNumber].name;
				cadena+= '<div id="'+edo.cvegeo+'" idref="'+edo.cvegeo+'" class="city_item float-left margin-5 padding-5" >';
				cadena+= '	<label class="float-left width-full big">'+stage+'</label>';
				cadena+= '	<label class="float-right big2">'+edo.progress.toFixed(2)+'%</label>';
				cadena+= '	<label class="float-left small italic">'+((edo.active)?'Activo':'Inactivo')+'</label>';
				cadena+= '	<label class="float-left small">Usuario: '+edo.username+'</label>';
				cadena+= '	<label class="float-left small">Primer Acceso: '+edo.firstAccess+'</label></small>';
				cadena+= '	<label class="float-left small">Último Acceso: '+edo.lastAccess+'</label></small>';
				cadena+= '</div>';
			}
			
			$('#edo_list').html(cadena);
							
			$('.city_item').each(function(index, element) {
				$(this).click(function(e){
					var id = $(this).attr('idref');
					obj.main.printUserChilds(id,true);	//es usuario principal
				});
			});
			
			
			

			var ent_progress = edos.progress;
			var edoName = edos_tab[ent];
			var edo_users = edos.list;
			
			var data = [{
							name: edoName,
							y: ent_progress,
							drilldown: 'serie_'+ent
						}]
						
			
			var drillData = [];
			for(var x in edo_users){
				var edo_user = edo_users[x];
				drillData.push([edo_user.username,edo_user.real_progress])	
			}
			
			$('#edo_graph').highcharts({
					chart: {
						type: 'column'
					},
					title: {
						text: ''
					},
					subtitle: {
						text: 'Has click en la barra del estado para ver el detalle'
					},
					xAxis: {
						type: 'category'
					},
					yAxis: {
						title: {
							text: 'Total de Avance'
						}
			
					},
					legend: {
						enabled: false
					},
					plotOptions: {
						series: {
							borderWidth: 0,
							dataLabels: {
								enabled: true,
								format: '{point.y:.1f}%'
							}
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
						pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
					},
					series: [{
							name: edoName,
							colorByPoint: true,
							data: [{
										name: edoName,
										y: ent_progress,
										drilldown: 'serie_'+ent
									}]
							}
							],
					drilldown:{
								series:[{
										name: edoName,
										id: 'serie_'+ent,
										data: drillData
										}
								]
							}
				});
			
		},
		showMainProgress:function(container){
			var obj = this;
			var edos = obj.main.users.getEdos();
			var edos_tab = obj.main.config.project.tabular_edo;
			
			var sum = 0;
			for(var x in edos){
				var edo = edos[x];
				sum+= edo.progress;
			}
			var num_edos = 0;
			for(var x in edos_tab){
				num_edos++;
			}
			//suma los progresos de todos los estados y los divide entre todos los estados
			var progress = (sum / num_edos).round(2);
			
			var gaugeOptions = {
					chart: {
						type: 'solidgauge'
					},
			
					title: null,
			
					pane: {
						center: ['50%', '85%'],
						size: '140%',
						startAngle: -90,
						endAngle: 90,
						background: {
							backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
							innerRadius: '60%',
							outerRadius: '100%',
							shape: 'arc'
						}
					},
			
					tooltip: {
						enabled: false
					},
					exporting:{
							enabled: false,
							buttons: {
								exportButton: {
									enabled: false
								},
								printButton: {
									enabled: false
								}
					
							}
					}
					,
					// the value axis
					yAxis: {
						stops: [
							[0.1, '#DF5353'], // red
							[0.5, '#DDDF0D'], // yellow
							[0.9, '#55BF3B'] // green
						],
						lineWidth: 0,
						minorTickInterval: null,
						tickPixelInterval: 400,
						tickWidth: 0,
						title: {
							y: -70
						},
						labels: {
							y: 16
						}
					},
			
					plotOptions: {
						solidgauge: {
							dataLabels: {
								y: 18,
								borderWidth: 0,
								useHTML: true
							}
						}
					}
				};

				// The speed gauge
				$('#'+container).highcharts(Highcharts.merge(gaugeOptions, {
					yAxis: {
						min: 0,
						max: 100,
						title: {
							text: ''
						}
					},
					credits: {
						enabled: false
					},
			
					series: [{
						name: 'Progreso Global',
						data: [progress],
						dataLabels: {
							format: '<div style="text-align:center"><span style="color:' +((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span><br/>' +
								   '<span style="color:silver">Global</span></div>'
						},
						tooltip: {
							valueSuffix: ' Avance'
						}
					}]
			
				}));	
			
		}
	}
	return _obj;
});