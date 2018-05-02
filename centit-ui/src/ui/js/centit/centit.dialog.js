define(function (require) {
  var Config = require('config');
  var Template = require('text!centit/centit.dialog.html');
  var Mustache = require('plugins/mustache.min');

  /**
   * 关闭dialog，仅仅是隐藏
   */
  function close(dialog, data) {
    dialog = get(dialog);
    if (!dialog) return;

    $.fn.dialog.methods['close'](dialog, false, data);

    destroy(dialog);
  }

  /**
   * 重新刷新对话框
   */
  function refresh(dialog, url) {
    // 包含 / 的字符串判断为url
    if (typeof dialog == 'string' && dialog.indexOf('/') > -1) {
      url = dialog;
      dialog = undefined;
    }

    dialog = get(dialog);
    if (!dialog) return;

    var op = dialog.data('options');
    op = $.extend({}, op);

    // 刷新新的url
    if (url) {
      op.href = Config.ViewContextPath + url;

      if (op.external) {
        Dialog.getContent(dialog)[0].location.href = op.href;
      }
      else {
        dialog.panel('refresh', op.href);
      }

      dialog.data('options', op);
    }
    else {
      if (op.external) {
        Dialog.getContent(dialog)[0].location.reload();
      }
      else {
        dialog.panel('refresh');
      }
    }
  }

  /**
   * 从html中完全消除dialog对象
   */
  function destroy(dialog) {
    try {
      dialog = get(dialog);
      if (!dialog) return;

      var id = dialog.attr('id');
      dialog.dialog('destroy');

      // 同步删除缓存中的对象
      delete Dialog.dialogs[id];
    }
    catch (e) {
      /****code****/
    }
  }

  /**
   * 获取对话框对象
   */
  function get(dialog) {
    if (typeof dialog == 'string') {
      dialog = Dialog.dialogs[dialog];
    }
    else {
      dialog = $(dialog);
    }

    return dialog;
  }

  /**
   * 获取对话框内容
   *
   * 非iframe直接返回dialog对象
   * 包含iframe返回iframe的contents对象
   */
  function getContent(dialog) {
    dialog = get(dialog);
    if (!dialog) return;

    var op = dialog.data('options');
    if (op.external) {
      return $(dialog).find('iframe:first').contents();
    }

    return dialog;
  }

  /**
   * 解析按钮
   */
  function _parseButton(options) {
    var id = options.id;

    // 如果已经自定义按钮，不再根据ok和cancle值自动生成
    if (options.buttons) {
      return;
    }

    var buttons = [];

    if (options.ok) {
      buttons.push({
        iconCls: options.okIcon,
        text: options.okValue,
        handler: function () {
          if (options.ok.call(this, Dialog.getContent(id), Dialog.get(id)) == false) {
            return;
          }

          Dialog.close(id);
        }
      });
    }

    buttons.push({
      iconCls: options.cancleIcon,
      text: options.cancleValue,
      handler: function () {
        if (options.cancle.call(this, Dialog.getContent(id), Dialog.get(id)) == false) {
          return;
        }

        Dialog.close(id);
      }
    });

    options.buttons = buttons;
  }

  // 解析带控制器的弹出窗口
  function _parseController(options, data, controller) {
    if (controller.beforeLoad && controller.beforeLoad.call(this, data) === false) {
      return;
    }

    var title = options.title, url = options.href, id = Mustache.render('dialog_{{id}}', {
      id: controller.id
    });

    // 重新解析标题和链接
    title = Mustache.render(options.title, data);
    url = Mustache.render(url, data);

    var dialogOpts = {
      id: id,
      title: title,

      href: url,
      width: options.width,
      height: options.height,

      // 页面加载事件
      onLoad: function (panel) {
        controller.$submited = false;
        controller.onClose.$injected = false;
        controller.init.call(controller, panel, data)
      },

      // 关闭事件
      onClose: function () {
        var data;
        try {
          if (!controller.onClose.$injected) {
            data = controller.onClose.call(controller);
          }
          else {
            data = controller.onClose.$data;
          }

          var dialog = Dialog.dialogs[id];
          if (!dialog) return;

          dialog.dialog('destroy');
          delete Dialog.dialogs[id];

        }
        catch (e) {

        }
        finally {
          window.SUBMIT_BTN = null;
        }

        return data;
      }
    };

    // 添加对话框按钮
    addDialogButton(dialogOpts, options, controller, function (data) {
      controller.$submited = true;
      controller.onClose.$injected = true;
      controller.onClose.$data = controller.onClose.call(controller, null, data);
      Dialog.close(id);
    });

    $.extend(options, dialogOpts);
  }

  var addDialogButton = function (dialogOpts, opts, subCtrl, closeCallback) {
    var buttons = opts.buttons;

    // 等于false对话框只有一个取消按钮
    if (buttons === 'false') {
      return;
    }
    // 没有buttons值，默认添加提交按钮
    else if (!buttons) {
      dialogOpts = $.extend(dialogOpts, {
        okValue: opts.btnValue,
        ok: function () {
          return subCtrl.submit.call(subCtrl, subCtrl.panel, subCtrl.data, closeCallback);
        }
      });
    }
    else {
      try {
        buttons = eval(buttons);

        // 添加按钮
        buttons.forEach(function (button) {
          var method = subCtrl[button.method];

          if (!method) {
            console.warn(Mustache.render('按钮【{{text}}】对应控制器【{{id}}】缺少方法：【{{method}}】', {
              text: button.text,
              id: subCtrl.id,
              method: button.method
            }));
            return true;
          }

          // 按钮点击事件
          button.handler = function () {
            if (method.call(subCtrl, subCtrl.panel, subCtrl.data, closeCallback) == false) {
              return;
            }

            closeCallback();
          }
        });

        dialogOpts.buttons = buttons;
      }
      catch (e) {
        console.error('解析对话框按钮失败：' + buttons);
      }
    }
  };

  function attachKeyEvents(panel, dialog, options) {
    panel.parent().off('keyup.hotkey').on('keyup.hotkey', function (e) {
      var code = e.which;

      switch (code) {
        case 13:
          onEnter(options);
          break;
        case 27:
          onEsc(dialog);
          break;
        default:
          break;
      }
    });

    function onEsc() {
      panel.parent().off('keyup.hotkey')
      Dialog.close(dialog)
    }

    function onEnter(options) {
      if (options.ok) {
        options.ok()
      }
    }
  }

  /**
   * 打开对话框
   */
  function open(options, data, controller) {

    return new Promise(function (resolve, reject) {
      var id = options;

      // 传入对象
      if ('string' !== typeof options) {
        id = options.id;
      }
      // 传入id字符串
      else {
        options = {
          id: id
        };
      }

      var dialog = Dialog.dialogs[id];

      // 默认配置
      options = $.extend({}, Dialog.defaults, options);

      if (controller) {
        _parseController(options, data, controller);
      }

      // 解析完页面后调用
      if (options.onLoad) {
        var onLoad = options.onLoad;

        options.onBeforeLoad = function () {
          $.parser.onComplete = function (panel) {
            $.parser.onComplete = $.noop;

            if (options.hotKey) {
              attachKeyEvents(panel, dialog, options);
            }

            onLoad.call(this, panel, dialog.data('params'));
          };
        };

        options.onLoad = undefined;
      }

      if (options.onClose && !options.onClose.$injected) {
        var originClose = options.onClose;

        onClose.$injected = true;
        options.onClose = onClose;

        function onClose() {
          var data = originClose();
          resolve(data);
        }
      }

      // 已经创建，重新打开
      if (dialog) {
        dialog.data('params', data);
        dialog.data('options', options);

        dialog.dialog('setTitle', options.title);
        dialog.dialog('open');

        // 是否需要重新刷新内容
        if (options.refresh) {
          if (options.href) {
            Dialog.refresh(dialog, options.href);
          }
          else {
            Dialog.refresh(dialog);
          }
        }
      }
      else {
        // 创建对话框
        dialog = createDialog(options);
        dialog.data('params', data);
      }

    });
  }

  function createDialog(options) {
    // 固定的对话框内容
    if (options.content) {
      delete options.href;
      options.external = false;
      options.refresh = false;
    }
    // 直接打开
    else if (!options.external) {
      options.href = Config.ViewContextPath + options.href;
    }
    // IFRAME方式打开
    else {
      options.url = Config.ViewContextPath + options.href;
      delete options.href;
    }

    // 解析按钮
    _parseButton(options);

    // 生成对话框
    dialog = $(Mustache.render(Template, options))
      .appendTo('body')
      .dialog(options)
      .data('options', options);

    // 缓存dialog
    Dialog.dialogs[options.id] = dialog;

    return dialog;
  }

  var Dialog = {
    dialogs: {},

    defaults: {
      hotKey: false,
      width: 320,
      height: 240,
      modal: true,
      title: '对话框',
      ok: null,
      okValue: '确定',
      okIcon: 'icon-save',
      cancle: function () {
        return true;
      },
      cancleValue: '取消',
      refresh: true
    },

    open: open,
    close: close,
    refresh: refresh,
    destroy: destroy,
    get: get,
    getContent: getContent
  };

  return Dialog;
});
