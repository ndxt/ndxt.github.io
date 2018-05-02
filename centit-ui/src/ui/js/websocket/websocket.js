define(function(require) {
  var Cache = require('core/cache');

  // 客户端
	var ws;
  var Events = {};

  return {
		on: on
	};

	///////////////////////////

  function _getContextPath() {
    var match = location.href.match(/^(http:\/\/.*?\/.*?)\//)

    if (match && match[1]) {
      return match[1]
    }
  }

  function init() {
    var contextPath = _getContextPath();
    var userCode = Cache.get('UserInfo').userCode;
    var osId = 'default';
    var wsHost;

    if (contextPath) {
      wsHost = contextPath.replace(/^http/, 'ws');
    }

    wsHost = wsHost + '/pusher/' + osId + '/' + userCode;

    var socket = new WebSocket(wsHost);

    socket.onopen = function() {
      console.info('WebSocket: ' + wsHost + ' is opened');
    };

    socket.onclose = function() {
      console.error('WebSocket: ' + wsHost + ' is closed');
    };

    socket.onmessage = function(res) {
      var data = res.data;

      try {
        data = JSON.parse(res.data);
      }
      catch (e) {
        // console.info(e)
      }

      if (Events[data.msgType]) {
        Events[data.msgType](data)
      }
    };

    return socket;
  }

	/**
	 * 添加事件
	 */
	function on(name, callback) {
		if (!ws) {
      init();
    }

		Events[name] = callback;
	}

});
