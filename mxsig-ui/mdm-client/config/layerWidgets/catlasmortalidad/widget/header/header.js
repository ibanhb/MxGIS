// JavaScript Document
window.layerWidgets.catlasmortalidad.w_header = {
	init:function(main){
		this.main = main;
		this.config = main.options.config
		this.currentData = main.currentData;
	},
	createColorRamp:function(){
		var obj = this;
		var config = obj.config.settings;
		var colors = config.colorRamps;
		var scolor = colors[config.colorSelectedIndex].colors;
		cadena = '<div class="widget-header-colorramp">';
		for(var x in scolor){
			var color = scolor[x];
			var width = 100/(scolor.length);
			cadena+= '<div class="widget-header-color-item widget-transition" style="width:'+width+'%;background-color:'+color+'"></div>';
			
		}
		cadena+= '</div>';
		
		return cadena;
		
	},
	update:function(){
		var obj = this;
		var main = obj.main;
		var cd = obj.currentData;
		var sd = obj.config.startingData;
		var container = $('#'+main.id+'_header');
		
		var varActive = cd.varActive || sd.varActive;
		
		
		var cadena = '';
			cadena+= '<table id="'+main.id+'_header_table" class="header-table-widget"><tr>';
			cadena+= '	<td valign="top"><div class="collapsed header-logo widget-transition"></div></td>';
			cadena+= '	<td valign="top"><div class="header-text widget-transition">';
			cadena+= '		<label>'+varActive.label+'</label>';
			cadena+= '	</div></td>';
			cadena+= '	<td valign="top"><div class="header-toolbar"><div id="'+main.id+'_config_btn" class="sprite-mor-modify"></div></div></td>';
			cadena+= '</tr>';
			cadena+= '<tr><td colspan="3" class="widget-value-container"><div class="header-widget-value header-widget-initval">10000</div><div class="header-widget-value header-widget-endval">20000</div></td></tr>';
			cadena+= '<tr><td colspan="3" valign="top"><div class="header-color-ramp">'+obj.createColorRamp()+'</div>';
			cadena+= '</td></tr></table>';
		
		container.html(cadena);
		
		$('#'+main.id+'_header_table').click(function(){
			if(!main.isOpen){
				main.open();
			}else{
				main.close();
			}
		});
		obj.height = $('#'+main.id+'_header_table').height();

		obj.createColorRamp();

	}
}
//@ sourceURL=config/layerWidgets/widget/catlasmortalidad/header/header.js