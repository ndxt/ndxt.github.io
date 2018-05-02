define(['jquery', 'easyUI'], function($) {
	$.extend($.fn.pagination.defaults, {
		pageSize: 20, pageList: [20, 50, 100],
		layout:['list','sep','first','prev','links','next','last','sep','refresh','info'],
		afterPageText: "页，总共 {pages} 页",
		beforePageText: "第 ",
		displayMsg: "第 {from} 到 {to} 条记录，总共 {total} 条记录"
	});
});