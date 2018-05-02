define([ 'jquery', 'core/core', 'easyUI' ], function($, Core) {
	$.extend($.fn.treegrid.defaults, {
		loader : function(params, success, error) {
			var opts = $(this).treegrid("options");
			
			if (!opts.url) {
				return false;
			}
			
			Core.ajax(opts.url, {
				data: params
			}).then(function(data) {
				success(data);
		    }, function() {
		    	error.apply(this, arguments);
		    });
		}
	});
});