(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{83:function(t,a,s){"use strict";s.r(a);var n=s(0),e=Object(n.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"content"},[s("h1",{attrs:{id:"技术路线"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#技术路线","aria-hidden":"true"}},[t._v("#")]),t._v(" 技术路线")]),s("p",[t._v("技术方面既要跟上快速的发展步伐又要减少学习成本同事还要兼顾开发人员的使用习惯，本身就是一个非常矛盾的事情；也是没有办法做到尽善尽美的。框架在技术方面的目标是让开发人员不需要学习太多的新的技术就可以使用框架，比如你不需要知道spring security的机制和原理，只要按照框架的约定开发，就已经应用了这个安全框架；让开发人员把跟多的精力集中在业务的理解和实现上。框架的设计理念和spring boot 非常相像，没有直接采用spring boot 的原因是在框架设计之初spring boot还没有流行，我们还不知道有这个东西；现在我们的框架已经将所有的配置信息和业务代码剥离可以直接一直到spring boot项目中。")]),s("p",[t._v("技术体系设计主要考虑一下内容：")]),s("ol",[s("li",[s("p",[t._v("统一的功能权限、数据范围权限控制。")])]),s("li",[s("p",[t._v("统一的用户、机构及关联关系，目的是为了统一实现工作流程设定。")])]),s("li",[s("p",[t._v("统一技术栈，减少员工的交流成本。技术栈在满足业务需求的情况下尽量减少，并且适当找过开发人员的使用习惯。")])]),s("li",[s("p",[t._v("不重复发明轮子，但也不为此而对业务需求进行妥协。")])])]),s("p",[s("strong",[t._v("特别说明一下第4点，框架更多的是一个代码联合剂将众多开源平台整合在一起、所以某种意义上也可以说框架是一个学习教程。但是我们还是在两个方面发明了自己的轮子，一：参数驱动sql 二：工作流引擎，具体原因参见对应的章节。")])]),s("h2",{attrs:{id:"统一技术栈"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#统一技术栈","aria-hidden":"true"}},[t._v("#")]),t._v(" 统一技术栈")]),s("h3",{attrs:{id:"框架平台的技术路线"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#框架平台的技术路线","aria-hidden":"true"}},[t._v("#")]),t._v(" 框架平台的技术路线")]),s("p",[t._v("框架经过多少改版，现在基本上全面拥抱spring体系，并且可以很容易的迁移到spring boot。框架现在是4.0版本，相比3.×最大的变化就是前后端分离，前端页面显示和后端的逻辑设计完全分离。")]),s("h3",{attrs:{id:"前端技术路线"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#前端技术路线","aria-hidden":"true"}},[t._v("#")]),t._v(" 前端技术路线")]),s("p",[t._v("目前前端有一套基于"),s("a",{attrs:{href:"https://github.com/ndxt/centit-ui/tree/master/framework-base-view-easyui",target:"_blank",rel:"noopener noreferrer"}},[t._v("easyui")]),t._v("的框架，正在研发一套基于vue的框架。")]),s("h3",{attrs:{id:"后端技术路线"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#后端技术路线","aria-hidden":"true"}},[t._v("#")]),t._v(" 后端技术路线")]),s("p",[t._v("后端采用的主要技术栈如下：")]),s("ol",[s("li",[t._v("基本算法类采用 apache commons系列。")]),s("li",[s("a",{attrs:{href:"https://github.com/ndxt/centit-commons",target:"_blank",rel:"noopener noreferrer"}},[t._v("centit-commons")]),t._v(" 作为基础算法的补充，其中最为重要的是"),s("a",{attrs:{href:"https://github.com/ndxt/centit-commons/tree/master/centit-compiler",target:"_blank",rel:"noopener noreferrer"}},[t._v("compiler")]),t._v("一个简化四则运算作为框架的规则引擎使用。")]),s("li",[t._v("采用fastjson作为json的解析工具。")]),s("li",[t._v("采用spring作为bean的容器和事务管理工具，spring mvc作为后端分层模型，spring security作为安全框架。spring 采用4.×版本。")]),s("li",[t._v("持久化公司"),s("a",{attrs:{href:"https://github.com/ndxt/centit-persistence",target:"_blank",rel:"noopener noreferrer"}},[s("strong",[t._v("centit-persistence")])]),t._v("工具类对spring-jdbc、Mybatis、Hibernate进行封装，使其都可以支持 参数驱动sql。推荐使用"),s("a",{attrs:{href:"https://github.com/ndxt/centit-persistence/tree/master/centit-persistence-jdbc",target:"_blank",rel:"noopener noreferrer"}},[t._v("centit-persistence-jdbc")]),t._v("它用sping jdbc实现了jpa使用和hibernate一样便捷，并且查询更加灵活。")]),s("li",[t._v("采用json格式作为前后端的数据通讯格式。")]),s("li",[t._v("采用restful风格的接口规范。")])]),s("h2",{attrs:{id:"前后端数据通讯格式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#前后端数据通讯格式","aria-hidden":"true"}},[t._v("#")]),t._v(" 前后端数据通讯格式")]),s("p",[t._v("框架现在是4.0版本，相比3.×最大的变化就是前后端分离，前端页面显示和后端的逻辑设计完全分离，部署在不同的服务容器上。框架强力建议前段采用html+js（或者js框架比如 easyui、vue等等）的静态方案，但是这并不是强制，开发依然可以使用jsp、velocity等等前段解决方案，但是要求前段必须单独一个服务。这样做的目的是要求开发组将后端的业务通过接口的方式抽象出来，好处是不同平台的客户端，pc端、iOS、Android等等可以用共同的后端。减少后期的维护成本。")]),s("p",[t._v("后端采用restful风格的接口，前后端用json的数据格式交换。后端除了返回单个数字、字符串、布尔型等标量其他的json都要符合"),s("a",{attrs:{href:"http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseData.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("ResponseData")]),t._v("定义的接口标准。")]),s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("    "),s("span",{attrs:{class:"token comment"}},[t._v("//JSON有三个域，其中data")]),t._v("\n    String RES_CODE_FILED"),s("span",{attrs:{class:"token operator"}},[t._v("=")]),s("span",{attrs:{class:"token string"}},[t._v('"code"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("    \n    String RES_MSG_FILED"),s("span",{attrs:{class:"token operator"}},[t._v("=")]),s("span",{attrs:{class:"token string"}},[t._v('"message"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    String RES_DATA_FILED"),s("span",{attrs:{class:"token operator"}},[t._v("=")]),s("span",{attrs:{class:"token string"}},[t._v('"data"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{attrs:{class:"token comment"}},[t._v("//处理结果，0标识正常，其他的为错误号  ，具体错误好参见接口中的注释 ")]),t._v("\n    "),s("span",{attrs:{class:"token keyword"}},[t._v("int")]),t._v(" "),s("span",{attrs:{class:"token function"}},[t._v("getCode")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{attrs:{class:"token comment"}},[t._v("//处理结果的文字说明")]),t._v("\n    String "),s("span",{attrs:{class:"token function"}},[t._v("getMessage")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{attrs:{class:"token comment"}},[t._v("//返回数据，可以是任何类型数据包括数组，如果返回多个结果可以用Map")]),t._v("\n    Object "),s("span",{attrs:{class:"token function"}},[t._v("getData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),s("p",[t._v("这个接口有两个具体的实现"),s("a",{attrs:{href:"http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseSingleData.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("ResponseSingleData")]),t._v("和"),s("a",{attrs:{href:"http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseMapData.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("ResponseMapData")]),t._v("，在客户端接受到这个JSON时可以用"),s("a",{attrs:{href:"http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseJSON.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("ResponseJSON")]),t._v("来解析。框架中"),s("a",{attrs:{href:"http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/JsonResultUtils.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("JsonResultUtils")]),t._v("类提供了直接向HttpServletResponse写符合上述格式要求的JSON的便捷方法。所以在controller类中可以有多种方式来实现json格式的数据返回，示例代码如下：")]),s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("    "),s("span",{attrs:{class:"token comment"}},[t._v("//返回一个标量,比如:数字\\字符串\\布尔值等等")]),t._v("\n    "),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@RequestMapping")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("value "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"/url"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" method "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" RequestMethod"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("GET "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@ResponseBody")]),t._v("\n    "),s("span",{attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("boolean")]),t._v(" "),s("span",{attrs:{class:"token function"}},[t._v("checkUserOptPower")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{attrs:{class:"token boolean"}},[t._v("true")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{attrs:{class:"token comment"}},[t._v("//返回符合格式的JSON对象")]),t._v("\n    "),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@RequestMapping")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("value "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"/url"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@ResponseBody")]),t._v("\n    "),s("span",{attrs:{class:"token keyword"}},[t._v("public")]),t._v(" ResponseData "),s("span",{attrs:{class:"token function"}},[t._v("forExample")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//仅仅返回成功信息")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("ResponseSingleData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//返回错误信息")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("ResponseSingleData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ResponseData"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("ERROR_SESSION_TIMEOUT"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{attrs:{class:"token string"}},[t._v('"用户没有登录或者超时，请重新登录。"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//返回单个数据对象")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" ResponseSingleData"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("makeResponseData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("Object")]),s("span",{attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{attrs:{class:"token string"}},[t._v('"hello"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{attrs:{class:"token string"}},[t._v('"world"')]),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//返回多个对象")]),t._v("\n        ResponseMapData resData "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("ResponseMapData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        resData"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("addResponseData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("BaseController"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("OBJLIST"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("Object")]),s("span",{attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{attrs:{class:"token string"}},[t._v('"hello"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{attrs:{class:"token string"}},[t._v('"world"')]),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        resData"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("addResponseData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("BaseController"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PAGE_DESC"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("PageDesc")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" resData"),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{attrs:{class:"token comment"}},[t._v("//用JsonResultUtils直接向 HttpServletResponse response 写json字符串的方式返回json")]),t._v("\n    "),s("span",{attrs:{class:"token annotation punctuation"}},[t._v("@GetMapping")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("value "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"/url"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{attrs:{class:"token function"}},[t._v("forExample")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("HttpServletResponse response"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//返回一个标量")]),t._v("\n        JsonResultUtils"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("writeOriginalObject")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token boolean"}},[t._v("true")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" response"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//仅仅返回成功信息")]),t._v("\n        JsonResultUtils"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("writeSuccessJson")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("response"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//返回错误信息")]),t._v("\n        JsonResultUtils"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("writeErrorMessageJson")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ResponseData"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("ERROR_UNAUTHORIZED"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" \n                        "),s("span",{attrs:{class:"token string"}},[t._v('"用户没有登录或者超时，请重新登录"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("response"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//返回单个数据对象")]),t._v("\n        JsonResultUtils"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("writeSingleDataJson")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("Object")]),s("span",{attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{attrs:{class:"token string"}},[t._v('"hello"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{attrs:{class:"token string"}},[t._v('"world"')]),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" response"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("//返回多个对象")]),t._v("\n        ResponseMapData resData "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("ResponseMapData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        resData"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("addResponseData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("BaseController"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("OBJLIST"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("Object")]),s("span",{attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{attrs:{class:"token string"}},[t._v('"hello"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{attrs:{class:"token string"}},[t._v('"world"')]),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        resData"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("addResponseData")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("BaseController"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PAGE_DESC"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("PageDesc")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        JsonResultUtils"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("writeResponseDataAsJson")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("resData"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" response"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token keyword"}},[t._v("return")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),s("p",[t._v("前端获取后端返回的json字符串可以使用"),s("a",{attrs:{href:"http://gitlab.centit.com/gitlab/ctm/centit-framework/blob/master/framework-adapter/src/main/java/com/centit/framework/common/ResponseJSON.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("ResponseJSON")]),t._v("来解析。示例代码：")]),s("p",[t._v("java客户端")]),s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("CloseableHttpClient client "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" HttpExecutor"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("createKeepSessionHttpClient")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nResponseJSON resJson "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" ResponseJSON"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("valueOfJson")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("HttpExecutor"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("simpleGet")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("client"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{attrs:{class:"token string"}},[t._v('"url"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nclient"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("close")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),s("p",[t._v("js客户端")]),s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{attrs:{class:"token comment"}},[t._v("//请张凯补充")]),t._v("\n")])]),s("h2",{attrs:{id:"参数驱动sql"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参数驱动sql","aria-hidden":"true"}},[t._v("#")]),t._v(" 参数驱动SQL")]),s("p",[t._v("参数驱动sql它是一个sql预处理引擎，他通过条件标签[],外置条件插入标签{}和预处理标签来将对数据库查询的逻辑规则从代码中剥离出来。设计这个参数化驱动sql的主要目标有：")]),s("ol",[s("li",[t._v("避免根据输入条件进行复杂的sql语句拼接工作。目标是将前段输入的条件直接转换为Map作为参数驱动sql的参数。")]),s("li",[t._v("统一处理数据范围权限包括数据行范围和数据的列范围。")])]),s("h3",{attrs:{id:"条件标签"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#条件标签","aria-hidden":"true"}},[t._v("#")]),t._v(" 条件标签[]")]),s("p",[t._v("语法: [(条件)(参数列表)| sql语句片段]")]),s("p",[t._v("意义是如果“条件”成立，sql语句片段将生效，并将参数列表中的参数加入最终sql语句的参数中，其中参数列表是可选的。")]),s("p",[t._v("先介绍一个名词"),s("strong",[t._v("参数引用描述符")]),t._v(",它是来引用Map参数中变量的。可以直接用名称引用，也可以用value.attr的形式来引用Map中变量的属性。如果Map中的变量名称比较特殊不符合标识符规范比如中文，可以用${变量名称}。")]),s("p",[t._v("条件：条件是一个逻辑运算表达式，其中可以直接用参数引用描述符引用参数Map中的变量。")]),s("p",[t._v("参数列表：是用“，”分开的多个参数，形式为"),s("strong",[t._v("参数引用描述符：(预处理指令列表)SQL语句变量名称")]),t._v(";如果参数引用描述符和sql语句变量名称一样，参数引用描述符可以省略。")]),s("p",[t._v("举个例子：")]),s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("-- Map中有变量 a、b、c、d\n-- 参数驱动sql如下：\nselect [(a>1)| t1.col1, ] t2.col2\nfrom [(a>1)| table1 t1 join ] table2 t2 [(a>1)| on (t1.id=t2.id) ]\nwhere t2.col3> 5 [(a>1 && b>1)(b:num)| and t1.col3 > :num][ (c>1)(:c) |and t2.col4 > :c ]\n[(isnotempty(d))(:(inplace)d)| order by :d desc ]\n--如果Map的值为 a:2, b:0 , c:2 , d: 't2.col4' 转换后的语句如下\nselect t1.col1, t2.col2\nfrom table1 t1 join  table2 t2 on (t1.id=t2.id) \nwhere t2.col3> 5 and t2.col4 > :c\norder by t2.col4 desc \n-- sql与的参数为 c:2\n")])]),s("p",[t._v("如果条件只是判断输入的参数是否为空有则可以将条件省略并且同时需要省略参数列表外层的（）;如果这个参数仅用于判断则参数中的sql语句变量名称也要省略。举个例子：")]),s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("-- Map中的变量 a：'4'、user:{name：'先腾'}、c：notnull\nselect t1.col1, t1.col2\nfrom table1 t1\nwhere 1=1 [:(number)a| and t1.col3>:a] [user.name:name| and t1.name=:name ]\n   [c | and t1.col4 not null] [:e| and t1.col5 =:e]\n-- 转换后的语句为\nselect t1.col1, t1.col2\nfrom table1 t1\nwhere 1=1 and t1.col3>:a and t1.name=:name \n    and t1.col4 not null\n-- sql与的参数为 a:4 , name:'先腾'\n")])]),s("h3",{attrs:{id:"外置条件插入标签"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#外置条件插入标签","aria-hidden":"true"}},[t._v("#")]),t._v(" 外置条件插入标签{}")]),s("p",[t._v('语法：{数据库表名列表}, 多个表名用",“分隔，表名和别名用空格或者”:"分隔。')]),s("p",[t._v("示例：{table1 t1, table2 t2}")]),s("p",[t._v("这个标签作用是将针对标签中的表对应的额外的顾虑条件插入到标签所在的位置，现在这个标签只能放在where语句部分。")]),s("p",[t._v("外部语句是作为字符串列表来传入的，每个字符串为一个条件语句；条件语句为一个sql语句条件表达式，其中用[表名称.字段名]来指定字段，用{参数引用描述符：(预处理指令列表)SQL语句变量名称}来引用变量，可以是用户相关的变量、环境变量或者前端输入的变量等等。")]),s("p",[t._v("举个例子：")]),s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("    "),s("span",{attrs:{class:"token comment"}},[t._v("//外部数据范围条件语句")]),t._v("\n    List"),s("span",{attrs:{class:"token generics function"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("String"),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" filters "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("ArrayList")]),s("span",{attrs:{class:"token generics function"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("String"),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    filters"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("add")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"[table1.c] like {p1.1:ps}"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    filters"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("add")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"[table1.b] = {p5}"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    filters"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("add")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"[table4.b] = {p4}"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    filters"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("add")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"([table2.f]={p2} and [table3.f]={p3})"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    Map"),s("span",{attrs:{class:"token generics function"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("String"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("Object"),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" paramsMap "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{attrs:{class:"token class-name"}},[t._v("HashMap")]),s("span",{attrs:{class:"token generics function"}},[s("span",{attrs:{class:"token punctuation"}},[t._v("<")]),t._v("String"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("Object"),s("span",{attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("       \n    paramsMap"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("put")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"p1.1"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"1"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    paramsMap"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("put")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('"p2"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"3"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    String queryStatement "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token string"}},[t._v('"select t1.a,t2.b,t3.c "')]),s("span",{attrs:{class:"token operator"}},[t._v("+")]),t._v("\n        "),s("span",{attrs:{class:"token string"}},[t._v('"from table1 t1,table2 t2,table3 t3 "')]),s("span",{attrs:{class:"token operator"}},[t._v("+")]),t._v("\n        "),s("span",{attrs:{class:"token string"}},[t._v('"where 1=1 {table1:t1} order by 1,2"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    System"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("out"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("println")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("QueryUtils"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("translateQuery")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("queryStatement"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("filters"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("paramsMap"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{attrs:{class:"token boolean"}},[t._v("true")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("getQuery")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    结果是：\n    select t1"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("a"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("t2"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("b"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("t3"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("c from table1 t1"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("table2 t2"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("table3 t3\n    where "),s("span",{attrs:{class:"token number"}},[t._v("1")]),s("span",{attrs:{class:"token operator"}},[t._v("=")]),s("span",{attrs:{class:"token number"}},[t._v("1")]),t._v("  and "),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("t1"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("c like "),s("span",{attrs:{class:"token operator"}},[t._v(":")]),t._v("ps "),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" order by "),s("span",{attrs:{class:"token number"}},[t._v("1")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{attrs:{class:"token number"}},[t._v("2")]),t._v("\n")])]),s("p",[t._v("在实际使用中可以将外置条件配置在数据库中并和具体的操作关联，在配置角色操作时同事指定对应的范围条件，条件中通过{参数引用描述符}应用用户属性。这样在具体的查询时可以获得额外的语句，根据当前用户属性获得对应的参数值。框架中"),s("a",{attrs:{href:"https://github.com/ndxt/centit-framework-system/blob/master/framework-system-module/src/main/java/com/centit/framework/system/service/impl/GeneralServiceImpl.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("GeneralServiceImpl")]),t._v(" 可也作为外部条件和用户变量生产示例，具体业务可以模仿这个类来实现。")]),s("h3",{attrs:{id:"参数预处理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参数预处理","aria-hidden":"true"}},[t._v("#")]),t._v(" 参数预处理")]),s("p",[t._v("在参数前面的预处理指令列表可以是多个，预处理会按照顺序执行。预处理的主要作用有：类型转换、查询模式生产、语句替换等等。详细预处理列表参见 "),s("a",{attrs:{href:"https://github.com/ndxt/centit-commons/blob/master/centit-database/src/main/java/com/centit/support/database/utils/QueryUtils.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("QueryUtils.java")]),t._v("。")]),s("h2",{attrs:{id:"数据持久化"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#数据持久化","aria-hidden":"true"}},[t._v("#")]),t._v(" 数据持久化")]),s("h3",{attrs:{id:"统一增删改查操作"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#统一增删改查操作","aria-hidden":"true"}},[t._v("#")]),t._v(" 统一增删改查操作")]),s("p",[t._v("为了照顾绝大部分开发人员，所以框架没有对持久化做严格的限制，"),s("a",{attrs:{href:"https://github.com/ndxt/centit-persistence",target:"_blank",rel:"noopener noreferrer"}},[t._v("centit-persistence")]),t._v("分别对Spring jdbc、Hibernate、MyBatis进行了封装。推荐使用jdbc。框架对持久化封装的目标有：")]),s("ol",[s("li",[t._v("用任意持久化框架实现"),s("strong",[t._v("增删改")]),t._v("，开发人员"),s("strong",[t._v("都不需要写sql语句")]),t._v("，sping jdbc中做了jpa的简单的实现，所以也无需写sql代码。")]),s("li",[s("strong",[t._v("用参数驱动sql执行查询操作")]),t._v("，jdbc直接用sql，Hibernate通过NativeQuery支持sql，Mybatis的Mapper文件中可以直接写sql。对参数驱动sql的支持jdbc和Hibernate都是通过先处理参数驱动sql得到最终的sql再来执行，Mybatis是通过插件来"),s("a",{attrs:{href:"https://github.com/ndxt/centit-persistence/blob/master/centit-persistence-mybatis/src/main/java/com/centit/framework/mybatis/plugin/ParameterDriverSqlInterceptor.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("ParameterDriverSqlInterceptor.java")]),t._v("来实现的。")]),s("li",[t._v("框架还实现了DatabaseOptUtils类，对常用的持久化操作进行封装，比如：调用存储过程，执行sql语句等等。")])]),s("h3",{attrs:{id:"数据源"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#数据源","aria-hidden":"true"}},[t._v("#")]),t._v(" 数据源")]),s("p",[t._v("框架默认只能设置一个数据源，框架"),s("a",{attrs:{href:"https://github.com/ndxt/centit-persistence/blob/master/centit-persistence-core/src/main/java/com/centit/framework/core/datasource",target:"_blank",rel:"noopener noreferrer"}},[t._v("DynamicDataSource")]),t._v("实现动态数据源，配合注解TargetDataSource可以实现数据源的选择。")]),s("p",[t._v("如果数据源在开发时是未知的，比如是用户通过界面设定的可以用"),s("a",{attrs:{href:"https://github.com/ndxt/centit-commons/tree/master/centit-database-datasource",target:"_blank",rel:"noopener noreferrer"}},[t._v("centit-database-datasource")]),t._v("中的DbcpConnectPools类来管理链接，用TransactionHandler执行事务。")]),s("h2",{attrs:{id:"mvc分层设计和脚手架"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mvc分层设计和脚手架","aria-hidden":"true"}},[t._v("#")]),t._v(" MVC分层设计和脚手架")]),s("p",[t._v("MVC是模型(Model),视图(View)和控制(Controller)的缩写，其目的实现Web系统的职能分工。对应到代码：")]),s("ol",[s("li",[t._v("Po持久对象(Persisent Object)，po和数据库中的表意义对应，需要用jpa注解定义映射关系（Mybatis可以用mapper文件定义）。框架没有要求必须有DTO（传送对象）、VO（展示对象）、BO（业务对象），业务系统根据自己的需求进行裁决。")]),s("li",[t._v("Dao 对数据库的操作层，负责对数据库进行增删改查操作。一般也po或者数据库表一一对应。")]),s("li",[t._v("Services逻辑层，和某一个具体业务对应，一般会和数据库中的一个业务主表对应。数据库事务一般在这个层面上控制，系统用spring来管理事务，spring是通过jdk代理类来管理事务的，所以Services层必须抽象出接口将实现和接口分开。")]),s("li",[t._v("Controller 控制层。采用spring mvc框架，用restful风格的接口返回json格式的数据。 由于框架是在这一层控制权限的，所以每个框架需要有一个唯一的ID便于后台维护数据权限时和业务对应。")]),s("li",[t._v("View 展示层。展示层有多种实现方式，有些项目还需要支持多种平台（Android、iOS等），将展示层独立出来就是为了应付用户多种需要。")])]),s("p",[t._v("在信息管理系统或则OA类等先腾的典型业务中的功能模块都会应对到数据库中的一个业务主表，所以我们的设计一般为围绕数据库表结构展开，我们推荐使用powerDesigner来做表结构设计。"),s("a",{attrs:{href:"https://github.com/ndxt/centit-scaffold",target:"_blank",rel:"noopener noreferrer"}},[t._v("centit-scaffold")]),t._v("是一个脚手架工程，他会根据pdm中的表定义和模板文件自动生成前后台代码。生成的代码实现了增删改查功能会对应的页面。开发人员可以根据自己项目的要求编写"),s("a",{attrs:{href:"https://github.com/ndxt/centit-scaffold/tree/master/src/main/resources",target:"_blank",rel:"noopener noreferrer"}},[t._v("模板")]),t._v("。")]),s("p",[t._v("这个脚手架目前还没有图形界面的实行，是通过"),s("a",{attrs:{href:"https://github.com/ndxt/centit-scaffold/blob/master/src/main/resources/scaffoldtask2.xml",target:"_blank",rel:"noopener noreferrer"}},[t._v("一个xml文件")]),t._v("来描述生产策略的，通过运行"),s("a",{attrs:{href:"https://github.com/ndxt/centit-scaffold/blob/master/src/main/java/com/centit/support/scaffold/RunScaffoldTask2.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("RunScaffoldTask2.java")]),t._v("来执行转换。")]),s("p",[t._v("还有一个类"),s("a",{attrs:{href:"https://github.com/ndxt/centit-scaffold/blob/master/src/main/java/com/centit/support/scaffold/RunScaffoldTask.java",target:"_blank",rel:"noopener noreferrer"}},[t._v("RunScaffoldTask.java")]),t._v("是针对struts版本的，struts处理在遗留项目外已经不允许使用。")])])}],!1,null,null,null);a.default=e.exports}}]);