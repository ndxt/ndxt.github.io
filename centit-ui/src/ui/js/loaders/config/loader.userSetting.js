define(function(require) {
	var Config = require('config');
	var LoaderConfig = require('loaders/loader.config');
	
	/**
	 * 读用户设置
	 */
	var LoaderConfigUserSetting = LoaderConfig.extend(function() {
		
		this.name = "用户设置 @loader.userSetting.js",
		
		// 用户设置url
		this.url = Config.URL.UserSetting;
		
		// 转换用户设置数据到config
		this.convert = function(data, config) {

			var theme = config.Theme;

			// 主题
			data.theme && (theme.DefaultTheme = data.theme);

			// 颜色
			data.color && (theme.DefaultColor = data.color);

			// 菜单布局
			data.layout && (theme.DefaultLayout = data.layout);
		};

	});
	
	return new LoaderConfigUserSetting('UserSetting');
});