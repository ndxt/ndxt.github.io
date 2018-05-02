define(function(require) {
	require('easyUI');
	require('plugins/extend');

	var $ = require('jquery');
	var Config = require('config');
    var Core = require('core/core');
    var Mustache = require('plugins/mustache.min');
    var Widget = require('widgets/widget');
    
    var CentitDatagrid = Widget.extend(function() {
    	
    });
    
    return CentitDatagrid;
});