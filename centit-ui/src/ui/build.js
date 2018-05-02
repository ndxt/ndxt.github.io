({
    baseUrl: './',
    paths: {
        jquery: 'js/jquery/jquery-1.11.2.min',

        easyUI: 'js/easyui/1.4.2/jquery.easyui.min',

        codeMirror: 'js/plugins/codemirror/codemirror',

        yepnope: 'js/plugins/yepnope/yepnope-1.5.4.min',

        fullcalendar: 'js/plugins/fullcalendar/zh-cn',

        moment: 'js/plugins/moment.min',

        // 用户自定义参数文件路径
        custom: '../custom',

        modules: '../modules',

        centit: 'js/centit',

        loaders: 'js/loaders',

        plugins: 'js/plugins',

        style: 'css'

    },

    shim: {
        easyUI : {
            deps: ['jquery', 'css!style/easyui/style.css', 'css!style/icon.css'],

            init: function($) {
                $.parser.auto = false;
            }
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
                'js/plugins/fullcalendar/fullcalendar',
                'css!js/plugins/fullcalendar/fullcalendar.css'
            ]
        }
    },
    
	map: {
		'*' : {
			'css' : 'js/css.min',
			'text' : 'js/text'
		}
	},
	optimizeCss: "standard",
    name: "app",
	out: "app-built.js"
})