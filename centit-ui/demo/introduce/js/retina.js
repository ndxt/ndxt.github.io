;(function($){
	/**
	 * @author Ti ($.fn.retina)                http://3apaxi.com/      ti.bugmenot@gmail.com
	 * @author Martin Angelov (idea, example)  http://tutorialzine.com/2010/06/apple-like-retina-effect-jquery-css/
	 * @version 0.1 (07.10.2010)
	 */
	$.fn.retina = function(options) {
		options = $.extend(true, {
			// default options:
			enable: true,         // false to deattach retina
			css: {},              // custom css
			appendTo: 'body',     // 
			src: null,			  // src of large iamge (else use rel, src or href attrs)
			radius: null,		  // css radius (null - auto)
			ie: {
				css3pie: 'PIE.htc',  // URI of css3pie (for IE)
				cursor: 'blank.cur' // URI of blank.cur (for IE)
			},
			preload: false	 	  // preload large image?
		}, options)
		
		// attach
		if (options.enable) {
			this.each(function() {
				if (this.retina) this.retina.deattach() // reattach retina
				this.retina = new Retina(this, options.src || $(this).attr('rel') || $(this).attr('src') || $(this).attr('href'), options)
			})
		}
		// deattach
		else {
			this.each(function() {
				if (this.retina) {
					this.retina.deattach()
					delete this.retina
				}
			})
		}
		return this
	}

	var Retina = function(element, largeImage, options) {
		var _this = this
		var node = $(element)
		var glass
		var oldIe

		var init = function() {
			oldIe = $.browser.msie && /^[5-8]\./.test($.browser.version)

			var getCursor = function() {
				if (oldIe && options.ie.cursor) return 'url('+options.ie.cursor+'),crosshair'
				if ($.browser.mozilla || $.browser.opera) return 'none'
                var blankCur='a';
				//var blankCur = 'AAACAAEAICAAAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAgAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAgICAAMDAwAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w=='
				if ($.browser.webkit) blankCur = blankCur.slice(0, 829)+'P'+blankCur.slice(830,1016)+'f'+blankCur.slice(1017)
				return 'url(data:text/plain;base64,'+blankCur+'),none'
			}

			glass = $('<div class="glass"></div>')
			glass.css($.extend(true, {
				display: 'none',
				
				background: 'no-repeat center center white url('+largeImage+')',
				border: '2px solid white',
				
				/* Positioned absolutely, so we can move it around */
				position: 'absolute',
				top: 0,
				left: 0,
				height: 300,
				width: 300,

				/* CSS3 Box Shadow */
				boxShadow: '0 2px 4px #777',
				'-webkit-box-shadow': '0 2px 4px #777',
				'-moz-box-shadow': '0 2px 4px #777',

				cursor: getCursor()
			}, options.css))
			glass.appendTo(options.appendTo)
	
			var radius = options.radius || Math.min(glass.width(),glass.height())/2 +'px'
			glass.css({
				/* CSS3 rounded corners */
				borderRadius: radius,
				'-webkit-border-radius': radius,
				'-moz-border-radius': radius
			})

			if (oldIe && options.ie.css3pie) glass.css('behavior', 'url('+options.ie.css3pie+')')

			$(document).bind('mousemove', _this.move)

			// on load image - recalculate size
			node.find('img').add(node).load(_this.loadSize)
			$(window).resize(_this.loadSize)

			init = $.noop
		}

		var offset, width, height, glassWidth, glassHeight
		_this.loadSize = function() {
			offset = node.offset()
			width = node.width()
			height = node.height()
			glassWidth = glass.width()
			glassHeight = glass.height()
		}

		_this.show = function(e) {
			init()
			_this.loadSize()
			if (oldIe && options.ie.css3pie) glass.show()
			else glass.stop(true, true).fadeIn('fast')
			_this.move(e)
		}
		
		_this.hide = function() {
			if (oldIe && options.ie.css3pie) glass.hide()
			else glass.stop(true, true).fadeOut('fast')
		}
		

		_this.move = function(e) {
			// mouse out

			if (e.pageX < offset.left || e.pageY < offset.top) return _this.hide()
			if (offset.left + width < e.pageX) return _this.hide()
			if (offset.top + height < e.pageY) return _this.hide()

			glass.css({
				// moving the retina div with the mouse
				marginLeft: e.pageX - glassWidth/2, // left and top css not work in ie with css3pie!
				marginTop: e.pageY - glassHeight/2,

				// scrolling the background
				backgroundPosition: ( (100/width) * (e.pageX - offset.left) )+'% '+( (100/height) * (e.pageY - offset.top) )+'%'
			})
		}
		
		_this.deattach = function() {
			node.unbind('mouseenter', _this.show)
			if (glass) {
				glass.remove()
				$(document).unbind('mousemove', _this.move)
				node.find('img').add(node).unbind('load', _this.loadSize)
				$(window).unbind('resize', _this.loadSize)
			}
		}

		node.bind('mouseenter', _this.show)

		// preload
		if (options.preload) $(new Image).attr('src', largeImage)
	}
})(jQuery);
