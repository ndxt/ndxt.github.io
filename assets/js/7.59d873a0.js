(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{101:function(t,e,a){"use strict";a.r(e);var r=a(0),i=Object(r.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content"},[a("h1",{attrs:{id:"基础算法类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基础算法类","aria-hidden":"true"}},[t._v("#")]),t._v(" 基础算法类")]),a("p",[t._v("这类目前开源的有很多，比如apache的commons，我们的主要作为一个补充。目前centit-commons项目中主要有几个包：")]),a("p",[t._v("1."),a("strong",[t._v("centit-utils：")]),t._v(" 集合各种通用算法，比如：农历、日期、树形结构、网络、图片、加密等等算法。")]),a("p",[t._v("2."),a("strong",[t._v("centit-compiler：")]),t._v(" 这个包中包括一个词法分析器和一个表达式语法分析器。词法分析可以用于解析字符串，比如sql语句；表达式分析器可以作为一个建议的规则引擎使用。")]),a("p",[t._v("3."),a("strong",[t._v("centit-database：")]),t._v(" 这个包对一些常用的数据库操作进行了封装，内容包括：")]),a("p",[t._v("a) 不同数据库的适配。比如：分页、计数等等。")]),a("p",[t._v("b) DDL语句。这个一般业务系统是用不到，作为工具开发是比较有用，比如自定义表单。")]),a("p",[t._v("c) 数据库的元数据访问。")]),a("p",[t._v("d) 以JSON为对象的一个建议的ORM工具类。")]),a("p",[t._v("e) 自定义的查询扩展（QueryUtils），对sql进行类扩展，引入类条件语句类似于MyBatis的If语句，和外部过滤条件用于数据权限引擎对数据进行过滤。")]),a("h2",{attrs:{id:"通用算法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#通用算法","aria-hidden":"true"}},[t._v("#")]),t._v(" 通用算法")]),a("p",[t._v("这类目前开源的有很多，比如apache的commons，我们的主要作为一个补充。目前centit-utils项目中主要包含通用的算法类，内容主要式公司开发过程中积累的一些通用的算法和模块，其中很多算法式从网络上检索来的。把它们收集在一起主要是为了统一使用方式和减少算法的bug。")]),a("h3",{attrs:{id:"generalalgorithm类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#generalalgorithm类","aria-hidden":"true"}},[t._v("#")]),t._v(" GeneralAlgorithm类")]),a("p",[t._v("目前这个类中只有两个方法 nvl 和 nvl2 方法的功能和oracle中的同名方法一样。")]),a("h3",{attrs:{id:"datetimeopt类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#datetimeopt类","aria-hidden":"true"}},[t._v("#")]),t._v(" DatetimeOpt类")]),a("p",[t._v("几乎每一个框架都有重写这个类，这个类中的方法比较多，可以归纳为一下几类：")]),a("ol",[a("li",[t._v("create* 这类方法式创建一个日期类，不同的方法有不同的参数")]),a("li",[t._v("current* 获取当前时间，不同的方法返回不同的类型，可能是 utils.Date、sql.Data、timeStamp等等")]),a("li",[t._v("convert* 在土工日期类型、日期和时间 等等之间进行转换")]),a("li",[t._v("equal* 判断两个日期在不同时间精度上是否相等，比如是否是同一月、同一天、同一分钟等等。")]),a("li",[t._v("calc* 一组关于日期的计算函数，比如：计算两个日期之间的时机差calcSpanDays， 计算两个日期之间的工作日 calcWeekDays， 计算两个日期之间的周末天数 calcWeekendDays，计算一周的第一天和最后一天等等。")]),a("li",[t._v("add* 给日期做加减计算，参数为负数就是减。")]),a("li",[t._v("get* 获得日期的属性，比如星期几、是一年的第几天、当前时分秒等等。")]),a("li",[t._v("seek* 移动到这个月的最后一天、这年的最后一天等等。")]),a("li",[t._v("truncate\n"),a("em",[t._v("截取日期到天、周、月等等，和seek")]),t._v("\n操作相对。")]),a("li",[t._v("smartPraseDate 和 castObjectToDate 前者将字符串转换为日期，后者将object转换为日期。")]),a("li",[t._v("compareTwoDate 比较两个日期大小 ,避免 发生 NullPointerException 异常。")])]),a("h3",{attrs:{id:"lunar类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#lunar类","aria-hidden":"true"}},[t._v("#")]),t._v(" Lunar类")]),a("p",[t._v("这个是从网络上检索来的一个计算农历的类。")]),a("h3",{attrs:{id:"listopt类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#listopt类","aria-hidden":"true"}},[t._v("#")]),t._v(" ListOpt类")]),a("p",[t._v("对list和array的通用操作，apachecommons和Array、collections有的通用方法都尽量避免重复。主要的方法有：")]),a("p",[t._v("关联对象com.centit.support.common.TreeNode。")]),a("ol",[a("li",[t._v("sortAsTree* 将list按照树形结构进行排序，这个方式是这个类最重要的一个方法，也是这个类存在的一个原因。")]),a("li",[t._v("compareTwoList 比较两个list，将他们相同的、删除的、新增的分别找出来，刚好对应sql的 update、delete和insert操作。")]),a("li",[t._v("listToArray 和 arrayToList 通过反射的方式简化了传入的参数。")]),a("li",[t._v("remove* 一组对集合元素清理操作。")]),a("li",[t._v("moveListItem 和 changeListItem ，前者为移动元素位置两个元素之间的所有item位置都有变化，后者为仅仅交换两个元素的位置")]),a("li",[t._v("clone* 复制集合。")]),a("li",[t._v("storedAsTree、treeToJSONArray 对属性结构的存储或者序列化。")])]),a("h3",{attrs:{id:"numberbaseopt类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#numberbaseopt类","aria-hidden":"true"}},[t._v("#")]),t._v(" NumberBaseOpt类")]),a("p",[t._v("和Number相关的通用方法，主要方法有：")]),a("ol",[a("li",[t._v("capitalization 将数据转换为大写，用户发票中的大写输出。123.45 - 壹佰贰拾叁点肆伍")]),a("li",[t._v("uppercaseCN 将数据转换为中文，比如 2017 - 二〇一七。")]),a("li",[t._v("getNumByte 获取数据字符串中某一位上的数值，比如获取十位上的数据参数就传入 2")]),a("li",[t._v("castObjectTo* 一组类型转换算法")]),a("li",[t._v("compareTwo* 数据之间比较，主要是为了避免 NullPointerException。")]),a("li",[t._v("parse* 转换字符串为数值类型， 主要是为了避免 NullPointerException。")])]),a("h3",{attrs:{id:"reflectionopt类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#reflectionopt类","aria-hidden":"true"}},[t._v("#")]),t._v(" ReflectionOpt类")]),a("p",[t._v("一组反射方面缺失功能的封装。关联对象com.centit.support.common.JavaBeanMetaData")]),a("ol",[a("li",[t._v("getSetterMethod 、 getGetterMethod、getAllGetterMethod和getAllSetterMethod 获取对象的getter、setter方法")]),a("li",[t._v("getFieldValue、setFieldValue、getBooleanFieldValue、forceGetProperty、forceSetProperty 获取属性和设置属性。")]),a("li",[t._v("invoke*Method、invoke*Func 用反射调用方法。")]),a("li",[t._v("is* 判断类型，isPrimitiveType 判断一个类型是否是基础类型， isScalarType 判断一个类型是否为标量类型 等等。")]),a("li",[t._v("getCurrentMethodName 获取当前方法的名称。")]),a("li",[t._v("attainExpressionValue 根据表达式获取属性的值，类似于el表达式。")]),a("li",[t._v("createObjectFromMap 根据一个map创建一个对象。和 JavaBeanMetaData 类中的createBeanObjectFromMap 功能相同，但是实现的方式不一样，使用时可以仔细比较一下。")])]),a("h3",{attrs:{id:"stringbaseopt类和stringregularopt类。"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#stringbaseopt类和stringregularopt类。","aria-hidden":"true"}},[t._v("#")]),t._v(" StringBaseOpt类和StringRegularOpt类。")]),a("p",[t._v("StringBaseOpt类中主要是对字符串和字符串数组的操作，StringRegularOpt类主要是对字符串的规则验证。"),a("br"),t._v("\nStringBaseOpt类中需要特别介绍的方法有：")]),a("ol",[a("li",[t._v("getFirstLetter 获取中文的拼音的首字母。")]),a("li",[t._v("nextCode 获取字符串的下个值。")]),a("li",[t._v("castObjectToString 将对象转换为字符串，添加了对null值的特别处理，不会自动转换为“null”。")])])])}],!1,null,null,null);e.default=i.exports}}]);