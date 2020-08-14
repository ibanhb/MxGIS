// JavaScript Document
var projectContext = null;
var p_main = {
	init:function(){
		 var projectContext = require.config({
				context: 'projectContext',
				baseUrl: 'projects/js/code',
				urlArgs: "ver=1.0", //+ (new Date()).getTime(),
				paths: {
					libs:'../libs',
					config:'config',
					//frameworks
					amaran:'../libs/AmaranJS/js/jquery.amaran',
					//modules
					p_users:'modules/usersModule',
					ui:'modules/ui',
					dialogs:'modules/dialogs',
					userDetail:'modules/userDetail',
					graph:'modules/graph',
					uiMapControls:'modules/uiMapControls',
					workload:'modules/workload',
					week:'modules/week',
					division:'modules/division',
					reports:'modules/reports',
					video:'modules/video',
					//widgets
					ecoPanel:'widgets/ecoPanel/jquery.ui.ecoPanel',
					panelList:'widgets/panelList/jquery.ui.panelList',
					userList:'widgets/userList/jquery.ui.userList',
					userPanel:'widgets/userPanel/jquery.ui.userPanel',
					colorSelector:'widgets/colorSelector/jquery.ui.colorSelector',
					dropDownImage:'widgets/dropDownImage/jquery.ui.dropDownImage'
				},
				shim: {
					amaran:{exports:'$.fn.amaran'},
					ecoPanel:{exports:'ecoPanel'},
					panelList:{exports:'panelList'},
					userList:{exports:'userList'},
					userPanel:{exports:'userPanel'},
					main:{deps:['amaran','ecoPanel','panelList','userList','userPanel','colorSelector','dropDownImage']}
				}
			});
		 (function(){
			projectContext(['require','main'], function(require,main){
				var urlArgs = "ver=1.0";
				var localUrl = require.toUrl("libs");
				
				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href:'projects/css/p_main.css'}).appendTo('head'),
					$('<link>', {rel: 'stylesheet',type: 'text/css',href:'projects/js/libs/pure/pure-min.css'}).appendTo('head'),
					//Libs
					//Amaran
					$('<link>', {rel: 'stylesheet',type: 'text/css',href:'//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css'}).appendTo('head'), 
					$('<link>', {rel: 'stylesheet',type: 'text/css',href:'projects/js/libs/AmaranJS/css/amaran.min.css'}).appendTo('head'),
					$('<link>', {rel: 'stylesheet',type: 'text/css',href:'projects/js/libs/AmaranJS/css/animate.min.css'}).appendTo('head'),
					//Widgets
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: 'projects/js/code/widgets/ecoPanel/jquery.ui.ecoPanel.css?'+urlArgs}).appendTo('head'),
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: 'projects/js/code/widgets/panelList/jquery.ui.panelList.css?'+urlArgs}).appendTo('head'),
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: 'projects/js/code/widgets/userList/jquery.ui.userList.css?'+urlArgs}).appendTo('head'),
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: 'projects/js/code/widgets/userPanel/jquery.ui.userPanel.css?'+urlArgs}).appendTo('head'),
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: 'projects/js/code/widgets/colorSelector/jquery.ui.colorSelector.css?'+urlArgs}).appendTo('head'),
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: 'projects/js/code/widgets/dropDownImage/plantilla.css?'+urlArgs}).appendTo('head'),
					
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					$('#panel-right_container').html('<div id="mdmp"></div>');
						
					//Cambio de header en proyecto	
					$('.headerBackground').fadeOut(500,function(){
						$('#headerLogoINEGI').attr('src','projects/img/headerMDMLeft.png').css('left','-400px');
						$('#headerLogoMDM').attr('src','projects/img/headerMDMRight.png').css('right','-400px');
						$('.headerBackground').css('background-image',"url(projects/img/headerMDMBackground.jpg)").fadeIn(500,function(){
							$('#headerLogoINEGI').animate({left:'0px'},1000);	
							$('#headerLogoMDM').animate({right:'0px'},1000);	
						});
					});
					/*setTimeout(function(){
						$('.pleg').click();
						setTimeout(function(){
							$('.toggle_panels').hide();
						},1000);
					},2000);*/
					
					main.init(MDM6);
				});
				
			});
		})();
	}	
}