define(function(require) {
	require('plugins/es6-promise.min');
	require('plugins/es5-array');
	require('yepnope');

	var Mustache = require('plugins/mustache.min');
	var Config = require('config');
	var Loader = require('loaders/loader');
	var Ajax = require('core/ajax');
	var $ = require('jquery');
	
	var LoaderResource = Loader.extend(function() {
		this.name = "系统资源 @loader.resource.js";
	
		var _self = this;

		this.injectCss = function(css, callback, params, timeout) {

			callback = callback || $.noop;
			timeout = timeout || 5000;
			params = params || {};

			return new Promise(function(resolve) {

				try {
					yepnope.injectCss(Config.ViewContextPath+css, function() {
						callback.apply(this, arguments);
						resolve();
					}, params, timeout);
				}
				catch (e) {
					resolve();
				}

			})
		};

		var loadCss = function(theme) {

			// 一般css
			var cssPromise = theme.CSS.reduce(function(promise, css) {
				return _self.injectCss(css);
			}, Promise.resolve());

			// 图标css
			var iconPromise = theme.IconCSS.reduce(function(promise, css) {
				return _self.injectCss(css);
			}, cssPromise);

			// 颜色css
			var colorPromise = theme.ColorCSS.reduce(function(promise, css) {
				return _self.injectCss(css, undefined, {
					name: 'color'
				});
			}, iconPromise);

			// 自定义css
			return theme.CustomCSS.reduce(function(promise, css) {
				return _self.injectCss(css);
			}, colorPromise);
		};
		
		this.init = function() {
			try {
				return this._init();
			}
			catch(e) {
				
				var msg = Mustache.render("加载【{{name}}】时发生错误（{{&message}}）", {
					name: _self.name,
					message: e.message ?　e.message : e
				});
				
				console.error(msg);
				return Promise.reject(msg);
			}
		};

		this._init = function() {
			var Theme = Config.Theme;

			return loadCss(Theme).then(function() {
				return Ajax.getHTML(Config.ViewContextPath+Theme.Template).then(
					function(html) {
						setTimeout(function() {
							$('body').append(html);
							return Promise.resolve();
						}, 0);
					},
					function(error) {
						throw("【加载模板 @loader.resource.js】时发生错误（"+ Config.ViewContextPath + Theme.Template +"）"); 
					}
				);
			});
		};

	});
	
	return new LoaderResource('Resource');
});