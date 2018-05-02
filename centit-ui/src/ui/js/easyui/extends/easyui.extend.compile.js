define(['jquery', 'core/cache', 'easyUI'], function($, Cache) {
	var parse = $.parser.parse;

	$.parser.parse = function(context) {

		if (context && context.find('auth')) {
			context.find('[auth]').each(function() {
				var value = $(this).attr('auth'),
					result = auth(value);

				if (!result) $(this).remove();
			});
		}

		parse.call(this, context);
	};

	function auth(value) {
		if (!value) return false;

		return Cache.get('$UserOpts')[value] || Cache.get('$UserRoles')[value];
	}
});