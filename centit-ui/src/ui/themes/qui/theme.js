define(function (require) {
  require('widgets/combobox-user-station');

  var Config = require('config');
  var Cache = require('core/cache');

  var $ = require('jquery');

  var ThemeConfig = {
    id: "qui",

    name: "qui",

    css: [
      "ui/themes/qui/less/style.css",
      "ui/themes/qui/less/header.css",
      "ui/themes/qui/less/menu.css",
      "ui/themes/qui/less/layout.css",
      "ui/themes/qui/less/tab.css"
    ],

    icons: [],

    template: "ui/themes/qui/template.html",

    colors: [{
      id: "sky_blue",
      name: "天空蓝",
      color: '#518CF0',
      css: "ui/themes/qui/blue/color.css"
    }, {
      id: "jewelry_blue",
      name: "宝石蓝",
      color: '#0062BD',
      css: "ui/themes/qui/jewelry-blue/color.css"
    }, {
      id: "dark_blue",
      name: "深蓝",
      color: '#2D7BB4',
      css: "ui/themes/qui/dark-blue/color.css"
    }, {
      id: "light_blue",
      name: "淡蓝",
      color: '#E1EDFA',
      css: "ui/themes/qui/light-blue/color.css"
    }, {
      id: "blue_green",
      name: "蓝绿",
      color: '#0FF3F8',
      css: "ui/themes/qui/blue-green/color.css"
    }, {
      id: "orange",
      name: "橘色",
      color: '#FF870F',
      css: "ui/themes/qui/orange/color.css"
    }, {
      id: "red",
      name: "艳红",
      color: '#E03E2C',
      css: "ui/themes/qui/red/color.css"
    }],

    menuIcons: null,

    init: function (panel, loader) {

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
      new MenuTab().render('#center');
      menu.openDashboard();

      var MenuSearch = require('widgets/menu-search/widget.menu-search');
      menu.addPlugin(new MenuSearch());

      loader.progress(95, '加载工具栏');
      // 创建工具栏
      var Toolbar = require('widgets/toolbar/widget.toolbar');
      var toolbar = new Toolbar({
        name: 'main'
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

      var User = Cache.get('UserInfo');
      var userName = User.userInfo ? User.userInfo.userName : (User.userName || User.username || User.name);
      $("<span>当前用户：" + userName + "</span>").appendTo("#header");

      $('<input style="margin-left: 10px;">')
        .appendTo($('#header > span'))
        .comboboxUserStation();
    }

  };

  return ThemeConfig;
});
