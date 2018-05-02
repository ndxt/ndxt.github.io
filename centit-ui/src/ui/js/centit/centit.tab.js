define(function(require) {
	var Template = require('template');
	var Config = require('config');
	
	var IdPrefix = "menu_tab_";
	
	// 菜单TAB
	var Tab;
	
	// 菜单TAB右键菜单
	var ContextMenu;
	
	// 菜单TAB右侧选择菜单
	var RightMenu;
	
	function _getTabIndex(tab) {
		if (!tab) {
			tab = Tab.tabs('getSelected');
		}
		
		if (typeof tab == 'string') {
			var panel = Tab.find('#'+IdPrefix+tab);
			return Tab.tabs('getTabIndex', panel);
		}
		else if (typeof tab == 'object') {
			return Tab.tabs('getTabIndex', tab);
		}
		
		return -1;
	} 
	
	function _getTabPanel(tab) {
		if (tab == undefined) {
			return Tab.tabs('getSelected');
		}
		
		if (typeof tab == 'string') {
			return Tab.find('#'+IdPrefix+tab);
		}
		else if (typeof tab == 'number') {
			return Tab.tabs('getTab', tab);
		}
	}
	
	function reload(tab, href) {
		var tab = _getTabPanel(tab);
		if (!tab) return;
		
		var iframe = tab.find('iframe.menu-iframe');
		
		// 是iframe
		if (iframe.length) {
			if (!href) {
				iframe.contents()[0].location.reload();
			}
			else {
				iframe.contents()[0].location.href = href;
			}
		}
		// 是panel
		else {
			tab.panel('refresh', href);
		}
	}
	
	function close(tab) {
		var tab = _getTabPanel(tab);
		if (!tab) return;
		
		var index = Tab.tabs('getTabIndex', tab);
		var closable = tab.panel('options').closable;
		if (closable) {
			Tab.tabs('close', index);
		}
	}
	
	function closeAll(tab) {
		var tabs = Tab.tabs('tabs').length;
		
		for (var i=tabs-1; i>=0; i--) {
			var tab = _getTabPanel(i);
			var closable = tab.panel('options').closable;
			if (closable) {
				Tab.tabs('close', Tab.tabs('getTabIndex', tab));
			}
		}
	}
	
	function closeOthers(tab) {
		var tabs = Tab.tabs('tabs').length;
		var index = _getTabIndex(tab);
		
		for (var i=tabs-1; i>=0; i--) {
			var tab = _getTabPanel(i);
			var closable = tab.panel('options').closable;
			if (index !== i && closable) {
				Tab.tabs('close', Tab.tabs('getTabIndex', tab));
			}
		}
	}
	
	/**
	 * 初始化右键菜单
	 */
	function initContextMenu() {
		ContextMenu = $('#menu_tab_menu').menu({
			onClick: function(item) {
				MenuTab[item.name].call();
			}
		});
		
		Tab.on('contextmenu', function(e){
			e.preventDefault();
			
			var closable = $(this).tabs('getSelected').panel('options').closable;
			
			// 判断关闭按钮是否可用
			ContextMenu.find('div.close').each(function() {
				// 不可用
				if (!closable) {
					ContextMenu.menu('disableItem', this);
				}
				// 可用
				else {
					ContextMenu.menu('enableItem', this);
				}
			});
			
			ContextMenu.menu('show', {
				left: e.pageX,
				top: e.pageY
			});
		});
	}
	
	/**
	 * 初始化右侧菜单
	 */
	function initRightMenu() {
		RightMenu = $('#tab_tools_menu').menu({
			onShow: function() {
				var self = $(this);
				var selectedIndex = Tab.tabs('getTabIndex', Tab.tabs('getSelected'));
				
				self.find('div.menu-item').not('.close').each(function(index) {
					$(this).data('index', index);
					
					if (index == selectedIndex) {
						self.menu('setIcon', {
							target: this,
							iconCls: 'icon-ok'
						});
					}
					else {
						self.menu('setIcon', {
							target: this,
							iconCls: 'icon-null'
						});
					}
				});
			},
			
			onClick: function(item) {
				
				if (item.name) {
					return MenuTab[item.name].call();
				}
				
				Tab.tabs('select', $(item.target).data('index'));
			}
		});
	}
	
	/**
	 * 初始化
	 */
	function init(tab, options, data) {
		options = $.extend({}, Defaults, options);
	
		// 字符串转换id
		if ('string' == typeof tab) {
			if (tab.indexOf('#') != 0) {
				tab = '#' + tab;
			}
		}
		Tab = $(tab);
		
		// 初始化右键菜单
		initContextMenu();
		
		// 初始化右侧菜单
		initRightMenu();
		
		Tab.tabs({
			height: options.height,
			
			tabHeight: options.tabHeight,
			
			pill: options.pill ? true : false,
		
			onContextMenu: function(e, title, index) {
				Tab.tabs('select', index);
			},
			
			onSelect: function(title, index) {
				var tab = $(this).tabs('getTab', index);
				var id = tab.panel('options').id;
				
				if (id) {
					id = id.substr(IdPrefix.length);
					
					window.CENTIT_MENU.clean();
					window.CENTIT_MENU.mark(id);
				}
			},
			
			onClose: function(title, index) {
				RightMenu.menu('removeItem', RightMenu.find('div.menu-item').not('.close')[index]);
			},
				
			onAdd: function(title, index) {
				
				var body = Tab.tabs('getTab', index);
				body.addClass('menu-tab-body');

				RightMenu.menu('appendItem', {
					text: title
				});
			}
		});
		
		return MenuTab;
	}
	
	function open(tab, external) {
		
		var index = _getTabIndex(tab.id);
		tab.contextPath = Config.ViewContextPath;
		
		// 已经打开
		if (index > -1) {
			Tab.tabs('select', index);
			MenuTab.reload(null, tab.contextPath + tab.url);
		}
		else {
			
			Tab.tabs('add',{
				id: IdPrefix + tab.id,
			    title: tab.text,
			    content: external ? Template("TEMPLATE_IFRAME", tab) : undefined,
			    href: !external ? tab.contextPath + tab.url : undefined,
			    closable: tab.closable === false ? false : true
			});
		}
		
	}
	
	var MenuTab = {
		init: init,
		open: open,
		reload: reload,
		closeOthers:closeOthers,
		closeAll:closeAll,
		close:close
	};
	
	var Defaults = {
		height: 26,
		tabHeight:25
	};
	
	window.MenuTab = MenuTab;
	return MenuTab;
});