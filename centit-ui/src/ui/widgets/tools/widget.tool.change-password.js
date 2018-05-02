define(function(require) {
	require('plugins/extend');
    require('easyUI');

    var $ = require('jquery');
    var Config = require('config');
    var Dialog = require('centit/centit.dialog')
    var Mustache = require('plugins/mustache.min');
    var Tool = require('widgets/tools/widget.tool');
    var ChangePasswordCtrl = require('modules/framework/ctrl/changepassword');

    var ChangePassword = Tool.extend(function() {

        this.name = 'Tool.ChangePassword';
        
        this.controller = new ChangePasswordCtrl('change_password');

        this.render = function(container) {
            container = this.get(container);

            var opts = this.options;

            var tool = this.element = $(Mustache.render(this.template, opts))
                .appendTo(container)
                .linkbutton(opts);

            // 添加事件
            this.attachChangePasswordEvent(tool, opts);

            return tool;
        };

        this.attachChangePasswordEvent = function(tool, opts) {
        	var controller = this.controller;
        	var dialogOptions = this.dialogOptions;
        
            tool.on('click', function(e) {
            	e.preventDefault();
                Dialog.open($.extend({}, dialogOptions, opts.dialogOptions), null, controller);
            });
        };
        
        this.defaults = {
        	text: '修改密码',
        	iconCls: 'icon-edit',
        	plain: true,
        	href: '#'
        };
        
        this.dialogOptions = {
        	title: '修改密码',
			width: 500,
			height: 300,
			href: "modules/framework/changepassword.html",
			okValue: "保存",
        };
    });

    return ChangePassword;
});