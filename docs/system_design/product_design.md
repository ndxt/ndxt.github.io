# 产品设计

框架遵循层层渐进式的开发，首先将框架赖以运行的数据模型、基础服务抽象成接口；在这些接口的基础上开发一个基础的框架平台；然后在针对这些接口做不同的实现，就可以和框架平台组合成多种运行方式和部署结构。

## 框架平台

框架平台主要完成以下目标：

1. 定义前后端数据交换格式，参见[framework-adapter/common](https://github.com/ndxt/centit-framework/tree/master/framework-adapter/src/main/java/com/centit/framework/common)。
2. 定义框架的业务数据模型（包括：用户、组织、用户组织关系、业务、操作、权限等等）和框架平台接口。
3. 定义基础服务接口，包括：操作日志记录、通知消息等等。
4. 设计框架的安全体系和登录流程。

参见[centit-framework](https://github.com/ndxt/centit-framework).

### 框架平台模型和接口

接口PlatformEnvironment提供了平台运行的基础，也是平台[业务概念](./concept_design.html)的模型。框架中的其他的核心功能都是基于这个接口来开发，业务模块需要访问平台提供的基础数据也都是通过这个接口来访问。这个接口的内容包括：

1. 获取用户、组织、用户组织信息。
2. 获取业务操作、角色操作等信息。
3. 获取用户的角色、用户设置等信息。
4. 获取数据字典信息。

框架平台围绕这个接口开发，并且框架还提供了多种接口的实现方式，json数据配置、数据库存储、远程调用等方式从而产生各种部署方式。

### 登录流程和安全体系

框架采用spring security安全体系。spring security集成了多种身份验证方式，框架实现了最基本的两种验证方式：
1. 用户名密码验证方式。系统提供两种密码加密方式，一种是标准的随机盐的加密方法（StandardPasswordEncoderImpl），这也是框架默认的加密方式；还有一种是用用户代码作为盐的加密方法（CentitPasswordEncoderImpl）。
2. 和[Apereo cas](https://www.apereo.org/projects/cas)集成的单点登录认证方式。[centit-cas](https://github.com/ndxt/centit-cas/)在Apereo cas基础上开发了更多的密码验证方式（比如：ldap验证方式）和一套登录页面。

Spring security使用一组过滤器来对资源进行保护，其过滤器的执行流程如下：

1. DaoFilterSecurityInterceptor 负责过滤器的执行，在执行获取用户的session。
2. DaoInvocationSecurityMetadataSource 复制将url映射到业务操作，并查找对应的角色集合。
3. DaoAccessDecisionManager 判断用户是否有权限访问资源。
4. 如果没有权限访问，会抛出401错误。
5. 前段接到401错误跳转到登录页面。

所以spring security并不要求用户一定到先登录才可以操作，不登录也可以做不受保护的操作，开发是一定要注意。详情参见[framework-security](https://github.com/ndxt/centit-framework/tree/master/framework-security)。

### 启动与配置空间

框架采用spring 4.* 来开发，使用了spring 配置类的新特性，将web服务中所有的配置信息用java类来实现，可能需要实施修改（配置）的内容全部集中放在system.properties这一个属性文件中。配置参数的设计原则：

1. 90%以上配置参数都是有默认值的。
2. app.* 和 login.* 是必须的，其他的都是可选的。比如：有数据就需要jdbc.\*，使用活动目录验证就要 ldap.\*。

java的配置类一般位于项目的config包中。配置类一般有一下几类：

1. web环境配置类，代替传统的web.xml。一般类名为 WebInitializer。
2. ServiceConfig 是spring 容器管理bean的配置入口。系统的[framework-config](https://github.com/ndxt/centit-framework/tree/master/framework-config)
3. NormalSpringMvcConfig，业务接口配置，和SystemSpringMvcConfig系统接口配置类似。
4. InstantiationServiceBeanPostProcessor，web启动钱初始化工作可以放在这个bean中配置。主要用于及加载框架的消息服务类、日志写入服务类等等。

配置项说明参见[framework-web-demo](https://github.com/ndxt/centit-framework/tree/master/framework-web-demo)。

## 最简实现

## 带系统维护平台

## 业务集成平台

## 基于Spring cloud微服务平台

## 前段框架


## 工具与服务等通用模块

南大先腾框架后期的建设重点就是逐步完善并开发更多的通用模块。框架的开发策略就是核心模块（framework）越来越稳定，通用功能服务、工具模块越来越丰富。

目前框架已经有一些通用模块，参见[相关项目](https://ndxt.github.io/projects/)。


