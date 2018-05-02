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
function parseURL(url) {
  url = url || window.location.href;
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
}

(function(params) {
  var cp = params.segments[0];
  this.ContextPath = this.ContextPath || (cp ? ('/' + cp + '/') : '/');
  this.ViewContextPath = this.ViewContextPath || this.ContextPath;
  this.GLOBAL_IDENTIFY = this.GLOBAL_IDENTIFY || {};
})(parseURL());

requirejs.config({
    baseUrl: window.ViewContextPath + 'ui',

    paths: {
		jquery: 'js/jquery/jquery-1.11.2.min',

		'ueditor': 'js/plugins/ueditor/ueditor.all',

		'quill': 'js/plugins/quill/1.2.4/quill',

		'socket.io': 'js/plugins/socket.io-1.3.7',

		underscore: 'js/plugins/underscore/underscore-min',

		easyUI: 'js/easyui/1.5.2/jquery.easyui.min',

		codeMirror: 'js/plugins/codemirror/codemirror',

		yepnope: 'js/plugins/yepnope/yepnope-1.5.4.min',

		fullcalendar: 'js/plugins/fullcalendar-3.0.1/locale/zh-cn',

		moment: 'js/plugins/moment.min',

		uploader: 'js/plugins/uploader/uploader',

		dropmenu: 'js/plugins/dropmenu/js/dropmenu',

		// 用户自定义参数文件路径
		custom: '../custom',

		modules: '../modules',

		centit: 'js/centit',

		loaders: 'js/loaders',

		plugins: 'js/plugins',

		websocket: 'js/websocket',

		myuploader: 'widgets/uploader/centit.uploader',

        style: 'css',

		locale: 'js/easyui/1.5.2/locale/easyui-lang-zh_CN',

		spark: 'js/plugins/spark-md5.min',

		fileMD5: 'js/plugins/file.md5'

    },

    shim: {
    	ueditor: {
    		deps: ['plugins/ueditor/third-party/zeroclipboard/ZeroClipboard', 'plugins/ueditor/ueditor.config'],
    		exports: 'UE',
			init: function(ZeroClipboard) {
				window.ZeroClipboard = ZeroClipboard;
			}
		},

        quill: {
        	deps: ['css!plugins/quill/1.2.4/quill.snow.css'],
			exports: 'Quill'
		},

		uploader: {
			deps: ['fileMD5', 'css!plugins/uploader/uploader.css', 'css!widgets/uploader/centit.uploader.css'],
			init: function(FileMD5) {
				window.FileMD5 = FileMD5;
			},
			exports: 'Stream'
		},

    	easyUI : {
    		deps: ['jquery', 'css!style/icon.css'],

    		init: function($) {
    			$.parser.auto = false;
    		}
    	},

        dropmenu: {
			deps: ['css!plugins/dropmenu/css/dropmenu.css']
		},

		codeMirror: {
			deps: [
				'js/plugins/codemirror/mode/xml/xml',
				'js/plugins/codemirror/mode/css/css',
				'js/plugins/codemirror/mode/javascript/javascript',
				'css!plugins/codemirror/codemirror.css'
			]
		},

		fullcalendar: {
			deps: [
			     'js/plugins/fullcalendar-3.0.1/fullcalendar.min',
			     'css!js/plugins/fullcalendar-3.0.1/fullcalendar.min.css'
			]
		}
    },

    map: {
		'*' : {
			'css' : 'js/css.min',
			'text' : 'js/text'
		}
	}
});

requirejs(['main']);
