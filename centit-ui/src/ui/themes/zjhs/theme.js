define(function(require) {
    var Config = require('config');
    var Cache = require('core/cache');
    
    var ThemeConfig = {
        id : "zjhs",

        name : "镇江海事",

        css : [
            "ui/themes/zjhs/less/style.css",
            "ui/themes/zjhs/less/header.css",
            "ui/themes/zjhs/less/layout.css",
            "ui/themes/zjhs/less/menu.css",
            "ui/themes/zjhs/less/tab.css"
        ],

        template : "ui/themes/zjhs/template.html",

        init: function(panel, loader) {

//            // 菜单
//            var Menu = require('centit/centit.menu').init({
//            	collapsible: false,
//                border: true,
//                width: 190,
//                layout: 'left',
//                hasSearch: false,
//            	icons: Config.menuIcons || ThemeConfig.menuIcons,
//            });
            
			loader.progress(70, '构建菜单');
            // 菜单
            var Menu = require('widgets/menu/widget.menu');
            var menu = new Menu({
                contextPath: Config.ViewContextPath,
                
                collapsible: false,

                loader: Config.Menu.Loader,

                dashboard: Config.Menu.Dashboard,

                icons: ThemeConfig.menuIcons || Config.Menu.Icons,

                width: 190
            }, Cache.get('Menu')).render('#side');

//            // 菜单TAB
//            var MenuTab = require('centit/centit.tab').init('menu_tab', {
//            	tabHeight: 35,
//            	pill: true
//            })
//            .open({
//                id: 'DASHBOARD',
//                text: '我的首页',
//                url: Config.Url.DashboardUrl,
//                closable: false
//            }, true);
            
            // 菜单TAB
            loader.progress(85, '创建菜单分页');
            // 菜单Tab
            var Tab = require('widgets/menu-tab/widget.menu-tab');
            window.MenuTab = new Tab({
                tabHeight: 35,
                pill: true
            }).render('#center');
            menu.openDashboard();

//            // 工具栏
//            var Toolbar = require('centit/toolbar/centit.toolbar').init('header', {
//                height: 24,
//                width: 303
//            })
//            // 全屏
//            .add(require('centit/toolbar/centit.toolbar.fullscreen'))
//            // 修改密码对话框
//            .add(require('centit/toolbar/centit.toolbar.modifypassword'))
//            // 注销
//            .add(require('centit/toolbar/centit.toolbar.logout'));

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
                text: '注销并重新登录',
                iconCls: 'icon-back'
            }).render(toolbar);

            // 标题
            document.title = Config.System.Title;
        }
    };

    return ThemeConfig;
});
