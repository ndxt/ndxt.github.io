# Core

----

## 1、引用
引用 **Core** 模块的方法是
``` javascript
var Core = require('core/core');
```

----

## 2、Core.ajax(url, options)
和 **Ajax** 模块的 *ajax(url, options)* 方法类似，唯一的区别是可以通过 **Config** 统一配置对数据成功和错误时的处理方法。一般情况下，我们只需要使用 **Core.ajax()** ，只有在需要特殊配置时才使用 **Ajax.ajax()**
``` javascript
Core.ajax(url)
    .then(function(data) {
        alert('成功');
    })
    .catch(function(data {
        alert('错误');
    });
```

----

## 3、Core.getJSON(url, options)
指定返回 **JSON** 格式数据

----

## 4、Core.reload(url)
重新加载当前页面，若 *url* 存在，加载指定 url

----

## 5、Core.height(obj)
相当有用的一个方法，可以获取当前 **Tab** 页面的高度，根据参数不同，返回不同含义

|参数类型|返回含义|
|:----:|:----:|
|undefined|直接返回当前 Tab 页的高度|
|Number|返回 Tab 页高度减去参数值。|
|String、Object|返回 Tab 页高度减去根据参数查找的 jQuery 对象的高度|

``` javascript
// Tab 页高度
var height = Core.height();

// Tab 页高度减去 50
var height2 = Core.height(50);

// Tab 页高度减去该页面上 class="search" 的搜索框高度
var height3 = Core.height('.search');
```
