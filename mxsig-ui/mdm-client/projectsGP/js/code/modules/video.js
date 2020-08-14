define(function(){
	var _obj = {
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.config = obj.main.config;
			obj.tracks = obj.config.video.tracks;
		},
		show:function(){ 
			var obj = this;
			obj.main.modules.graph.graphUserGral().close();
			
			var videoPath = obj.config.video.videoPath;
			var width = $(window).width();
			
			var cadena = '<div id="mdmp_video_container" class="mdmp-help-video-container">';
				cadena+= '<div id="mdmp_video_bg"></div>';
				cadena+= '<div id="mdmp_video_tracks" style="'+((obj.tracks && obj.tracks.length > 0)?'':'display: none;')+'"></div>';
				cadena+= '<div id="mdmp_video"><center><div class="mdmp_video_vertical">';
				cadena+= '	<div id="mdmp_video_close" class="mdmp_plantilla mdmp_plantilla_house_closeBlack"></div>';
				cadena+= '	<video id="mdmp_video_help" width="1024" height="590" controls>';
				cadena+= '  	<source src="'+videoPath+'" type="video/mp4">';
				cadena+= '		El browser no soporta video html5 MP4.';
				cadena+= '	</video>';
				cadena+= '</div></center></div>';
				cadena+= '</div>';
				
				
			$('body').append(cadena);
			$('#mdmp_video_close').click(function(e){
				$('#mdmp_video_container').remove();
				e.stopPropagation();
			});
			
			obj.videoObj = document.getElementById('mdmp_video_help');
			obj.createTracks();
			obj.videoObj.ontimeupdate = function(){
									obj.updateTrackSelected(obj.videoObj.currentTime);
								 }
		
		},
		updateTrackSelected:function(time){
			var obj = this;
			var video = obj.videoObj;
			
			var tracks = obj.tracks;
				time = Math.round(time);
			var segment = -1;
			
			for (var x in tracks){
				var track = tracks[x];
				if (time >= track.timeIni && time <= track.timeEnd){
					segment = x;
					break;	
				}
			}
			if (obj.currentSegment != segment){
				$('.mdmp-help-video-track-item[current=true]').attr('current',false);
				$('.mdmp-help-video-track-item[segment='+segment+']').attr('current',true);
				obj.currentSegment = segment;
			}
		},
		createTracks:function(){
			var main = this.main;
			var obj = this;
			var tracks = obj.tracks;
			
			var cadena = '';
			for (var x in tracks){
				var track = tracks[x];
					cadena+= '<div class="mdmp-help-video-track-item" current="false" segment="'+x+'" start="'+track.timeIni+'">';
					cadena+= 	'<span class="ui-icon ui-icon-play"></span>'+track.text;	
					cadena+= '</div>';	
			}
			
			$('#mdmp_video_tracks').html(cadena);
			$('.mdmp-help-video-track-item').each(function(){
				$(this).click(function(e){
					var segment = $(this).attr('segment');
					var time = parseInt($(this).attr('start'),10);
					obj.videoObj.currentTime = time;
					obj.updateTrackSelected(segment,time);
					e.stopPropagation();
				});
			});
		}
	}	
	
	return _obj;
})