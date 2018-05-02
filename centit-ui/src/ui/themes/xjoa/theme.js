define(function(require) {
    var Config = require('config');
    var Cache = require('core/cache');

    var ThemeConfig = {
        id : "xjoa",

        name : "新疆OA",

        css : [
            "ui/themes/xjoa/less/style.css",
            "ui/themes/xjoa/less/header.css",
            "ui/themes/xjoa/less/layout.css",
            "ui/themes/xjoa/less/menu.css",
            "ui/themes/xjoa/less/tab.css"
        ],

        icons: [],

        template : "ui/themes/xjoa/template.html",

        colors : [{
            id : "blue",
            name : "天空蓝",
            color: '#2FB0E2',
            css : "ui/themes/xjoa/blue/color.css"
        },{
            id : "yellow",
            name : "玛瑙黄",
            color: '#D1D433',
            css : "ui/themes/xjoa/yellow/color.css"
        },{
            id : "red",
            name : "深沉红",
            color: '#B40000',
            css : "ui/themes/xjoa/red/color.css"
        },{
            id : "green",
            name : "橄榄绿",
            color: '#367500',
            css : "ui/themes/xjoa/green/color.css"
        }],
        
        menuLargeIcons: {
			DASHBOARD: 'easyui-large-icon icon-large-picture',
			Components: 'easyui-large-icon icon-large-chart',
			Tables: 'easyui-large-icon icon-large-shapes',
			Form: 'easyui-large-icon icon-large-clipart',
			MultiLevel: 'easyui-large-icon icon-large-smartart'
		},

        init: function(panel, loader) {

            loader.progress(70, '构建菜单');

            // 菜单
            var Menu = require('widgets/menu/widget.menu');
            var menu = new Menu({
                contextPath: Config.ViewContextPath,

                loader: Config.Menu.Loader,

                dashboard: Config.Menu.Dashboard,

                icons: ThemeConfig.menuIcons || Config.Menu.Icons,

                width: 194
            }, Cache.get('Menu')).render('#side');

            loader.progress(85, '创建菜单分页');
            // 菜单Tab
            var MenuTab = require('widgets/menu-tab/widget.menu-tab');
            new MenuTab().render('#center');
            menu.openDashboard();


            loader.progress(95, '加载工具栏');
            // 创建工具栏
            var Toolbar = require('widgets/toolbar/widget.toolbar');
            var toolbar = new Toolbar({
                name : 'main'
            }).render('#header');

            // 全屏按钮
            var ToolFullScreen = require('widgets/tools/widget.tool.full-screen');
            new ToolFullScreen().render(toolbar);

            // 皮肤颜色按钮
            var ToolColors = require('widgets/tools/widget.tool.colors');
            new ToolColors({
                colors: ThemeConfig.colors,
                current: Config.Theme.DefaultColor
            }).render(toolbar);
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
            $('#title').text(Config.System.HeaderTitle);
            $('#footer').text(Config.System.FooterTitle);
        }
    };

    return ThemeConfig;
});
