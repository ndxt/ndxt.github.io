/**
 * @https://github.com/phstc/jquery-dateFormat
 * 
 * yy = short year

	yyyy = long year
	
	M = month (1-12)
	
	MM = month (01-12)
	
	MMM = month abbreviation (Jan, Feb … Dec)
	
	MMMM = long month (January, February … December)
	
	d = day (1 - 31)
	
	dd = day (01 - 31)
	
	ddd = day of the week in words (Monday, Tuesday … Sunday)
	
	E = short day of the week in words (Mon, Tue … Sun)
	
	D - Ordinal day (1st, 2nd, 3rd, 21st, 22nd, 23rd, 31st, 4th…)
	
	h = hour in am/pm (0-12)
	
	hh = hour in am/pm (00-12)
	
	H = hour in day (0-23)
	
	HH = hour in day (00-23)
	
	mm = minute
	
	ss = second
	
	SSS = milliseconds
	
	a = AM/PM marker
	
	p = a.m./p.m. marker
 */
define(function(require) {
	var Filter = require('core/filter/filter');
	var DateFormat = require('plugins/dateFormat.min');

	/**
	 * 日期过滤器
	 */
	var FilterDate = Filter.extend(function() {
		var filter = this;

		// @override
		this.convert = function(format, value) {
			if (!value) return value;
		
			return DateFormat.format.date(value, format);
		};
	});
	
	return new FilterDate();
});