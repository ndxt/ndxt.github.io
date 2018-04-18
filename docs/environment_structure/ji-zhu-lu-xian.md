# 技术体系设计

技术方面既要跟上快速的发展步伐又要减少学习成本同事还要兼顾开发人员的使用习惯，本身就是一个非常矛盾的事情；也是没有办法做到尽善尽美的。框架在技术方面的目标是让开发人员不需要学习太多的新的技术就可以使用框架，比如你不需要知道spring security的机制和原理，只要按照框架的约定开发，就已经应用了这个安全框架；让开发人员把跟多的精力集中在业务的理解和实现上。框架的设计理念和spring boot 非常相像，没有直接采用spring boot 的原因是在框架设计之初spring boot还没有流行，我们还不知道有这个东西；现在我们的框架已经将所有的配置信息和业务代码剥离可以直接一直到spring boot项目中。

技术体系设计主要考虑一下内容：

1. 统一的功能权限、数据范围权限控制。

2. 统一的用户、机构及关联关系，目的是为了统一实现工作流程设定。

3. 统一技术栈，减少员工的交流成本。技术栈在满足业务需求的情况下尽量减少，并且适当找过开发人员的使用习惯。

4. 不重复发明轮子，但也不为此而对业务需求进行妥协。

**特别说明一下第4点，框架更多的是一个代码联合剂将众多开源平台整合在一起、所以某种意义上也可以说框架是一个学习教程。但是我们还是在两个方面发明了自己的轮子，一：参数驱动sql 二：工作流引擎，具体原因参见对应的章节。**

## 统一技术栈
### 框架平台的技术路线

框架经过多少改版，现在基本上全面拥抱spring体系，并且可以很容易的迁移到spring boot。框架现在是4.0版本，相比3.×最大的变化就是前后端分离，前端页面显示和后端的逻辑设计完全分离。

### 前端技术路线

