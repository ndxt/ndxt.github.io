# 快速入门

基于公司框架可以开发多种类型的应用系统。

1. 开发一个传统的但应用系统，但应用系统就是只有一个工程结果只打一个war包，单独部署的系统；这样的系统有包括后台系统管理和前段业务应用。github的[centit-framework-system](https://github.com/ndxt/centit-framework-system)中有一个[framework-system-demo](https://github.com/ndxt/centit-framework-system/tree/master/framework-system-demo)模块就是一个最简明的示例。这个示例可以直接运行，其中包括了系统管理的所有实现。但依然有一下几个方面需要开发人员根据项目的情况进行修改：
   1. 数据库的选择，目前支持MySql，Oracle，H2和SQLServer。每种数据库示例中都有对应的flyway自动初始化脚本。开发人员只需要在resources目录中的system.properties文件中定义即可。
   2.  数据持久化的技术选型，目前框架无差别的实现了SpringJdbc、MyBatis和Hibernate三个版本，开发人员需要在pom.xml中修改对应的依赖，依赖有两个包一个具体的逻辑实现还有一个是配置类，同时还需要在demo的config中修改配置类的应用。强力推荐使用SpringJdbc，jdbc较为灵活，并且框架用jdbc对jpa做了最基础的实现，使用更加便。
   3.  为了是示例执行简单，demo把前段打包成[framework-system-view-easyui](https://github.com/ndxt/centit-framework-system/tree/master/framework-system-view-easyui)引入项目中，这样可以使用web容器（比如：Tomcat）直接运行；但是框架是基于前后端分离的思想设计的，这个jar包中只有静态的文件，将这个jar解压到前段项目中，采用前后端分离的方式开发。前段单独部署到Nginx或者Apache这样的http服务器中。
   4. 虽然是但应用系统的开发方式，它依然可以用框架提供的各种功能服务产品。这些工具类功能服务产品都有一个核心包，可以通过引入这些核心包将功能服务产品直接整合到项目中。比如文件服务器的整合方式为可以参见https://github.com/ndxt/centit-fileserver/tree/master/fileserver-demo/src/main/java/com/centit/fileserver/demo/localstore 。 
2. 开发分布式系统项目。框架提供了一个集成平台[centit-integration-platform](https://github.com/ndxt/centit-integration-platform)；这个平台提供了同意的系统后台管理和基础数据服务平台，并提供了服务接口。各个业务模块只要应用服务接口就可以开发成可以集成在一起的，独立部署的分布是业务系统。业务模块开发的示例代码参见[centit-ip-app-demo](https://github.com/ndxt/centit-integration-platform/tree/master/centit-ip-app-demo)。这些独立部署的业务通过单点登录平台[centit-cas](https://github.com/ndxt/centit-cas)集成在一起。
3. 


