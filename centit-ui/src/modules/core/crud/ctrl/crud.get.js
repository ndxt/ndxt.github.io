define(function(require) {
    require('plugins/extend');

    var $ = require('jquery');
    var SaveCtrl = require('./crud.save');


    var GetCtrl = SaveCtrl.extend(function() {

        this.onClose = function(table) {
            if (this.data) {
                this.parent.balance -= this.data.money;

                table.datagrid('appendRow', $.extend(this.data, {
                    id: new Date().getTime(),
                    operator: '取款',
                    balance: this.parent.balance,
                    date: new Date()
                }));
            }
        };

    });

    return GetCtrl;
});