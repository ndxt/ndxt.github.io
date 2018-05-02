# Centit-UI 开发文档

---

在正式介绍如何开发一个新页面之前，需要强调的是：**不要使用 iframe！！！** **不要直接在页面上写业务 javascript！！！**这些都是以前项目的开发习惯，虽然编码时快速方便，但是在代码的重用性、维护性上存在严重的问题。

当然你也不用担心，虽然不能用iframe、不能直接写javascript，但是通过新的模块化机制以及组件的继承，以前的所有功能都可以实现，而且会更加简单。这也正是我们追求的目标：*在代码维护性和上手难度之间找到一个平衡点*

---

## 1、第一个页面：ATM自动存取款机
这里我们不准备讨论细节，只关注流程。ATM的功能很简单：可以显示列表、存款、取款和查看明细。
![ATM自动存取款机示意图](img/atm.gif) 

----

## 2、文件结构
    /webapp
    |----/modules
         |----/atm
              |----atm.jsp                  // 列表页面
              |----atm-save.jsp             // 存款页面
              |----atm-get.jsp              // 取款页面
              |----atm-detail.jsp           // 操作详情页面
              |----/ctrl
                   |----atm.js              // 列表控制器
                   |----atm.save.js         // 存款控制器
                   |----atm.get.js          // 取款控制器
                   |----atm.detail.js       // 详情控制器
                  

----

## 3、列表
列表页面包含工具栏和数据表格，**atm.jsp**内容如下

### ① 表格
```
<table url="${ctx}/modules/core/crud/data/list.json"
        layoutH="0"
        toolbar=".temp-toolbar"
        height="500">
    <thead>
        <tr>
            <th field="id" width="150" align="center">流水号</th>
            <th field="operator" width="100" align="center">操作</th>
            <th field="money" width="150" align="right">金额</th>
            <th field="balance" width="150" align="right">余额</th>
            <th field="date" width="250"align="center">日期</th>
        </tr>
    </thead>
</table>
```
我们现在只关注table中的*url* 属性，表格中的数据是通过ajax请求url地址，得到数据如下格式：

### ②表格数据
```
[
  {
    "id": "1000000000000",
    "balance": 1000
  }
]
```
### ③工具栏
通过table的*toolbar* 属性，表格和工具栏得以联系在一起
```
<div class="temp-toolbar">
    <a rel="save" href="modules/core/crud/crud-save.html" iconCls="icon-base icon-base-take_in"
       trigger="none" target="dialog">存款</a>
    <a rel="get" href="modules/core/crud/crud-get.html" iconCls="icon-base icon-base-take_out"
       trigger="none" target="dialog">取款</a>
    <hr>
    <a rel="detail" href="modules/core/crud/crud-detail.html" iconCls="icon-base icon-base-info"
       trigger="single" target="dialog" title="操作明细">明细</a>
</div>
```
在这个例子中有3个按钮，对应3种操作：存款、取款、查看明细。**特别注意** *rel*  属性，唯一不重复控制器的id。而点击按钮后的逻辑，将写在各自的控制器中。

### ④加载控制器
```
<script>
    $.parser.onComplete = function(panel) {
        $.parser.onComplete = $.noop;

        requirejs([
            'modules/atm/ctrl/atm'
        ], function(ATM) {
            new ATM('ATM', panel).load(panel);
        });
    };
</script>
```
**$.parser.onComplete** 确保在页面加载完毕，并且所有*easyUI* 组件渲染完毕后会自动调用。

里面是标准的模块化调用写法，现在我们只需要知道页面会加载 *atm.js*，有关列表的所有业务逻辑都会写在 *atm.js* 里。

----

## 4、列表控制器

让我们一起来看看列表控制器 *atm.js* 里都写了什么

