define(['jquery', 'config'], function($, Config) {

  var LoadingInstance;
  function Loading() {
    // 单例
    return LoadingInstance;
  }

  $.extend(Loading.prototype, {

    template: '<div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 999999; background: #fff;">' +
    '<div class="ajax-loader-icon" style="position: absolute; width: 42px; height: 42px; background: url('+ Config.ContextPath +'ui/themes/qui/less/images/loading.gif); top: 50%; left: 50%; margin: -21px 0 0 -21px;"></div>' +
    '</div>',

    loadings: [],

    timeout: 20 * 1000,

    create: function(context) {
      // 只能在 panel-body 里创建 loading
      if (!context || !context.is || !context.is('.panel-body') || context.is('.messager-body')) return;
      return $(this.template).appendTo(context);
    },

    add: function(context) {
      var loading = this.create(context);
      var vm = this;

      if (loading) {
        // 压入清除 loading 方法
        this.loadings.unshift(function unLoading() {
          loading.fadeOut(vm.pop.bind(vm))
        });

        // 确保不会因为意外而造成loading无法消失
        setTimeout(vm.pop.bind(vm), vm.timeout)
      }
    },

    pop: function() {
      var unLoading = this.loadings.pop();

      if (typeof unLoading === 'function') {
        unLoading()
      }
    }
  });

  return LoadingInstance = new Loading();
});
