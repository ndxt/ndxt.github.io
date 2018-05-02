define(function(require) {
    require('easyUI');
    require('plugins/extend');
    require('css!widgets/menu-search/widget.menu-search.css');

    var Widget = require('widgets/widget');
    var $ = require('jquery');

    var MenuSearch = Widget.extend(function() {
        var _self = this;

        this.name = 'MenuSearch';

        this.template = require('text!widgets/menu-search/template.menu-search.html');

        this.result = [];

        this.index = 0;

        this.oldValue = '';

        /**
         * 清除搜索结果
         */
        this.clean = function() {
            this.menu.clean();

            this.result.length = 0;
            this.index = 0;
            this.oldValue = '';
        };

        /**
         * 搜索
         * @param value
         */
        this.search = function(value) {
            this.result = this.menu.search(value);
            this.index = 0;
            this.oldValue = value;
        };

        /**
         * 下一个搜索结果
         */
        this.next = function () {
            this.menu.mark(this.result[this.index]);

            if (++this.index > this.result.length - 1) {
                this.index = 0;
            }
        };

        this.render = function(menu) {
            this.element = $(this.template).insertBefore(menu);
            this.element.find('input').textbox(this.options);

            this.attachMenuSearchEvent();

            return this.element;
        };

        /**
         * 添加搜索事件
         */
        this.attachMenuSearchEvent = function() {
            var element = this.element, input = element.find('.textbox-text');

            element.find('.textbox-button').on('click', function() {
                _self.next();
            });

            input.on('keyup', function(e) {
                var value = $(this).val();

                if (!value) {

                    _self.clean();
                }
                else if (e.which == 13) {
                    _self.next();
                }
                else if (value != _self.oldValue) {
                    _self.search(value);
                    _self.next();
                }

            });
        };

        this.defaults = {
            width: 160,
            height: 24,
            prompt: '搜索菜单名称',
            buttonIcon: 'icon-search'
        };

    });

    return MenuSearch;
});