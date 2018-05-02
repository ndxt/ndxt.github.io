define(['jquery', 'core/core', 'easyUI', 'plugins/form2object'], function($, Core) {
	
	$.extend($.fn.form.defaults, {
		_method: true
	});

	$.extend($.fn.form.methods, {
		ajax : function(jq, options) {
			options.method = options.method || 'post';
			var form = $(jq);

			// 自动配置是否添加 _method 过滤项
			var foptions = form.data('form').options;
			if (foptions._method) {
				var temp = form.find('input[name=_method]');

				if (temp.length) {
					temp.val(options.method);
				} else {
					form.append('<input type="hidden" name="_method" value="'
							+ options.method + '"/>');
				}
				options.method = 'post';
			}

			var fdata = form.form('value');
			options.data = $.extend(options.data || {}, fdata);

			if (options.onSubmit && !options.onSubmit.call(form)) {
				return;
			}

			return Core.ajax(options.url, options);

		},

		readonly : function(jq, name, flag) {
			if (!name)
				return $(jq);

			if (typeof name === 'string') {
				name = [ name ];
			}

			var form = $(jq);
			flag = flag === false ? false : true;

			$.each(name,
					function() {
						var n = this;
						form.find('input[textboxname=' + n + ']').textbox(
								'readonly', flag);
					})

			return $(jq);
		},

		focus : function(jq) {
			$(jq).find(".textbox-text:not(:disabled)").not(function() {
				return $(this).prop('readonly');
			}).first().focus();

			return $(jq);
		},

		disableValidation : function(jq, name) {
			var form = $(jq);

			// 对全form进行操作
			if (!name) {
				form.find(".validatebox-text:not(:disabled)").validatebox(
						"disableValidation");
				return $(jq);
			}

			if (typeof name === 'string') {
				name = [ name ];
			}
			$.each(name, function() {
				var n = this;
				var obj = form.find('input[name=' + n + ']').prev(
						'.validatebox-text');
				obj.validatebox('disableValidation');
			});
			return $(jq);
		},		
		
		addValidation : function(jq, options) {
			var form = $(jq);

			for ( var name in options) {
				var obj = form.find('input[name=' + name + ']').prev(
						'.validatebox-text');
				if (obj.length) {
					obj.validatebox(options[name]);
				}
			}

			return $(jq);
		},

		value : function(jq) {
			if (window.form2object) {
				return form2object(jq[0]);
			}
		}
	});
});