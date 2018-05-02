define(function(require) {
	require('plugins/extend');
	var Filter = require('core/filter/filter.cache');

	/**
	 * 人员过滤器
	 */
	var FilterUserInfo = Filter.extend(function() {
		
		this.name = 'AllUsersMap';
		
		// 在子类里自己去实现转换值
		this.parseValue = function(value, textField) {
			return value ? value[textField || 'userName'] : value;
		};

	});
	
	return new FilterUserInfo();
});