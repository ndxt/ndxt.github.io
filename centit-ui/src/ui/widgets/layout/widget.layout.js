define(function(require) {
    require('plugins/extend');
    require('easyUI');

    var $ = require('jquery');
    var Widget = require('widgets/widget');

    var Layout = Widget.extend(function() {
        var body = this.element;
        var _self = this;

        this.name = 'Layout';

        this.events = {
            collapseMenu: function() {
            
            	if (body.find('.layout-expand-west:first').is(':visible')) {
            		return;
            	}
            
                body.layout('collapse', 'west');
            },

            expandMenu: function() {
            
            	if (body.find('.layout-expand-west:first').is(':hidden')) {
            		return;
            	}
            
                body.layout('expand', 'west');
            },

            fullScreen: function(e, height) {
                body.addClass('full-screen');

                _self.resizePanel('north', undefined, height || 33);
                body.layout('collapse', 'north');
                _self.resizePanel('south', undefined, 1);

                //body.layout('collapse', 'west');
            },

            restoreScreen: function() {
                body.removeClass('full-screen');

                //body.layout('expand', 'west');
                body.layout('expand', 'north');
                _self.restorePanel('north');
                _self.restorePanel('south');
            },

            hideMenu: function() {

            },

            showMenu: function() {

            }
        };

        this.resizePanel = function(panel, width, height) {
            panel = body.layout('panel', panel);
            panel.data('height', panel.height());
            panel.panel('resize', {
                width: width,
                height: height
            });
            body.layout('resize');
        };

        this.restorePanel = function(panel) {
            panel = body.layout('panel', panel);
            var height = panel.data('height');

            if (height) {
                panel.panel('resize', {
                    height: height
                });
                body.layout('resize');
            }
        };

        this.render = function() {
            body = this.element = $('body').layout();

            var opts = body.layout('panel', 'center').data('panel').options;
            opts.onResize = function(width, height) {
                $(window).trigger('resize.layout', [width, height]);
            };

            return body;
        };

        this.defaults = {

        };
    });

    return Layout;
});