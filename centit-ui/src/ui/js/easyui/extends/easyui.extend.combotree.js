define(['jquery', 'core/core', 'core/utils', 'config', 'plugins/mustache.min', 'core/cache', 'core/cache.dictionary', 'easyUI'],
  function ($, Core, Utils, Config, Mustache, Cache, DictionaryCache) {


    $.fn.combotree.defaults.editable = true;
    $.extend($.fn.combotree.defaults.keyHandler, {

      up: function () {
        var t = $(this).combotree('tree');

        var node = t.tree('getSelected');
        var nodes = t.tree('getChildren').filter(function (node) {
          return $(node.target).is(':visible');
        });
        if (!node || nodes.length == 0) return;

        var index = nodes.indexOf(node) - 1;
        index = index < 0 ? nodes.length - 1 : index;
        node = nodes[index];

        t.tree('select', node.target);
        t.tree('scrollTo', node.target);
      },
      down: function () {
        var t = $(this).combotree('tree');

        var node = t.tree('getSelected');
        var nodes = t.tree('getChildren').filter(function (node) {
          return $(node.target).is(':visible');
        });
        if (nodes.length == 0) return;

        var index = nodes.indexOf(node) + 1;
        index = index > nodes.length - 1 ? 0 : index;
        node = nodes[index];

        t.tree('select', node.target);
        t.tree('scrollTo', node.target);
      },
      enter: function () {
        var t = $(this).combotree('tree');
        var node = t.tree('getSelected');

        if (node) {
          $(node.target).click();
        }
      },
      query: function (q) {
        var t = $(this).combotree('tree');
        var nodes = t.tree('getChildren');
        var opts = $(this).combotree('options');
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];

          if (node[opts.textField].has(q) || node[opts.valueField].has(q)) {
            $(node.target).show();
            while (node = t.tree('getParent', node.target)) {
              $(node.target).show();
            }
          } else {
            $(node.target).hide();
          }
        }

        if (!opts.hasSetEvents) {
          opts.hasSetEvents = true;
          var onShowPanel = opts.onShowPanel;
          opts.onShowPanel = function () {

            var node = t.tree('getSelected');
            if (node) {
              t.tree('select', node.target);
              t.tree('scrollTo', node.target);
            }

            onShowPanel.call(this);
          };
          $(this).combo('options').onShowPanel = opts.onShowPanel;
        }
      }
    });

    /**
     * 加载方法
     */
    var loader = function (params, success, error) {
      var combotree = this;
      var opts = $(this).tree("options");

      // 是否在js客户端转换成树形结构数据
      var translate = opts.translate;

      var target = opts.target;

      switch (target) {
        case 'dictionary':
          return loader4Dictionary.call(combotree, opts, params, success, error);
        case 'unit':
          opts.key = 'Units';
          opts.valueField = 'unitCode';
          opts.textField = 'unitName';
          opts.parentField = 'parentUnit';
          return loader4CacheTree.call(combotree, opts, params, success, error);
        case 'unit&user':
          return loader4UnitUser.call(combobox, opts, params, success, error);
        case 'optinfo':
          opts.key = 'Optinfos';
          opts.valueField = 'id';
          opts.textField = 'text';
          opts.parentField = 'pid';
          return loader4CacheTree.call(combotree, opts, params, success, error);
        case 'cache':
          return translate ? loader4CacheTree.call(combotree, opts, params, success, error) : loader4Cache.call(combotree, opts, params, success, error);
      }

      if (!opts.url) return;
      Core.ajax(opts.url, {
        data: params
      }).then(function (data) {
        success(data || []);
      }, function () {
        error.apply(combotree, arguments);
      });
    };

    /**
     * 人员机构
     */
    var loader4UnitUser = function (options, params, success, error) {
      var userunits = Cache.get('UserUnit');
      userunits = clone(userunits);

      if (!userunits) {

        var users = Cache.get('Users');
        var units = Cache.get('Units');

        users.forEach(function (user) {
          user.id = user.userCode;
          user.text = user.userName;
          user.pid = user.primaryUnit;
        });

        units.forEach(function (unit) {
          unit.id = user.unitCode;
          unit.text = user.unitName;
          unit.pid = user.parentUnit;
        });

        var tree = Utils.makeTree(users.concat(units));
        tree = clone(tree);
        Cache.save('UserUnit', tree);
        success(userunits);
      }
      else {
        success(userunits);
      }
    };

    /**
     * 加载数据字典数据
     */
    var loader4Dictionary = function (options, params, success, error) {
      var key = options.key;

      var data = DictionaryCache.get(key);
      data = clone(data);

      // 没有数据字典缓存数据
      if (!data) {
        Core.ajax(Mustache.render(Config.URL.Dictionary, {
          code: key
        })).then(function (data) {
          data = data || [];
          DictionaryCache.save(key, data);
          success(DictionaryCache.getTree(key));
        }, function () {
          error.apply(this, arguments);
        });
      }
      else {
        success(DictionaryCache.getTree(key));
      }
    };

    /**
     * 缓存
     */
    var loader4Cache = function (options, params, success, error) {
      var url = options.url, key = options.key;
      var data = Cache.get(key);
      data = clone(data);

      // 没有缓存数据
      if (!data) {
        Core.ajax(Mustache.render(Config.URL.Dictionary, {
          code: key
        }), {
          data: params
        }).then(function (data) {
          data = data || [];
          Cache.save(key, data);
          success(data);
        }, function () {
          error.apply(this, arguments);
        });
      }
      else {
        success(data);
      }
    };

    // 将数组转换成树形结构
    function translate(datas, valueField, textField, iconField, parentField) {

      // 树形数据的字段固定，所以在转换前加以赋值
      var tree = Utils.makeTree(datas.map(function (data) {
        valueField && (data.id = data[valueField]);
        textField && (data.text = data[textField]);
        iconField && (data.icon = data[iconField]);
        return data;
      }), function (p) {
        return this[parentField] == p[valueField];
      });

      filter(tree, function (node) {
        return node.isValid === 'F'
      });

      return tree;

    };

    /**
     * 缓存，自转成树形结构
     */
    var loader4CacheTree = function (options, params, success, error) {
      var url = options.url, key = options.key;
      var valueField = options.valueField, textField = options.textField, iconField = options.iconField, parentField = options.parentField;

      var data = Cache.get(key);
      data = clone(data);

      // 没有缓存数据
      if (!data) {
        Core.ajax(Mustache.render(Config.URL.Dictionary, {
          code: key
        }), {
          data: params
        }).then(function (data) {
          data = data || [];
          Cache.save(key, data);

          var tree = translate(data, valueField, textField, iconField, parentField);
          Cache.save(key + 'Tree', tree);

          success(tree);
        }, function () {
          error.apply(this, arguments);
        });
      }
      else {
        var tree = Cache.get(key + 'Tree');

        if (!tree) {
          tree = translate(data, valueField, textField, iconField, parentField);
          Cache.save(key + 'Tree', tree);
        }

        tree = clone(tree);
        success(tree);
      }
    };

    function clone(data) {
      return JSON.parse(JSON.stringify(data));
    }
    /**
     * 过滤掉禁用的机构
     */
    function filter(arr, callback) {
      if (!arr) return;
      var length = arr.length;

      while (--length >= 0) {
        var node = arr[length];
        if (callback(node)) {
          arr.splice(length, 1)
        }

        filter(node.children, callback)
      }
    }

    $.extend(true, $.fn.combotree.defaults, {

      method: 'get',
      validType: 'combotree',
      loader: loader
    });


    $.extend($.fn.combotree, {
      parseOptions: function (jq) {
        return $.extend({
            translate: true,
            valueField: 'id',
            textField: 'text',
            parentField: 'pid'
          }, $.fn.combo.parseOptions(jq), $.fn.tree.parseOptions(jq),
          $.parser.parseOptions(jq, ['target', 'valueField', 'textField', 'parentField', 'iconField', {translate: 'boolean'}]));
      }
    });

  });
