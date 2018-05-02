define(function(require) {
	var Config = require('config');
	var LoaderCache = require('loaders/loader.cache');
	
	/**
	 * 读菜单信息
	 */
	var LoaderCacheMenu = LoaderCache.extend(function() {
		
		this.rejectWhenError = true;
		
		// 菜单url
		this.url = Config.URL.Menu;
		
		this.name = "菜单信息 @loader.menu.js";
		
		// 缓存菜单数据
		this.convert = function(data, cache) {
			cache.save('Menu', data);
		}

	});
	
	return new LoaderCacheMenu('Menu');
});