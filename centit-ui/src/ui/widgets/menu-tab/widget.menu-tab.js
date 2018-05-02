define(function (require) {
  require('easyUI');

  var Events = require('core/events');
  var Widget = require('widgets/widget');
  var Mustache = require('plugins/mustache.min');
  var Loading = require('plugins/loading');

  var MenuTab = Widget.extend(function () {
    var _self = this;

    /**
     * ID 前缀
     * @type {string}
     */
    var ID_PREFIX = 'menu_tab_';

    /**
     * 以iframe打开方式内容模板
     * @type {string}
     */
    var TEMPLATE_IFRAME = '<iframe id="iframe_{{id}}" class="menu-iframe" scrolling="yes" frameborder="no" src="{{url}}"></iframe>';

    /**
     * 右键菜单
     */
    var contextMenu;

    /**
     * 工具栏菜单
     */
    var toolMenu;

    this.name = 'MenuTab';

    this.template = require('text!widgets/menu-tab/template.menu-tab.html');

    /**
     * 自定义公开事件
     * @type {{open: Function, refresh: Function, close: Function, closeOthers: Function, closeAll: Function}}
     */
    this.events = {
      open: function (event, tab, external) {
        _self.open(tab, external);
      },

      refresh: function (event, tab, href) {
        _self.reload(tab, href);
      },

      close: function (event, tab) {
        _self.close(tab);
      },

      closeOthers: function (event, tab) {
        _self.closeOthers(tab);
      },

      closeAll: function () {
        _self.closeAll();
      }
    };

    /**
     * 初始化右键菜单
     */
    var initContextMenu = function () {
      contextMenu = $('#menu_tab_menu').menu({
        onClick: function (item) {
          _self[item.name].call();
        }
      });

      this.element.find('ul.tabs:first').on('contextmenu', function (e) {
        e.preventDefault();

        // 当前选中的Tab页是否可以被关闭
        var closable = false;
        var panel = _self.element.tabs('getSelected');
        if (panel && panel.panel('options').closable) {
          closable = true;
        }

        // 判断关闭按钮是否可用
        contextMenu.find('div.close').each(function () {
          // 不可用
          if (!closable) {
            contextMenu.menu('disableItem', this);
          }
          // 可用
          else {
            contextMenu.menu('enableItem', this);
          }
        });

        contextMenu.menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      });
    };

    /**
     * 初始化工具栏菜单
     */
    var initToolMenu = function () {
      var tab = this.element;

      toolMenu = $('#tab_tools_menu').menu({
        onShow: function () {
          var self = $(this);
          var selectedIndex = tab.tabs('getTabIndex', tab.tabs('getSelected'));

          self.find('div.menu-item').not('.close').each(function (index) {
            $(this).data('index', index);

            if (index == selectedIndex) {
              self.menu('setIcon', {
                target: this,
                iconCls: 'icon-ok'
              });
            }
            else {
              self.menu('setIcon', {
                target: this,
                iconCls: 'icon-null'
              });
            }
          });
        },

        onClick: function (item) {

          if (item.name) {
            return _self[item.name].call();
          }

          tab.tabs('select', $(item.target).data('index'));
        }
      });
    };

    /**
     * 渲染
     * @param container
     * @returns {*}
     */
    this.render = function (container) {
      container = this.get(container);

      $(this.template).appendTo(container);

      var tab = this.element = container.find('#menu_tab');

      $.parser.parse(container);

      // 生成Tab
      tab.tabs($.extend({
        onContextMenu: function (e, title, index) {
          tab.tabs('select', index);
        },

        onSelect: function (title, index) {
          var tab = $(this).tabs('getTab', index);
          var id = tab.panel('options').id;

          if (id) {
            id = id.substr(ID_PREFIX.length);
            Events.trigger('select.Menu', id);
          }
        },

        onClose: function (title, index) {
          toolMenu.menu('removeItem', toolMenu.find('div.menu-item').not('.close')[index]);
        },

        onAdd: function (title, index) {

          var body = tab.tabs('getTab', index);
          body.addClass('menu-tab-body');

          toolMenu.menu('appendItem', {
            text: title
          });
        }
      }, this.options));

      // 初始化右键菜单
      initContextMenu.call(this);

      // 初始化工具栏菜单
      initToolMenu.call(this);

      return this;
    };

    /**
     * 获取Tab页index
     * @param tab
     * @returns {*}
     */
    this.getTabIndex = function (tab) {
      var panel = this.getTabPanel(tab);

      if (!panel) {
        return -1;
      }

      return this.element.tabs('getTabIndex', panel);
    };

    /**
     * 获取Tab页panel
     * @param tab
     * @returns {*}
     */
    this.getTabPanel = function (tab) {
      if (!tab) {
        return this.element.tabs('getSelected');
      }

      if (typeof tab == 'string') {
        return this.element.find('#' + ID_PREFIX + tab);
      }
      else if (typeof tab == 'number') {
        return this.element.tabs('getTab', tab);
      }
    };

    /**
     * 打开Tab页
     * @param tab
     * @param external 以iframe形式打开
     */
    this.open = function (tab, external) {
      if (!tab || !tab.id) return;

      var index = this.getTabIndex(tab.id);
      var opts = $.extend({}, tab, {
        selected: true,
        iconCls: tab.icon,
        id: ID_PREFIX + tab.id,
        title: tab.text,
        content: external ? Mustache.render(TEMPLATE_IFRAME, tab) : undefined,
        href: !external ? tab.url : undefined,
        closable: tab.closable !== false
      });

      // 已经打开
      if (index > -1) {
        this.element.tabs('select', index);

        this.element.tabs('update', {
          tab: this.element.tabs('getTab', index),
          options: opts
        });

        tab.reload != false && this.reload(null, tab.url);
      }

      // 新打开
      else {
        this.element.tabs('add', opts);
      }

      if (external) {
        Loading.pop();
      }
    };

    /**
     * 重新加载
     * @param tab
     * @param href
     */
    this.reload = function (tab, href) {
      tab = this.getTabPanel(tab);
      if (!tab) return;

      var iframe = tab.find('iframe.menu-iframe');

      // 是iframe
      if (iframe.length) {

        // FIXME 存在跨域问题：Uncaught SecurityError: Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "http://localhost:8088" from accessing a frame with origin "http://192.168.131.101:8080". Protocols, domains, and ports must match.

        if (!href) {
          iframe.contents()[0].location.reload();
        }
        else {
          iframe.contents()[0].location.href = href;
        }
      }
      // 是panel
      else {
        tab.panel('refresh', href);
      }
    };

    /**
     * 关闭
     * @param tab
     */
    this.close = function (tab) {
      tab = this.getTabPanel(tab);
      if (!tab) return;

      var index = this.element.tabs('getTabIndex', tab);
      var closable = tab.panel('options').closable;
      if (closable) {
        this.element.tabs('close', index);
      }
    };

    /**
     * 关闭所有
     */
    this.closeAll = function () {
      var tabs = this.element.tabs('tabs').length;

      for (var i = tabs - 1; i >= 0; i--) {
        var tab = this.getTabPanel(i);
        var closable = tab.panel('options').closable;
        if (closable) {
          this.element.tabs('close', i);
        }
      }
    };

    /**
     * 关闭其他
     * @param tab
     */
    this.closeOthers = function (tab) {
      var tabs = this.element.tabs('tabs').length;
      var index = this.getTabIndex(tab);

      for (var i = tabs - 1; i >= 0; i--) {
        var temp = this.getTabPanel(i);
        var closable = temp.panel('options').closable;
        if (index !== i && closable) {
          this.element.tabs('close', i);
        }
      }
    };

    this.defaults = {
      height: 26,
      tabHeight: 25,
      pill: false
    };
  });

  return MenuTab;
});
