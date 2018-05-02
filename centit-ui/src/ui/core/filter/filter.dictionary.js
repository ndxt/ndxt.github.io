define(function(require) {
	require('plugins/es5-array');

	var Config = require('config');
	var Core = require('core/core');
	var Filter = require('core/filter/filter');
	var Cache = require('core/cache.dictionary');
	var Mustache = require('plugins/mustache.min');
	
	/**
	 * 数据字典过滤器
	 */
	var FilterDictionary = Filter.extend(function() {
		var filter = this;
		
		/**
		 * 缓存数据
		 */
		this.cache = {};
		
		// @override
		this.convert = function(name, value) {
		
			if (Cache.getMap(name)) {
				var format = Cache.getMap(name)[value];
				return format === undefined ? value : format;	
			}
			
			return value;
		}
		
		/**
		 * 添加过滤字典
		 * 
		 * 必须确保先预加载，因为表格渲染时格式化数据只能同步进行
		 */
		this.add = function(names) {
			if (!names) return Promise.resolve();
			
			if (!$.isArray(names)) {
				names = [names];
			}
			
			// 过滤已经加载的字典项
			names = names.filter(function(name) {
				return !Cache.get(name);
			});
			
			return Promise.all(
				names
				
				// 修改字典名称变为URL
				.map(function(name) {
					return Mustache.render(Config.URL.Dictionary, {
						code: name
					});
				})
				
				// 发起请求加载
				.map(Core.getJSON)
			)
			
			// 缓存 (请求顺序不一定一致，但是items结果顺序由Promise保证和names一致)
			.then(function(items) {
				names.forEach(function(name, index) {
					
					Cache.save(name, items[index]);
					
				});
			})
			
			['catch'](function(result) {
				console.error(result);
			});
		}
	});
	
	// 由于要保存缓存数据，数据字典过滤器实例单例化
	return new FilterDictionary();
});