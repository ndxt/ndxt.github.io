define(function(require) {
    require('easyUI');
    require('plugins/extend');
    require('yepnope');

    var Mustache = require('plugins/mustache.min');
    var Config = require('config');
    var Tool = require('widgets/tools/widget.tool');
    var $ = require('jquery');

    var Colors = Tool.extend(function() {
        this.name = 'Tool.Color';

        var TEMPLATE_COLORS = require('text!widgets/tools/template.tool.colors.html');

        this.render = function(container) {
            container = this.get(container);

            var opts = this.options;

            // 默认选择第一个颜色
            var colors = this.options.colors;
            colors.forEach(function(color) {
                if (opts.current == color.id) {
                    color.selected = true;
                }
                else {
                    color.selected = false;
                }
            });

            var btn = this.element = $(Mustache.render(this.template, opts))
                .appendTo(container)
                .linkbutton(this.options)
                .tooltip({
                    showEvent: 'click',

                    content: $(Mustache.render(TEMPLATE_COLORS, {
                        colors: colors
                    })).find('a').linkbutton({
                        onClick: function() {
                            var url = $(this).data('url');

                            // 选中的颜色与当前颜色一样，忽略
                            var currentLink = $('link[name=color]');
                            if (currentLink.attr('href') == url) {
                                return;
                            }

                            // 切换css
                            try {
                                //$.messager.progress({});
                                yepnope.injectCss(Config.ViewContextPath+url, function() {
                                    //$.messager.progress('close');
                                    currentLink.remove();
                                    $('link[name=colorTemp]').attr('name', 'color');
                                }, {name: "colorTemp"});
                            }
                            catch (e) {
                                //$.messager.progress('close');
                            }
                        }
                    }),

                    // 第一次展示时渲染内容
                    onUpdate: function(content) {
                        content.each(function() {
                            var a = $(this);
                            a.find('.color').css({
                                background: a.data('color')
                            });
                        });
                    },

                    onShow: function(){
                        var t = $(this);
                        t.tooltip('tip').unbind().bind('mouseenter', function(){
                            t.tooltip('show');
                        }).bind('mouseleave', function(){
                            t.tooltip('hide');
                        });
                    }
                });

            return btn;
        };

        this.defaults = {
            url: '#',
            iconCls: 'icon-tip',
            text: '换肤',
            plain: true
        };
    });

    return Colors;
});