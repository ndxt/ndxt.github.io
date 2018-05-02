define(function(require) {
	var Template = require('template');
	var MenuData = require('menu');
	var MenuTab = require('centit/centit.tab');
	var Config = require('config');
	
	var Mustache = require('plugins/mustache.min');
	var MenuTemplate = require('centit/menu/menu.html');
	var MenuCollapseTemplate = require('centit/menu/menu.collapse.html');
	var MenuSearchTemplate = require('centit/menu/menu.search.html');
	var MenuMixTemplate = require('centit/menu/menu.mix.html');
	var MenuTopTemplate = require('centit/menu/menu.top.html');
	
	var MenuCollapseObj, MenuSearchObj, MenuObj, MenuContainer, MenuMixObj, MenuTopObj;
	
	function setSize(height) {
		if (height) {
			MenuObj.accordion('resize', {
				height: height
			});
		}
		else {
			MenuObj.accordion('resize', {
				height: MenuObj.closest('div.layout-body').height() - MenuObj.prev('div.easyui-panel').outerHeight()
			});
		}
	}
	
	function _get(obj) {
		// 字符串转换id
		if ('string' == typeof obj) {
			if (obj.indexOf('#') != 0) {
				obj = '#' + obj;
			}
		}
		
		return $(obj);
	}
	
	/*遍历树*/
	function _walk(datas, fn, level) {
		level = level || 1;
		
		if (datas.length) {
			for (var i=0, data; data = datas[i++];) {
				_walk(data, fn, level);
			}
		}
		else {
			fn.call(datas, datas, level);
			
			if (datas.children) {
				_walk(datas.children, fn, level+1);
			}
		}
	}
	
	function createLeftMenu(obj, options, data) {
		MenuContainer = obj;
		
		// 收缩栏
		if (options.collapsible) {
			MenuCollapseObj = $(Mustache.render(MenuCollapseTemplate)).appendTo(obj);
			MenuContainer = obj.find('div.layout-container');
			
			MenuContainer.width(options.width);
		}
		
		// 菜单搜索
		if (options.hasSearch) {
			MenuSearchObj = $(Mustache.render(MenuSearchTemplate)).appendTo(MenuContainer);
			$.parser.parse(MenuSearchObj);
		}
		
		// 菜单主体
		MenuObj = $(Mustache.render(MenuTemplate)).appendTo(MenuContainer).accordion({
			border: options.border
		});
		
		if (data) {
			// 加载菜单数据
			for (var i=0; i<data.length; i++) {
				var menu = data[i];
				addLeftMenu(MenuObj, menu, i);
			}
		}
		
		// 设置高度
		if (options.setSize) {
			setSize(options.setSize(MenuObj));
		}
		else {
			setSize();
		}
		
	}
	
	function addLeftMenu(obj, menu, index) {
		var treeId = "menu_"+menu.id;
		
		// 一级菜单
		obj.accordion('add', {
			title: menu.text,
			iconCls: menu.icon,
			content: Template("TEMPLATE_TREE", {
				treeId: treeId
			}),
			selected: menu.selected || (index == 0 && !menu.isDashboard)? true : false,
			collapsible: (menu.collapsible == false || menu.isDashboard) ? false : true
		});
		
		// 二级及以后菜单
		_createTreeMenu($('#'+treeId), menu.children);
	}

	function _attachHoverOnTree(obj) {
		obj.find('.tree').on('mouseenter', 'li', function () {
			var node = $(this).find('.tree-node:first');
			//console.log('enter', node);
			var tree = $(this).closest('.tree');
			tree.tree('expand', node[0]);
			tree.tree('select', node[0]);
		}).on('mouseleave', 'li', function () {
			var node = $(this).find('.tree-node:first');
			node.removeClass('tree-node-selected tree-node-hover');
			//console.log('leave', node);
			var tree = $(this).closest('.tree');
			tree.tree('collapse', node[0]);
		});
	};
	
	function _createTreeMenu(obj, data) {
		obj.tree({
			onClick: function(node){
				// 叶子节点是菜单
				if (!node.children || !node.children.length) {
					// 默认TAB页打开
					var pageType = node.attributes ? node.attributes.pageType : 'tab';
					(pageType == undefined) && (pageType = 'tab');
					
					// 默认IFRAME打开
					var external = node.attributes ? node.attributes.external : true;
					(external == undefined) && (external = true);
					
					if (pageType == 'tab') {
						MenuTab.open(node, external);
					}
					
					return;
				}

				node = $(node.target);
				var tree = node.closest('.tree');
				tree.tree('toggle', node[0]);
			},
			formatter: function(node) {
				node.contextPath = Config.ViewContextPath;
				return Template("TEMPLATE_LINK", node);
			},
			data: data
		});
		
		obj.find('div.tree-node').each(function() {
			var node = $(this);
			// 叶子节点
			if (!node.next('ul').length) {
				node.closest('li').addClass('leaf');
			}
		});
	}
	
	function updateLeftMenu(options, data) {
		var length = MenuObj.accordion('panels').length;
		
		for (var i=length-1; i>=0; i--) {
			MenuObj.accordion('remove', i);
		}
		
		// 如果是数组
		if (data.length) {
			// 加载菜单数据
			for (var i=0; i<data.length; i++) {
				var menu = data[i];
				addLeftMenu(MenuObj, menu, i);
			}
		}
		else {
			addLeftMenu(MenuObj, data, 0);
		}
		
		// 设置高度
		// 设置高度
		if (options.setSize) {
			setSize(options.setSize(MenuObj));
		}
		else {
			setSize(MenuObj);
		}

		if (options.active == 'hover') {
			_attachHoverOnTree(MenuObj);
		}
	}
	
	function createMixMenu(top, left, options, data) {
		// 设置大图标
		if (options.largeIcons) {
			var largeIcons = options.largeIcons;
			for (var i=0, node; node = data[i++];) {
				if (largeIcons[node.id]) {
					node.largeIcon = largeIcons[node.id];
				}
			}
		}

		// 创建顶部一级菜单
		MenuMixObj = $(Mustache.render(MenuMixTemplate, {
			menus: data
		})).appendTo(top);
		$.parser.parse(MenuMixObj);
		
		$.each(data, function() {
			var menu = this;
			var id = "#menu_mix_" + menu.id;
			var btn = MenuMixObj.find(id);
			
			if (menu.isDashboard) {
				btn.data('menus', data);
			}
			else {
				btn.data('menus', menu);
			}
		});
		
		MenuMixObj.find('a').on('click', function() {
			var btn = $(this);
			if (btn.hasClass('l-btn-selected')) return;

			var data = btn.data('menus');
			MenuMixObj.find('a').linkbutton('unselect');
			btn.linkbutton('select');
			
			updateLeftMenu(options, data);
		});
		
		// 创建左侧菜单
		createLeftMenu(left, options, data);

		if (options.active == 'hover') {
			_attachHoverOnTree(left);
		}
	}
	
	function createTopMenu(top, options, data) {
		// 设置大图标
		if (options.largeIcons) {
			var largeIcons = options.largeIcons;
			for (var i=0, node; node = data[i++];) {
				if (largeIcons[node.id]) {
					node.largeIcon = largeIcons[node.id];
				}
			}
		}
		
		for (var i = 0, menu; menu = data[i++];) {
			menu.treeId = 'menu_' + menu.id
		}
	
		MenuTopObj = $(Mustache.render(MenuTopTemplate, {
			menus: data,
			tabHeight: options.height || 70
		})).appendTo(top);

		for (var i = 0, menu; menu = data[i++];) {
			_createTreeMenu($('#' + menu.treeId), menu.children);
			$('#' + menu.treeId).tree('collapseAll');
		}

		$.parser.parse(MenuTopObj.parent());
		MenuTopObj.tabs('select', data.length - 1);

		if (options.active == 'hover') {
			_attachHoverOnTree(MenuTopObj);
		}
	}
	
	/**
	 * 初始化菜单
	 */
	function init(options, data) {
		var top, left;
		
		// 默认配置
		options = $.extend({}, Defaults, options);
		
		// 菜单数据
		data = data || MenuData;
		
		options.loader = options.loader || Config.menuLoader;
		if (options.loader) {
			data = options.loader(data);
		}
		
		if (options.icons) {
			var icons = options.icons;
			
			_walk(data, function(node) {
				if (!node.icon && icons[node.id]) {
					node.icon = icons[node.id];
				}
			});
		}
		
		data[options.selected].selected = true;
		
		var layout = options.layout;
		if (layout == 'left') {
			left = _get(options.leftContainer);
			
			// 创建左侧菜单
			createLeftMenu(left, options, data);
		}
		else if (layout == 'mix') {
			left = _get(options.leftContainer);
			top = _get(options.topContainer);
			
			// 创建混合菜单
			createMixMenu(top, left, options, data);
		}
		else if (layout == 'top') {
			top = _get(options.topContainer);
			
			// 创建顶部菜单
			createTopMenu(top, options, data);
		}
		
		
		
		return Menu;
	}
	
	
	var Menu = window.CENTIT_MENU = {
		init: init,
		clean: function() {},
		mark: function() {}
	};
	
	var Defaults = {
	    topContainer: 'header',
	    
	    leftContainer: 'side',
	                
		layout: 'left',
		
		border: false,
		
		hasSearch: true,
		
		collapsible: true,

		active: 'click',
		
		width: 180,
		
		collapsedSize: 10,
		
		selected: 0
	};
	
	return Menu;
});