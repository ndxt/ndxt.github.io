[^]:title:江苏南大先腾业务框架（九）RESTFUL服务与返回数据格式[附源码]

# 概述

框架是基于前后端分离的架构思想开发的，后端以restful风格url提供返回json格式的数据服务。框架对返回结果的形式做了一个约定，返回形式如下的json：
```json5
{
    code:'integer 型，0 表示成功，其他均为错误代码， 不可以为空',
    message:'code=0：消息：code!=0:错误信息。 也可以为空',
    data:'any 可以是简单的一个数字，也可以是一个复杂的对象，Map等等，甚至可以为 null'
}
```
客户端获取返回结果首先判断code的值，如果是0再从data中获取真正的返回数据。

# 服务端开发最佳实践

先用一段代码来展示一下：
```java
    @ApiOperation(value="根据学号查询学生",notes="根据学号查询学生。")
    @ApiImplicitParams(@ApiImplicitParam(
        name = "studNo", value="学号必须是两位数",
        required=true, paramType = "path", dataType ="String"
    ))
    @GetMapping("/student/{studNo}")
    @WrapUpResponseBody
    public Student findStudent(@PathVariable String studNo) {
        if(StringUtils.length(studNo)!=2){
            throw new ObjectException(studNo,
                ObjectException.DATA_NOT_FOUND_EXCEPTION,
                "找不到对应学号的学生");
        }
        Student stud = new Student();
        stud.setStudNo(studNo);
        stud.setStudName("小强");
        return stud;
    }
```
说明：

1. @WrapUpResponseBody 注解会将返回的结果转化为json，并添加code和message部分。
2. 框架会统一对异常进行处理，将ObjectException异常中的 data,code,error(message)转化为json格式，如果式普通的异常code=500,data为null。

# 其他实现方式
除了用WrapUpResponseBody注解的方式，用其他的方式也可以，只要保证返回的格式和约定的一致就行。
## ResponseBody 注解
框架定义了[ResponseData](https://github.com/ndxt/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseData.java)接口，并作了两个的实现。同样上面的示例：

```java
        @GetMapping("/student2/{studNo}")
        @ResponseBody
        public ResponseData findStudent2(@PathVariable String studNo) {
            if(StringUtils.length(studNo)!=2){
                /*throw new ObjectException(studNo,
                    ObjectException.DATA_NOT_FOUND_EXCEPTION,
                    "找不到对应学号的学生");*/
                //直接返回错误数据，和上面的throw在返回结果上是等价的。
                return ResponseData.makeErrorMessageWithData(studNo,
                    ObjectException.DATA_NOT_FOUND_EXCEPTION,
                    "找不到对应学号的学生");
            }
            Student stud = new Student();
            stud.setStudNo(studNo);
            stud.setStudName("小强");
            return ResponseData.makeResponseData(stud);
        }

```
这个实现方式和上面注解方是等价的，说明：
1. 和WrapUpResponseBody注解示例主要的区别式返回类型不同，这个有一个缺点就是Swagger2的文档说明中无法展示真正返回数据Student的结构。
2. 错误处理部分依然可以使用 throw 异常的形式，这里只是突出另一种写法。

## 不使用spring mvc的情况

框架实现了一个返回结果的工具类[JsonResultUtils](https://github.com/ndxt/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/JsonResultUtils.java)可以直接对response中的outputStream进行操作，这样根加灵活，直接上代码：

```java
    // 返回错误，这个参数的顺序和上面的有点不一致
    JsonResultUtils.writeSingleErrorDataJson(604,"找不到对应学号的学生", studNo, response );
    // 返回正确数据
    JsonResultUtils.writeSingleDataJson(stud,response);
    //也可以构建 ResponseData 对象
    JsonResultUtils.writeResponseDataAsJson(ResponseData.makeResponseData(stud),response)
```
