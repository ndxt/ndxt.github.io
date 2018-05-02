define(function(require) {
	require('plugins/extend');
	require('plugins/es6-promise.min');
	require('plugins/es5-array');
	
	var Core = require('core/core');
	var Config = require('config');
	var Mustache = require('plugins/mustache.min');
	
	var $ = require('jquery');
	
	/**
	 * 通用加载器
	 * 
	 * 不能直接使用，必须由其他类继承并实例化后才可以使用
	 */
	var Loader = Class.extend(function() {

		this.constructor = function(id) {
			this.id = id;
		};

		var _self = this;
		
		/**
		 * 加载url
		 * 
		 * TODO 实例中重写
		 */
		this.url = null;
		
		this.name;

		/**
		 * 批量加载url
		 *
		 * @type {Array}
		 */
		this.urlAll = [];
		
		/**
		 * 当加载发生错误时是否抛出错误
		 * 默认否，可以继续往下走流程
		 */
		this.rejectWhenError = false;
		
		/**
		 * 解析数据方法
		 */
		this.convert = function(data) {
			// TODO 实例中重写
		};

		/**
		 * 加载数据
		 */
		this.load = function(url) {
			url = url || this.url;

			if (url) {
				return Core.getJSON(Config.ContextPath + url).then(

					// 正常情况，持久化用户设置数据
					function(data) {
						return _self.save.call(_self, data);
					},

					// 如果读取发生错误，根据rejectWhenError决定
					// false: 忽略（使用默认配置），流程继续往下走
					// true: 抛出错误
					function(error) { 
						var msg = Mustache.render("加载【{{name}}】（{{&url}}）时发生错误，状态（{{status}}）", {
							name: _self.name,
							status: error.status,
							url: Config.ContextPath + url
						});
					
						if (_self.rejectWhenError) {
							console.error(msg);
							return Promise.reject(msg);
						}
						
						console.warn(msg);
						return Promise.resolve();
					}
				);
			}

			return Promise.resolve();
		};

		/**
		 * 批量加载数据
		 * @param urlAll
		 */
		this.loadAll = function(urlAll) {
			urlAll = urlAll || this.urlAll;

			if (urlAll && $.isArray(urlAll)) {

				// 将url数组变成链式异步请求
				return urlAll.reduce(function(promise, obj) {
					// 对象数组或者url字符串数组
					var url = obj.url ? obj.url : obj;
					var loader = obj.loader;

					return Core.getJSON(Config.ContextPath + url)
						.then(

							// 和单个加载不同，每个请求都不处理错误
							function(data) {
								return _self.save.call(_self, loader ? loader(data) : data, obj);
							},

							function() {
								return Promise.resolve();
							}
						);

				}, Promise.resolve());
			}

			return Promise.resolve();
		};

		
		/**
		 * 保存数据
		 */
		this.save = function(data) {
			try {
				this.convert.call(this, data);
			}
			catch(e) {
				var msg = Mustache.render("加载【{{name}}】时发生错误（{{message}}）", {
					name: _self.name,
					message: e.message ?　e.message : e
				});
			
				if (this.rejectWhenError) {
					console.error(msg);
					return Promise.reject(msg);
				}
				else {
					console.warn(msg);
				}
			}

			return Promise.resolve(data);
		};


        this.reload = function(id) {
            if (!this.urlAll || !$.isArray(this.urlAll)) return;

            var urls = this.urlAll.filter(function(url) {
                return id == url.id;
            });

            return this.loadAll(urls);
        }

	});
	
	return Loader;
});