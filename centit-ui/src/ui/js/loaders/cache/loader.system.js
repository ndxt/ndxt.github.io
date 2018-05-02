define(function (require) {
	require('plugins/es5-array');
    var Config = require('config');
    var LoaderCache = require('loaders/loader.cache');

    var LoaderCacheSystem = LoaderCache.extend(function () {
    	
    	this.name = "系统缓存 @loader.system.js";

        this.urlAll = Config.Cache.Init ? Config.Cache.Init : [];

        this.convert = function (data, cache, obj) {
            cache.save(obj.id, data);
            cache.remove('UnitsTree');
            var keyField = obj.key;
            var valueField = obj.value;
            
            // 如果需要，根据数组数据生成另一份缓存，转换数组为map
            if (keyField && $.isArray(data)) {
            	cache.save(obj.id + 'Map', data.reduce(function(tempObj, item) {
            		
            		// 如果有 valueField，保存对应字段值，否则保存整个对象
            		tempObj[item[keyField]] = valueField ? item[valueField] : item;
            		return tempObj;
            	}, {}));
            }
        };

    });

    return new LoaderCacheSystem('System');
});