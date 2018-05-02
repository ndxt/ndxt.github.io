define(function(require) {
	
	require('plugins/es6-promise.min');
	
	require('plugins/jquery.json-2.3.min');
	
	var pinyin = require('plugins/pinyin');
	
	var Ajax = require('core/ajax');
	
	var Utils = require('core/utils');
	
	var Config = require('config');
	
	var $ = require('jquery');
	
		
	if (!String.prototype.has) {
		String.prototype.has = function(q) {
			var str = this+"";
		
			if (str === undefined || str === "") return false;
			
			if (str.toLowerCase().indexOf(q.toLowerCase()) > -1) {
				return true;
			}
			else if (pinyin.getCamelChars(str).toLowerCase().indexOf(q.toLowerCase()) > -1) {
				return true;
			}
			else if (pinyin.getFullChars(str).toLowerCase().indexOf(q.toLowerCase()) > -1) {
				return true;
			}
			
			return false;
		};
	}
	
	if (Config.System.AjaxSend) {
		$(document).bind('ajaxSend', Config.System.AjaxSend);
	}
	if (Config.System.AjaxComplete) {
		$(document).bind('ajaxComplete', Config.System.AjaxComplete);
	}
	
	/**
	 * CentitUI 核心组件
	 */
	var Core = {};
	
	/**
	 * 封装Ajax.ajax方法
	 * 可以在config里自定义对数据的处理方法
	 */
	Core.ajax = function(url, options) {
		var AjaxLoader = Config.System.AjaxLoader;
		var AjaxErrorLoader = Config.System.AjaxErrorLoader;
		
		url = addPrefix(url);
	
		return Ajax.ajax(url, options)
			.then(
				// 处理正常数据
				function(response) {
					if (AjaxLoader && $.isFunction(AjaxLoader)) {
						return AjaxLoader.apply(this, arguments);
					}
					
					return Promise.resolve(response);
				}, 
				
				// 处理错误数据
				function(error) {
					if (AjaxErrorLoader && $.isFunction(AjaxErrorLoader)) {
						return AjaxErrorLoader.apply(this, arguments);
					}
					
					return Promise.reject(error);
				}
			);
	};
	
	function addPrefix(url) {
		var ctx = Config.ContextPath;
		
		// 非 http 完整请求
		// 没有以 ctx 开头
		if (ctx && url.indexOf('http://') < 0 && url.indexOf(ctx) != 0) {
			url = ctx + url;
		}
		
		return url;
	}
	
	/**
	 * 封装Ajax.getJSON方法
	 * 可以在config里自定义对数据的处理方法
	 */
	Core.getJSON = function(url, options) {
		options = $.extend({}, options, {
			method: 'get',
			dataType : 'json'
		});
		
		return Core.ajax(url, options);
	};
	
	Core.reload = function(url) {
		if (!url) {
			window.location.reload();
		}
		
		else {
			window.location.href = Config.ContextPath+url;
		}
	};
	
	Core.height = function(obj, panel) {
		panel = panel || $('#menu_tab').tabs('getSelected');
		var height = panel.height();

		if (typeof obj == 'string' || typeof obj == 'object') {
			panel.find(obj).each(function() {
//				console.log($(this).height(), $(this).outerHeight());
			
				height = height - $(this).outerHeight();
			});
		}
		else if (typeof obj == 'number') {
			height = height - obj;
		}

		return height;
	};
	
	Core.parseURL = function() {
		var panel = $('#menu_tab').tabs('getSelected')
				url = panel.panel('options').href;
		
		// div or iframe
		url = url || location.href;
		
		return Utils.parseURL(url);
	}
	
	return Core;
});