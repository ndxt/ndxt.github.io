define(function(require) {
    require('easyUI');
    require('plugins/extend');

    var Widget = require('widgets/widget');
    var Mustache = require('plugins/mustache.min');
    var $ = require('jquery');

    var Tool = Widget.extend(function() {
        this.name = 'Tool';

        this.template = '<a href="{{url}}" class="easyui-linkbutton"></a>';

        this.render = function(container) {
            container = this.get(container);

            var btn = this.element = $(Mustache.render(this.template, this.options))
                .appendTo(container).linkbutton(this.options);

            return btn;
        };

        this.defaults = {
            plain: true,
            url: '#'
        };
    });

    return Tool;
});