```
define(function(require) {
    require('plugins/extend');
    
    // 页面基础对象，提供了对页面的控制方法
    var Page = require('core/page');

    // 存款控制器
    var SaveCtrl = require('../ctrl/crud.save');
    
    // 取款控制器
    var GetCtrl = require('../ctrl/crud.get');
    
    // 查看详情控制器
    var DetailCtrl = require('../ctrl/crud.detail');

    // 通过扩展的方式定义列表页面的处理方法
    var ATM = Page.extend(function() {

        // 注入存款、取款、查看详情3个子控制器
        this.injecte([
            new SaveCtrl('save'),
            new GetCtrl('get'),
            new DetailCtrl('detail')
        ]);

        // 重写 Page 类中页面加载调用方法
        this.load = function(panel) {
            
            // 保存页面一些值，比如：余额
            this.balance = 1000;
            
            // 去id化查找表格，去id化可以更好滴移植、继承控制器
            var table = panel.find('table');
            
            // 执行表格插件
            table.cdatagrid({
                controller: this
            });
        };

    });

    return ATM;
});
```

去掉注释和变量定以后其实没有几行代码。

我们将页面行为总结为2点：① 加载，比如初始化页面等，② 提交，比如提交表单。

所有的行为几乎都可以归结为以上2个步骤。在*Page* 类中定义了默认的 *load* 和 *submit* 方法，在业务类中需要继承并重写这些方法。

**特别注意**的是，控制器中注入了3个子控制器，通过 id 将页面按钮和控制器联系到了一起。

----

## 5、存款页面

存款页面是 *atm-save.html* 

```
<form class="form centit">
    <div class="field required">
        <label>存款</label>
        <input type="text" class="easyui-numberbox" name="money"
               min="0" prefix="￥"
                required />
    </div>
</form>
```
是的，我们只需要定义代码片段，不用再写完整的 html 、head 、body 等等，很方便吧~

----

## 6、存款页面控制器
存款页面控制器 *atm.save.js* 已经在列表页面控制器中注入，所以不需要再在页面上引用

```
define(function(require) {
    require('plugins/extend');

    var $ = require('jquery');
    var Page = require('core/page');

    var SaveCtrl = Page.extend(function() {

        // 重写页面加载方法
        this.load = function(panel) {
            this.data = null;

            var form = panel.find('form');
            form.form('disableValidation')
                .form('focus');
        };

        // 重写页面提交方法
        this.submit = function(panel, data, closeCallback) {
            var form = panel.find('form');

            form.form('enableValidation');
            var isValid = form.form('validate');

            if (isValid) {
                this.data = {
                    money: parseInt(form.form('value').money)
                }
                
                // 关闭窗口
                closeCallback();
            }

            return false;
        };

        // 重写页面关闭调用方法
        this.onClose = function(table) {
            if (this.data) {
                
                // 通过 parent 调用父控制器的一些值
                this.parent.balance += this.data.money;
                
                // 插入数据
                table.datagrid('appendRow', $.extend(this.data, {
                    id: new Date().getTime(),
                    operator: '存款',
                    balance: this.parent.balance,
                    date: new Date()
                }));
            }
        };

    });

    return SaveCtrl;
});
```

----

## 7、使用对象扩展方式的好处
取款控制器与存款控制器之间有很多相似的地方，只是最后提交时逻辑有所不同（一个是加余额，另一个是减余额），所以可以直接扩展存款控制器，重写不同的地方即可

*atm.get.js*

```
define(function(require) {
    require('plugins/extend');

    var $ = require('jquery');
    var SaveCtrl = require('./crud.save');


    var GetCtrl = SaveCtrl.extend(function() {

        this.onClose = function(table) {
            if (this.data) {
                this.parent.balance -= this.data.money;

                table.datagrid('appendRow', $.extend(this.data, {
                    id: new Date().getTime(),
                    operator: '取款',
                    balance: this.parent.balance,
                    date: new Date()
                }));
            }
        };

    });

    return GetCtrl;
});
```
在具体项目中，通过对业务的整理归纳，可以写出重用率很好的业务特有控制模块。

----

## 8、总结
通过上面的列子，我们已经大概了解页面的开发流程。上面所有代码都可以在[SVN][1]中获得


  [1]: https://192.168.128.8/svn/centit/framework/framework-ui/src/main/webapp/modules/core/crud/