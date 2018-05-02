# Widget

----

## 1、插件类引用

我们在编写插件时，统一引用并继承 **插件类** ，不但可以规范插件写法，还可以方便调用基类提供的事件等其他一系列方法

``` javascript
var Widget = require('widgets/widget'); 

var MyWidget = Widget.extend(function() {
	
	// 重写渲染方法
	this.render = function() {
	}
});
```

----

## 2、初始化
使用插件的一般流程是：

```flow
st=>start
init=>operation: new (实例化)
render=>operation: render（渲染）
e=>end

st->init->render->e
```

我们来看 **菜单** 组件的具体使用方法：

``` javascript
// 获取菜单插件
var Menu = require('widgets/menu/widget.menu');

// 实例化
var menu = new Menu(options, data);

// 渲染到DOM上
menu.render('#side');
```

我们注意到在实例化时传入了2个参数 **options** 和 **data** ，分别代表组件的配置和数据。这2个参数并不是必填项，但是如果你所写的插件需要这2个参数，那么可以在初始化的时候传入。

----

## 3、渲染
渲染可以说是组件最重要的一个环节，通过执行**render**方法，组件被加载到了DOM树上。虽然渲染方法需要组件自己去实现，但是我们希望在写自己的render方法时，能够遵循一些约定，保证以后组件使用的通用性。

```javascript

// 一个标准的render方法写法
this.render = function(container) {
	
	// 可以使用基类提供的get方法，快速将字符串转换成jQuery对象
	container = this.get(container);
	
	// 使用element属性保存组件的jQuery对象
	this.element = ...	

	// 返回对象自己
	return this;
}
```

首先我们注意的是 render 方法的传入参数 container。container可以是字符串，可以是dom对象，也可以是jQuery对象

|方法名|参数|类型|含义|
|:----:||||
|get|container||最终返回jQuery对象|
|||String（jQuery选择器）|例如：'.unit'、'#person'|
|||String（id）|例如：'person'|
|||DOM Object||
|||jQuery Object||


> 用element属性保存组件的jQuery对象 

``` javascript
// 使用element属性保存组件的jQuery对象
this.element = ...  
```

> 返回对象自己
``` javascript
// 返回对象自己
return this;  
```

----

## 4、事件

组件和组件之间肯定会存在相互调用，在这里我们并不推荐直接调用，而是推荐使用**事件化**的方式推动。实现事件化非常简单，只要是继承了基类**Widget**就可以在**events**属性里定义事件。

``` javascript
var Widget = require('widgets/widget');

var MyWidget = Widget.extend(function() {

	// 必须定义唯一不重复的name
	this.name = 'MyWidget';	

	// 定义事件方法
	this.events = {
		
		select: function(event, id) {
			alert(id);
		}
	};
});


// -------------------- 另一处调用事件 ------------------

var Event = require('core/events');

Event.trigger('select.MyWidget', 'centit'); // output: centit
```

----

## 5、onResize 改变尺寸回调方法
严格的说，onResize也属于事件，但是因为比较特殊，而且使用率很高，所以单独列了出来。我们肯定希望，当窗口大小改变的时候，组件的尺寸也能自动同时发生正确的改变。而大多数情况下，组件并没有这么智能，需要我们手动处理。

``` javascript
var Widget = require('widgets/widget');
var Core = require('core/core');

var MyWidget = Widget.extend(function() {
	
	// 重写渲染方法
	this.onResize = function() {
		// 获取当前tab页高度，这只是一个示意，具体情况要具体考虑
		var h = Core.height();
		
		// 改变元素高度
		this.element.height(h);
	}
});
```