define(function (require) {
	require('plugins/pinyin');
    require('easyUI');
    require('plugins/es5-array');
    //require('plugins/jquery.nicescroll.min');

    var Mustache = require('plugins/mustache.min');

    var $ = require('jquery');

    var Events = require('core/events');

    var MenuContainer = require('widgets/menu/widget.menu.container');

    var Widget = require('widgets/widget');

    var Utils = require('core/utils');

    var Menu = Widget.extend(function () {

        var _self = this;

        /**
         * 插件名称
         * @type {string}
         */
        this.name = 'Menu';

        this.events = {
            select: function (event, id) {
                _self.select(id);
            },
            
            updateTitle: function (event, id, update) {
            	_self.updateTitle(id, update);
            }
        };

        /**
         * 模板
         * @type {exports}
         */
        this.template = require('text!widgets/menu/template.menu.html');

        /**
         * 菜单文字
         * @type {exports}
         */
        this.templateLink = require('text!widgets/menu/template.menu-link.html');

        /**
         * 打开菜单
         * @param node
         */
        var openMenu = function(node) {
            // 叶子节点是菜单
            if (!node.children || 0 == node.children.length) {

                // 默认TAB页打开
                var pageType = node.attributes ? node.attributes.pageType : 'tab';
                pageType || (pageType = 'tab');

                // 默认IFRAME打开
                var external = node.attributes ? node.attributes.external : true;
                (external == undefined) && (external = true);

                if (pageType == 'tab') {
                    Events.trigger('open.MenuTab', node, external);
                }
            }
        };

        /**
         * 打开指定菜单
         * @param id
         */
        this.open = function(id) {
            var menu = this.menuIndexes[id];
            if (!menu) return;

            this.select(id);
            openMenu(menu);
        };

        /**
         * 查找指定菜单
         * @param filter
         * @returns {Array}
         */
        this.find = function (filter) {
            var result = [];

            for (var id in this.menuIndexes) {
                if (this.menuIndexes.hasOwnProperty(id)) {
                    var menu = this.menuIndexes[id];

                    if (filter(menu)) {
                        result.push(menu);
                    }
                }
            }

            return result;
        };

        /**
         * 查找菜单文字
         * @param text
         * @returns {*|Array}
         */
        this.search = function (text) {
            var result = this.find(function(menu) {
                return menu.text.has(text);
            });

            result = result.filter(function(obj) {
                // 只查询子菜单
                return !obj.accordion;
            }).map(function(obj) {
                return obj.id;
            });

            this.cleanMark();
            this.markFound(result);

            return result;
        };

        /**
         * 标记指定菜单
         * @param id
         */
        this.mark = function(id) {
            var menu = _self.menuIndexes[id];
            if (menu && menu.domId) {
                this.cleanMark();
                $('#'+menu.domId).addClass('tree-node-mark');

                this.scrollTo(menu.id);
            }
        };

        /**
         * 标记找到的菜单
         * @param ids
         */
        this.markFound = function(ids) {
            if (!$.isArray(ids)) {
                ids = [ids];
            }

            this.cleanFound();
            ids.forEach(function(id) {
                var menu = _self.menuIndexes[id];
                if (menu && menu.domId) {
                    $('#'+menu.domId).addClass('tree-node-found');
                }
            });
        };

        /**
         * 清除被标记的菜单
         */
        this.cleanMark = function() {
            this.element.find('.tree-node-mark').removeClass('tree-node-mark');
        };

        /**
         * 清除在查询中被找到的菜单
         */
        this.cleanFound = function() {
            this.element.find('.tree-node-found').removeClass('tree-node-found');
        };

        /**
         * 清除现在选中的菜单
         */
        this.cleanSelected = function() {
            this.element.find('.tree-node-selected').removeClass('tree-node-selected');
        };

        /**
         * 清除
         * @param all
         */
        this.clean = function(all) {
            this.cleanMark();
            this.cleanFound();

            if (all) {
                this.cleanSelected();
            }
        };

        /**
         * 滚动到指定菜单
         * @param id
         */
        this.scrollTo = function(id) {
            var menu = this.menuIndexes[id];

            if (!menu) return;

            // 是一级菜单
            if (menu.accordion) {
                this.element.accordion('select', menu.text);
            }
            // 是子菜单
            else {
                var tree = menu.tree, target = $('#'+menu.domId), root = menu.root;

                this.element.accordion('select', root.text);
                tree.tree('expandTo', target);
                tree.tree('scrollTo', target);

                return target;
            }
        };

        /**
         * 选中指定菜单
         * @param id
         */
        this.select = function(id) {
            this.cleanSelected();

            var menu = this.menuIndexes[id];
            if (!menu) return;

            var target = this.scrollTo(id);
            if (target) {
                target.addClass('tree-node-selected');
            }
        };
        
        /**
         * 更新菜单标题
         * 
         * @id 菜单id
         * @callback 
         * 	如果是字符串，直接更新菜单标题；
         *  或者是一个回调函数，参数为原来的标题，this为dom对象
         */
        this.updateTitle = function(id, callback) {
        	var menu = this.menuIndexes[id];
        	
        	if (!menu || callback == undefined) return;
        	
        	if ('string' == typeof callback) {
        		_update(menu, callback);
        	}
        	else {
        		var text = callback.call($('#' + menu.domId), menu.text);
        		_update(menu, text);
        	}
        	
        	////////////////////////////////////////
        	
        	function _update(menu, text) {
        		menu.text = text;
        		$('#' + menu.domId).find('.tree-title a').text(text);
        	}
        }

        /**
         * 菜单数据建索引
         * @param data
         */
        this.indexMenu = function(data) {
            var indexes = this.menuIndexes = {};

            data.forEach(function(menu) {
                var id = menu.id, title = menu.text;
                var tree = _self.element.accordion('getPanel', title).find('ul.easyui-tree');

                // 一级菜单
                indexes[id] = $.extend({
                    accordion: _self.element
                }, menu);

                // 子菜单
                var children = tree.data('tree').data;
                Utils.walkTree(children, function(node) {
                    indexes[node.id] = $.extend({
                        tree: tree,
                        root: menu
                    }, node);
                });
            });
        };



        /**
         * 创建菜单
         * @param container
         * @param data
         * @param opts
         * @returns {*|jQuery}
         */
        this.createMenu = function(container, data, opts, id) {
            var menu = $(Mustache.render(this.template, {
            	id: id,
                menus: data,
                dashboard: opts.dashboard
            })).appendTo(container);

            // 一级菜单
            menu.accordion(opts.accordion);
            this.collapseFirstLevelMenu(menu, data);

            // 一级菜单子菜单
            menu.find('ul.easyui-tree').each(function(index, tree) {
                tree = $(tree);

                tree.tree({
                    onBeforeSelect: function(node) {
                        if (!node.isLeaf) {
                            return false;
                        }
                    },
                    onClick: function(node){
                        openMenu(node);
                        tree.tree('toggle', node.target);
                    },
                    formatter: function(node) {
                        return Mustache.render(_self.templateLink, node);
                    },
                    data: data[index].children
                });
            });

            // 添加叶子节点标记
            menu.find('div.tree-node').each(function() {
                var node = $(this);
                // 叶子节点
                if (!node.next('ul').length) {
                    node.closest('li').addClass('leaf');
                }
            });

            //menu.find('.panel-body').niceScroll({cursorcolor:"#BCBCBC"});

            return menu;
        };

        /**
         * 收缩无子菜单的一级菜单
         * @param menu
         * @param data
         */
        this.collapseFirstLevelMenu = function(menu, datas) {
            datas.forEach(function(node) {
                if (!node.children || 0 === node.children.length) {
                    var accordion = menu.find('.panel.'+node.id);

                    // 添加按钮点击事件
                    accordion.find('.accordion-header').on('click', function () {
                        openMenu(node);
                    });

                    // 收起面板
                    accordion.find('.accordion-body').panel({
                        collapsible: false,
                        collapsed: true
                    });
                }
            });
        };

        /**
         * 解析菜单数据
         * @param data
         * @param loader
         * @returns {*}
         */
        this.parseData = function(data, opts) {

            // 上下文路径
            var contextPath = this.options.contextPath;

            Utils.walkTree(data, function(node) {

                // 判断叶子节点
                if (!node.children || !node.children.length) {
                    node.isLeaf = true;
                    node.children = false;
                }
                else {
                    node.isLeaf = false;
                }

                // url添加上下文
                if (contextPath && node.url && node.url != '...' && node.url.indexOf('http')) {
                    node.url = contextPath + node.url;
                }
            });

            // 第一个有子菜单的展开菜单打开. selected必须要有一个值true or false
            var selected = false
            data.forEach(function(d, index) {
                if (!selected && d.children && d.children.length) {
                    d.selected = true;
                    selected = true;
                }
                else {
                    d.selected = false;
                }
            });

            return data;
        };

        /**
         * 解析菜单图标
         * @param data
         * @param icons
         */
        this.parseIcons = function(data, opts) {
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
        };

        /**
         * 打开首页
         */
        this.openDashboard = function() {
            var dashboard = this.options.dashboard;

            Events.trigger('open.MenuTab', dashboard, dashboard.external);
        };

        /**
         * 添加菜单事件
         * @param menu
         */
        this.attachMenuEvent = function(menu, opts) {
            var container = menu.closest('.layout-body');

            if (opts.collapsible) {
                // 收缩菜单
                container.find('.layout-collapse-center').on('click', function() {
                    Events.trigger('collapseMenu.Layout');
                });
            }

            if (opts.dashboard) {
                menu.find('.dashboard .panel-header').on('click', function() {
                    _self.openDashboard();
                });
            }
        };

        /**
         * 添加插件
         * @param plugin
         */
        this.addPlugin = function (plugin) {
            plugin.render(this.element);
            plugin.menu = this;
            this.onResize();
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
                this.container = container = new MenuContainer(opts).render(container).element;
            }

            // 解析菜单数据
            var data = this.parseData(opts.loader ? opts.loader(this.data) : this.data);

            // 解析菜单图标
            this.parseIcons(data, opts);

            // 生成菜单
            this.element = this.createMenu(container, data, opts);

            // 索引菜单数据
            this.indexMenu(data);

            // 菜单事件
            this.attachMenuEvent(this.element, opts);

            // 调整菜单高度
            this.onResize();

            return this;
        };

        /**
         * 当窗口大小改变时调用
         */
        this.onResize = function() {
            var layout = this.element.closest('.layout-body');

            var pHeight = 0;
            layout.find('.menu-plugin').each(function() {
                pHeight += $(this).outerHeight();
            });

            this.element.accordion('resize', {
                height: layout.height() - pHeight
            });
        };

        /**
         * 默认设置
         * @type {{drawContainer: boolean, width: number, collapsedSize: number, collapsible: boolean, dashboard: boolean}}
         */
        this.defaults = {
            selected: 0,
            drawContainer: true,
            width: 190,
            collapsedSize: 10,
            collapsible: true,
            dashboard: false,
            accordion: {
                border: false
            }
        };
    });

    return Menu;
});