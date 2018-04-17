# 框架平台的技术路线

框架经过多少改版，现在基本上全面拥抱spring体系，并且可以很容易的迁移到spring boot。框架现在是4.0版本，相比3.×最大的变化就是前后段分离，前段页面显示和后端的逻辑设计完全分离。

## 前端技术路线

目前前端有一套基于easyui的框架，正在研发一套基于vue的框架。

## 后端技术路线

后端采用的主要技术栈如下：

1. 基本算法类采用 apache commons系列。
2. [centit-commons](https://github.com/ndxt/centit-commons) 作为基础算法的补充，其中最为重要的是[compiler](https://github.com/ndxt/centit-commons/tree/master/centit-compiler)一个简化四则运算作为框架的规则引擎使用。
3. 采用fastjson作为json的解析工具。
4. 采用spring作为bean的容器和事务管理工具，spring mvc作为后端分层模型，spring security作为安全框架。spring 采用4.×版本。
5. 持久化公司[**centit-persistence**](https://github.com/ndxt/centit-persistence)工具类对spring-jdbc、Mybatis、Hibernate进行封装，使其都可以支持 参数驱动sql。推荐使用[centit-persistence-jdbc](https://github.com/ndxt/centit-persistence/tree/master/centit-persistence-jdbc)它用sping jdbc实现了jpa使用和hibernate一样便捷，并且查询更加灵活。
6. 采用json格式作为前后端的数据通讯格式。
7. 采用restful风格的接口规范。



