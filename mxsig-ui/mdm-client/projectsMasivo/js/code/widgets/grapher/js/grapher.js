var MDMGrapher;
//define(function(){
   (function( $, window ) {
        $.widget("mdm6.sectioner", {
            options: {
                sections:{
                    'left':'200px',
                    'right':'300px',
                    'center':'auto'
                }
            },
            buildStructure: function(o){
                var element = this.element;
                element.addClass('grapher');
                var chain=''+
                '<div class="right" style="width:'+o.right+'"></div>'+
                '<div class="divisor" style="right:'+o.right+'">'+
                    '<div class="left" style="width:'+o.left+';"></div>'+
                    '<div class="center" style="left:'+o.left+'"></div>'+
                '</div>';
                element.append(chain);
            },
            _create: function(){
                var o = this.options;
                this.buildStructure(o.sections);
            },
            _init: function(){
            },
            destroy: function(){
                var element = this.element;
                element.removeClas('grapher');
                element.html('');
            },
            _setOption: function(key, value){
                this.options[key] = value;
                switch(key){
                    case "something":
    
                    break;
                    }
                }
            });
        
        var Events = {
            timer:null,
            tableRequest:null,
            request:null,
            user:{
               type:'jg',
               id:'22'
            },
            options:{
                id:'grapher',
                baseUrl:'projects/code/widgets/grapher/css/'
            },
            clearTimer:function(){
               if(Events.timer){
                    clearTimeout(Events.timer);
               }
            },
            executeTimer:function(){
               $("#panel-bottom").panel('show');
               var obj = Events;
               obj.clearTimer();
               obj.timer=setTimeout(function(){
                    //obj.request.setUrl(mdmp.dataSource.server+'/summary/subdirector/'+obj.user);
                    obj.request.setUrl(mdmp.dataSource.server+'/summary/'+obj.user.type+'/'+obj.user.id);
                    obj.request.execute();
                    //obj.requestTable.setUrl(mdmp.dataSource.server+'/summary/jg/'+obj.user);
                    //obj.requestTable.execute();
               },1000);
            },
            init:function(){
               var obj = Events;
               obj.timer = function(){
                    
               }
                $.when(
                    $('<link>', {rel: 'stylesheet',type: 'text/css',href: Events.options.baseUrl+'grapher.css'}).appendTo('head'),
                    $.Deferred(function( deferred ){
                        $( deferred.resolve );
                    })
                ).done(function(){
                    Events.defineRequest();
                    $("#"+Events.options.id).sectioner({sections:{left:'5px',right:'300px',center:'auto'}});
                    //$("#"+Events.options.id).sectioner({sections:{left:'250px',right:'300px',center:'auto'}});
                    //Events.executeTimer();
                });
            },
            Execute:function(){
               var obj = Events;
               obj.user = arguments[0];
               obj.executeTimer();
            },
            Clear:function(){
               $(".left").html('');
               $(".right").html('');
               $(".center").html('');
            },
            defineRequest:function(){
               var obj=Events;
               
               var params ={
                    url:'',
                    type:mdmp_sources.global.type,
                    format:mdmp_sources.global.dataType,
                    contentType:mdmp_sources.global.contentType,
                    xhrFields:mdmp_sources.global.xhrFields,
                    params:'',
                    events:{
                        success:function(data,extraFields){
                            var msg=null;
                            if(data){
                                if(data.response.success){
                                    var datos = data.data.value;
                                    var response=obj.buildStructureData(data.data.value);
                                    //console.log(data.data.value);
                                    obj.plot(response.circle,response.bar,response.table);
                                }else{
                                     msg='Graficado no disponible';
                                }
                            }else{
                                msg='Servicio de graficado no disponible';
                            }
                            if(msg!=null){
                                   MDM6('newNotification',{message:msg,time:5000});
                            }
                        },
                        before:function(a,extraFields){
                           
                        },
                        error:function(a,b,extraFields){
                              var msg ='Servicio de graficado no disponible';
                               MDM6('newNotification',{message:msg,time:5000});
                        },
                        complete:function(a,b,extraFields){
                            
                        }
                    }
                };
               obj.request = MDM6('newRequest',params);
               var paramsTable ={
                    url:'',
                    type:mdmp_sources.global.type,
                    format:mdmp_sources.global.dataType,
                    contentType:mdmp_sources.global.contentType,
                    xhrFields:mdmp_sources.global.xhrFields,
                    params:'',
                    events:{
                        success:function(data,extraFields){
                            var msg=null;
                            if(data){
                                if(data.response.success){
                                    console.log(data);
                                    
                                }else{
                                     msg='Graficado no disponible';
                                }
                            }else{
                                msg='Servicio de graficado no disponible';
                            }
                            if(msg!=null){
                              MDM6('newNotification',{message:msg,time:5000});
                            }
                        },
                        before:function(a,extraFields){
                           
                        },
                        error:function(a,b,extraFields){
                                var msg = 'Servicio de graficado no disponible'
                                MDM6('newNotification',{message:msg,time:5000});
                        },
                        complete:function(a,b,extraFields){
                         
                        }
                    }
               };
               obj.requestTable = MDM6('newRequest',paramsTable);
            },
            buildStructureData:function(data){
               var response = {};
               var typeUser;
               switch(data.barGraph.tipo){
                    case 1:typeUser='REP';
                         break;
                    case 2:typeUser='Supervisor';
                         break;
                    case 3:typeUser='Entrevistador';
                         break;
               };
               
               response.circle = {
                         series:[
                                   {
                                           drilldown:'asignados',
                                           name:'Asignados',
                                           visible:true,
                                           y:data.asignado,
                                           color:'#77DD77'
                                   },
                                   {
                                           drilldown:'no asignados',
                                           name:'No asignados',
                                           visible:true,
                                           y:data.noAsignado,
                                           color:'#CFCFC4'
                                   }
                                   
                              ],
                         subSeries:[
                                        {
                                                data:[
                                                  /*
                                                        {name:'jc1',y:23,color:'#779ECB'},
                                                        {name:'jc2',y:23,color:'#966FD6'},
                                                        {name:'jc3',y:23,color:'#AEC6CF'}
                                                        */
                                                ],
                                                id:'asignados',
                                                name:'Asignados'
                                        },
                                        {
                                                data:[
                                                  /*
                                                        {name:'jc1',y:23,color:'#779ECB'},
                                                        {name:'jc2',y:23,color:'#966FD6'},
                                                        {name:'jc3',y:23,color:'#AEC6CF'}
                                                        */
                                                ],
                                                id:'no asignados',
                                                name:'No asignados'
                                        }
                                   ]
               };
               response.bar = {
                    categories:[],
                    series:[
                         {    name:'No asignados',
                              data:[],
                              color:'#CFCFC4'
                         },
                         {
                              name:'Asignados',
                              data:[],
                              color:'#77DD77'                             
                         }
                    ],
                    Titulo:typeUser
               };
               for(var x in data.barGraph.childList){
                    var i = data.barGraph.childList[x];
                    response.bar.categories.push(i.userName);
                    var restantes = i.maximo-i.charge;
                    response.bar.series[1].data.push({y:i.charge,color:i.color});//asignados
                    response.bar.series[0].data.push(restantes);//no asignados
                    response.circle.subSeries[0].data.push({name:i.userName,y:i.charge});//asignados
                    response.circle.subSeries[1].data.push({name:i.userName,y:restantes});//no asignados
                    
               }
               response.table={
                         title:'Totales',
                         series:[
                              /*
                              {title:'total',value:526},
                              {title:'total',value:526},
                              {title:'total',value:526},
                              {title:'total',value:526},
                              {title:'total',value:526}
                              */
                         ]
               };
               return response;
            },
            plot:function(seriesCircle,seriesBar,dataTable){
               
               Events.buildGraph({side:'right',centerTitle:true,type:'pie',title:'Cargas de trabajo',data:seriesCircle,showLabels:true,legend:true});
               Events.buildGraph({side:'center',type:'column',title:'Cargas para '+seriesBar.Titulo,data:seriesBar,showLabels:true,HorizontalTitle:'Total de cargas'});
               //Events.buildTable({side:'left',data:dataTable});
            },
            buildTable:function(options){
     
               //console.log(options);
               var claseItem = 'even';
               var chain='<div class="separatorGraph">'+
                              '<div class="title"><div class="content" align="center">'+options.data.title+'</div></div>'+
                              '<div class="table">'+
                                   '<div class="graphTable">';
               for(var x in options.data.series){
                                   var o = options.data.series[x];
                                   claseItem = (claseItem=='even')?'odd':'even';
                                   chain+='<div class='+claseItem+'>'+
                                                  '<div class="section">'+
                                                       '<div class="left">'+o.title+'</div>'+
                                                       '<div class="right">'+o.value+'</div>'+
                                                  '</div>'+
                                           '</div>';
               }
               chain+=             '</div>'+
                              '</div>'+
                        '</div>';
               $('.'+options.side).html(chain);
            },
            buildGraph:function(options){
                var params = {
                    chart: {
                        type: options.type,
                        resetZoomButton:{
                                   relativeTo: 'chart',
                                   position: {
                                        y: 5,
                                        x: -5
                                   },
                                   theme: {
                                        fill: 'white',
                                        stroke: 'silver',
                                        r: 0,
                                        states: {
                                            hover: {
                                                fill: '#41739D',
                                                style: {
                                                    color: 'white'
                                                }
                                            }
                                        }
                                   }
                         },
                         events:{
                              drilldown:function(e){
                                   /*
                                   var chart = $('.'+options.side).highcharts();
                                   var title = e.seriesOptions.name;
                                   chart.setTitle({text: title});
                                   */
                              },
                              drillup:function(e){
                                   /*
                                   var chart = $('.'+options.side).highcharts();
                                   var title = e.seriesOptions.name;
                                   chart.setTitle({text: options.title});
                                   */
                              },
                              click:function(e){
                                   //console.log('click');
                              },
                              redraw:function(e){
                                   //console.log('redraw');
                              },
                              addSeries:function(){
                                   //console.log('addseries');
                              }
                         }
                    },
                    credits:{
                         enabled:false
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: ((options.showLabels)?options.showLabels:false),
                                format:'{percentage:.1f}%'//,
                                //style: {
                                    //fontWeight: 'bold',
                                    //color: 'white',
                                    //textShadow: '0px 1px 2px black'
                                //}
                            },
                            showInLegend:((options.legend)?options.legend:false)
                        }
                    },
    
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> elementos<br/>'
                    }, 
    
                    series: [{
                        name: options.title,
                        colorByPoint: true,
                        data: options.data.series
                    }],
                    drilldown: {
                        series: options.data.subSeries,
                        drillUpButton:{
                              relativeTo: 'spacingBox',
                              position: {
                                   y: 0,
                                   x: 0
                              },
                              theme: {
                                        fill: 'white',
                                        stroke: 'silver',
                                        r: 0,
                                        states: {
                                            hover: {
                                                fill: '#41739D',
                                                style: {
                                                    color: 'white'
                                                }
                                            }
                                        }
                              }
                        }
                    }
                };
                if(options.title){
                    params.title={
                        text: options.title,
                        style: {
                            font: 'bold 12px Verdana, sans-serif',
                            color : '#58748E'
                        }
                        
                    }
                }
                if(options.centerTitle){
                    params.title.align='center';
                    params.title.verticalAlign='middle';
                    params.title.y=-75;
                    //params.title.y=-33;
                    //params.plotOptions.series.innerSize='50%';
                    params.plotOptions.series.dataLabels.distance=-20;
                }
                if(options.subtitle){
                    params.subtitle={
                        text: options.subtitle
                    }
                }
                
                if(options.type=='column'){
                    params.chart.zoomType='x';
                    params.xAxis = {
                             categories: options.data.categories
                    };
                    params.yAxis = {
                             min: 0,
                             title: {
                                 text: options.HorizontalTitle
                             },
                             stackLabels: {
                                 enabled: true,
                                 style: {
                                     fontWeight: 'bold',
                                     color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                 }
                             }
                         };
                    params.plotOptions = {
                                             column: {
                                                 stacking: 'normal',
                                                 dataLabels: {
                                                     enabled: true,
                                                     color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                                     style: {
                                                         textShadow: '0 0 3px black, 0 0 3px black'
                                                     }
                                                 },
                                                 showInLegend:((options.legend)?options.legend:false)
                                             }
                                        };
                    params.series = options.data.series;
                    params.tooltip = {
                             formatter: function() {
                                 return '<b>'+ this.x +'</b><br/>'+
                                     this.series.name +': '+ this.y +'<br/>'+
                                     'Total: '+ this.point.stackTotal;
                             }
                    };
                    
                }
               Highcharts.setOptions({
                         lang: {
                             drillUpText: 'Regresar',//'Regresar a {series.name}'
                             resetZoom:'Regresar'
                         }
               });
                $('.'+options.side).highcharts(params);
            }
        };
        $.fn.MDMGrapher = function(e) {
                    if (Events[e] ) {
                        return Events[e].apply( this, Array.prototype.slice.call(arguments, 1) )
                    } else if ( typeof e === 'object' || ! e ) {
                        Events.init.apply( this, arguments );
                    } else {
                            //no existe el metodo
                    }
            };
        MDMGrapher = $.fn.MDMGrapher;
        
    })( jQuery, window );
//});
//@ sourceURL=grapher.js