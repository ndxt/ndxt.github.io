define(function(require) {
	require('plugins/extend');
	
	var Mustache = require('plugins/mustache.min');
	
	var Menu = require('widgets/menu/widget.menu');
	var MenuContainer = require('widgets/menu/widget.menu.container');
	
	var Events = require('core/events');
	var Utils = require('core/utils');
	
	// 继承自普通Menu组件
	var MixMenu = Menu.extend(function() {
		var _self = this;
		
		this.top_template = require('text!widgets/menu/mix/template.mix-menu.html');
		
		// 顶层菜单
		this.topMenu;
		
		// 创建首页菜单
		function createDashboardMenu(container, data, opts) {
			// 首页时显示的菜单
			var dashboardMenuFilter = opts.dashboardMenuFilter, dashboardData;
		
			if (opts.dashboard) {
				
				// 显示全部菜单
				if ('all' === dashboardMenuFilter) {
					dashboardData = data;
				}
				// 通过id过滤显示菜单
				else if ($.isArray(dashboardMenuFilter)) {
					
					dashboardData = [];
					
					Utils.walkTree(data, function(node) {
						if (dashboardMenuFilter.indexOf(node.id) > -1) {
							dashboardData.push(node);
						}
					});
				
				}
				// 自定义函数过滤
				else if ($.isFunction(dashboardMenuFilter)) {
					dashboardData = dashboardMenuFilter(data);
				}
				
				// 没有首页菜单数据
				if (!dashboardData) {
					opts.whenDashboard = 'hide'
				}
				else {
					return this.createMenu(container, dashboardData, opts, opts.dashboard.id);
				}
			}
		}
		
		/**
         * 创建菜单
         * @param container
         * @param data
         * @param opts
         * @returns {*|jQuery}
         */
        this.createMixMenu = function(container, data, opts) {
        	
        	// 渲染顶层菜单
        	var topMenu = this.topMenu = $(Mustache.render(this.top_template, {
        		menus: data,
        		dashboard: opts.dashboard
        	})).appendTo(opts.top);
        	
        	$.parser.parse(topMenu);
        	
        	// 创建首页菜单
        	var dashboardMenu = createDashboardMenu.call(this, container, data, opts);
        	
        	
        	var tempOpts = $.extend({}, opts);
        	delete tempOpts.dashboard;
        	
        	// 创建其他菜单
        	data.forEach(function(node) {
        		node.children.forEach(function(n, index) {
					n.selected = 0 == index
        		});
        	
        		// 其他菜单暂时先隐藏
        		_self.createMenu(container, node.children, tempOpts, node.id).hide();
        	});
            
            return dashboardMenu;
        };
		
        /**
         * 解析菜单图标
         * @param data
         * @param icons
         */
        this.parseIcons = function(data, opts) {
        	// 普通菜单图标
        	var icons = opts.icons;
            if (icons && !$.isEmptyObject(icons)) {
                // 遍历树节点替换图标
                Utils.walkTree(data, function(node) {
                    var icon = icons[node.id];

                    if (!node.icons && icon) {
                        node.icon = icon;
                    }

                    node.leaf = !!(!node.children || !node.children.length);
                });
            }
            
            // 顶部大图标
            var largeIcons = opts.largeIcons;
            if (largeIcons && !$.isEmptyObject(largeIcons)) {
            	for (var i=0, node; node = data[i++];) {
    				if (largeIcons[node.id]) {
    					node.largeIcon = largeIcons[node.id];
    				}
    			}
            }
        };
        
        this.attachTopMenuEvent = function(container, opts) {
        	var menus = container.find('div.accordion');
        
        	this.topMenu.find('a').click(function() {
        		var btn = $(this), name = btn.attr('name');
        		
        		// 隐藏现在的菜单
    			menus.hide();

    			// 显示对应菜单
    			_self.element = menus.filter('[name='+name+']').show();
    			
    			
    			Events.trigger('expandMenu.Layout');
    			
    			// 调整高度
				_self.onResize();
				
				if (opts.onTopSelect) {
    				opts.onTopSelect.call(this);
    			}
        	})
        };
		
        /**
         * 渲染
         * @param container
         */
        this.render = function (container) {
            container = this.get(container);

            var opts = this.options;
            
            // 菜单容器
            if (opts.drawContainer) {
            	container = new MenuContainer(opts).render(container).element;
            }
            
            // 解析菜单数据
            var data = this.parseData(opts.loader ? opts.loader(this.data) : this.data);

            // 解析菜单图标
            this.parseIcons(data, opts);

            // 生成菜单
            this.element = this.createMixMenu(container, data, opts);

            // 索引菜单数据
            this.indexMenu(data);

            // 菜单事件
            this.attachMenuEvent(this.element, opts);
            
            this.attachTopMenuEvent(container, opts);
            //收缩左侧菜单栏功能
//            setTimeout(function() {
//	            Events.trigger('collapseMenu.Layout');
//            }, 0);

            // 调整菜单高度
            this.onResize();
            

            return this;
        };
	

        this.defaults = {
        	top: '#header-menu',
        	
        	/**
        	 * 当显示首页时处理方式：
        	 * 
        	 * hide: 隐藏左侧菜单
        	 * collapse: 收缩左侧菜单
        	 * normal: 正常显示
        	 */
        	whenDashboard: 'hide',
        	
        	/**
        	 * 选择首页时显示菜单
        	 * 
        	 * all: 显示全部菜单
        	 * Array [id ...]: 数组定义显示的菜单
        	 * Function (data) {}: 定义菜单数据函数 
        	 */ 
        	dashboardMenuFilter: 'all',
        	
        	/**
        	 * 选择顶级菜单
        	 */ 
        	onTopSelect: null,
        
            //selected: 0,
            drawContainer: true,
            width: 190,
            collapsedSize: 10,
            collapsible: false,
            dashboard: false,
            accordion: {
                border: false
            }
        };
	});
	
	return MixMenu;
});