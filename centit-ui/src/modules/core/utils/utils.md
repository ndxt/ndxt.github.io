# Utils

----

## 1、引用
``` javascript
var Utils = require('core/utils');
```

----

## 2、Utils.makeTree(data, isParentFn, childField)
作用：将list数组转换成父子关系的tree数据

|参数|类型|作用|默认值|
|:----:||||
|data|Array|待转换的list数组||
|isParentFn|Function|判断是否是父子关系的方法|function(parent) { return this.pid == parent.id; }|
|childField|String|子元素字段名称|children|

``` javascript
// 待转换数组
var list = {
	{id: 0, pid: null, name: "A"},
	{id: 1, pid: 0, name: "A1"},
	{id: 2, pid: null, name: "B"},
};

var tree = Utils.makeTree(list);

// return tree as
[
	{
		id: 0, pid: null, name: "A", 
		children: [{id: 1, pid: 0, name: "A1"}]
	},
	{id: 2, pid: null, name: "B"},
]
```

----

## 3、Utils.walkTree(datas, callback, childField, level)
作用：遍历树形数据

|参数|类型|作用|默认值|
|:----:||||
|datas|TreeArray or TreeObject|待遍历的树形数据||
|callback|Function|遍历回调函数，参数(当前对象, 父级对象, 层级, 当前位置)| callback(obj, parent, level, index)|
|childField|String|子元素字段名称|children|
|level|Number|当前层级|0|

``` javascript
// 树形数据
var data = [
	    {
	        id: 0, pid: null, name: "A", 
	        children: [{id: 1, pid: 0, name: "A1"}]
	    },
	    {id: 2, pid: null, name: "B"},
	];

// 遍历
Utils.walkTree(data, function(obj) {
	obj.name = obj.name + "111";
});

// return data as
[
    {
        id: 0, pid: null, name: "A111", 
        children: [{id: 1, pid: 0, name: "A1111"}]
    },
    {id: 2, pid: null, name: "B111"},
]
```

----
 
## 4、Utils.walkTreeBefore(datas, callback, childField, level)
作用：和 *Utils.walkTree()* 方法类似，只是回调函数 **callback** 会在遍历前执行

----

## 5、Utils.throttle(func, wait, options)
作用：返回原函数的一个包裹函数，在指定时间内不会再次执行

出于性能上的考虑，有时候我们并不希望一段程序连续地执行。比如 **$(window).resize(fn)** 中的事件，并不需要在拖拽窗口时每一次都响应，只要在结束或者每隔100ms响应一次。这个时候我们可以方便地用 **throttle** 方法包裹原函数，指定响应间隔时间。

|参数|类型|作用|默认值|
|:----:||||
|func|Function|待包裹的函数||
|wait|Number|等待时间，单位：毫秒| callback(obj, parent, level, index)|

``` javascript

var index = 0;

var fn = Utils.throttle(setInterval(function() {
	console.log(index++);
}, 10), 500);

fn();

// 本来会每隔10ms就打印，被包裹后每隔大约500ms才执行一次
0
// after 500ms
1
.
.
.
```