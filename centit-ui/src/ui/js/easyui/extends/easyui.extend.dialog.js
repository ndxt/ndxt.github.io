define(['jquery', 'easyUI'], function($) {
	
	/**
	 * 重写easyui-dialog的close方法
	 * 
	 * 可以传入第三个参数data，在onBeforeClose事件中调用
	 */
	$.extend($.fn.dialog.methods, {
		close : function(jq, force, data) {
			return jq.each(function() {
				var el = this;
				var opts = $.data(this, "panel").options;
				var panel = $.data(this, "panel").panel;
				if (force != true) {
					if (opts.onBeforeClose.call(this, data) == false) {
						return;
					}
				}
				panel.stop(true, true);
				panel._size("unfit");
				if ($.isFunction(opts.closeAnimation)) {
					opts.closeAnimation.call(this, cb);
				} else {
					switch (opts.closeAnimation) {
					case "slide":
						panel.slideUp(opts.closeDuration, cb);
						break;
					case "fade":
						panel.fadeOut(opts.closeDuration, cb);
						break;
					case "hide":
						panel.hide(opts.closeDuration, cb);
						break;
					default:
						panel.hide();
						cb();
					}
				}

				function cb() {
					opts.closed = true;
					var wopts = $.data(el, "window").options;
					var win = $.data(el, "window");

					if (win.shadow) {
						win.shadow.hide();
					}
					if (win.mask) {
						win.mask.hide();
					}
					wopts.onClose.call(this, data);
				}
			});
		}
	});
});