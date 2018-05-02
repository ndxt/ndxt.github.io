define(function(require) {
	require('plugins/extend');
	var Cache = require('core/cache');
	var Utils = require('core/utils');
	
	var DictionaryCache = Class.extend(function() {
		
		var prefix = 'dictionary.'; 
		
		this.get = function(name) {
			name = prefix + name;
		
			return Cache.get(name);
		};
		
		this.getMap = function(name) {
			name = prefix + name;
		
			var map = Cache.get(name + '.map');
			
			if (!map) {
				
				var items = Cache.get(name);
				if (!items) return undefined;
				
				map = items.reduce(function(tempObj, item) {
	        		tempObj[item.dataCode] = item.dataValue;
	        		return tempObj;
	        	}, {});
				
				Cache.save(name + '.map', map);
			}
			
			return map;
		};
		
		this.getTree = function(name) {
			name = prefix + name;
		
			var tree = Cache.get(name + '.tree');
			
			if (!tree) {
				
				var items = Cache.get(name);
				if (!items) return undefined;
				
				tree = Utils.makeTree(items.map(function(item) {
					item.id = item.dataCode;
					item.text = item.dataValue;
					item.icon = item.extraCode2;
					return item;
				}), function(p) {
					return this.extraCode == p.dataCode;
				});
				
				Cache.save(name + '.tree', tree);
			}
			
			return tree;
		};
		
		this.save = function(name, value) {
			name = prefix + name;
			
			Cache.save(name, value);
		};
	});
	
	return new DictionaryCache();
});