# Filter

----

## 1、引用

如果要新增过滤器，需要引用并继承 **Filter** 类

``` javascript
var Filter = require('core/filter/filter');

var MyFilter = Filter.extend(function() {
	
	// 重写 convert 方法
	this.convert = function(value) {
		...
	}
});

return new MyFilter();
```
----

## 2、DictionaryFilter
系统已经写好了若干过滤器实例，数据字典过滤器就是其一。数据字典过滤器的作用是将字典编码转换成值，使用时先引入：

``` javascript
var filter = require('core/filter/filter.dictionary'); 

// 从后台加载 SYSPARAM 数据字典
filter.add("SYSPARAM").then(function() {

	// 得到数据字典 SYSPARAM 明细中 SysTitle 的值
	alert(filter.convert("SYSPARAM", "SysTitle")); 
	
});
```

使用数据字典过滤器前，需要先通过 **add** 从后台加载数据，也可以在 **config.js** 文件中配置在首页初始化时就从后台加载。加载后的数据会存入缓存对象中，下次再使用不会再发请求。

|方法|参数|作用|
|:----:|||
|add||从后台请求数据字典数据|
||name [String] 数据字典目录名称||
||name [Array] 数据字典目录名称||
|convert||转换数据字典编码为值|
||name [String] 数据字典目录名称||
||code [String] 数据字典明细编码||


----


## 3、ColumnFilter
列过滤器是用来转换表格列表中的编码和值，不能单独使用，我们将在 **表格扩展** 中详细介绍用法

``` javascript
require('core/filter/filter.column');
```

