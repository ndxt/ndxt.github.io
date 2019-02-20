---
sidebar: auto
---
# 历史更新记录
## 2019-2-20
发布版本\*.\*.1812详细版本号参见[framework-release-dependencies](https://github.com/ndxt/centit-framework-dependencies/blob/master/framework-release-dependencies/pom.xml)。主要更新：

1. 添加了swagger2, 并为框架中的接口编写了对应文档
2. 新增WrapUpResponseBody注解，让接口代码写的根简洁，更好调试。
3. 纠正了对Spring session错误用法，让不同应用之间session共享更加方便。

## 2018-9-30

发布版本\*.\*.1809详细版本号参见[framework-release-dependencies](https://github.com/ndxt/centit-framework-dependencies/blob/master/framework-release-dependencies/pom.xml)。主要更新：

1. 持久化层添加了数据版本的统一处理方法。
2. 修改一些不常运行到但是很重要的bug，建议更新。

## 2018-8-24

发布版本\*.\*.1808详细版本号参见[framework-release-dependencies](https://github.com/ndxt/centit-framework-dependencies/blob/master/framework-release-dependencies/pom.xml)。主要更新：

1. 缓存机制的更新，框架的主版本号也从 4.1.* 更改为 4.2.* 了。项目可以直接更新版本号，相关接口没有变化。
2. 修改一些不常运行到但是很重要的bug，建议更新。

## 2018-6-19

发布版本*.*.1806详细版本号参见[framework-release-dependencies](https://github.com/ndxt/centit-framework-dependencies/blob/master/framework-release-dependencies/pom.xml)。主要更新：

1. 取消对MsgPusher包的依赖。
2. 将流水号生成业务作为一个特定的功能从框架中剥离。
3. 整理flyway初始化脚本。
4. 添加安全认证策略，比如：
     - 添加权限拦截规则配置项（access.resource.must.be.assigned）：配置到菜单的url都被拦截，必须分配给角色才可以访问。
     - 添加配置不拦截url的配置项（security.ignore.url，多个用逗号隔开）。
     - 添加配置浏览器对url中分号校验的配置项（http.firewall.allowSemicolon）（spring security-4.3.13默认不支持url中包含分号）
5. 修改bug：
     - IUnitInfo添加getUnitShortName()接口
     - 获取机构所有角色接口bug
     - 获取菜单bug

## 2018-5-4

添加[包依赖管理项目](https://github.com/ndxt/centit-framework-dependencies)，并发现版本\*.\*.1805。

请将使用框架的项目继承framework-release-dependencies，版本号为1.0；没有用1.0.1805使用为1.0.1805发行了有错误，不能修改。
```xml
    <parent>
        <artifactId>framework-release-dependencies</artifactId>
        <groupId>com.centit.framework</groupId>
        <version>1.0</version>
    </parent>
```


## 2018-4-2

第一次以新的版本号命名方式发行\*.\*.1803版本，这次改版的主要内容是对框架中的包进行拆分，将配置的代码和程序代码分开。

1. **centit-commons** 2.2.1803 版本；当前开发版本为 2.2-SNAPSHOT。
2. **centit-persistence**  1.1.1803 版本；当前开发版本为 1.1-SNAPSHOT。  
3. **centit-framework** 4.1.1803 版本；当前开发版本为 4.1-SNAPSHOT。
4. **centit-framework-system** 4.1.1803 版本；当前开发版本为 4.1-SNAPSHOT。

所有开发过程中其他的项目都依赖月release版本的包。

## 2018-1-24

发行release版本，2018年的第一个版本，这次发行的版本号还是遵循以前的规则，后面的版本号严格按照新规格执行。

1. **centit-commons** 2.2.5 版本；当前开发版本为 2.2-SNAPSHOT。
2. **centit-ui** 3.1.0 版本；当前开发版本为 3.1-SNAPSHOT。
3. **centit-persistence**  1.0.2 版本；当前开发版本为 1.0-SNAPSHOT。  
4. **centit-framework** 4.0.4 版本；当前开发版本为 4.0-SNAPSHOT。
5. **centit-framework-system** 4.0.4 版本；当前开发版本为 4.0-SNAPSHOT。

## 2017-10-12

发布第一个release版本，以后使用框架的jar尽量不要再用snapshot版本，发布的内容包括：  
1. **centit-commons** 2.2.4 版本  
2. **centit-ui** 3.0.1 版本  
3. **centit-persistence**  1.0 版本  
4. **centit-framework** 4.0.1 版本  
5. **centit-framework-system** 4.0.1 版本  
6. **centit-integration-platform**  1.0 版本

## 2017-9-29

重构 centit-report-utils 中excel导入和导出方法，时期能够支持excel 2003版本和 excel的最新版本。

## 2017-9-27

在 centit-webim 添加了 cen\`tit-im-robot-es 模块，用elastic search 实现了一个智能问答机器人。使用了ik分词技术。

