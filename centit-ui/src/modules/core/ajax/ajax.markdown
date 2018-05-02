# Ajax

---

## 1、Promise

*promise* 规范非常非常适合异步调用，让我们可以不用一层一层地嵌套回调函数。

以前ajax写法：

```
ajax(url, {
    success: successCallback(data) {
        // 数据处理
    },
        
    error: errorCallback(data) {
        // 错误处理
    }
});
```

用 *promise* 改造后的写法：
```
ajax(url)
    .then(function(data) {
        // 数据处理
    })
    .catch(function(data {
        // 错误处理
    });

```
更加详细的介绍 [戳这里][1]

----

## 2、Ajax.ajax(url, options)

获取 **Ajax** 模块非常简单

```
var Ajax = require('core/ajax');
```
接下来就可以使用 **Ajax** 模块了，第一个要介绍的方法就是最基本的 *ajax(url, options)* 方法：

|参数|类型|作用|
|:----:|:----:|:----:|
|url|String|请求url地址|
|options|Object|请求参数配置，完全和$.ajax(url, options)中的配置一致|

```
Ajax.ajax(url)
    .then(function(data) {
        alert('成功');
    })
    .catch(function(data {
        alert('错误');
    });

```

----

## 3、Ajax.getJSON(url, options)
和 *Ajax.ajax()* 参数用法一样，只是 *getJSON()* 方法指定返回的是 **JSON** 数据

----

## 4、Ajax.getHTML(url, options)
同样，该方法指定返回 **HTML** 文本


  [1]: http://www.html5rocks.com/zh/tutorials/es6/promises/