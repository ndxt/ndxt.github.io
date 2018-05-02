define(function (require) {
    var Config = require('config');
    var Cache = require('core/cache.dictionary');
    var LoaderCache = require('loaders/loader.cache');
    var Mustache = require('plugins/mustache.min');

    var LoaderCacheDictionary = LoaderCache.extend(function () {
    	this.name = '数据字典 @loader.dictionary.js';
    
        this.urlAll = Config.Dictionary.Init ?
            Config.Dictionary.Init.map(function (code) {
                return {
                    id: code,
                    url: Mustache.render(Config.URL.Dictionary, {
                        code: code
                    })
                };
            }) : [];

        this.convert = function (data, cache, obj) {
        	Cache.save(obj.id, data);
        };

    });

    return new LoaderCacheDictionary('Dictionary');
});