目前前端有一套基于[easyui](https://github.com/ndxt/centit-ui/tree/master/framework-base-view-easyui)的框架，正在研发一套基于vue的框架。

### 后端技术路线

后端采用的主要技术栈如下：

1. 基本算法类采用 apache commons系列。
2. [centit-commons](https://github.com/ndxt/centit-commons) 作为基础算法的补充，其中最为重要的是[compiler](https://github.com/ndxt/centit-commons/tree/master/centit-compiler)一个简化四则运算作为框架的规则引擎使用。
3. 采用fastjson作为json的解析工具。
4. 采用spring作为bean的容器和事务管理工具，spring mvc作为后端分层模型，spring security作为安全框架。spring 采用4.×版本。
5. 持久化公司[**centit-persistence**](https://github.com/ndxt/centit-persistence)工具类对spring-jdbc、Mybatis、Hibernate进行封装，使其都可以支持 参数驱动sql。推荐使用[centit-persistence-jdbc](https://github.com/ndxt/centit-persistence/tree/master/centit-persistence-jdbc)它用sping jdbc实现了jpa使用和hibernate一样便捷，并且查询更加灵活。
6. 采用json格式作为前后端的数据通讯格式。
7. 采用restful风格的接口规范。

## 前后端数据通讯格式

框架现在是4.0版本，相比3.×最大的变化就是前后端分离，前端页面显示和后端的逻辑设计完全分离，部署在不同的服务容器上。框架强力建议前段采用html+js（或者js框架比如 easyui、vue等等）的静态方案，但是这并不是强制，开发依然可以使用jsp、velocity等等前段解决方案，但是要求前段必须单独一个服务。这样做的目的是要求开发组将后端的业务通过接口的方式抽象出来，好处是不同平台的客户端，pc端、iOS、Android等等可以用共同的后端。减少后期的维护成本。

后端采用restful风格的接口，前后端用json的数据格式交换。后端除了返回单个数字、字符串、布尔型等标量其他的json都要符合[ResponseData](http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseData.java)定义的接口标准。

```java
    // http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter\
    // /src/main/java/com/centit/framework/common/ResponseData.java
    //JSON有三个域，其中data
    String RES_CODE_FILED="code";    
    String RES_MSG_FILED="message";
    String RES_DATA_FILED="data";
    //处理结果，0标识正常，其他的为错误号  ，具体错误好参见接口中的注释 
    int getCode();
    //处理结果的文字说明
    String getMessage();
    //返回数据，可以是任何类型数据包括数组，如果返回多个结果可以用Map
    Object getData();
```

这个接口有两个具体的实现[ResponseSingleData](http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseSingleData.java)和[ResponseMapData](http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseMapData.java)，在客户端接受到这个JSON时可以用[ResponseJSON](http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseJSON.java)来解析。框架中[JsonResultUtils](http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/JsonResultUtils.java)类提供了直接向HttpServletResponse写符合上述格式要求的JSON的便捷方法。所以在controller类中可以有多种方式来实现json格式的数据返回，示例代码如下：

```java
//返回一个标量,比如:数字\字符串\布尔值等等
     @RequestMapping(value = "/url", method = { RequestMethod.GET })
     @ResponseBody
     public boolean checkUserOptPower(@PathVariable String optId,
                                  @PathVariable String method, HttpServletResponse response) {
        return true;
    }

//返回符合格式的JSON对象
    @PutMapping(value = "/url")
    @ResponseBody
    public ResponseData forExample() {
        //仅仅返回成功信息
        return new ResponseSingleData();
        //返回错误信息
        return new ResponseSingleData(ResponseData.ERROR_SESSION_TIMEOUT,
                    "用户没有登录或者超时，请重新登录。");
        //返回单个数据对象
        return ResponseSingleData.makeResponseData(new Object[]{"hello","world"});
        //返回多个对象
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(BaseController.OBJLIST, new Object[]{"hello","world"});
        resData.addResponseData(BaseController.PAGE_DESC, new PageDesc());
        return resData;
    }

//用JsonResultUtils直接向 HttpServletResponse response 写json字符串的方式返回json
    @PutMapping(value = "/setuserposition/{userUnitId}")
    public void forExample(HttpServletResponse response) {
        //返回一个标量
        JsonResultUtils.writeOriginalObject(true, response);
        //仅仅返回成功信息
        JsonResultUtils.writeSuccessJson(response);
        return;
        //返回错误信息
        JsonResultUtils.writeErrorMessageJson(ResponseData.ERROR_UNAUTHORIZED, 
                        "用户没有登录或者超时，请重新登录",response);
        return;
        //返回单个数据对象
        JsonResultUtils.writeSingleDataJson(new Object[]{"hello","world"}, response);
        return;
        //返回多个对象
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(BaseController.OBJLIST, new Object[]{"hello","world"});
        resData.addResponseData(BaseController.PAGE_DESC, new PageDesc());
        JsonResultUtils.writeResponseDataAsJson(resData, response);
        return;
    }
```

前端获取后端返回的json字符串可以使用[ResponseJSON](http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseJSON.java)来解析。示例代码：

java客户端

```java
CloseableHttpClient client = HttpExecutor.createKeepSessionHttpClient();
ResponseJSON resJson = ResponseJSON.valueOfJson(HttpExecutor.simpleGet(client,"url"));
client.close();
```

js客户端

```js
//请张凯补充
```

## 参数驱动SQL

参数驱动sql它是一个sql预处理引擎，他通过条件标签[],外置条件插入标签{}和预处理标签来将对数据库查询的逻辑规则从代码中剥离出来。设计这个参数化驱动sql的主要目标有：
1. 避免根据输入条件进行复杂的sql语句拼接工作。目标是将前段输入的条件直接转换为Map作为参数驱动sql的参数。
2. 统一处理数据范围权限包括数据行范围和数据的列范围。
### 条件标签[]
语法: [(条件)(参数列表)| sql语句片段]

意义是如果“条件”成立，sql语句片段将生效，并将参数列表中的参数加入最终sql语句的参数中，其中参数列表是可选的。

先介绍一个名词**参数引用描述符**,它是来引用Map参数中变量的。可以直接用名称引用，也可以用value.attr的形式来引用Map中变量的属性。如果Map中的变量名称比较特殊不符合标识符规范比如中文，可以用${变量名称}。

条件：条件是一个逻辑运算表达式，其中可以直接用参数引用描述符引用参数Map中的变量。

参数列表：是用“，”分开的多个参数，形式为**参数引用描述符：(预处理指令列表)SQL语句变量名称**;如果参数引用描述符和sql语句变量名称一样，参数引用描述符可以省略。

举个例子：
```sql92
-- Map中有变量 a、b、c、d
-- 参数驱动sql如下：
select [(a>1)| t1.col1, ] t2.col2
from [(a>1)| table1 t1 join ] table2 t2 [(a>1)| on (t1.id=t2.id) ]
where t2.col3> 5 [(a>1 && b>1)(b:num)| and t1.col3 > :num][ (c>1)(:c) |and t2.col4 > :c ]
[(isnotempty(d))(:(inplace)d)| order by :d desc ]
--如果Map的值为 a:2, b:0 , c:2 , d: 't2.col4' 转换后的语句如下
select t1.col1, t2.col2
from table1 t1 join  table2 t2 on (t1.id=t2.id) 
where t2.col3> 5 and t2.col4 > :c
order by t2.col4 desc 
-- sql与的参数为 c:2
```
如果条件只是判断输入的参数是否为空有则可以将条件省略并且同时需要省略参数列表外层的（）;如果这个参数仅用于判断则参数中的sql语句变量名称也要省略。举个例子：
```sql92
-- Map中的变量 a：'4'、user:{name：'先腾'}、c：notnull
select t1.col1, t1.col2
from table1 t1
where 1=1 [:(number)a| and t1.col3>:a] [user.name:name| and t1.name=:name ]
   [c | and t1.col4 not null] [:e| and t1.col5 =:e]
-- 转换后的语句为
select t1.col1, t1.col2
from table1 t1
where 1=1 and t1.col3>:a and t1.name=:name 
    and t1.col4 not null
-- sql与的参数为 a:4 , name:'先腾'
```
### 外置条件插入标签{}
语法：{数据库表名列表}, 多个表名用","分隔，表名和别名用空格或者":"分隔。

示例：{table1 t1, table2 t2}

这个标签作用是将针对标签中的表对应的额外的顾虑条件插入到标签所在的位置，现在这个标签只能放在where语句部分。

外部语句是作为字符串列表来传入的，每个字符串为一个条件语句；条件语句为一个sql语句条件表达式，其中用[表名称.字段名]来指定字段，用{参数引用描述符：(预处理指令列表)SQL语句变量名称}来引用变量，可以是用户相关的变量、环境变量或者前端输入的变量等等。

举个例子：
```java
    List<String> filters = new ArrayList<String> ();
    filters.add("[table1.c] like {p1.1:ps}");
    filters.add("[table1.b] = {p5}");
    filters.add("[table4.b] = {p4}");
    filters.add("([table2.f]={p2} and [table3.f]={p3})");
    Map<String,Object> paramsMap = new HashMap<String,Object>();       
    paramsMap.put("p1.1", "1");
    paramsMap.put("p2", "3");
     
    String queryStatement = "select t1.a,t2.b,t3.c "+
        "from table1 t1,table2 t2,table3 t3 "+
        "where 1=1 {table1:t1} order by 1,2";
         
    System.out.println(QueryUtils.translateQuery(queryStatement,filters,paramsMap,true).getQuery());
    结果是：
    select t1.a,t2.b,t3.c from table1 t1,table2 t2,table3 t3
    where 1=1  and (t1.c like :ps ) order by 1,2
```
在实际使用中可以将外置条件配置在数据库中并和具体的操作关联，在配置角色操作时同事指定对应的范围条件，条件中通过{参数引用描述符}应用用户属性。这样在具体的查询时可以获得额外的语句，根据当前用户属性获得对应的参数值。框架中[GeneralServiceImpl](https://github.com/ndxt/centit-framework-system/blob/master/framework-system-module/src/main/java/com/centit/framework/system/service/impl/GeneralServiceImpl.java) 可也作为外部条件和用户变量生产示例，具体业务可以模仿这个类来实现。

### 参数预处理
在参数前面的预处理指令列表可以是多个，预处理会按照顺序执行。预处理的主要作用有：类型转换、查询模式生产、语句替换等等。详细预处理列表参见 [QueryUtils.java](https://github.com/ndxt/centit-commons/blob/master/centit-database/src/main/java/com/centit/support/database/utils/QueryUtils.java)。

## 数据持久化
### 统一增删改查操作
为了照顾绝大部分开发人员，所以框架没有对持久化做严格的限制，[centit-persistence](https://github.com/ndxt/centit-persistence)分别对Spring jdbc、Hibernate、MyBatis进行了封装。推荐使用jdbc。框架对持久化封装的目标有：

1. 用任意持久化框架实现**增删改**，开发人员都不需要写sql语句，sping jdbc中做了jpa的简单的实现，所以也无需写sql代码。
2. 通过参数驱动sql执行**查询**操作，jdbc直接原生sql，Hibernate通过NativeQuery支持sql，Mybatis的Mapper文件中可以直接写sql。对参数驱动sql的支持jdbc和Hibernate都是通过先处理参数驱动sql得到最终的sql来执行，Mybatis是通过插件来[ParameterDriverSqlInterceptor.java](https://github.com/ndxt/centit-persistence/blob/master/centit-persistence-mybatis/src/main/java/com/centit/framework/mybatis/plugin/ParameterDriverSqlInterceptor.java)来实现的。
3. 框架还实现了DatabaseOptUtils类，对常用的持久化操作进行封装，比如：调用存储过程，执行sql语句等等。

### 数据源

框架默认只能设置一个数据源，框架[DynamicDataSource](https://github.com/ndxt/centit-persistence/blob/master/centit-persistence-core/src/main/java/com/centit/framework/core/datasource)实现动态数据源，配合注解TargetDataSource可以实现数据源的选择。

如果数据源在开发时是未知的，比如是用户通过界面设定的可以用[centit-database-datasource](https://github.com/ndxt/centit-commons/tree/master/centit-database-datasource)中的DbcpConnectPools类来管理链接，用TransactionHandler执行事务。

## MVC分层设计和脚手架

在信息管理系统或则OA类等先腾的典型业务中的功能模块都会应对到数据库中的一个业务主表，所以我们的设计一般为围绕数据库表结构展开，我们推荐使用powerDesigner来做表结构设计。[centit-scaffold](https://github.com/ndxt/centit-scaffold)是一个脚手架工程，他会根据pdm中的表定义和模板文件自动生成前后台代码。生成的代码实现了增删改查功能会对应的页面。开发人员可以根据自己项目的要求编写[模板](https://github.com/ndxt/centit-scaffold/tree/master/src/main/resources)。

这个脚手架目前还没有图形界面的实行，是通过[一个xml文件](https://github.com/ndxt/centit-scaffold/blob/master/src/main/resources/scaffoldtask2.xml)来描述生产策略的，通过运行[RunScaffoldTask2.java](https://github.com/ndxt/centit-scaffold/blob/master/src/main/java/com/centit/support/scaffold/RunScaffoldTask2.java)来执行转换。

还有一个类[RunScaffoldTask.java](https://github.com/ndxt/centit-scaffold/blob/master/src/main/java/com/centit/support/scaffold/RunScaffoldTask.java)是针对struts版本的，struts处理在遗留项目外已经不允许使用。