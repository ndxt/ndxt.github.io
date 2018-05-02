define(function(require) {
    require('plugins/extend');

    var $ = require('jquery');
    var Page = require('core/page');


    var SaveCtrl = Page.extend(function() {

        this.load = function(panel) {
            this.data = null;

            var form = panel.find('form');
            form.form('disableValidation')
                .form('focus');
        };

        this.submit = function(panel, data, closeCallback) {
            var form = panel.find('form');

            form.form('enableValidation');
            var isValid = form.form('validate');

            if (isValid) {
                this.data = {
                    money: parseInt(form.form('value').money)
                }

                closeCallback();
            }

            return false;
        };

        this.onClose = function(table) {
            if (this.data) {
                this.parent.balance += this.data.money;

                table.datagrid('appendRow', $.extend(this.data, {
                    id: new Date().getTime(),
                    operator: '存款',
                    balance: this.parent.balance,
                    date: new Date()
                }));
            }
        };

    });

    return SaveCtrl;
});