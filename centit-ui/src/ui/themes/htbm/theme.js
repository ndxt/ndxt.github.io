define(function (require) {
    require('dropmenu');
    var Utils = require('core/utils');
    var Config = require('config');
    var Cache = require('core/cache');
    var Events = require('core/events');
    var $ = require('jquery');
    var Mustache = require('plugins/mustache.min');
    var ThemeConfig = {
        id: "mapfang",

        name: "图房",

        // css : [
        //     "ui/themes/mapfang/less/style.css",
        //     "ui/themes/mapfang/less/header.css",
        //     "ui/themes/mapfang/less/layout.css",
        //     "ui/themes/mapfang/less/menu.css",
        //     "ui/themes/mapfang/less/tab.css"
        // ],

        css: [
            "ui/themes/htbm/less/style.css",
            "ui/themes/htbm/less/header.css",
            "ui/themes/htbm/less/layout.css",
            "ui/themes/htbm/less/menu.css",
            "ui/themes/htbm/less/tab.css",
            "ui/themes/htbm/custom.css"
        ],


        template: "ui/themes/htbm/template.html",

        menuIcons: {
            DASHBOARD: 'fa fa-home',
            Components: 'fa fa-plug',
            Core: 'fa fa-heart',
            Layout: 'fa fa-rss',
            ORGMAG: 'fa fa-plug',
            SYS_CONFIG: 'fa fa-heart',
            DEPTMAG: 'fa fa-rss',
            Demo: 'fa fa-star',
            BASE: 'fa fa-star',
            SYS001: 'fa fa-heart',
            PLAN:'fa fa-heart',
            INCOMEBUDGET:'fa fa-cny',
            Rev:'fa fa-cny'
        },

        init: function (panel, loader) {

            loader.progress(70, '构建菜单');

            var template = require('text!./menu.html'),
                menus = Cache.get('Menu');

            menus.forEach(function (item) {
                item.icon = item.icon || ThemeConfig.menuIcons[item.id];
            });

            Utils.walkTree(menus, function (menu) {
                menu.hasChildren = !!(menu.children && menu.children.length);
            });

            var html = Mustache.render(template, {
                menus: menus
            });

            $('#side #wrap').html(html);

            /*  if($("#side").height()=="50"){
             $(".vertical-nav ul").css("left","31%");

             }*/


            $("#side #wrap .vertical-nav")
                .verticalnav({speed: 600, align: "left"});


            $("#side #wrap .vertical-nav").on('click', '.menu', function (e) {
                e.preventDefault();
                var menu = $(this),
                    id = menu.attr('rel'),
                    url = menu.attr('href'),
                    text = menu.text();
                if (url == "...") {
                    return;
                }
                url = Config.ViewContextPath + menu.attr('href'),
                    Events.trigger('open.MenuTab', {
                        id: id,
                        url: url,
                        text: text
                    });
            });

            // 菜单TAB
            loader.progress(85, '创建菜单分页');

            // 菜单Tab
            var MenuTab = require('widgets/menu-tab/widget.menu-tab');
            new MenuTab({
                tabHeight: 37,
                pill: true,
                dashboard: Config.URL.Dashboard
            }).render('#center').open({
                id: 'DASHBOARD',
                text: '我的首页',
                url: Config.URL.Dashboard,
                closable: false
            }, false);


            var expand = true;
            $('.vertical-nav .layout-collapse-centerer').on('click', function () {
                var width = expand ? 50 : 200;
                if (expand) {
                    $("#side").width(width);
                    $('.vertical-nav ul, .vertical-nav ul li ul').width(200);
                    $('.search .search-body').width($('.search .search-body').width() + 150);
                    $("#wrap a .texter").hide();
                    $("#wrap a .submenu-icon").hide();
                    $("#wrap a .ser").show();
                    expand = false;

                    setTimeout(function() {
                        $(document).trigger('collapseMenu');
                    });


                }
                else {
                    $("#side").width(width);
                    $('.search .search-body').width($('.search .search-body').width() - 150);
                    $("#wrap a .texter").show();
                    $("#wrap a .submenu-icon").show();
                    expand = true;

                    setTimeout(function() {
                        $(document).trigger('expandMenu');
                    });


                }
                resize(width);
            });

            // 工具栏
            loader.progress(95, '加载工具栏');
            // 创建工具栏
            var Toolbar = require('widgets/toolbar/widget.toolbar');
            var toolbar = new Toolbar({
                name : 'main'
            }).render('#header');
            /*
             // 改密码按钮
             var ChangePassword = require('widgets/tools/widget.tool.change-password');
             new ChangePassword().render(toolbar);
             // 注销按钮
             var Tool = require('widgets/tools/widget.tool');
             new Tool({
             url: Config.URL.Logout,
             text: '注销',
             iconCls: 'icon-back'
             }).render(toolbar);*/




            //个人资料
            // var ToolUser = require('widgets/tools/widget.tool.user');
            // new ToolUser({
            //     text: '',
            //     iconCls: 'icon-useres',
            //     width:72,
            //     height:38
            // }).render(toolbar);

            // 标题
            document.title = Config.System.Title;
        }
    };

    function resize(width) {
        var layout = $('body');
        layout.layout('panel', 'west').panel('resize', {
            width: width
        });
        layout.layout('resize');
    }

    return ThemeConfig;
});