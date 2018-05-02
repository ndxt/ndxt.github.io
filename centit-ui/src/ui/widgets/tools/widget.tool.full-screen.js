define(function(require) {
    require('plugins/extend');
    require('easyUI');

    var $ = require('jquery');
    var Events = require('core/events');
    var Mustache = require('plugins/mustache.min');
    var Tool = require('widgets/tools/widget.tool');
    var Layout = require('widgets/layout/widget.layout');

    var FullScreen = Tool.extend(function() {

        this.name = 'Tool.FullScreen';

        this.render = function(container) {
            container = this.get(container);

            var opts = this.options;
            var fullScreen = opts.fullScreen;

            var tool = this.element = $(Mustache.render(this.template, this.options))
                .appendTo(container)
                .linkbutton($.extend({}, opts, {
                    text: fullScreen ? opts.restoreScreenText : opts.fullScreenText,
                    iconCls: fullScreen ? opts.restoreScreenIcon : opts.fullScreenIcon
                }))
                .data('fullScreen', fullScreen);

            // 添加事件
            this.attachFullScreenEvent(tool, opts);

            return tool;
        };

        this.attachFullScreenEvent = function(tool, opts) {
            tool.on('click', function() {
                var btn = $(this), full = btn.data('fullScreen');

                // 取消全屏
                if (full) {
                    Events.trigger('restoreScreen.Layout');

                    btn.linkbutton({
                        text: opts.fullScreenText,
                        iconCls: opts.fullScreenIcon
                    });
                }
                // 全屏
                else {
                    Events.trigger('fullScreen.Layout');

                    btn.linkbutton({
                        text: opts.restoreScreenText,
                        iconCls: opts.restoreScreenIcon
                    });
                }

                btn.data('fullScreen', !full);
            });
        };

        this.defaults = {
            url: '#',
            plain: true,
            fullScreen: false,
            fullScreenText: '全屏显示',
            fullScreenIcon: 'icon-black icon-black-full_screen',
            restoreScreenText: '退出全屏',
            restoreScreenIcon: 'icon-black icon-black-zoom_out1'
        };
    });

    return FullScreen;
});