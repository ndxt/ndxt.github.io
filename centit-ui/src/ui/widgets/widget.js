define(function(require) {
	require('widgets/jquery.centit-datagrid');
	require('widgets/jquery.centit-treegrid');
	require('widgets/jquery.centit-panel');

    require('plugins/extend');
    require('plugins/jquery.nicescroll.min');

    var $ = require('jquery');

    var Events = require('core/events');
    var Mustache = require('plugins/mustache.min');
    var Utils = require('core/utils');

    var Widget = Class.extend(function() {

        this.events = {};

        /**
         * 构造函数
         * @param options
         * @param data
         */
        this.constructor = function(options, data) {
            this.options = $.extend(true, {}, this.defaults, options);

            this.data = data;

            this.attachEvent();

            if (this.onResize) {
                $(window).on('resize.layout', Utils.throttle(this.onResize, 200));
            }

            return this;
        };

        this.attachEvent = function () {
            var events = this.events;

            for (var event in events) {
                Events.on(event + '.' + this.name, events[event]);
            }
        };

        /**
         * 获取对象
         * @param obj
         * @returns {*|jQuery|HTMLElement}
         */
        this.get = function(obj) {
            if (typeof obj == 'string') {
                if (obj.indexOf('#') != 0) {
                    obj = '#' + obj;
                }
            }

            return $(obj);
        };

        /**
         * 渲染方法
         * @param container
         */
        this.render = function(container) {
            container = this.get(container);

            if (this.template) {
                this.element = $(Mustache.render(this.template, this.options)).appendTo(container);
            }

            return this;
        };

    });

    return Widget;
});