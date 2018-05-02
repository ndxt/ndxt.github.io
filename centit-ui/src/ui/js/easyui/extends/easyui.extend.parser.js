define([
  'jquery',
  'config',
  'plugins/loading',
  'easyUI',
  'widgets/widget.easyui-radio',
  'widgets/widget.easyui-checkbox'
], function($, Config, Loading) {
	$.parser.plugins = $.parser.plugins.concat(['ccombobox','radio','checkbox']);

	// 扩展panel加载时显示loading，在控制器load结束后才fade loading
	if (Config.System.panelLoading) {
    $.parser.parse = extendParse($.parser.parse);
    // window.requirejs = extendRequireJS(window.requirejs);
  }

  function extendRequireJS(requireJS) {
	  return function (modules, callback) {
	    requireJS(modules, function() {
	      callback.apply(this, arguments);
	      Loading.pop();
      })
    }
  }

  function extendParse(parse) {
	  return function(context) {
      Loading.add(context);
      parse(context);
    }
  }
});
