define(function (require) {
  require('js/easyui/easyui.extend');
  var WebSocket = require('websocket/websocket');

  var $ = require('jquery');
  var Config = require('config');

  // 首页缓冲动画
  var Loading = require('widgets/loading/widget.loading');
  var loader = new Loading({
    show: Config.System.LoadingAnimation
  });
  loader.render($('body')).begin(0, '开始精彩世界');

  // 读用户个人设置
  require('loaders/config/loader.userSetting').load()

    .then(function () {
      return require('loaders/cache/loader.csrf').load();
    })

    .then(function () {
      loader.progress(5, '读取用户信息');
      return require('loaders/cache/loader.userInfo').load();
    })

    .then(function () {
      loader.progress(10, '读取菜单数据');
      return require('loaders/cache/loader.menu').load();
    })

    .then(function () {
      loader.progress(15, '缓存数据字典');
      return require('loaders/cache/loader.dictionary').loadAll();
    })

    .then(function () {
      loader.progress(20, '缓存系统信息');
      return require('loaders/cache/loader.system').loadAll();
    })

    .then(function () {
      loader.progress(30, '读取主题配置');
      return require('loaders/loader.theme').init();
    })

    .then(function () {
      loader.progress(40, '加载资源文件');
      return require('loaders/loader.resource').init();
    })

    .then(function () {
      loader.progress(50, '初始化页面');
      return require('loaders/loader.init').init(loader);
    })

    .then(function () {
      loader.end('加载完毕');
    })

    .then(function () {
      WebSocket.on('msg', require('websocket/websocket.innermsg'));
    })

    // 捕获错误（因为catch是IE8下面的关键字，为了保证兼容性用这种写法）
    ['catch'](function (error) {
    console.error(error);
    loader.error(error);
  });


});
