[^]:title:江苏南大先腾业务框架（七）通知与消息机制[附源码]

# 概述
框架中提供的基础服务都是通过接口将实现和调用分离，这样应用开发人员可以根据业务的需求定制符合用户需求的实现方式。

系统中的消息分两种：
1. 信息，针对一个用户发送的信息，比如：待办提醒、日程提醒等待。
2. 通知，针对一个群体，比如：部门、小组，的广播消息。

框架中和通知相关的接口有两个：

4. NotificationCenter 根据消息发送策略向用户发送消息。
5. MessageSender 真正的消息发送接口。

# 源码分析
## 消息内容
消息内容可以是在线个用户发送的用户查看的信息，也可以是也前端应用改变状态的信息。消息内容可以和应用或者应用中的操作关联。
```java
public class NoticeMessage implements java.io.Serializable {
    /**
     * 消息类别 默认值 msg
     * 客户端可以根据不同的消息类别提供不同的 响应方式 或者 展示方式
      */
    private String msgType;
    /** 消息主题 这不是必须的
     * */
    private String msgSubject;
    /** 消息内容，为一个文本，不同的消息类别 可以有不同的格式
     */
    private String msgContent;
    /** 关联业务
     */
    private String optId;
    /**关联业务中的 方法、功能、模块
     */
    private String optMethod;
    /** 关联对象组件，多个主键用url参数的方式链接
     */
    private String optTag;
```
## 接口MessageSender
[MessageSender](https://github.com/ndxt/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/model/adapter/MessageSender.java) 只有一个需要实现的方法。它式真正发送消息的地方。
```java
 /**
     * 发送内部系统消息
     *
     * @param sender     发送人内部用户编码
     * @param receiver   接收人内部用户编码
     * @param message 消息主体
     * @return "OK" 表示成功，其他的为错误信息
     */
    String sendMessage( String sender, String receiver, NoticeMessage message);
```
框架中内置了一些具体的实现：
1. [DummyMessageSenderImpl](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/impl/DummyMessageSenderImpl.java)这个是一个哑实现，仅仅用于测试桩。
2. [EmailMessageSenderImpl](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/impl/EmailMessageSenderImpl.java)是通过email发送消息的实现。
3. 项目[centit-framework-system](https://github.com/ndxt/centit-framework-system)中[InnerMessageManagerImpl.java](https://github.com/ndxt/centit-framework-system/blob/master/framework-system-module/src/main/java/com/centit/framework/system/service/impl/InnerMessageManagerImpl.java)实现了一个通过数据库表来存储的内部消息机制。
## 接口NotificationCenter
[NotificationCenter](https://github.com/ndxt/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/model/adapter/NotificationCenter.java) 提供的发送消息的方式和接口MessageSender类似，额外多了写个消息发送注册接口，将方式方式（noticeType/sendType）和MessageSender 关联起来。NotificationCenter可以通过指定的方式给用户发送，也可以根据用户设置的接收方式发送，用户可以定义多个接收方式。默认情况下通过后者给用户发送消息。框架中也有多个实现：

1.  [SimpleNotificationCenterImpl](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/impl/SimpleNotificationCenterImpl.java) 实现了唯一的发送方式的通知方案。
2.  [NotificationCenterImpl](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/impl/NotificationCenterImpl.java) 实现了可以根据用户设置接收方式的发送方案。
3. 项目 [centit-msgpusher](https://github.com/ndxt/centit-msgpusher) 中的[SimpleNotificationCenterPlusMsgPusherImpl](https://github.com/ndxt/centit-msgpusher/blob/master/msgpusher-notification/src/main/java/com/centit/msgpusher/notification/SimpleNotificationCenterPlusMsgPusherImpl.java)在SimpleNotificationCenterImpl的基础上添加了对在线用户的websocket推送功能。使用这个功能需要引用msgpusher-notification 包。
4.  [centit-msgpusher](https://github.com/ndxt/centit-msgpusher) [NotificationCenterPlusMsgPusherImpl](https://github.com/ndxt/centit-msgpusher/blob/master/msgpusher-notification/src/main/java/com/centit/msgpusher/notification/NotificationCenterPlusMsgPusherImpl.java)和上面的相似在NotificationCenterImpl的基础上添加了对在线用户的websocket推送功能。
5.   [centit-msgpusher](https://github.com/ndxt/centit-msgpusher) [MsgPusherNotificationImpl](https://github.com/ndxt/centit-msgpusher/blob/master/msgpusher-client/src/main/java/com/centit/msgpusher/client/MsgPusherNotificationImpl.java)，这类是将消息发送的实现交给[msgpusher-server](https://github.com/ndxt/centit-msgpusher/tree/master/msgpusher-server)服务，msgpusher-server可以通过websocket对pc在线用户发送消息，同时也可以对iOS和android用户实现实时的消息推送。使用这个功能需要引用msgpusher-client 包，同时要启动msgpusher-server服务，这个服务需要单独运行。
 
# 使用示例
使用通知中心，需要分四步：
1. 定义消息发送类的bean（实现MessageSender接口的bean），可以有多个、也可以没有 在使用msgpusher-server时就不需要。
```java
	@Bean
    public EmailMessageSenderImpl emailMessageSender() {
        EmailMessageSenderImpl sender = new EmailMessageSenderImpl();
        sender.setHostName("mail.centit.com");
        sender.setUserName("suport");
        sender.setUserPassword("********");
        sender.setServerEmail("suport@centit.com");
        return sender;
    }
```
2. 定义个通知中心bean（实现NotificationCenter接口的bean）。
```java
	@Bean
    public NotificationCenter notificationCenter() {
        NotificationCenterImpl notificationCenter = new NotificationCenterImpl();
        //这个不是必须的,只是为了在没有真正的发送类时不报错
        notificationCenter.initDummyMsgSenders();
        //打开消息推送服务日志
        notificationCenter.setWriteNoticeLog(true);
        return notificationCenter;
    }
```
3. 在web初始化时将消息发送类的bean注册到通知中心bean中。
 ```java
 public class InstantiationServiceBeanPostProcessor
    implements ApplicationListener<ContextRefreshedEvent>{
    @Autowired
    protected NotificationCenter notificationCenter;
    @Autowired
    private EmailMessageSenderImpl emailMessageSender;
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event){
            notificationCenter.registerMessageSender("email", emailMessageSender);
            notificationCenter.appointDefaultSendType("email");
    }
```
4. 在使用的地方引入 通知中心bean 。
```java
    @Autowired
    protected NotificationCenter notificationCenter;
```




