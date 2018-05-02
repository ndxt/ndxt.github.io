# Event

----

## 1、引入
``` javascript
var Event = reuqire('core/events');
```

----

## 2、使用
在前面的使用说明中，我们已经介绍了如何在插件中使用事件。我们也可以直接使用事件类。

> 添加事件 Event.on(eventName, eventHandle) 

``` javascript
Event.on('select', function(event, id, name) {
	alert(id + ': ' + name);
});
```

|方法|参数|类型|含义|
|:----:||||
|on|||添加事件。事件将会通过jQuery附加到document上|
||eventName|String|事件名。不用担心会与系统现有的事件关键字冲突，因为前面会自动加上前缀。|
||eventHandle|Function|事件。需要注意第一个参数一定是event对象|

> 调用事件 Event.trigger(eventName, param1, param2, ...)

``` javascript
Event.trigger('select', 6527, '唐伯虎');  // 6527: 唐伯虎
```
|方法|参数|类型|含义|
|:----:||||
|trigger|||触发事件。|
||eventName|String|事件名。|
||参数||传递给事件回调函数的参数|