(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{109:function(t,a,s){"use strict";s.r(a);var n=s(0),e=Object(n.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"content"},[s("h1",{attrs:{id:"动机"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#动机","aria-hidden":"true"}},[t._v("#")]),t._v(" 动机")]),s("p",[t._v("业务系统一般都会选择一个Orm框架，笔者强力推荐使用先腾"),s("a",{attrs:{href:"https://github.com/ndxt/centit-persistence/tree/master/centit-persistence-jdbc",target:"_blank",rel:"noopener noreferrer"}},[t._v("基于spring jdbc的的持久化框架")]),t._v("，但现在这个框架还不是主流，主流的Orm框架还是Hibernate和MyBatis，"),s("a",{attrs:{href:"https://github.com/ndxt/centit-persistence",target:"_blank",rel:"noopener noreferrer"}},[t._v("先腾持久化框架")]),t._v("对他们都有封装，提供了很多共用方法和整合参数驱动sql。")]),s("p",[t._v("参数驱动sql和Orm框架在持久化方面进行分工，Orm用于数据的增删改，参数驱动sql主要用于数据的查询与统计工作。Hibernate由于提供了NativeQuery查询接口所以整合非常简单，就是在查询前做一个语句预处理工作。MyBatis是通过Mapper.xml提供查询语句的，和MyBatis的整合是通过插件来实现的。")]),s("h1",{attrs:{id:"参数驱动sql-mybatis插件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参数驱动sql-mybatis插件","aria-hidden":"true"}},[t._v("#")]),t._v(" 参数驱动sql Mybatis插件")]),s("p",[t._v("Mybatis使用Mapper.XML来配置sql语句，插件ParameterDriverSqlInterceptor在Mybatis执行前对sql语句进行预处理。")]),s("h2",{attrs:{id:"插件的启动方式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#插件的启动方式","aria-hidden":"true"}},[t._v("#")]),t._v(" 插件的启动方式")]),s("p",[t._v("Mapper.XML中的语句ID（方法名称）如果以 ByPDSql 结尾，将会触发语句预处理活动。")]),s("p",[t._v("如果不方便修改这个ID（方法名称），也可以在语句的最前面添加注释来触发， 比如：")]),s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v(" -- PDSql\n /* PDSql */\n -- parameter driver sql \n /* parameter driver sql */\n-- parameters driver sql \n /* parameters driver sql */\n")])]),s("p",[t._v("6种书写方式都可以，但是注释必须在语句的最前面。")]),s("h2",{attrs:{id:"配置方式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#配置方式","aria-hidden":"true"}},[t._v("#")]),t._v(" 配置方式")]),s("p",[t._v("spring 4 配置类配置方法")]),s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("    "),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@SuppressWarnings")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"SpringJavaAutowiringInspection"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@Bean")]),t._v("\n    "),s("span",{attrs:{class:"token keyword"}},[t._v("public")]),t._v(" SqlSessionFactoryBean "),s("span",{attrs:{class:"token function"}},[t._v("sqlSessionFactory")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@Autowired")]),t._v(" DataSource dataSource"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("throws")]),t._v(" IOException "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        SqlSessionFactoryBean sessionFactory "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("SqlSessionFactoryBean")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        org"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("apache"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("ibatis"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("session"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Configuration configuration "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("org"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("apache"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("ibatis"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("session"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Configuration")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//添加数据权限拦击器")]),t._v("\n        configuration"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("addInterceptor")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("ParameterDriverSqlInterceptor")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("\n        sessionFactory"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("setConfiguration")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("configuration"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("\n    "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])]),s("h1",{attrs:{id:"参数驱动sql使用示例"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参数驱动sql使用示例","aria-hidden":"true"}},[t._v("#")]),t._v(" 参数驱动sql使用示例")]),s("pre",{pre:!0,attrs:{class:"language-xml"}},[s("code",[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("select")]),t._v(" "),s("span",{attrs:{class:"token attr-name"}},[t._v("id")]),s("span",{attrs:{class:"token attr-value"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{attrs:{class:"token punctuation"}},[t._v('"')]),t._v("pageQuery"),s("span",{attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{attrs:{class:"token attr-name"}},[t._v("parameterType")]),s("span",{attrs:{class:"token attr-value"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{attrs:{class:"token punctuation"}},[t._v('"')]),t._v("map"),s("span",{attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{attrs:{class:"token attr-name"}},[t._v("resultMap")]),s("span",{attrs:{class:"token attr-value"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{attrs:{class:"token punctuation"}},[t._v('"')]),t._v("OptLog"),s("span",{attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        /* parameter driver sql */ /* 这个注释式触发插件的关键字 */\n        "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("include")]),t._v(" "),s("span",{attrs:{class:"token attr-name"}},[t._v("refid")]),s("span",{attrs:{class:"token attr-value"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{attrs:{class:"token punctuation"}},[t._v('"')]),t._v("com.centit.framework.mybatis.dao.BaseDao.pageBeginByPDSql"),s("span",{attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("/>")])]),t._v("\n        "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("include")]),t._v(" "),s("span",{attrs:{class:"token attr-name"}},[t._v("refid")]),s("span",{attrs:{class:"token attr-value"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{attrs:{class:"token punctuation"}},[t._v('"')]),t._v("coreSql"),s("span",{attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("/>")])]),t._v("\n        where 1=1 [ :logId | and u.LOG_ID = :logId ]\n        [ :(like)logLevel | and u.LOG_LEVEL like :logLevel]\n        [ :userCode | and u.USER_CODE = :userCode]\n        [ :(date)optTimeBegin | and u.OPT_TIME >= :optTimeBegin]\n        [ :(nextday)optTimeEnd | and u.OPT_TIME "),s("span",{attrs:{class:"token cdata"}},[t._v("<![CDATA[<= ]]>")]),t._v(" :optTimeEnd]\n        [ :optId | and u.OPT_ID in (:optId)]\n        [ :optCode | and u.OPT_CODE = :optCode]\n        [ :(like)optContent | and u.OPT_CONTENT :optContent]\n        [ :(like)oldValue| and u.OLD_VALUE like :oldValue]\n        [ :(like)optMethod| and u.OPT_METHOD like :optMethod]\n        [ :(INPLACE)mybatisOrderBy | order by :mybatisOrderBy]\n        "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("include")]),t._v(" "),s("span",{attrs:{class:"token attr-name"}},[t._v("refid")]),s("span",{attrs:{class:"token attr-value"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{attrs:{class:"token punctuation"}},[t._v('"')]),t._v("com.centit.framework.mybatis.dao.BaseDao.pageEndByPDSql"),s("span",{attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("/>")])]),t._v("\n    "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("</")]),t._v("select")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])]),s("p",[t._v("使用这个功能需要在项目中添加依赖")]),s("pre",{pre:!0,attrs:{class:"language-xml"}},[s("code",[t._v("\t\t"),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("dependency")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n            "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("groupId")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("com.centit.framework"),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("</")]),t._v("groupId")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n            "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("artifactId")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("centit-persistence-mybatis"),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("</")]),t._v("artifactId")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n            "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("version")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("1.1.1806"),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("</")]),t._v("version")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        "),s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token tag"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("</")]),t._v("dependency")]),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])]),s("p",[t._v("相关的包都已经发布到Maven的中央库中，更多框架信息参见"),s("a",{attrs:{href:"https://ndxt.github.io/",target:"_blank",rel:"noopener noreferrer"}},[t._v("先腾框架")]),t._v("。")])])}],!1,null,null,null);a.default=e.exports}}]);