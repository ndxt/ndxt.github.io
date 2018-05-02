define(function (require) {
    require('core/cache');
    var Config = require('config');
    var DictionaryCache=require('core/cache.dictionary');
    var Core=require('core/core');
    var Mustache = require('plugins/mustache.min');
    var template = require('text!widgets/template.easyui-radio.html');

    $.fn.radio = function () {//定义扩展组件

        //当该组件在一个页面出现多次时，this是一个集合，故需要通过each遍历。
        return this.each(function () {
        	var _obj=$(this);
    		var _key=_obj.attr('key');
    		var _classname=_obj.attr('class');
    		var _name=_obj.attr('name');
    		_obj.hide();

    		var data = DictionaryCache.get(_key);
        	// 没有数据字典缓存数据
        	if (!data) {
    			Core.ajax(Config.ContextPath+'system/cp/dictionary/'+_key)
    		    .then(function(data) {
    		    	var inputlist = $(Mustache.render(template, {inputs:data,classname:_classname,name:_name}));
    			 	_obj.after(inputlist);
    	        	$.parser.parse(inputlist);
    	        	data = data || [];
        			DictionaryCache.save(_key, data);
    		    }, function () {
    	            error.apply(this, arguments);
    	        });
        	}
        	else {
        		var inputlist = $(Mustache.render(template, {inputs:data,classname:_classname,name:_name}));
    		 	_obj.after(inputlist);
        	}
        });
    };

});
