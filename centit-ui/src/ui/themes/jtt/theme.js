define(function(require) {

    var Events = require('core/events');

    var Config = require('config');
    var Cache = require('core/cache');

    var $ = require('jquery');

    var ThemeConfig = {
        id : "qui",

        name : "qui",

        css : [
            "ui/themes/jtt/less/style.css",
            "ui/themes/jtt/less/header.css",
            "ui/themes/jtt/less/menu.css",
            "ui/themes/jtt/less/layout.css",
            "ui/themes/jtt/less/tab.css"
        ],

        icons: [],

        template : "ui/themes/jtt/template.html",

        menuIcons: null,

        init: function(panel, loader) {


            loader.progress(70, '构建菜单');
            // 菜单
            var Menu = require('widgets/menu/widget.menu');
            var menu = new Menu({
                contextPath: Config.ContextPath,

                loader: Config.Menu.Loader,

                dashboard: Config.Menu.Dashboard,
                collapsedSize: 0,

                icons: ThemeConfig.menuIcons || Config.Menu.Icons
            }, Cache.get('Menu')).render('#side');

            loader.progress(85, '创建菜单分页');
            // 菜单Tab
            var MenuTab = require('widgets/menu-tab/widget.menu-tab');
            new MenuTab().render('#center');
            menu.openDashboard();

            var MenuSearch = require('widgets/menu-search/widget.menu-search');
            menu.addPlugin(new MenuSearch());

            loader.progress(95, '加载工具栏');
            // 创建工具栏
            var Toolbar = require('widgets/toolbar/widget.toolbar');
            var toolbar = new Toolbar({
                name : 'main'
            }).render('#header');



            //全屏按钮
            var ToolFullScreen = require('widgets/tools/widget.tool.full-screen');
            new ToolFullScreen().render(toolbar);



            $('#header .layout-collapse-centerer').on('click', function() {
                Events.trigger('collapseMenu.Layout');
                $('#header').addClass('header_cm');
                $('#header .layout-collapse-centerer').css('display','none');
                $('#header .change_s').css('display','block');
                $('#header .title').css('left','85px');
            });

            $('#header .change_s').on('click', function() {
                Events.trigger('expandMenu.Layout');
                $('#header .layout-collapse-centerer').css('display','block');
                $('#header .change_s').css('display','none');
                $('#header').removeClass('header_cm');
                $('#header .title').css('left','220px');
            });



			/*// 皮肤颜色按钮
			 var ToolColors = require('widgets/tools/widget.tool.colors');
			 new ToolColors({
			 colors: ThemeConfig.colors,
			 current: Config.Theme.DefaultColor
			 }).render(toolbar);
			 */



            // 改密码按钮
			/*	var ChangePassword = require('widgets/tools/widget.tool.change-password');
			 new ChangePassword().render(toolbar);*/


			/*	// 注销按钮
			 var Tool = require('widgets/tools/widget.tool');
			 new Tool({
			 url: Config.URL.Logout,
			 text: '注销',
			 iconCls: 'icon-back'
			 }).render(toolbar);*/

            // 标题
            document.title = Config.System.Title;
            $('#title').text(Config.System.HeaderTitle);
            $('#footer').text(Config.System.FooterTitle);
        }

    };

    return ThemeConfig;
});



