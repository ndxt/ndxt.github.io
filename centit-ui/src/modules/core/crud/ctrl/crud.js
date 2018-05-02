define(function(require) {
    require('plugins/extend');
    var Page = require('core/page');

    var SaveCtrl = require('../ctrl/crud.save');
    var GetCtrl = require('../ctrl/crud.get');
    var DetailCtrl = require('../ctrl/crud.detail');
    
    var DetailTabCtrl = require('../ctrl/crud.detail.tab');
    var DetailState0Ctrl = require('../ctrl/crud.detail.state0');
    var DetailState13Ctrl = require('../ctrl/crud.detail.state13');
    var DetailState4Ctrl = require('../ctrl/crud.detail.state4');

    var CRUD = Page.extend(function() {

        this.injecte([
            new SaveCtrl('save'),
            new GetCtrl('get'),
            new DetailCtrl('detail'),
            
			new DetailTabCtrl('detail_tab'),
			new DetailState0Ctrl('detail_state_0'),
			new DetailState13Ctrl('detail_state_13'),
			new DetailState4Ctrl('detail_state_4')
        ]);

        this.load = function(panel) {

            var table = panel.find('table');

            this.balance = 1000;

            table.cdatagrid({
                controller: this
            });
        };

    });

    return CRUD;
});