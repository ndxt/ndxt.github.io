define([ 'jquery', 'core/core', 'easyUI' ], function($) {

	$.extend($.fn.panel.defaults,{
		loader:function(params, success) {
			var opts = $(this).panel("options");
			if (!opts.href) {
				return false;
			}
			$.ajax({
				type: opts.method,
				url: opts.href,
				cache: false,
				data: params,
				dataType: "html",
				success: function(data) {
					success(data);
				},
				error: function() {
					success("<div style='width: 100%;background: #bee8ff;height: 100%;'>"+
								"<div style=\"background:url('"+window.ViewContextPath+"images/bg.png') center center no-repeat;"+
									"width: 1280px;height:100%;position: relative;margin: auto;\">"+
								"</div>"+
							"</div>");
				}
			});
		}
	});

});
