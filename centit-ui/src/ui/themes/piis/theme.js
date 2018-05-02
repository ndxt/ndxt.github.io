define(function(require) {
    var Config = require('config');
	var Core = require('core/core');
    var Cache = require('core/cache');
	
    var ThemeConfig = {
        id : "piis",

        name : "颍上警情系统",

        css : [
            "ui/themes/piis/less/style.css",
            "ui/themes/piis/less/header.css",
            "ui/themes/piis/less/layout.css",
            "ui/themes/piis/less/menu.css",
            "ui/themes/piis/less/tab.css"
        ],
        
        template : "ui/themes/piis/template.html",

        init: function(panel, loader) {
        	
			loader.progress(70, '构建菜单');
            // 菜单
            var Menu = require('widgets/menu/widget.menu');
            var menu = new Menu({
                contextPath: Config.ViewContextPath,
                
                collapsible: false,

                loader: Config.Menu.Loader,

                dashboard: Config.Menu.Dashboard,

                icons: ThemeConfig.menuIcons || Config.Menu.Icons,
                
                width: 223
            }, Cache.get('Menu')).render('#side');
            
         // 用户名
        	var userName="";
        	Core.ajax(Config.ContextPath+'system/userinfo/current', {
        		data: {
        		},
        		async:true,
        		method: 'get'
        	}).then(function(data) {
        		userName=data.userName;//alert(data.userName);
        		
        		
        		// 菜单TAB
                loader.progress(85, '创建菜单分页');
                // 菜单Tab
                var Tab = require('widgets/menu-tab/widget.menu-tab');
                window.MenuTab = new Tab({
//                    tabHeight: 35,
                    pill: true
                }).render('#center');
                menu.openDashboard();

                // 工具栏
                loader.progress(95, '加载工具栏');
                // 创建工具栏
                var Toolbar = require('widgets/toolbar/widget.toolbar');
                var toolbar = new Toolbar({
                    name : 'main'
                }).render('#header');
        		
        		// 用戶信息alert(userName);
                var Uinfo = require('widgets/tools/widget.tool');
        		new Uinfo({
                    id: "userName",
                	text: userName+"，欢迎您 ",
                    iconCls: 'icon icon-user'
                }).render(toolbar);
        		   // 修改密码
                var ChangePassword = require('widgets/tools/widget.tool.change-password');
                new ChangePassword({
                    url: Config.URL.updPassWord,
                    iconCls: 'icon icon-help'
                }).render(toolbar);

                // 注销按钮
                var Tool = require('widgets/tools/widget.tool');
                new Tool({
                    url: Config.URL.Logout,
                    text: '注销',
                    iconCls: 'icon icon-back'
                }).render(toolbar);
                
                

                // 标题
                document.title = Config.System.Title;
        		
        		
        	});
            
            
         
            
            
            
        }
    };

    return ThemeConfig;
});





