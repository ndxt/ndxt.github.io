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

### 启动与系统配置

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

[centit-framework](https://github.com/ndxt/centit-framework)是基于框架的最简单的实现，没有持久化操作，没有维护工作，所以叫静态实现；但是可以实现用户的登录、权限的控制等等。

1. [framework-system-static](https://github.com/ndxt/centit-framework/tree/master/framework-system-static)是框架基于JSON的最简静态实现。主要工作有：
  * 定义一组基本要素（用户、组织、业务、数据字典等等）的po。
  * 用一个json文件维护所有的基本要素的内容。
  * JsonPlatformEnvironment 实现了框架接口的所有方法。
这样框架运行的条件就全部具备了。
2. [framework-system-static-jdbc](https://github.com/ndxt/centit-framework/tree/master/framework-system-static-jdbc)在framework-system-static基础上实现了从数据库中通过自定义sql（通过ExtendedSqlMap.xml来配置）来获取系统基本模型的对象。
3. [framework-system-static-config](https://github.com/ndxt/centit-framework/tree/master/framework-system-static-configc)配置了系统运行所需要的bean。
4. [framework-web-demo](https://github.com/ndxt/centit-framework/tree/master/framework-web-demo)是一个最简单的基于框架的运行示例，开发人员可以复制这个项目作为自己的业务开发的起点。

## 带系统维护平台
传统政企业务系统都有个后台的系统维护，维护的内容就是我们框架的基本要素。所以框架开发了一个基于数据库的包括这些维护功能项目[centit-framework-system](https://github.com/ndxt/centit-framework-system)。工程中的模块有：

1. framework-persistence-core 模块，定义了持久化对象和持久化接口。框架的开发规范中并没有要求持久化类（Dao）的接口和实现分离，由于框架部分希望能够灵活的绑定不同的持久化模块所以抽象出一个接口。
2. framework-persistence-\* 三个相同功能模块，分别用jdbc、hibernate、mybatis实现了基本元素的持久化工作。因为单应用系统的业务部分和系统管理部分一般在一个工程中，这样做多个实现是为了给开发人员不同的选择。
3. framework-system-module 模块，实现了系统维护逻辑操作。
4. framework-system-web 模块，实现了系统维护的http接口，供前段调用。
5. framework-system-view-easyui 模块，为系统维护的前端页面。
6. framework-system-config 为系统模块相关的bean配置。
7. framework-system-demo 是一个可以运行的示例。

如果我们需要开发一个单应用系统[framework-system-demo](https://github.com/ndxt/centit-framework-system/tree/master/framework-system-demo)是一个最好不过的开发起点。开发人员可以复制这个项目的源代码作为自己项目的基础工程，记得修改java的包名。

## 业务集成平台
如果一个机构（政府或者企业）开发很多单应用系统，每个系统中都有用户、组织的维护功能，必然会导致不一致的问题，特别是用户的密码不一致，用户登录到多个系统需要重复认证，系统越多问题越大。[centit-integration-platform](https://github.com/ndxt/centit-integration-platform)就是为这个目的设计的，主要包括：
1. centit-ip-module是一个基于framework-system-demo开发的系统集成管理平台，包括以下内容：
  * 将对基本元素的访问用http+json接口的方式暴露出来，供其他应用访问。
  * 添加业务系统和数据库资源的维护工作，并通过http+json的接口提供服务。
2. centit-ip 是一个包含centit-ip-module的最简单的实现，具体业务系统可以在这个项目的基础上添加业务相关的基础数据维护和服务工作。
3. centit-ip-app 通过调用centit-ip接口的方式实现了PlatformEnvironment接口，这样基于centit-ip-app开发的应用系统就可以使用同一套用户、权限体系，各个系统相关的后台维护工作都可以集中在一起维护。
4. centit-ip-app-demo是一个基于centit-ip-app的最简单的实现，具体的业务开发可以复制这个项目作为开发的代码基础。
5. 各个业务系统可以通过[centit-cas](https://github.com/ndxt/centit-cas)单点登录平台集成在一起，这样不同的业务系统就可以在一次登录同时使用了。

有了这个集成平台作为一个企业的系统业务管理中心使用，各个业务模块可以作为微服务的方式运行，不同的业务模块可以使用不同的技术栈这样有效提高开发效率。

## 基于Spring cloud微服务平台
业务集成平台适用于对性能要求不高，业务系统相对比较少的集成工作，因为所有的业务系统都是要认为的维护和管理的。如果性能要求比较高，或者业务系统服务模块也比较多就需要使用微服务的架构了。框架中所有的项目都是前后端分离的、业务逻辑和配置也是分离的、项目很容易迁移到spring boot平台，所以采用spring cloud作为微服务平台就是理所当然的了。[centit-framework-cloud](https://github.com/ndxt/centit-framework-cloud)是框架的微服务实现。其组成如下：

1. eureka-server 是微服务注册中心。
2. authorize-server 是用户认证中心，它的作用类似于单点登录。
3. server-gateway 是一个网关，用于请求的权限认证和分发，只有通过认证才会分发。
4. framework-system-cloud 就是centit-ip的基于spring cloud的实现，负责系统维护工作，和提供基础元素的访问接口。
5. framework-cloud-client 是 centit-ip-app的spring cloud的实现。
6. framework-cloud-demo 类似于 centit-ip-app-demo 是基于spring cloud进行业务开发的示例代码，开发人员可以将这个项目复制，并作为业务开发基础。
7. config-server 是基于git的集中配置管理平台。

基于spring cloud的项目和集成平台后端的接口规范是一样的，所以可以用相同的前段代码。eureka可以自动做多个微服务实例的负载均衡，server-gateway的负载均衡可以用nginx来做。所以这个微服务架构是可以处理高并发的业务的。

**这个项目很特殊，几乎所有业务代码都是引用了集成平台，其自身的代码大多数都是和spring cloud整合的代码；所以如果需要新建基于spring cloud的微服务平台可以直接复制这个项目的所有代码作为项目的起点。**
## 前段框架

目前前端框架是基于EasyUI做的，项目参见[centit-ui](https://github.com/ndxt/centit-ui)，文档参见[centit-ui文档](../centit-ui)。我们正在开发基于Vue的前段框架，敬请期待。


## 工具与服务等通用模块

南大先腾框架后期的建设重点就是逐步完善并开发更多的通用模块。框架的开发策略就是核心模块（framework）越来越稳定，通用功能服务、工具模块越来越丰富。南大先腾的目标是借此打造一个政企应用系统的强大的“中台”。

目前框架已经有一些通用模块，参见[相关项目](https://ndxt.github.io/projects/)。


