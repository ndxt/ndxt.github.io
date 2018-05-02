define(['jquery', 'core/core', 'easyUI'], function($, Core) {
	
	$.extend(true, $.fn.tree.defaults, {
		
		method: 'get',
		
		loader : function(params, success, error) {
			var opts = $(this).tree("options");
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