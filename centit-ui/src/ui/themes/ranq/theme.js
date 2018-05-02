define(function(require) {
    var Config = require('config');
    var Cache = require('core/cache');
	var Mustache = require('plugins/mustache.min');

    var ThemeConfig = {
        id : "ranq",

        name : "ranq",

        css : [
            "ui/themes/ranq/less/style.css",
            "ui/themes/ranq/less/header.css",
            "ui/themes/ranq/less/layout.css",
            "ui/themes/ranq/less/menu.css",
            "ui/themes/ranq/less/tab.css",
			"ui/themes/ranq/rancss/ranq.css"
        ],

        template : "ui/themes/ranq/template.html",

    	init: function(panel, loader) {

			loader.progress(70, '构建菜单');
			// 菜单
			var Menu = require('widgets/menu/widget.menu');
			var menu = new Menu({
				contextPath: Config.ViewContextPath,

				loader: Config.Menu.Loader,

				dashboard: Config.Menu.Dashboard,

				icons: ThemeConfig.menuIcons || Config.Menu.Icons
			}, Cache.get('Menu')).render('#side');

			loader.progress(85, '创建菜单分页');
			// 菜单Tab
			var MenuTab = require('widgets/menu-tab/widget.menu-tab');
			new MenuTab({
				// 更新面包屑
				onTabSelect: function(tab) {
					var breadcurmbs = [];
					while (tab) {
						breadcurmbs.push({
							text: tab.text
						});
						tab = tab.parent;
					}

					var html = Mustache.render('<ul class="breadcrumb">{{#breadcurmbs}}<li>{{text}}</li>{{/breadcurmbs}}</ul>', {
						breadcurmbs: breadcurmbs.reverse()
					});

					$('#menu_breadcrumbs').html(html);
				}
			}).render('#center');
			// 插入面包屑容器
			$('#menu_tab > .tabs-header').after('<p id="menu_breadcrumbs"></p>');
			menu.openDashboard();

			loader.progress(95, '加载工具栏');
			// 创建工具栏
			var Toolbar = require('widgets/toolbar/widget.toolbar');
			var toolbar = new Toolbar({
				name : 'main'
			}).render('#header');


			 var ChangePassword = require('widgets/tools/widget.tool.change-password');
			 new ChangePassword().render(toolbar);
			 // 注销按钮
			 var Tool = require('widgets/tools/widget.tool');
			 new Tool({
			 url: Config.URL.Logout,
			 text: '注销',
			 /*iconCls: 'icon-back'*/
			 }).render(toolbar);


		}
    };

    return ThemeConfig;
});
