define(['jquery', 'core/core', 'config', 'plugins/mustache.min', 'core/cache', 'core/cache.dictionary', 'plugins/dateFormat.min', 'easyUI'], 
	function($, Core, Config, Mustache, Cache, DictionaryCache, DateFormat) {
	
	function changeHandler(value) {
		var opts = $.parser.parseOptions(this, ['target', 'key']);
		var fieldOpts = $.parser.parseOptions(this, ['valueField', 'textField']);
		
		// 根据不同类型有不同的 valueField 和 textField
        if (opts.target) {
        	switch(opts.target) {
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
        	
        	opts = $.extend(opts, fieldOpts);
        	
        	var textValue = parseValue.call(this, value, opts);
        	$(this).textbox('setText', textValue);
        }
	}
	
	function parseValue(value, opts) {
	
		var type = opts.target;
		switch(type) {
			case 'dictionary':
				return loader4Dictionary.call(this, value, opts);
			case 'unit':
				opts.key = 'UnitsMap';
				return loader4Cache.call(this, value, opts);
			case 'user':
				opts.key = 'UsersMap';
				return loader4Cache.call(this, value, opts);
			case 'role':
				opts.key = 'RolesMap';
				return loader4Cache.call(this, value, opts);
			case 'cache':
				return loader4Cache.call(this, value, opts);
			case 'date':
				return DateFormat.format.date(value, opts.key)
		}
	}
	
    /**
     * 缓存
     */
    var loader4Cache = function(value, options) {
    	var key = options.key;
    	var data = Cache.get(key) || Cache.get(key+'Map');
    	var textValue;
    	
    	if (data && data[value]) {
    		textValue = data[value][options.textField];
    	}
    	
		return textValue == undefined ? value : textValue;
    };
    
    /**
     * 加载数据字典数据
     */
    var loader4Dictionary = function(value, options) {
    	var key = options.key;
    	var data = DictionaryCache.getMap(key);
    	var textValue, textbox = this;
    	
    	if (data && data[value]) {
    		textValue = data[value];
    	}
    	else if (!data) {
    		Core.ajax(Mustache.render(Config.URL.Dictionary, {
    			code: key
    		})).then(function (data) {
    			data = data || [];
    			DictionaryCache.save(key, data);
    			
    			data = DictionaryCache.getMap(key);
    			if (data && data[value]) {
    	    		$(textbox).textbox('setText', data[value]);
    	    	}
	        });
    	}
    	
		return textValue == undefined ? value : textValue;
    };

	$.extend($.fn.textbox.defaults, {
		height: 30,
		onChange: changeHandler
	});

	$.extend($.fn.numberbox.defaults, {
		height: 30
	});
	
	$.extend($.fn.combobox.defaults, {
		height: 30
	});
	
	$.extend($.fn.datebox.defaults, {
		editable: false,
		height: 30
	});
	
	$.extend($.fn.datetimebox.defaults, {
		editable: false,
		height: 30,
	});
	
	$.extend($.fn.combotree.defaults, {
		height: 30
	});
	
	$.extend($.fn.combo.defaults, {
		height: 30
	});
	
	$.extend($.fn.numberbox.defaults, {
		height: 30
	});
	
	$.extend($.fn.numberspinner.defaults, {
		height: 30
	});
	
	$.extend($.fn.timespinner.defaults, {
		height: 30
	});
});