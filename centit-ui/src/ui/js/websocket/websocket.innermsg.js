define(['jquery', 'easyUI'], function ($) {
  return receiveMessage;

  function receiveMessage(data) {
    $.messager.show({
      title: '新消息',
      msg: data.msgContent,
      showType: 'slide'
    });
  }
});
