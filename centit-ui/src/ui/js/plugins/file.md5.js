define(['jquery', 'spark'], function($, SparkMD5) {
    var options = {
        chunkSize: 2097152,
        debug: false
    };

    return function(file, configs) {
        configs = $.extend({}, options, configs);

        return new Promise(function(resolve, reject) {
            // 不支持 File FileReader
            if (typeof FileReader === undefined || typeof File === undefined) {
                return reject('浏览器不支持 File 或者 FileReader。');
            }

            if (!(file instanceof File)) {
                return reject('参数不是 File 类型。');
            }

            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                chunkSize = configs.chunkSize || 2097152,                             // Read in chunks of 2MB
                chunks = Math.ceil(file.size / chunkSize),
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),
                fileReader = new FileReader();

            fileReader.onload = function (e) {
                configs.debug && console.log('read chunk nr', currentChunk + 1, 'of', chunks);
                spark.append(e.target.result);                   // Append array buffer
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    configs.debug && console.log('finished loading');
                    configs.debug && console.info('computed hash', spark.end());  // Compute hash
                    return resolve(spark.end());
                }
            };

            fileReader.onerror = function (e) {
                configs.debug && console.warn('oops, something went wrong.');
                return reject(e);
            };

            function loadNext() {
                var start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
            }

            loadNext();
        });


    }
});