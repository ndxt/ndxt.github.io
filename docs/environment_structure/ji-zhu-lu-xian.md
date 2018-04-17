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
     @RequestMapping(value = "/checkuserpower/{optId}/{method}", method = { RequestMethod.GET })
     @ResponseBody
     public boolean checkUserOptPower(@PathVariable String optId,
                                  @PathVariable String method, HttpServletResponse response) {
        return CodeRepositoryUtil
                .checkUserOptPower(optId,method);
    }

//或者
    @RequestMapping(value = "/checkuserpower/{optId}/{method}", method = { RequestMethod.GET })
    public void checkUserOptPower(@PathVariable String optId,
                                  @PathVariable String method, HttpServletResponse response) {
        boolean s = CodeRepositoryUtil
                .checkUserOptPower(optId,method);
        JsonResultUtils.writeOriginalObject(s, response);
    }

//只返回处理结果

    @PutMapping(value = "/setuserposition/{userUnitId}")
    public ResponseData setUserCurrentStaticn(@PathVariable String userUnitId,
            HttpServletRequest request) {
        CentitUserDetails currentUser = WebOptUtils.getLoginUser(request);
        if(currentUser==null){
            return new ResponseSingleData(ResponseData.ERROR_SESSION_TIMEOUT,
                    "用户没有登录或者超时，请重新登录。");
        }
        return new ResponseSingleData();
    }

//或者
    @PutMapping(value = "/setuserposition/{userUnitId}")
    public void setUserCurrentStaticn(@PathVariable String userUnitId,
            HttpServletRequest request,HttpServletResponse response) {
        CentitUserDetails currentUser = WebOptUtils.getLoginUser(request);
        if(currentUser==null){
            JsonResultUtils.writeErrorMessageJson(ResponseData.ERROR_SESSION_TIMEOUT,
                    "用户没有登录或者超时，请重新登录。", response);
            return;
        }
        JsonResultUtils.writeSuccessJson(response);
    }

//返回单个数据
    @GetMapping(value = "userranks/{rank}")
    @ResponseBody
    public ResponseData listUserUnitsByRank(@PathVariable String rank){
        CentitUserDetails centitUserDetails = WebOptUtils.getLoginUser();
        if(centitUserDetails == null){
            return new ResponseSingleData(ResponseData.ERROR_UNAUTHORIZED, "用户没有登录或者超时，请重新登录");
        }
        return ResponseSingleData.makeResponseData(
                DictionaryMapUtils.objectsToJSONArray(
                CodeRepositoryUtil.listUserUnitsByRank(centitUserDetails.getUserCode(), rank)));
    }
//或者    
    @GetMapping(value = "userranks/{rank}")
    public void listUserUnitsByRank(@PathVariable String rank, HttpServletResponse response){
        CentitUserDetails centitUserDetails = WebOptUtils.getLoginUser();
        if(centitUserDetails == null){
            JsonResultUtils.writeErrorMessageJson(ResponseData.ERROR_UNAUTHORIZED, 
                "用户没有登录或者超时，请重新登录",response);

            return;
        }
        return JsonResultUtils.writeSingleDataJson(
                DictionaryMapUtils.objectsToJSONArray(
                CodeRepositoryUtil.listUserUnitsByRank(centitUserDetails.getUserCode(), rank)),response );
    }

//返回多个数据
    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public ResponseDatalist(PageDesc pageDesc,
        HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> searchColumn = BaseController.convertSearchColumn(request);
        listObjects = sysUserManager.listObjects(searchColumn, pageDesc);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(BaseController.OBJLIST, listObjects);
        resData.addResponseData(BaseController.PAGE_DESC, pageDesc);
        return ResponseMapData;
    }    
//或者    
    @RequestMapping(method = RequestMethod.GET)
    public void list(PageDesc pageDesc,
                     HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> searchColumn = BaseController.convertSearchColumn(request);
        listObjects = sysUserManager.listObjects(searchColumn, pageDesc);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(BaseController.OBJLIST, listObjects);
        resData.addResponseData(BaseController.PAGE_DESC, pageDesc);

        JsonResultUtils.writeResponseDataAsJson(resData, response, simplePropertyPreFilter);
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

## 数据持久化

## MVC分层设计和脚手架




