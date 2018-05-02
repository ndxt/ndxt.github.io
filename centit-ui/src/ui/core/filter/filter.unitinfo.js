define(function(require) {
	require('plugins/extend');
	var Filter = require('core/filter/filter.cache');

	/**
	 * 单位过滤器
	 */
	var FilterUnitInfo = Filter.extend(function() {
		
		this.name = 'UnitsMap';
		
		// 在子类里自己去实现转换值
		this.parseValue = function(value, textField) {
			return value ? value[textField || 'unitName'] : value;
		};

	});
	
	return new FilterUnitInfo();
});