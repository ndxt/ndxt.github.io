define(['jquery', 'easyUI'], function($) {
	$.extend($.fn.calendar.defaults, {
		weeks : [ '日', '一', '二', '三', '四', '五', '六' ],
		months : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
	});
	
	$.extend($.fn.datetimebox.defaults, {
		currentText: '现在',
		closeText: '关闭',
		okText: '确定'
	});
	
	$.extend($.fn.datebox.defaults, {
		currentText: '今天',
		closeText: '关闭',
		okText: '确定',
		formatter: function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
		},
		parser : function(s) {
			if (!s)
				return new Date();
			var ss = s.split('-');
			var y = parseInt(ss[0], 10);
			var m = parseInt(ss[1], 10);
			var d = parseInt(ss[2], 10);
			return !isNaN(y) && !isNaN(m) && !isNaN(d) ? new Date(y, m - 1, d) : new Date();
		},
		validType : 'date'
	});
	
	$.extend($.fn.datetimebox.defaults, {
		validType : 'datetime'
	});
});