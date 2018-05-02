define(function(require) {
    require('plugins/mustache.min');

    var Widget = require('widgets/widget');

    var MenuContainer = Widget.extend(function() {
        this.name = 'MenuContainer';

        /**
         * 模板
         * @type {exports}
         */
        this.template = '<div class="layout-container"></div>';

        this.templateCollapse = '<div class="layout-collapse"><div class="layout-collapse-center" title="收缩面板"></div></div>'

        this.render = function(container) {
            if (!container) return;
            container = this.get(container);

            var opts = this.options;
            var element = this.element = $(this.template).appendTo(container);

            if (opts.collapsible) {
                element.width(opts.width - opts.collapsedSize);
                var collapse = $(this.templateCollapse).insertAfter(element).width(opts.collapsedSize);

                collapse.find('.layout-collapse-center').attr('title', opts.collapseTitle);
                // TODO .on('click', collapseMenu);
            }
            else {
                element.width(opts.width);
            }

            return this;
        };

        this.defaults = {
            width: 190,
            collapsedSize: 10,
            collapsible: true,
            collapseTitle: '收缩面板'
        };

    });

    return MenuContainer;
});