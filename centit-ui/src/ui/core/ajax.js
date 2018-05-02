define(function(require) {
	/**
	 * ES6异步写法
	 *
	 * 参考：
	 * 	http://www.html5rocks.com/zh/tutorials/es6/promises/
	 * 	https://github.com/jakearchibald/es6-promise
	 */
	require('plugins/es6-promise.min');
	var $ = require('jquery');
	var Cache = require('core/cache');

	$.ajaxSetup({
		contentType: "application/x-www-form-urlencoded; charset=utf-8"
    });

	/**
	 * ES6异步写法重新封装ajax请求
	 */
	var Ajax = {};

	/**
	 * Promise封装$.ajax
	 */
	Ajax.ajax = function (url, options, replaceFlag) {


		var csrf = Cache.get('csrf') ? Cache.get('csrf')['token'] : null;

		options = $.extend({
			dataType: 'json'
		}, options);

		options.data = $.extend({}, options.data, {
			_r: Math.random(),
			_csrf: csrf
		});

		if (options.payload) {
		  options.contentType = 'application/json';
      options.data = JSON.stringify(options.data);
    } else {
      var params = $.param(options.data, false);
      params = decodeURIComponent(params);

      // 转换 optDefs[0][optCode]=1 为 optDefs[0].optCode=1
      params = params.replace(/\[([_$a-z]\w*?)\]/g, '.$1');

      // 转换 test[]=1&test[]=2 为 test=1&test=2
      params = params.replace(/(\[\])/g, "");

      // 中文转码
      params = encodeURI(params);

      options.data = params;
    }

		return new Promise(function(resole, reject) {
			options = $.extend(true, {}, options, {
				success: function(data, textStatus, jqXHR) {
					resole(data, textStatus, jqXHR);
				},

				error: function(result) {
					reject(result);
				}
			});

			$.ajax(url, options);
		});
	};

	/**
	 * Promise封装$.getHTML
	 * @param url
	 * @param options
	 */
	Ajax.getHTML = function(url, options) {
		options = $.extend({}, options, {
			method: 'get',
			dataType : 'html'
		});

		return Ajax.ajax(url, options, true);
	};

	/**
	 * Promise封装$.getJSON
	 */
	Ajax.getJSON = function(url, options) {
		options = $.extend({}, options, {
			method: 'get',
			dataType : 'json'
		});

		return Ajax.ajax(url, options);
	};

	return Ajax;
});
