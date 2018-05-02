define(function(require) {
	require('plugins/extend');

	var Filter = require('core/filter/filter');
	var Cache = require('core/cache');

	/**
	 * 缓存过滤器
	 */
	var FilterCache = Filter.extend(function() {
		
		this.name = null;
		
		// 在子类里自己去实现转换值
		this.parseValue = function(value, textField) {
			return textField ? value[textField] : value;
		};

		// @override
		this.convert = function(cacheName, textField, value) {
			this.name = cacheName || this.name
		
			if (!this.name) return value;
			
			// 获取缓存
			var map = Cache.get(this.name);
			
			// 缓存中对应的对象
			var newValue = map ? map[value] : undefined;

			return newValue !== undefined ? this.parseValue(newValue, textField) : value;
		};
	});
	
	return FilterCache;
});