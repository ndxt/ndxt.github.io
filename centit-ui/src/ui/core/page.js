define(function (require) {
  var Config = require('config');
  var Core = require('core/core');
  var Mustache = require('plugins/mustache.min');
  var Loading = require('plugins/loading');

  // 页面对象
  var Page = Class.extend(function () {
    var _self = this;

    this.id = '';

    // 页面DOM，默认为document
    this.panel = $(document);

    // object 页面对象默认值
    // data 从父级页面传过来的值
    this.object = this.data = {};

    // 父对象
    this.parent = null;

    this.controllers = {};

    // 注入子控制器
    this.injecte = function (controller) {
      if (!$.isArray(controller)) {
        controller = [controller];
      }

      controller.forEach(function (c, i) {
        _self.controllers[c.id] = c;
        c.parent = _self;
      });

    };

    this.$findUp = function(name) {
      var parents = [];
      var scope = this;
      var result;

      while (scope) {
        parents.unshift(scope);
        scope = scope.parent;
      }

      for (var i = 0; i < parents.length; i++) {
        result = parents[i][name];
        if (result !== undefined) {
          return result
        }
      }
    };

    /**
     * 递归遍历找子控制器
     * @param name
     * @param callback
     */
    this.$find = function(name, callback) {
      var controller = find(this, name);
      if (controller) {
        callback(controller)
      }
      return controller;

      function find(controller, name) {
        var controllers = controller.controllers;

        if (controllers[name]) {
          return controllers[name];
        }

        for (var n in controllers) {
          var c = find(controllers[n], name);
          if (c) {
            return c;
          }
        }
      }
    };

    /**
     * 构造函数
     */
    this.constructor = function (id, panel) {
      if (!id) throw ('id is not defined.');

      this.id = id;
      panel && (this.panel = $(panel));
    };

    this.$parse = function (data, obj) {
      if (!this.panel || !this.panel.length) {
        return;
      }

      var toRender = obj ? this.panel.find(obj) : this.panel;

      var html = toRender.html();
      toRender.html(Mustache.render(html, data));
    }

    // 初始化方法
    this.init = function (panel, data) {
      panel && (this.panel = panel);
      data && (this.data = data);

      initPrintForm(panel);

      this.load(panel || this.panel, data || this.data);
      Loading.pop();
    };

    this.beforeLoad = function (data) {
      return true;
    };

    // 加载数据
    this.load = function (panel, data) {
    };

    // 提交
    this.submit = function (panel, data, closeCallback) {
    };

    // 注销
    this.onClose = function (table, data) {
      return data
    };

    // 注销前事件
    this.onBeforeClose = function (panel) {
    };

    this.beforeSearch = function(value) {

    };

    this.$afterEvents = {};

    this.$getRootLayout = function(panel) {
      panel = panel || this.panel;

      var layout = panel;

      if (layout.is('.layout')) {
        return layout;
      }

      layout = $('>.layout', layout);
      if (layout.length) return layout;
    };

    this.$autoHeight = function(region, layout) {

      // 直接传入 panel 对象
      if ('object' === typeof region) {
        if (!region.is) return;

        return region.panel('resize')
      }

      var root = this.$getRootLayout();

      // 没有找到 layout 直接使用 panel
      if (!root) {
        this.panel.panel('doLayout')
      }
      else {
        region = region || 'north';
        var panel = (layout || root).layout('panel', region);
        panel.panel('resize', {
          height: 'auto'
        });
        root.layout('resize')
      }
    };

    /**
     * 特殊处理打印form
     */
    function initPrintForm(panel) {
      var form = panel.find('form.print');

      if (form[0]) {
        // 解决 IE8 不支持 :last-child
        form.find('.fields:last-child, .field:last-child').addClass('last');

        // 解决 label 高度随 textarea 动态撑开
        form.find('span.textbox').each(function () {
          var height = $(this).height() + 5;
          $(this).parent().find('>label').css({
            'line-height': height + 'px'
          });
        });
      }
    }
  });

  return Page;
});
