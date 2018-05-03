---
sidebar: auto
---
# 常见问题及解决办法

## 依赖包无法下载
一般两种情况会导致这个问题：
1. 您下载的框架的SNAPSHOT版本的代码，无法下载框架相关的依赖包。只是因为框架snapshot版本的包没有发行到公网上。解决办法有两个：
  * 下载依赖包对应的工程，自己编译对应的依赖包。框架所有的依赖包都是开源的，都可以在https://github.com/ndxt下载。
  * 将对应的依赖包版本更改为最新的release版本的包，release版本的包都是发行在[Maven Central](http://central.maven.org/maven2/com/centit/)库中的。
2. 另一种情况是没有正确的配置 JAVA_HOME 环境变量。无论在windows、linux下都需要配置环境变量 JAVA_HOME 指向jdk1.8对应的目录。


