define(function(require) {
    var Cache = require('core/cache');
    var Loader = require('loaders/loader');

    var LoaderCache = Loader.extend(function() {


        this.save = function(data, obj) {
            try {
                this.convert.call(this, data, Cache, obj);
            }
            catch(e) {
                if (this.rejectWhenError) {
                    return Promise.reject(e);
                }
            }

            return Promise.resolve(data);
        };

    });

    return LoaderCache;
});