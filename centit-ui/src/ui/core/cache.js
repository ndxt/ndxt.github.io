define(function(require) {
    require('plugins/extend');
    require('plugins/es6-promise.min');

    var $ = require('jquery');

    var Cache = Class.extend(function() {
        /**
         * 缓存数据
         * @type {{}}
         */
        var cache = {};

        /**
         * 保存 直接覆盖
         * @param key
         * @param value
         */
        this.save = function(key, value) {
            cache[key] = value;
        };

        /**
         * 合并数据
         *
         * @param key
         * @param value
         */
        this.merge = function(key, value) {
            var obj = cache[key];

            if (obj) {
                $.extend(true, obj, value);
            }
            else {
                this.save(key, value);
            }

        };

        this.get = function(key) {
            if (!key) {
                return cache;
            }

            return cache[key];
        };

        this.remove = function(key) {
            delete cache[key];
        };
    });

    // 确保一定只有一个实例
    return new Cache();
});