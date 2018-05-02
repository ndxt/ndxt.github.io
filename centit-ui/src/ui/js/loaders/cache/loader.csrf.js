define(function(require) {
	var Config = require('config');
	var $ = require('jquery');
	var LoaderCache = require('loaders/loader.cache');

	/**
	 * 读用户信息
	 */
	var LoaderCacheUserInfo = LoaderCache.extend(function() {

		// csrf url
		this.url = Config.URL.CSRF;

		this.name = "CSRF @loader.csrf.js";

		// csrf
		this.convert = function(data, cache) {
			cache.save('csrf', data);

			var ajaxData = {};
			ajaxData[data.parameterName] = data.token;

			$.ajaxSetup({
				data: ajaxData
			});
		}

	});

	return new LoaderCacheUserInfo('UserInfo');
});
