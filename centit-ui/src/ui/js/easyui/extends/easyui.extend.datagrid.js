define([ 'jquery', 'core/core', 'easyUI' ], function($, Core) {
	$.extend($.fn.datagrid.defaults, {
        pagination: true,
		pageSize : 20,
		pageList : [ 10, 20, 50, 100 ]
	});



	$.extend($.fn.datagrid.methods, {
		getRowData : function(jq, index) {
			var rows = $(jq).datagrid('getRows');
			return rows[index];
		},

		getSelectedRowIndex : function(jq) {
			var row = $(jq).datagrid('getSelected');

			if (row) {
				return $(jq).datagrid('getRowIndex', row);
			}

			return -1;
		}
	});

	$.extend($.fn.datagrid.defaults, {
		loader : function(params, success, error) {
			var opts = $(this).datagrid("options");
			
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
	
	$.extend($.fn.datagrid.defaults.editors, {
	    text: {
	        init: function(container, options){
	            var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
	            return input;
	        },
	        destroy: function(target){
	            $(target).remove();
	        },
	        getValue: function(target){
	            return $(target).val();
	        },
	        setValue: function(target, value){
	            $(target).val(value);
	        },
	        resize: function(target, width){
	            $(target)._outerWidth(width).outerHeight(30);
	        }
	    }
	});
});