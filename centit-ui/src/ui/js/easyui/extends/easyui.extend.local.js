define(['jquery', 'easyUI'], function($) {

	if ($.fn.datagrid){
		$.fn.datagrid.defaults.loadMsg = '正在处理，请稍待。。。';
	}
	if ($.fn.treegrid && $.fn.datagrid){
		$.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
	}
	if ($.messager){
		$.messager.defaults.ok = '确定';
		$.messager.defaults.cancel = '取消';
	}
	$.map(['validatebox','textbox','filebox','searchbox',
			'combo','combobox','combogrid','combotree',
			'datebox','datetimebox','numberbox',
			'spinner','numberspinner','timespinner','datetimespinner'], function(plugin){
		if ($.fn[plugin]){
			$.fn[plugin].defaults.missingMessage = '该输入项为必输项';
		}
	});
	if ($.fn.validatebox){
		$.fn.validatebox.defaults.rules.email.message = '请输入有效的电子邮件地址';
		$.fn.validatebox.defaults.rules.url.message = '请输入有效的URL地址';
		$.fn.validatebox.defaults.rules.length.message = '输入内容长度必须介于{0}和{1}之间';
		$.fn.validatebox.defaults.rules.remote.message = '请修正该字段';
	}
	
	if ($.fn.datetimebox && $.fn.datebox){
		$.extend($.fn.datetimebox.defaults,{
			currentText: $.fn.datebox.defaults.currentText,
			closeText: $.fn.datebox.defaults.closeText,
			okText: $.fn.datebox.defaults.okText
		});
	}
	if ($.fn.datetimespinner){
		$.fn.datetimespinner.defaults.selections = [[0,4],[5,7],[8,10],[11,13],[14,16],[17,19]]
	}

});