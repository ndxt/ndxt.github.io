[^]:title:江苏南大先腾业务框架（六）身份认证与session管理[附源码]

# 概述
先腾框架的安全体系采用了spring security的框架。本文主要阐述框架中在身份认证和session管理方面的考虑。

# 身份认证
## 认证方式配置
Spring security提供了多种认证方式：ldap、用户名密码、cas单点登录、OAuth等等，非常灵活，我们只需要做响应的配置就可以了。日常中我们用的最多的就是用户名密码和单点登录。所以框架[framework-config](https://github.com/ndxt/centit-framework/tree/master/framework-config)中实现了这两个类验证的配置方式，开发人员只要在属性文件中配置以下内容就可以了。

```shell
# 启动用户名密码验证
login.dao.enable= true
# 启动cas单点登录认证
login.cas.enable= false
login.cas.localHome = http://localhost:8085/framework
login.cas.casHome = http://localhost:8080/centit-cas
```
如果使用其他的配置方式就需要将这两个属性都配置为false，然后自行编写对应的配置类。

## 密码加密方式

使用用户名密码配置时，密码是要加密为密文存储的，笔者认为一个好的密码加密方式应该具备一下特点：
1. 密文不可逆，就是无法从密文知道密码，这个一般用散列的方式，比如：md5，SHA-1等散列算法。
2. 相同的密码密文不能都是一样，所以一般在散列算法中“加盐”，并且为了提高破解难度可能会多次散列。
3. 不同用户的密文不能通用，就是一个用户密文复制到另外一个用户名下，不能使用，这个可以将2中的盐和用户的主键关联。

Spring security 4.* 版本以后推荐使用 org.springframework.security.crypto.password.PasswordEncoder 不支持上面的3特性，而之前 org.springframework.security.authentication.encoding.PasswordEncoder 是支持用户属性作为盐的。Spring 的理由是“ better accommodates best practice of randomly generated salt that is included with the  password.” 好在这两个接口都得以保留。框架同时实现了这两个接口，开发人员可以根据自己的需求选择。开发人员只要定义，源码参见[framework-core](https://github.com/ndxt/centit-framework/tree/master/framework-core/src/main/java/com/centit/framework/security/model) ，通过bean的形式注入到框架中:
```java
 	@Bean("passwordEncoder")
    public Object passwordEncoder() {
    	// org.springframework.security.crypto.password.PasswordEncoder 
        return new StandardPasswordEncoderImpl();
        // org.springframework.security.authentication.encoding.PasswordEncoder 
        //return new CentitPasswordEncoderImpl();
    }
```
# session管理

## session的内容

用户登录后框架会创建一个 [CentitUserDetails](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/security/model/CentitUserDetails.java) 对象。它包含：

1. 用户的基本信息
2. 用户的岗位信息
3. 用户的权限信息
4. 用户的角色列表
5. 用户的设置信息

## session持久化

Session可以存放在内存中，也可以存放在数据库比如H2或者Redis数据库中。需要实现[SessionRegistry](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/security/model/MemorySessionRegistryImpl.java) 接口。

# 用户登录
## 登录方式

1. 系统集成的spring security 有多种登录方式，可以通过配置实现用户名密码登录、ldap登录、cas单点登录等等。
2. 为了提供进程间通讯，提供给应用程序客户端的登录方式"/system/mainframe/loginasclient"这个和spring security 提供的login接口一样，不同的是这个提供了特别的授权方式，让登录的服务可以访问系统提供的服务接口。
3. 第三方认证互信接口"/system/mainframe/loginasthird"，调用这个接口需要提供ThirdPartyCheckUserDetails类型的bean它需要开发人员自己实现第三方认证机制。

## 身份识别

一般请求可以通过携带cookie的方式来说明自己的身份，在无法使用cookie的情况下可以在request的header的Authorization属性中设置token，这个token在用户以ajax形式认证时服务器返回的信息中包括这个值，客户端需要保存好这个token。