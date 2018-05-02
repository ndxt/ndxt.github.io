define(function(require) {
	require('locale');

	// easyui.compile 扩展
	require('js/easyui/extends/easyui.extend.compile');

	// easyui.parser 扩展
	require('js/easyui/extends/easyui.extend.parser');

	// easyui.panel 扩展
	require('js/easyui/extends/easyui.extend.panel');

	// easyui.dialog 扩展
	require('js/easyui/extends/easyui.extend.dialog');

	// easyui.form 扩展
	require('js/easyui/extends/easyui.extend.form');

	// easyui.validation 扩展
	require('js/easyui/extends/easyui.extend.validation');

	// easyui.pagination 扩展
	require('js/easyui/extends/easyui.extend.pagination');

	// easyui.date 扩展
	require('js/easyui/extends/easyui.extend.date');
	
	// easyui.datagrid 扩展
	require('js/easyui/extends/easyui.extend.datagrid');

	// easyui.datagrid-celledit 扩展
	require('js/easyui/extends/easyui.extend.datagrid-cellediting');
	
	// easyui.treegrid 扩展
	require('js/easyui/extends/easyui.extend.treegrid');
	
	// easyui.combobox 扩展
	require('js/easyui/extends/easyui.extend.combobox');
	
	// easyui.text 扩展
	require('js/easyui/extends/easyui.extend.text');
	
	// easyui.message 扩展
	require('js/easyui/extends/easyui.extend.message');
	
	// easyui.tree 扩展
	require('js/easyui/extends/easyui.extend.tree');
	
	// easyui.combotree 扩展
	require('js/easyui/extends/easyui.extend.combotree');
	
	// 中文环境
	require('js/easyui/extends/easyui.extend.local');
	
	// 添加其他扩展

	// 用户自定义扩展
	require('custom/easyui.extend');
	
	var $ = require('jquery');
});