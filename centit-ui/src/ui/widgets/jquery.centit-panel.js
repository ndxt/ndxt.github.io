define(function(require) {
	var $ = require('jquery');
	var Mustache = require('plugins/mustache.min');
	var Dialog = require('centit/centit.dialog');
	
	var ToolbarTemplate = '<div id="{{id}}"></div>';
	
	// 解析弹出框按钮
    var parseDialogButton = function (btn, opts, ctrl) {
    	var panel = $(this);
    	
    	var title = Mustache.render(opts.title, ctrl.data), id = Mustache.render('dialog_{{id}}', {
            id: ctrl.id
        });
    	
        btn.attr('title', title);
    	
        btn.on('click', function(event) {
        	
            event.preventDefault();
            
            if (ctrl.beforeLoad && ctrl.beforeLoad.call(this, ctrl.data) === false) {
                return;
            }
        	
        	Dialog.open({
                id: id,
                title: title,

                href: opts.href,
                width: opts.width,
                height: opts.height,

                // 提交按钮
                okValue: opts.btnValue,
                
                ok: function () {
                    return ctrl.submit.call(ctrl, ctrl.panel, ctrl.data, function () {
                        Dialog.close(id);
                    });
                },

                // 页面加载事件
                onLoad: ctrl.init,

                // 关闭事件
                onClose: function (data) {
                    ctrl.onClose.call(ctrl, panel, ctrl.data);
                }
            }, ctrl.data);
        });

        return btn;
    };
    
    // 解析确认按钮
    var parseConfirmButton = function (btn, opts, ctrl) {
        var panel = $(this), trigger = opts.trigger;
        var title = opts.title, data = ctrl.data;
		title = Mustache.render(title, $.extend({}, data));
		
		btn.attr('title', title);

        btn.on('click', function(event) {
        	event.preventDefault();
            
			if (ctrl.beforeLoad && ctrl.beforeLoad.call(this, ctrl.data) === false) {
			    return;
			}
			
			$.messager.confirm('确认', title, function (r) {
                if (r) {
                    ctrl.submit.call(ctrl, panel, ctrl.data);
                }
            });
        });

        return btn;
    };
	
	var parseButton = function(ctrl, panel) {
		var btn = $(this).clone();
		var opts = parseButtonOptions(this);
		var subCtrl = ctrl.controllers[opts.rel];
		
		subCtrl.data = ctrl.data;
		if (opts.target == 'dialog') {
			parseDialogButton.call(panel, btn, opts, subCtrl);
		}
		else if (opts.target == 'confirm') {
			parseConfirmButton.call(panel, btn, opts, subCtrl);
		}
		
		return btn.addClass('easyui-linkbutton');
	};
	
	// 解析按钮
	var parseButtonOptions = function (target) {
        return $.extend({}, $.fn.linkbutton.parseOptions(target), $.parser.parseOptions(target, [
            'rel', 'trigger', 'target', 'title', 'warn', 'href', 'btnValue',
            {width: 'number', height: 'number'}
        ]));
    };
	
    // 构建工具栏
    var buildToolbar = function (buttons, options) {
    	var controller = options.controller.controllers[options.rel];
    	var panel = $(this);
    	
    	if (buttons && buttons.length) {
    		var toolbar = $(Mustache.render(ToolbarTemplate, {
    			id: panel.attr('id')+'_toolbar'
    		})).insertAfter(panel);
    		
    		buttons.each(function () {
	            var el = $(this);
	            
	            toolbar.append(parseButton.call(el[0], controller, panel));
	        });
    		
    		$.parser.parse(toolbar);
	        buttons.remove();
	        options.footer = '#' + panel.attr('id') + '_toolbar'; 
    	}

        return buttons;
    };
	
    // 构建面板
	function buildPanel(target) {
		var opts = $.data(target, 'cpanel').options;
		
		var ctrl = opts.controller.controllers[opts.rel];
		var data = ctrl.data = ctrl.parent.data;
        
		opts.onLoad = function () {
            ctrl.init.call(this, $(target), data);
        };
        
        var buttons = $(target).find('[toolbar]');
		buildToolbar.call(target, buttons, opts);
		
		$(target).panel(opts).data('cpanel', {
			options: opts
		});
	}
	
	$.fn.cpanel = function(options, panel) {
		if (typeof options == 'string') {
            var method = $.fn.cpanel.methods[options];
            if (method) {
                return method.apply(this[0], Array.prototype.slice.call(arguments, 1));
            } else {
                return this.panel(options, param);
            }
        }
		
        options = options || {};
        
        return this.each(function () {
            var state = $.data(this, 'cpanel');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'cpanel', {
                    options: $.extend({}, $.fn.cpanel.defaults, $.fn.cpanel.parseOptions(this), options)
                });
            }

            buildPanel(this);
        });
	};
	
	$.fn.cpanel.parseOptions = function (target) {
        return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, ["rel"]));
    };
});