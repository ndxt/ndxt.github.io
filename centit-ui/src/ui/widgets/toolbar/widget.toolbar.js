define(function(require) {
    require('plugins/extend');

    var $ = require('jquery');
    var Mustache = require('plugins/mustache.min');
    var Widget = require('widgets/widget');

    var Toolbar = Widget.extend(function() {

        this.name = 'Toolbar';

        this.template = '<div class="toolbar {{name}}"></div>';

        this.render = function(container) {
            container = this.get(container);
            var opts = this.options;

            this.element = $(Mustache.render(this.template, {
                name: opts.name
            }))
                .appendTo(container);

            return this.element;
        };

    });

    return Toolbar;
});