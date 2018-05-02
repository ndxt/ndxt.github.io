define(function(require) {
	require('plugins/extend');
	require('css!widgets/loading/widget.loading.css');
	
	var Widget = require('widgets/widget');
	
	var WidgetLoader = Widget.extend(function() {
		var _self = this;
		
		this.template = require('text!widgets/loading/widget.loading.html');
		
		this.begin = function(percent, message) {
			if (!this.options.show) return;

			this.element.show();
			this.progress(percent, message);
		};

		this.progress = function(percent, message) {
			if (!this.options.show) return;

			this.element.find('.title').text(message);
			this.element.find('.progress-num').text(percent+'%');
		};
		
		this.end = function(message) {
			if (!this.options.show) return;

			this.progress(100, message);
			
			this.element.fadeOut(function() {
				_self.element.remove();
			});
		};
		
		this.error = function(message) {
			if (!this.options.show) return;

			this.element.find('.title').text(message);
		};

		this.defaults = {
			show: true
		};
	});
	
	return WidgetLoader;
});