define(function(require) {
    var Config = require('config');
    var Cache = require('core/cache');
    var $ = require('jquery');

    var ThemeConfig = {
        id : "ldxx",

        name : "图房",

        css : [
            "ui/themes/ldxx/less/style.css",
            "ui/themes/ldxx/less/header.css",
            "ui/themes/ldxx/less/layout.css",
            "ui/themes/ldxx/less/menu.css",
            "ui/themes/ldxx/less/tab.css"
        ],

        template : "ui/themes/ldxx/template.html",

		icons: ["ui/css/icon-lundeng.css"],

        menuIcons: null,
		
		menuLargeIcons: {
			Components: 'ludeng ludeng_yw',
			Tables: 'ludeng ludeng_yw',
			Form: 'ludeng ludeng_yw',
			MultiLevel: 'ludeng ludeng_yw'
		},

        init: function(panel, loader) {

        	loader.progress(70, '构建菜单');
			// 菜单
			var Menu = require('widgets/menu/mix/widget.mix-menu');
			var menu = new Menu({
				contextPath: Config.ViewContextPath,

				loader: Config.Menu.Loader,

				dashboard: Config.Menu.Dashboard,

				icons: ThemeConfig.menuIcons || Config.Menu.Icons,
				
				largeIcons: ThemeConfig.menuLargeIcons || Config.Menu.LargeIcons,
				
				onTopSelect: function() {
					var btn = $(this);
					
					$('#header .sub-title').text(btn.text());
				},
				
				top: '#header'
			}, Cache.get('Menu')).render('#side');

			loader.progress(85, '创建菜单分页');
			// 菜单Tab
			var MenuTab = require('widgets/menu-tab/widget.menu-tab');
			new MenuTab({
				tabHeight : 35,
				onSelect : function(title) {
					var r = parseInt($("#menu_tab > .tabs-header .tabs-wrap").css("margin-right").replace("px", ""));
					var l = parseInt($("#menu_tab > .tabs-header .tabs-wrap").css("margin-left").replace("px", ""));
					var w = $(window).width() - $(".layout-panel-west").width() - 144 - r - l;
					$("#menu_tab > .tabs-header .tabs-wrap").css("max-width", w);
				}
			}).render('#center');
			menu.openDashboard();

//			var MenuSearch = require('widgets/menu-search/widget.menu-search');
//			menu.addPlugin(new MenuSearch());

			loader.progress(95, '加载工具栏');
			// 创建工具栏
			var Toolbar = require('widgets/toolbar/widget.toolbar');
			var toolbar = new Toolbar({
				name : 'main'
			}).render('#center');

			// 全屏按钮
			var ToolFullScreen = require('widgets/tools/widget.tool.full-screen');
			new ToolFullScreen().render(toolbar);

			// 皮肤颜色按钮
//			var ToolColors = require('widgets/tools/widget.tool.colors');
//			new ToolColors({
//				colors: ThemeConfig.colors,
//				current: Config.Theme.DefaultColor
//			}).render(toolbar);

			// 注销按钮
			var Tool = require('widgets/tools/widget.tool');
			new Tool({
				url: Config.URL.Logout,
				text: '注销',
				iconCls: 'icon-back'
			}).render(toolbar);
			// 改密码按钮
			var ChangePassword = require('widgets/tools/widget.tool.change-password');
			new ChangePassword().render(toolbar);
			// 标题
			document.title = Config.System.Title;
			$('#title').text(Config.System.HeaderTitle);
			$('#footer').text(Config.System.FooterTitle);
			
			$(window).resize(function() {
				var r = parseInt($("#menu_tab > .tabs-header .tabs-wrap").css("margin-right").replace("px", ""));
				var l = parseInt($("#menu_tab > .tabs-header .tabs-wrap").css("margin-left").replace("px", ""));
				var w = $(window).width() - $(".layout-panel-west").width() - 144 - r - l;
				$("#menu_tab > .tabs-header .tabs-wrap").css("max-width", w);
			});
        }
    };

    return ThemeConfig;
});
