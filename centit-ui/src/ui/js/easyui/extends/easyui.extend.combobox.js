define(['jquery', 'core/core', 'config', 'plugins/mustache.min', 'core/cache', 'core/cache.dictionary', 'easyUI'],
  function ($, Core, Config, Mustache, Cache, DictionaryCache) {

    $.fn.combo.defaults.inputEvents.keyup = function (e) {
      var el = $(e.data.target), combo = el.data('combo');
      var opts = el.combo("options");

      if (opts.onTextChange) {
        if (opts.editable) {
          if (combo.Timer4Change) {
            clearTimeout(combo.Timer4Change);
          }
          combo.Timer4Change = setTimeout(function () {
            var q = el.combo("getText");
            opts.onTextChange.call(e.data.target, q, e);
          }, opts.delay);
        }
      }
    };

    $.fn.combo.defaults.inputEvents.focus = function (e) {
      var el = $(e.data.target);
      el.combo('showPanel');
    };

    $.extend($.fn.textbox.methods, {
      addClearBtn: function (jq, iconCls) {
        return jq.each(function () {
          var t = $(this);
          var opts = t.textbox('options');
          opts.icons = opts.icons || [];
          if (!opts.icons.some(function (o) {
              return o.iconCls == 'icon-clear';
            })) {
            opts.icons.unshift({
              iconCls: iconCls,
              handler: function (e) {
                $(e.data.target).combobox('clear').textbox('textbox').focus();
                $(this).css('visibility', 'hidden');
              }
            });
          }
          t.textbox();
          if (!t.textbox('getText')) {
            t.textbox('getIcon', 0).css('visibility', 'hidden');
          }
          t.textbox('textbox').bind('keyup', function () {
            var icon = t.textbox('getIcon', 0);
            if ($(this).val()) {
              icon.css('visibility', 'visible');
            } else {
              icon.css('visibility', 'hidden');
            }
          });

          var combo = $.data(this, 'combo');
          if (combo) {
            var originOnChange = combo.options.onChange;
            if (!originOnChange.injected) {
              combo.options.onChange = function () {

                (typeof originOnChange === 'function') && originOnChange.apply(this, arguments);

                var icon = t.textbox('getIcon', 0);
                if ($(this).combo("getValue")) {
                  icon.css('visibility', 'visible');
                } else {
                  icon.css('visibility', 'hidden');
                }
              }

              combo.options.onChange.injected = true
            }
          }
        });
      }
    });

    $.fn.combo.defaults.onTextChange = function (v, e) {
      // console.log('changed', v);
    };

    /**
     * 加载数据函数
     */
    var loader = function (params, success, error) {
      var combobox = this;
      var opts = $(this).combobox("options");
      if (opts.clearBtn != false) {
        $(this).textbox().textbox('addClearBtn', 'icon-clear');
      }

      var type = opts.target;

      switch (type) {
        case 'dictionary':
          return loader4Dictionary.call(combobox, opts, params, success, error);
        case 'unit':
          opts.key = 'Units';
          return loader4Cache.call(combobox, opts, params, success, error);
        case 'user':
          opts.key = 'Users';
          return loader4Cache.call(combobox, opts, params, success, error);
        case 'role':
          opts.key = 'Roles';
          return loader4Cache.call(combobox, opts, params, success, error);
        case 'cache':
          return loader4Cache.call(combobox, opts, params, success, error);
      }

      if (!opts.url) return;
      Core.ajax(opts.url, {
        data: params
      }).then(function (data) {
        success(data || []);
      }, function () {
        error.apply(combobox, arguments);
      });
    };

    /**
     * 加载数据字典数据
     */
    var loader4Dictionary = function (options, params, success, error) {
      var key = options.key;

      var data = DictionaryCache.get(key);

      // 没有数据字典缓存数据
      if (!data) {
        Core.ajax(Mustache.render(Config.URL.Dictionary, {
          code: key
        })).then(function (data) {
          data = data || [];
          DictionaryCache.save(key, data);
          success(filterData(data, options));
        }, function () {
          error.apply(this, arguments);
        });
      }
      else {
        success(filterData(data, options));
      }
    };

    /**
     * 缓存
     */
    var loader4Cache = function (options, params, success, error) {
      var url = options.url, key = options.key;

      var data = Cache.get(key);
      var cacheUrl = {
        Units: 'system/cp/allunits/A',
        Roles: 'system/cp/roleinfo/G',
        Users: 'system/cp/alluser/A'
      };
      // 没有缓存数据
      if (!data) {
        Core.ajax(Mustache.render(cacheUrl[key]), {
          data: params
        }).then(function (data) {
          data = data || [];
          Cache.save(key, data);
          success(filterData(data, options));
        }, function () {
          error.apply(this, arguments);
        });
      }
      else {
        success(filterData(data, options));
      }
    };

    /**
     * 过滤传来的数据
     * @param data 数组
     * @param options
     */
    function filterData(data, options) {
      if (options.isValid) {
        return data ? data.filter(function(d) {
          return d.isValid == options.isValid
        }) : []
      }
      else {
        return data
      }
    }

    $.extend(true, $.fn.combobox.defaults, {
      filter: function (q, row) {
        var opts = $(this).combobox("options");
        return row[opts.textField].has(q) || row[opts.valueField].has(q);
      },

      selectOnNavigation: false,

      validType: 'combobox',

      method: 'get',

      onBeforeLoad: function (param) {
        var opts = $.parser.parseOptions(this, ['target', 'key','isValid']);
        var fieldOpts = $.parser.parseOptions(this, ['valueField', 'textField']);
        var comboboxOptions = $.data(this, 'combobox').options;

        // 根据不同类型有不同的 valueField 和 textField
        if (opts.target) {
          switch (opts.target) {
            case 'dictionary':
              opts.valueField = opts.valueField || 'dataCode';
              opts.textField = opts.textField || 'dataValue';
              break;
            case 'unit':
              opts.valueField = opts.valueField || 'unitCode';
              opts.textField = opts.textField || 'unitName';
              break;
            case 'user':
              opts.valueField = opts.valueField || 'userCode';
              opts.textField = opts.textField || 'userName';
              break;
            case 'role':
              opts.valueField = opts.valueField || 'roleCode';
              opts.textField = opts.textField || 'roleName';
              break;
          }
        }

        // 如果节点上有 dataCode 或 dataValue 以指定的为准，否则使用默认值
        $.extend(comboboxOptions, opts, fieldOpts);
      },

      loader: loader
    });


  });
