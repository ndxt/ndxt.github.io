define(function(require) {
	var Config = require("config");
	var Cache = require('core/cache');

	var ThemeConfig = {
		id : "jmht",

		name : "信息管理系统",

		css : [
		       "ui/themes/jmht/less/style.css",
		       "ui/themes/jmht/less/header.css",
		       "ui/themes/jmht/less/layout.css",
		       "ui/themes/jmht/less/menu.css",
		       "ui/themes/jmht/less/tab.css"
        ],

		icons: ["ui/css/jm-icons/jm-icon.css"],

        template : "ui/themes/jmht/template.html",

        menuIcons: null,
		
		menuLargeIcons: {
			DASHBOARD: 'icon-jm icon-jm-dashboard',
			Components: 'icon-jm icon-jm-components',
			Tables: 'icon-jm icon-jm-tables',
			Form: 'icon-jm icon-jm-form',
			MultiLevel: 'icon-jm icon-jm-multilevel'
		},
		
        init : function(panel, loader) {

			loader.progress(70, '构建菜单');

			// 菜单
			var Menu = require('widgets/menu/widget.menu');
			var menu = new Menu({
				contextPath: Config.ViewContextPath,

				loader: Config.Menu.Loader,

				dashboard: Config.Menu.Dashboard,

				icons: ThemeConfig.menuIcons || Config.Menu.Icons,

				width: 186,

				collapsible: false
			}, Cache.get('Menu')).render('#side');

			// 菜单TAB
			loader.progress(85, '创建菜单分页');
			// 菜单Tab
			var MenuTab = require('widgets/menu-tab/widget.menu-tab');
			new MenuTab({
				tabHeight: 31
			}).render('#center');
			menu.openDashboard();

			// 工具栏
			loader.progress(95, '加载工具栏');
			// 创建工具栏
			var Toolbar = require('widgets/toolbar/widget.toolbar');
			var toolbar = new Toolbar({
				name : 'main'
			}).render('#header');
			// 改密码按钮
			var ChangePassword = require('widgets/tools/widget.tool.change-password');
			new ChangePassword().render(toolbar);
			// 注销按钮
			var Tool = require('widgets/tools/widget.tool');
			new Tool({
				url: Config.URL.Logout,
				text: '注销',
				iconCls: 'icon-back'
			}).render(toolbar);

			// 标题
			document.title = Config.System.Title;
        }
	};
	return ThemeConfig;
});
