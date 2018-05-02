define(function(require) {
	var Config = require('config');
	var Ajax = require('core/ajax');
	var Filter = require('core/filter/filter');

	/**
	 * 数据字典过滤器
	 */
	var FilterColumn = Filter.extend(function() {
		var filter = this;

		// @override
		this.convert = function(name, value, row) {
			if (row[name]) {
				return row[name];
			}

			return value;
		};
	});
	
	return new FilterColumn();
});