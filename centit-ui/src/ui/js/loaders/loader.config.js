define(function(require) {
    var Config = require('config');
    var Loader = require('loaders/loader');

    /**
     * 读用户设置
     */
    var LoaderConfig = Loader.extend(function() {


        /**
         * 重写save方法，传入Config供数据保存
         */
        this.save = function(data) {
            try {
                // 将数据转换到config存储
                this.convert.call(this, data, Config);
            }
            catch(e) {
                if (this.rejectWhenError) {
                    return Promise.reject(e);
                }
            }

            return Promise.resolve(data);
        };

    });

    return LoaderConfig;
});