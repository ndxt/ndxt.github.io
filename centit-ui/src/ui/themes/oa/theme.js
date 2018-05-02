define(function(require) {
    var Config = require('config');
    var Cache = require('core/cache');
    var Events = require('core/events');

    var ThemeConfig = {
        id : "xjoa",

        name : "新疆OA",

        css : [
            "ui/themes/oa/less/style.css",
            "ui/themes/oa/less/header.css",
            "ui/themes/oa/less/layout.css",
            "ui/themes/oa/less/menu.css",
            "ui/themes/oa/less/tab.css",
            "ui/themes/oa/less/descriptive/descriptive.css"
        ],

        icons: [],

        template : "ui/themes/oa/template.html",

        colors : [{
            id : "blue",
            name : "天空蓝",
            color: '#2FB0E2',
            css : "ui/themes/oa/blue/color.css"
        },{
            id : "yellow",
            name : "阳光橙",
            color: '#ec8624',
            css : "ui/themes/oa/yellow/color.css"
        },{
            id : "red",
            name : "火山红",
            color: '#B40000',
            css : "ui/themes/oa/red/color.css"
        },{
            id : "green",
            name : "橄榄绿",
            color: '#367500',
            css : "ui/themes/oa/green/color.css"
        },{
            id : "Chinese-Ink",
            name : "水墨黑",
            color: '#2c4450',
            css : "ui/themes/oa/Chinese-Ink/color.css"
        },{
            id : "white",
            name : "极光白",
            color: '#ffffff',
            css : "ui/themes/oa/white/color.css"
        }],
        
        menuLargeIcons: {
        	Dashboard:'easyui-large-icon sy',
        	YGJGGRBG:'easyui-large-icon grbg',
        	YGJGGWLZ:'easyui-large-icon gwlz',
        	YGJGBGZY:'easyui-large-icon bgzy',
        	Zhgl:'easyui-large-icon zhgl'
		},
		menuIcons: {
        	Dashboard:'easyui-large-icon sy',
        	YGJGGRBG:'easyui-large-icon grbg',
        	YGJGGWLZ:'easyui-large-icon gwlz',
        	YGJGBGZY:'easyui-large-icon bgzy',
        	Zhgl:'easyui-large-icon zhgl'
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
                largeIcons:ThemeConfig.menuLargeIcons,
                onTopSelect: function(btn) {//顶部菜单添加选中类名（selected）
                	btn = $(this);
                	btn.addClass('selected');
                	btn.siblings('a').removeClass('selected');
                	/*var _nameTop=btn.attr('name');
                	$('.layout-container>div').each(function(){
                		
                		if($(this).attr('name')==_nameTop){
                			$('.menu-tab-link',this).each(function(){
                				if($(this).attr('rel')=='SWGLSWDB'){
                					return $(this).click();
                				}
                			});
                		}
                	});*/
                	//顶部菜单单击以后，打开链接
                	Events.trigger('open.MenuTab', {
                		id: 'SWGLSWDB',
               		    text: 'baidu',
                		url:btn.attr("link")
                	});
                },
                width: 194,
                collapsible: true,//取消左侧菜单收缩功能
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
            }).render('#toolbar');

            // 全屏按钮
//            var ToolFullScreen = require('widgets/tools/widget.tool.full-screen');
//            new ToolFullScreen().render(toolbar);

            // 皮肤颜色按钮
            var ToolColors = require('widgets/tools/widget.tool.colors');
            new ToolColors({
                colors: ThemeConfig.colors,
                current: Config.Theme.DefaultColor
            }).render(toolbar);
            // //登陆用户信息
			// var LoginUser = require('widgets/toolbar/widget.toolbar.Loginuser');
			// new LoginUser().render(Loginuser);
			//
			//  // 改密码按钮
			// var ChangePassword = require('widgets/tools/widget.tool.change-password');
			// new ChangePassword({id:'ChangePassword'}).render(toolbar);
			//
			// // 通讯录按钮
			// var AddressList = require('widgets/tools/widget.tool.address-list');
			// new AddressList({id:'AddressList'}).render(toolbar);
			
			// 消息提醒按钮
			//var MessageTips = require('modules/messagetips/messagetips');
			//new MessageTips({id:'MessageTips'}).render(toolbar);

            // 消息提醒按钮
            // var MessageTips = require('modules/messagetips/dialogmessagetips');
            // new MessageTips({id:'DialogMessageTips'}).render(toolbar);
			
			//消息提示框
//			var Messager=require('widgets/tools/widget.tool.messager');
//			var Controller=require('widgets/tools/optprocinfo');
//			var controller=new Controller();
//			new Messager({url:'modules/powerruntime/optideainfo/optideainfo.html',controller:controller,id:'optideainfo'}).show();
//			
			// 锁屏按钮
			// var LockScreen = require('widgets/tools/widget.tool.lock-screen');
			// new LockScreen({id:'LockScreen'}).render(toolbar);
            //
            // //帮助中心
            // var HelpCenter = require('modules/helpcenter/ctrl/helpcenter');
            // new HelpCenter({id:'HelpCenter'}).render(toolbar);
			//
			// //工具组合
			// var ToolGroup = require('widgets/tools/widget.tool.tool-group');
			// new ToolGroup({
			// 	btns:[
			// 	      {class:'sp_icon',clickobj:'LockScreen'},
			// 	      {class:'sz_icon',clickobj:'ChangePassword'},
			// 	      {class:'tx_icon',clickobj:'DialogMessageTips'},
			// 	      {class:'bz_icon',clickobj:'HelpCenter'}
			// 	      ]
			// }).render(toolbar);
            //
			// // 消息提醒按钮
			// /*var MessageTips = require('modules/messagetips/messagetips');
			// new MessageTips().render(toolbar);*/
            // // 注销按钮
            // var Cancel = require('widgets/tools/widget.tool.cancel');
            // new Cancel({
             //    url: Config.URL.Logout,
             //    text: '注销',
             //    iconCls: 'icon-back'
            // }).render(toolbar);
            // 标题
            document.title = Config.System.Title;
            $('#title').text(Config.System.HeaderTitle);
            $('#footer').text(Config.System.FooterTitle);
            $("#menu_mix_Dashboard").hide();//禁用默认我的首页
            $("#menu_mix_WDSY").trigger('click');//开启自定义我的首页
            $("#toolbar>.toolbar>a").click(function(){
            	$("#toolbar>.toolbar>a").removeClass("selected");
            	$(this).addClass("selected");
            });
        }
    };
    return ThemeConfig;
});
