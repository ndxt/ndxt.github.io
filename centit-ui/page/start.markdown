# 欢迎使用 Centit-UI

-----

曾经我们饱受没有统一前端框架之苦：样式单一过时、缺少插件、缺少文档…… 痛定思痛，新框架正是按照解决这一系列问题的思路而开发。花大心血和人力编写使用文档、引用成熟商业框架丰富插件、快速无缝切换的主题颜色配置，这一切，只为让您能够专心快速地开发项目。

-----

## 1、引入 Centit-UI

引用Centit-UI的项目**必须是Maven**工程，如果您的项目还不是Maven工程，请先改造成Maven工程。

我们推荐直接引用Framework2.0的pom，因为Framework2.0不但包含完整的UI文件，还包含了**工作流**、**统计报表**、**文件服务**、**全文检索**等一系列功能。

### 修改pom.xml，添加依赖
```
<dependency>
    <groupId>com.centit.framework</groupId>
    <artifactId>framework-sys-module</artifactId>
    <version>2.0.1-SNAPSHOT</version>
</dependency>
```
是的，就是这么简单。现在启动工程，就能看到框架界面了。

----

如果项目因为种种原因不能引用Framework2.0，也可以单独引用Centit-UI：
```
<dependency>
    <groupId>com.centit.framework</groupId>
    <artifactId>framework-ui</artifactId>
    <version>2.1.0-SNAPSHOT</version>
</dependency>
```
之后需要**手动修改工程的登录页面和首页**为指定的文件

-----

## 2、Centit-UI 结构

    /webapp
    |---index.jsp           首页
    |---login.html          登录页面
    |---/custom             *项目自定义配置文件夹
    |   |---config.js
    |   |---style.css
    |---/modules            *项目页面文件夹
    |---/ui                 ui主文件夹
        |---app.js          
        |---main.js
        |---config.js
        |---/core
        |---/css
        |---/js
        |---/themes
        |---/widgets

-----

## 3、配置 Centit-UI

由于是通过jar包引入，所以在工程文件夹中我们是看不到上面这些文件的。如果需要特别定制，一般我们**不建议**在工程目录相同路径下建同名文件直接覆盖。

我们提供了一个可配置文件夹：**custom**，这个文件夹下面的所有文件是可以被任意覆盖的。通过覆盖这些文件可以改变框架的默认行为和样式：

### ① custom/style.css
在这个文件里所写样式，将会覆盖框架的默认样式。

### ② custom/config.js
一般情况下我们只需要配置主题和颜色：
```
define(function(require) {
    return {
        Theme: {
            DefaultTheme: 'qui',            /* 默认主题 */
            DefaultColor: 'sky_blue'        /* 默认颜色 */   
        }
    };
});
```

完整配置系统参数见下面表格：
| 参数名 | 子参数 |  类型  |  注释  | 示例 |
| :---- | :---- | :----: | :---- | :---- |
|Theme|     |Object|主题相关配置|   |
|   |DefaultTheme|String|默认主题ID|qui|
|   |DefaultColor|String|默认颜色|blue|
|   |LoadAnimation|String|首页加载动画效果主题|qui|
|   |Title|String|项目标题（显示在浏览器标签页上）|CentitUI|
|   |HeaderTitle|String|项目头部标题|南大先腾富客户端系统 V2.0|
|   |FooterTitle|String|项目尾部标题|技术支持电话：025-84207500 @南大先腾有限公司|
|   |CustomCss|Array|定义用户需要加载的css文件|['custom/style.css']|
|   |ColorCSS|Array|定义用户需要加载的与色彩相关的css文件||
|   |IconCSS|Array|定义用户需要加载的与图标相关的css文件||
|   |Colors|Array|定义用户主题可配置的颜色（具体格式可以参照各主题theme.js里的颜色配置）||
|   |Template|String|定义用户首页加载的html模板（默认为主题文件夹下的template.html文件）|ui/themes/qui/template.html||
|System|    |Object|系统相关配置||
|   |LoadingAnimation|Boolean|是否显示首页加载动画缓冲效果|true|
|   |AjaxLoader|Function|系统ajax调用数据处理器（不建议修改）||
|   |AjaxErrorLoader|Function|系统ajax错误数据处理器（不建议修改）||
|   |Debug|Boolean|调试模式，打印系统日志|true|
|   |EasyUI|Boolean|是否使用easy-ui布局|true|
| URL    |        |   Object     | 系统URL相关配置 |    |
|        |Dictionary|  String     | 获取数据字典明细： {{code}} 用来替换数据字典编码 | data/dictionary/{{code}}.json |
|   |UserInfo|  String  |获取用户信息|data/user-info.json|
|   |UserSetting|  String  |获取用户个性化配置|data/user-setting.json|
|   |Menu|String|获取首页菜单数据|data/menu.json|
|   |Logout|String|登出链接|login.html|
|Menu|  |Object|菜单相关配置|   |
|   |Loader|Function|菜单数据加载过滤器|function(data) { return data[0].children; }|
|   |Icons|Map|传入菜单ID和图标所对应的class|{DASHBOARD: 'icon-base icon-base-home'}|
|   |LargeIcons|MAP|传入菜单ID和大图标所对应的class（大图标用在混合菜单顶部）|  |
|   |Dashboard|Object|首页信息相关配置||
|   |——(id)|String|首页菜单ID||
|   |——(text)|String|首页菜单名称||
|   |——(icon)|String|首页菜单图标||
|   |——(url)|String|首页菜单链接||
|   |——(external)|Boolean|是否以iframe方式打开||
|   |——(closable)|Boolean|是否可以关闭||
|Cache| |Object|系统缓存相关配置||
|   |Init|Array|初始化加载的缓存|[{id: 'UnitInfo', url: 'data/user-info.json'}]|
|Dictionary||Object|系统缓存数据字典相关配置||
|   |Init|Array|初始化加载的数据字典|['OptType', 'OptLevel']|


