[^]:title:江苏南大先腾业务框架（八）操作日志记录[附源码]

# 概述
框架通过接口将日志的记录和调用分离，并通过RecordOperationLog注解实现AOP方式的日志记录；同时OperationLogCenter类通过静态方法向应用开发人员提供了更加灵活的日志记录方式。

框架中的日志一共分三类：
1. log4j记录的程序运行日志，一般用于debug。
2. 操作日志是指，业务系统需要记录的用户操作日志，比如：用户登录、授权、业务审批等敏感操作日志，用于业务的跟踪和还原。
3. 用户行为日志，一般在前端用插件收集，比如pwiki。

本文中讲的日志均值操作日志。

# 接口和函数说明
## 接口[OperationLogWriter](https://github.com/ndxt/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/model/adapter/OperationLogWriter.java)
开发人员可以通过实现这个接口来做自己的日志保存策略，框架也提供了多种实现方式：
1. [TextOperationLogWriterImpl](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/impl/TextOperationLogWriterImpl.java) 将日志写入到文本文件中。
2. [Log4jOperationLogWriterImpl](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/impl/Log4jOperationLogWriterImpl.java) 将日志写入操作交给log4j。
3. [OptLogManagerImpl](https://github.com/ndxt/centit-framework-system/blob/master/framework-system-module/src/main/java/com/centit/framework/system/service/impl/OptLogManagerImpl.java) 这个是[框架待系统维护版本](https://github.com/ndxt/centit-framework-system)提供的一个将日志写数据库的实现。

开发人员可以根据自己的需要编写自己的日志记录方式，比如：和logstash对接，用elk来分析日志。
## 工具类 [OperationLogCenter](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/OperationLogCenter.java)

这个日志类的策略是将日志一个BlockingQueue中，等系统空闲式批量写入。这个工具类还提供了一组静态方法用于记录日志：
```java
/**
    * 记录日志内容 
    * @param loglevel 操作日志还是错误提示
    * @param userCode 操作人员
    * @param optId    业务代码（类别）
    * @param optTag   对象主键，如果是联合主键请用url的方式编写，比如a=1;b=2
    * @param optMethod 操作方法
    * @param optContent 操作内容描述
    * @param newValue 新增json(或者操作参数明细，比如查询操作可以记录查询参数)
    * @param oldValue 旧值json
    */
 public static void log(String loglevel, String userCode, String optId, String optTag, String optMethod,
           String optContent,String newValue,String oldValue) {
       OperationLog optLog = new OperationLog(loglevel, userCode, optId, optTag, optMethod,  optContent ,newValue, oldValue);
       optLog.setOptTime(new Date());
       log(optLog);
   }
```

注：如果使用OptLogManagerImpl记录人日志，虽然它们和业务系统使用的是一个数据库链接，也用的同一个事物管理器，但是它们不在一个线程中所以它们不在同一事务中，也就是说如果业务失败了回滚了，但是日志还是会记录的。

# AOP方式记录日志
框架中提供了[RecordOperationLog](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/operationlog/RecordOperationLog.java) 并且提供了Aop方式的实现[RecordOperationLogAspect](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/operationlog/RecordOperationLogAspect.java)。

RecordOperationLog注解中的content为一个字符串模板，其格式参见[字符串模板生成字符串](https://blog.csdn.net/code_fan/article/details/83863965)。
```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RecordOperationLog {
    /**
     *
     * @return 记录操作内容，理论上这个不能为空
     */
    @AliasFor("value")
    String content() default "";
    /**
     * 是否记录操作时间
     * @return boolean
     */
    boolean timing() default false;
    /**
     * 是否将HttpRequest中的参数放入newValue中，
     * 一般查询都需要将这个 参数设置为true
     * @return boolean
     */
    boolean appendRequest() default false;
}
```

# [使用示例](https://github.com/ndxt/centit-framework/tree/master/framework-core/src/main/java/com/centit/framework/operationlog)

框架提供两种方式记录操作日志。

## 注解方式 RecordOperationLog

通过在controller类的方法上添加 RecordOperationLog 注解记录日志。
1. 注解中的 content 是一个日志内容模板。模板中可以用{}嵌入方法的参数或者参数的属性。第一个参数为arg0，第二个为org1以此类推。
2. timing 表示是否记录方法的执行时间。
3. appendRequest 表示是否要把request中的参数记录到日志中。

```java
 /**
     * 新增菜单
     * @param optInfo  业务菜单信息
     */
    @ApiOperation(value="新建系统业务菜单",notes="新建系统业务菜单。")
    @ApiImplicitParams(@ApiImplicitParam(
        name = "optInfo", value="业务菜系信息",
        required=true, paramType = "body", dataTypeClass= OptInfo.class
    ))
    @RequestMapping(method = {RequestMethod.POST})
    @RecordOperationLog(content = "操作IP地址:{loginIp},用户{loginUser.userName}新增{optInfo.optName}菜单")
    @WrapUpResponseBody
    public OptInfo createOptInfo(@ParamName("optInfo") @Valid OptInfo optInfo) {
        optInfoManager.saveNewOptInfo(optInfo);
        CodeRepositoryCache.evictCache("OptInfo");
        return optInfo;
    }
```

## 直接调用 OperationLogCenter

这个工具类可以直接调用日志记录接口写入用户自定义的日志信息。参见[日志写入接口](https://github.com/ndxt/centit-framework/tree/master/framework-adapter/src/main/java/com/centit/framework/model/adapter)。

## 日志记录接口注入

```java
/**
 * Created by codefan on 17-7-6.
 * 需要在配置类中创建这个 Bean 才能是日志生效
 */
public class InstantiationServiceBeanPostProcessor implements ApplicationListener<ContextRefreshedEvent>
{
    @Autowired
    private OperationLogWriter optLogManager;
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event){
        if(optLogManager!=null) {
            OperationLogCenter.registerOperationLogWriter(optLogManager);
        }
        //......
    }
}
```

## 其他注意事项

操作日志记录只负责日志的写入操作，不负责日志的查询和统计工作。centit-framework-system有一个针对写入数据库的日志简单的查询和管理功能。
