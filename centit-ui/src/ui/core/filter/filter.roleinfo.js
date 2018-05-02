define(function(require) {
	require('plugins/extend');
	var Filter = require('core/filter/filter.cache');

	/**
	 * 角色过滤器
	 */
	var FilterRoleInfo = Filter.extend(function() {
		
		this.name = 'RolesMap';
		
		// 在子类里自己去实现转换值
		this.parseValue = function(value, textField) {
			return value ? value[textField || 'roleName'] : value;
		};

	});
	
	return new FilterRoleInfo();
});