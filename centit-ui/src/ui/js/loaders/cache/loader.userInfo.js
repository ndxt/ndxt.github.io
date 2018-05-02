define(function(require) {
	var Config = require('config');
	var LoaderCache = require('loaders/loader.cache');

	/**
	 * 读用户信息
	 */
	var LoaderCacheUserInfo = LoaderCache.extend(function() {
		
		// 用户设置url
		this.url = Config.URL.UserInfo;
		
		this.name = "用户信息 @loader.userInfo.js",
		
		// 缓存用户信息数据
		this.convert = function(data, cache) {
			cache.save('UserInfo', data);
			saveRoles(cache, data);
			saveOpts(cache, data);
		}

	});

	function saveRoles(cache, user) {
		var roles = {};
		if (user.userRoleCodes) {
			for (var i = 0, len = user.userRoleCodes.length; i < len; i++) {
				roles[user.userRoleCodes[i]] = true;
			}
		}

		cache.save('$UserRoles', roles);
	}

	function saveOpts(cache, user) {
		cache.save('$UserOpts', user.userOptList || {});
	}

	return new LoaderCacheUserInfo('UserInfo');
});