define(function() {
	(function($){
		/**
		 * Get time in ms
		 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
		 * @type {function}
		 * @return {number}
		 */
		var getTime = (Date.now || function () {
			return new Date().getTime();
		});
		
		/**
		 * Returns a function, that, when invoked, will only be triggered at most once
		 * during a given window of time. Normally, the throttled function will run
		 * as much as it can, without ever going more than once per `wait` duration;
		 * but if you'd like to disable the execution on the leading edge, pass
		 * `{leading: false}`. To disable execution on the trailing edge, ditto.
		 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
		 * @param {function} func
		 * @param {number} wait
		 * @param {Object=} options
		 * @returns {Function}
		 */
		function throttle(func, wait, options) {
			var context, args, result;
			var timeout = null;
			var previous = 0;
			options || (options = {});
			var later = function () {
				previous = options.leading === false ? 0 : getTime();
				timeout = null;
				result = func.apply(context, args);
				context = args = null;
			};
			return function () {
				var now = getTime();
				if (!previous && options.leading === false) previous = now;
				var remaining = wait - (now - previous);
				context = this;
				args = arguments;
				if (remaining <= 0) {
					clearTimeout(timeout);
					timeout = null;
					previous = now;
					result = func.apply(context, args);
					context = args = null;
				} else if (!timeout && options.trailing !== false) {
					timeout = setTimeout(later, remaining);
				}
				return result;
			};
		};
		
		function onScroll(container, selector) {
			var top = container.offset().top, height = container.outerHeight(), bottom = top + height;
			var scrollHeight = container.scrollTop() + height, scrollMax = container[0].scrollHeight;
			
			// 部分包含和全部包含
			var partList = [], allList = [];
			
			container.find(selector).each(function() {
				var allIn = false, partIn = false;
				var el = $(this);
				var t = el.offset().top;
				var b = t + el.outerHeight();
				
				if ((t <= top && b >= bottom) || (t >= top && t <= bottom && b >= top && b <= bottom )) {
					allIn = true;
				}
				
				if ((t <= top && b >= top && b <= bottom) || (t >= top && t <=bottom && b >= bottom)) {
					partIn = true;
				}
				
				if (allIn) {
					allList.push(el);
				}
				else if (partIn) {
					partList.push(el);
				}
			});
			
			var target = null;
			
			// 全部包含选第一个
			if (allList.length) {
				// 翻到底了
				var last = Math.abs(scrollMax - scrollHeight) < options.offset;
				target = last ? allList[allList.length - 1] : allList[0];
			}
			// 部分包含选最后一个
			else {
				target = partList[partList.length-1];
			}
			
			if (target) {
				target.triggerHandler('scrollspy:enter');
			}
			
		}
		
		var options;
		$.fn.scrollspy = function(selector, op) {
			options = op || {
				throttle: 200,
				offset: 10
			};
		
			$(this).each(function() {
				var container = $(this);
				if (container.data('scrollspy')) {
					return;
				}
				
				var throttledScroll = throttle(function () {
					// 通过闭包保存container值
					onScroll(container, selector);
				}, options.throttle);
				
				var readyScroll = function(event){
					$(document).ready(throttledScroll);
				};
				
				container.on('scroll', {
					container: container
				}, readyScroll);
				
				container.on('resize', {
					container: container
				},  readyScroll);
				
				container.data('scrollspy', true);

				// perform a scan once, after current execution context, and after dom is ready
				setTimeout(readyScroll, 0);

			});
			
			return $(this);
		}
		
	})(jQuery);
});