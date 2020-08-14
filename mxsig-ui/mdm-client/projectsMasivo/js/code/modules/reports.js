define(function(){
	return{
		init:function(main){
			var obj = this;
			obj.main = main;
			obj.data = obj.main.data;
			obj.ranks = obj.main.config.project.ranks;
			obj.config = obj.main.config;
		},
		listReports:function(){
			var obj = this;
			var container = $('#reports_content');
			var user = obj.main.modules.users.getMainUser();
			var alias = obj.main.modules.users.getUserAlias(user);
			var url = obj.config.project.reports.baseUrl;
			
			var cadena = '';
			
			
			
			
			
			switch (user.rightsId){
				case 0: case 1:
					var edo = user.edo;
					//base_01.dbf
					debugger;
					//var turl = url+'/prodFinal.csv?cve_ce='+obj.main.modules.users.getMainUser().edo;
					var turl = url+'/base_'+edo+'.dbf';
					
						cadena+= '<div class="item-report">';
						cadena+= '	<label>Base final</label>';
						cadena+= '	<a href="'+turl+''+'" target="_blank" style="float:right">';
						cadena+= '		<span class="mdmp_plantilla mdmp_plantilla_icon_dbf"></span>';
						cadena+= '	</a>';
						cadena+= '</div>';
				
				
					for(var x=1;x <= 5;x++){
						//var cz = (user.rightsId == 1)?'&cz='+user.user:'';
						var cz = (user.rightsId == 1)?'-cz='+user.user:'-cz=null';
						
						//var turl = url+'/prod'+x+'?coordinacion='+user.edo+cz
						var turl = url+'/Prod'+x+'-coord='+user.edo+cz
						cadena+= '<div class="item-report">';
						cadena+= '	<label>Producto '+x+'</label>';
						
						//cadena+= '	<a href="'+turl+'.xls" target="_blank" style="float:right">';
						
						cadena+= '	<a href="'+turl+'.xls'+'" target="_blank" style="float:right">';
						cadena+= '		<span class="mdmp_plantilla mdmp_plantilla_icon_xls"></span>';
						cadena+= '	</a>';
						
						//cadena+= '	<a href="'+turl+'&documento=pdf'+'" target="_blank" style="float:right">';
						cadena+= '	<a href="'+turl+'.pdf'+'" target="_blank" style="float:right">';
						cadena+= '		<span class="mdmp_plantilla mdmp_plantilla_icon_pdf"></span>';
						cadena+= '	</a>';
						cadena+= '</div>';
					}
				break;
			}
			container.html(cadena);
			
		}
	}	
})