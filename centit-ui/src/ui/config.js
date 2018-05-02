/**
 * CentitUI 配置信息
 */
define(function (require) {
  var CustomConfig = require('custom/config');

  var $ = require('jquery');

  var _ = require('underscore');

  // api请求路径
  var ContextPath = window.ContextPath;

  // 静态资源请求路径
  var ViewContextPath = window.ViewContextPath || ContextPath;

  /**
   * 系统链接配置
   * @type {{}}
   */
  var URL = {
    Dictionary: ContextPath + 'system/cp/dictionary/{{code}}',

    LVB: ContextPath + 'system/cp/lvb/{{code}}',

    CSRF: 'system/mainframe/login/csrf',

    // 用户信息
    UserInfo: 'system/mainframe/currentuser',

    // 用户个性化设置
    UserSetting: null,

    // 首页菜单
    Menu: "system/mainframe/menu",

    // 注销
    Logout: ContextPath + 'system/mainframe/logout', // 'j_spring_security_logout',

    // 首页
    Dashboard: ViewContextPath + 'modules/dashboard/demo/demo.html'
  };
  URL = $.extend({}, URL, CustomConfig.URL);

  /**
   * 主题配置
   * @type {{Default: string}}
   */
  var Theme = {
    // 默认主题
    DefaultTheme: 'qui',

    // 默认颜色
    DefaultColor: 'sky_blue',

    // 默认菜单布局
    DefaultLayout: 'left',

    // 首页加载动画效果主题
    LoadAnimation: 'CentiUI',

    // 加载的样式文件路径
    CSS: [
      "ui/css/easyui/1.5.2/default/easyui.css",
      "ui/css/easyui/style.css",
      "ui/css/easyui/bootstrap-grid.css"
    ],

    // 加载自定义样式文件路径
    CustomCSS: ['custom/style.css'],

    // 加载图标样式文件路径
    IconCSS: [
      "ui/css/font-awesome/4.7.0/css/font-awesome.min.css",
      "ui/css/icon.css",
      "ui/css/icon-base.css",
      "ui/css/icon-black.css",
      "ui/css/icon-black-16.css",
      "ui/css/icon-border.css",
      "ui/css/icon-border-16.css",
      "ui/css/icon-white.css",
      "ui/css/icon-white-16.css"
    ],

    Template: null
  };
  Theme = $.extend({}, Theme, CustomConfig.Theme, {
    CSS: _.union(Theme.CSS, CustomConfig.Theme ? CustomConfig.Theme.CSS : null),

    CustomCSS: _.union(Theme.CustomCSS, CustomConfig.Theme ? CustomConfig.Theme.CustomCSS : null),

    IconCSS: _.union(Theme.IconCSS, CustomConfig.Theme ? CustomConfig.Theme.IconCSS : null)
  });

  /**
   * 菜单相关配置
   * @type {{}}
   */
  var Menu = {
    // 菜单数据加载器，可以处理传入的菜单数据
    Loader: function (data) {

      return data;

//    		data = data[0] ? data[0] : [];
//
//    		return data.children ? data.children : [];
    },

    // 菜单图标，在后台数据无icon字段时手动设定
    Icons: null,

    // 菜单大图标，在使用混合型菜单时设定
    LargeIcons: null,

    Dashboard: {
      id: 'Dashboard',

      text: '我的首页',

      icon: 'icon-base icon-base-home',

      url: URL.Dashboard,

      external: true,

      closable: false
    }
  };
  Menu = $.extend(true, {}, Menu, CustomConfig.Menu, {
    Dashboard: {
      url: CustomConfig.URL.Dashboard ? CustomConfig.URL.Dashboard : URL.Dashboard
    }
  });

  /**
   * 缓存相关配置
   * @type {{}}
   */
  var Cache = {
    // 缓存初始加载，更多信息参考：loader.system.js
    Init: [
      {
        id: 'Optinfos', url: "system/cp/optinfo/A"
      },
      {
        id: 'loginuser', url: "system/mainframe/currentuser"
      },
      {
        id: 'Units', url: 'system/cp/allunits/A',
        key: 'unitCode'
      },
      {
        id: 'Roles', url: 'system/cp/roleinfo/G',
        //                	   loader: function(data) {return data ? data.objList : data;},
        key: 'roleCode'
      },
      {
        id: 'Users', url: 'system/cp/alluser/T',
        //                	   loader: function(data) {return data ? data.objList : data;},
        key: 'userCode'
      },
      {
        id: 'AllUsers', url: 'system/cp/alluser/A',
//                	   loader: function(data) {return data ? data.objList : data;},
        key: 'userCode'
      }

    ]
  };
  Cache = $.extend({}, Cache, {
    Init: CustomConfig.Cache === false ? [] : _.union(Cache.Init, CustomConfig.Cache.Init)
  });

  /**
   * 数据字典相关
   * @type {{}}
   */
  var Dictionary = {
    // 缓存数据字段，数组保存需要缓存的数据字典Code，更多信息参考：loader.dictionary.js
    //Init: ['OptType', 'OptLevel']
  };
  Dictionary = $.extend({}, Dictionary, {
    Init: _.union(Dictionary.Init, CustomConfig.Dictionary ? CustomConfig.Dictionary.Init : null)
  });

  /**
   * 系统相关配置
   * @type {{}}
   */
  var System = {
    // 系统title
    Title: 'CENTIT-UI',

    // 系统头部title
    HeaderTitle: 'CENTIT-UI',

    // 系统尾部title
    FooterTitle: '南大先腾技术管理中心',

    // 首页加载时缓冲动画效果
    LoadingAnimation: true,

    panelLoading: true,

    webSocket: false,

    AjaxSend: function (event, state, options) {
      // console.log(options.url, options.type);

      if (['POST', 'PUT', 'DELETE'].indexOf(options.type) > -1) {
        window.ajaxCount = window.ajaxCount || 0;
        window.ajaxCount++;
        $('#ajax-loader').show();

        var btn = $(window.SUBMIT_BTN);

        if (btn.length) {
          btn.linkbutton('disable');

          // 默认2秒恢复
          setTimeout(function () {
            btn.linkbutton('enable');
            window.SUBMIT_BTN = null;
          }, 2000)
        }
      }
    },

    AjaxComplete: function (event, state, options) {
      if (['POST', 'PUT', 'DELETE'].indexOf(options.type) > -1) {
        if (--window.ajaxCount <= 0) {
          $('#ajax-loader').hide();
        }

        var btn = $(window.SUBMIT_BTN);
        if (btn.length) {
          btn.linkbutton('enable')
        }
        window.SUBMIT_BTN = null;
      }
    },

    // 处理Ajax数据
    AjaxLoader: function (response) {
      var translate = function (data) {
        if (typeof data === 'string') return data;

        var msg = [];

        for (var name in data) {
          if (data.hasOwnProperty(name)) {
            msg.push(name + ": " + data[name]);
          }
        }

        return msg.join('\n');
      };


      if (0 == response.code) {
        return Promise.resolve(response.data);
      }
      else if (response.code) {
        $.messager.progress('close');
        switch (response.code) {
          case 401:
            window.location.href = ContextPath + 'system/mainframe/login';
            return Promise.reject(response);
          case 404:
            return Promise.reject(response);
          case 500:
          case 400:
          case 403:
          default:
            if (!response.data || $.isEmptyObject(response.data)) {
              $.messager.alert('错误', response.message, 'error');
            }
            else {
              $.messager.alert(response.message, translate(response.data), 'error');
            }

            return Promise.reject(response);
        }
      }

      return Promise.resolve(response);
    },

    // 处理Ajax错误数据
    AjaxErrorLoader: function (response) {

      try {
        $.messager.progress('close');
      }
      catch (e) {

      }

      if (response.status == null || 401 == response.status
        || 302 == response.status || 0 == response.status) { //302
        window.location.href = ContextPath + 'system/mainframe/login';
        return Promise.reject(response);
      }

      if (response.status == 404) { //302
        return Promise.reject(response);
      }

      if (response.responseJSON) {
        var data = response.responseJSON;
        $.messager.alert(data.message, $.toJSON(data.data), 'error');
      }
      else {
        $.messager.alert(response.status + ' 错误', response.statusText, 'error');
      }
    },

    // debug模式，打印日志
    Debug: true,

    // 使用easyui布局
    EasyUI: true
  };
  System = $.extend({}, System, CustomConfig.System);


  return {
    ContextPath: ContextPath,

    ViewContextPath: ViewContextPath,

    URL: URL,

    Theme: Theme,

    Menu: Menu,

    System: System,

    Cache: Cache,

    Dictionary: Dictionary

  };
});
