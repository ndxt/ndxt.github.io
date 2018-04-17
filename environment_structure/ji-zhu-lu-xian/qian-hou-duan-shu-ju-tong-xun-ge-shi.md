# 前后端数据通讯格式

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

```java
CloseableHttpClient client = HttpExecutor.createKeepSessionHttpClient();
ResponseJSON resJson = ResponseJSON.valueOfJson(HttpExecutor.simpleGet(client,"url"));
client.close();
```



