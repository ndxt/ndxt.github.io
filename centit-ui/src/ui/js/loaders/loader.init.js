define(function(require) {
	require('plugins/es6-promise.min');
	
	var Config = require('config');
	var Loader = require('loaders/loader');
	var Layout = require('widgets/layout/widget.layout');

	var $ = require('jquery');
	
	var LoaderInit = Loader.extend(function() {
		
		this.name = "初始化 @loader.init.js";
		
		this.init = function(loader) {
			var initHandle = require('custom/init') || Config.Theme.init || $.noop;
			
			var afterInit = require('custom/afterInit');


			return new Promise(function(resolve, reject) {
				
				// 使用EasyUI
				if (Config.System.EasyUI) {
					require('easyUI');

					$.parser.onComplete = function () {
						// 仅执行一次
						$.parser.onComplete = $.noop;
						initHandle.call(this, $('body'), loader);
						afterInit.call(this);
						resolve();
					};

					setTimeout(function() {
						new Layout().render();
						$.parser.parse();
					}, 50);
				}

				// 不使用EasyUI
				else {
					initHandle.call(this, $('body'));
					resolve();
				}

			});

		}

	});
	
	return new LoaderInit('Init');
});