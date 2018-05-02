define(function(require) {
	require('plugins/es6-promise.min');
	require('plugins/es5-array');

	var Config = require('config');
	var Loader = require('loaders/loader');
	var $ = require('jquery');
	var _ = require('underscore');
	var Mustache = require('plugins/mustache.min');
	
	var LoaderTheme = Loader.extend(function() {
		var _self = this;
	
		this.name = "系统主题@loader.theme.js";
		
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

			var ThemeConfig;

			switch(Config.Theme.DefaultTheme || 'default') {
				case 'qui':
				ThemeConfig = require('themes/qui/theme');
				break;
                case 'jtt':
                    ThemeConfig = require('themes/jtt/theme');
                    break;
				case 'ldxx':
					ThemeConfig = require('themes/ldxx/theme');
					break;
				case 'jmht':
					ThemeConfig = require('themes/jmht/theme');
					break;
				case 'xjoa':
					ThemeConfig = require('themes/xjoa/theme');
					break;
				case 'xkj':
					ThemeConfig = require('themes/xkj/theme');
					break;
				case 'mapfang':
					ThemeConfig = require('themes/mapfang/theme');
					break;
				case 'zjhs':
					ThemeConfig = require('themes/zjhs/theme');
					break;
                case 'ranq':
                    ThemeConfig = require('themes/ranq/theme');
                    break;
                case 'htbm':
                    ThemeConfig = require('themes/htbm/theme');
                    break;
                case 'piis':
                    ThemeConfig = require('themes/piis/theme');
                    break;
                case 'oa':
                    ThemeConfig = require('themes/oa/theme');
                    break;
				default :
					ThemeConfig = require('themes/qui/theme');
			}

			ThemeConfig = $.extend({}, ThemeConfig, require('custom/theme'));

			this.convert(ThemeConfig);

			return Promise.resolve(Config.Theme);
		};


		this.convert = function(theme) {
			// COLORS
			Config.Theme.ColorCSS = [];
			if (theme.colors && $.isArray(theme.colors)) {

				// 指定id或者第一个颜色
				var color = theme.colors.filter(function(c) {
					return c.id == Config.Theme.DefaultColor;
				})[0] || theme.colors[0];

				Config.Theme.ColorCSS.push(color.css);
			}

			// ICONS
			Config.Theme.IconCSS = _.union(Config.Theme.IconCSS, theme.icons);

			// CSS
			Config.Theme.CSS = _.union(Config.Theme.CSS, theme.css);

			// Template
			Config.Theme.Template = Config.Theme.Template || theme.template;

			// 初始化方法
			Config.Theme.init = theme.init || $.noop;
		};
	});
	
	return new LoaderTheme('Theme');
});