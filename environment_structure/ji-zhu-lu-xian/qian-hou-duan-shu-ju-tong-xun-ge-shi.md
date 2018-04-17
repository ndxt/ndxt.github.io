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

这个接口有两个具体的实现ResponseSingleData和ResponseMapData，在客户端接受到这个JSON时可以用ResponseJSON来解析。



