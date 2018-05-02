define(function (require) {


  var Utils = {

    /**
     *@param {string} url 完整的URL地址
     *@returns {object} 自定义的对象
     *@description 用法示例：var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
     myURL.file='index.html'

     myURL.hash= 'top'

     myURL.host= 'abc.com'

     myURL.query= '?id=255&m=hello'

     myURL.params= Object = { id: 255, m: hello }

     myURL.path= '/dir/index.html'

     myURL.segments= Array = ['dir', 'index.html']

     myURL.port= '8080'

     myURL.protocol= 'http'

     myURL.source= 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
     */
    parseURL: function (url) {
      var a = document.createElement('a');
      a.href = url;
      return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
          var ret = {},
            seg = a.search.replace(/^\?/, '').split('&'),
            len = seg.length, i = 0, s;
          for (; i < len; i++) {
            if (!seg[i]) {
              continue;
            }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
          }
          return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
      };
    },

    /**
     * 将平直的list数据转换成父子关系的tree数据
     *
     * @param datas list数据
     * @param isParent 判断是否是父子关系函数 function(parent) { return this.pid === parent.id; }
     * @param childField 子元素字段名
     * @returns {Array}
     */
    makeTree: function (datas, isParent, childField) {
      isParent = isParent || function (parent) {
        return this.pid == parent.id;
      };

      var top = [], childField = childField || 'children';

      datas.forEach(function (child) {
        var isTop = true;

        datas.forEach(function (parent) {
          if (isParent.call(child, parent)) {
            if (!parent[childField]) {
              parent[childField] = [];
            }
            parent[childField].push(child);
            isTop = false;
            return false;
          }
        });

        if (isTop) {
          top.push(child);
        }
      });

      return top;
    },


    /**
     * 遍历树
     * @param datas
     * @param callback
     * @parem childField
     * @param level
     */
    walkTree: function (datas, callback, childField, level) {
      childField = childField || 'children';
      level = level || 0;
      callback = callback || $.noop;

      var _walk = function (data, callback, parent, level) {
        data.forEach(function (obj, index) {
          var children = obj[childField];

          if (children && children.length) {
            _walk(children, callback, obj, level + 1);
          }

          // 当前对象、父级对象、层级、当前对象的index
          callback.call(obj, obj, parent, level, index);
        });
      };

      if (datas.length) {
        _walk(datas, callback, null, 0);
      }
      else {
        _walk([datas], callback, null, 0);
      }
    },

    /**
     * 遍历树
     * @param datas
     * @param callback
     * @parem childField
     * @param level
     */
    walkTreeBefore: function (datas, callback, childField, level) {
      childField = childField || 'children';
      level = level || 0;
      callback = callback || $.noop;

      var _walk = function (data, callback, parent, level) {
        data.forEach(function (obj, index) {
          // 当前对象、父级对象、层级、当前对象的index
          callback.call(obj, obj, parent, level, index);

          var children = obj[childField];

          if (children && children.length) {
            _walk(children, callback, obj, level + 1);
          }
        });
      };

      if (datas.length) {
        _walk(datas, callback, null, 0);
      }
      else {
        _walk([datas], callback, null, 0);
      }
    },

    /**
     * Returns a function, that, when invoked, will only be triggered at most once
     * during a given window of time. Normally, the throttled function will run
     * as much as it can, without ever going more than once per `wait` duration;
     * but if you'd like to disable the execution on the leading edge, pass
     * `{leading: false}`. To disable execution on the trailing edge, ditto.
     * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
     * @param {function} func
     * @param {number} wait
     * @param {Object=} options
     * @returns {Function}
     */
    throttle: function (func, wait, options) {
      /**
       * Get time in ms
       * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
       * @type {function}
       * @return {number}
       */
      var getTime = (Date.now || function () {
        return new Date().getTime();
      });

      var context, args, result;
      var timeout = null;
      var previous = 0;
      options || (options = {});
      var later = function () {
        previous = options.leading === false ? 0 : getTime();
        timeout = null;
        result = func.apply(context, args);
        context = args = null;
      };

      return function () {
        var now = getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
          context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };


    },

    /**
     * 日期格式化
     * lsh
     */
    formateDate: function (date, fmt) {
      var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  };

  return Utils;
});
