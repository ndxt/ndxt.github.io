# 快速入门

基于公司框架可以开发多种类型的应用系统。

1. 开发一个传统的但应用系统，但应用系统就是只有一个工程结果只打一个war包，单独部署的系统；这样的系统有包括后台系统管理和前段业务应用。github的[centit-framework-system](https://github.com/ndxt/centit-framework-system)中有一个[framework-system-demo](https://github.com/ndxt/centit-framework-system/tree/master/framework-system-demo)模块就是一个最简明的示例。这个示例可以直接运行，其中包括了系统管理的所有实现。但依然有一下几个方面需要开发人员根据项目的情况进行修改：
   1. 数据库的选择，目前支持MySql，Oracle，H2和SQLServer。每种数据库示例中都有对应的flyway自动初始化脚本。开发人员只需要在resources目录中的system.properties文件中定义即可。
   2. 数据持久化的技术选型，目前框架无差别的实现了SpringJdbc、MyBatis和Hibernate三个版本，开发人员需要在pom.xml中修改对应的依赖，依赖有两个包一个具体的逻辑实现还有一个是配置类，同时还需要在demo的config中修改配置类的应用。强力推荐使用SpringJdbc，jdbc较为灵活，并且框架用jdbc对jpa做了最基础的实现，使用更加便捷。
   3. 
2. 


