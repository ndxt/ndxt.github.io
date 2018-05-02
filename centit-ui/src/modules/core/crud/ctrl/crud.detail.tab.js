define(function(require) {
    require('plugins/extend');

    var $ = require('jquery');
    var Page = require('core/page');


    var DetailCtrl = Page.extend(function() {

        this.load = function(panel, data) {
            panel.find('form').form('load', data);
        };

    });

    return DetailCtrl;
});