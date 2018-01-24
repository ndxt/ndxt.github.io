# 基础算法类

这类目前开源的有很多，比如apache的commons，我们的主要作为一个补充。目前centit-utils项目中主要包含通用的算法类，内容主要式公司开发过程中积累的一些通用的算法和模块，其中很多算法式从网络上检索来的。把它们收集在一起主要是为了统一使用方式和减少算法的bug。

## com.centit.support.algorithm包

### GeneralAlgorithm类

目前这个类中只有两个方法 nvl 和 nvl2 方法的功能和oracle中的同名方法一样。

### DatetimeOpt类

几乎每一个框架都有重写这个类，这个类中的方法比较多，可以归纳为一下几类：

1. create\* 这类方法式创建一个日期类，不同的方法有不同的参数
2. current\* 获取当前时间，不同的方法返回不同的类型，可能是 utils.Date、sql.Data、timeStamp等等
3. convert\* 在土工日期类型、日期和时间 等等之间进行转换
4. equal\* 判断两个日期在不同时间精度上是否相等，比如是否是同一月、同一天、同一分钟等等。
5. calc\* 一组关于日期的计算函数，比如：计算两个日期之间的时机差calcSpanDays， 计算两个日期之间的工作日 calcWeekDays， 计算两个日期之间的周末天数 calcWeekendDays，计算一周的第一天和最后一天等等。
6. add\* 给日期做加减计算，参数为负数就是减。
7. get\* 获得日期的属性，比如星期几、是一年的第几天、当前时分秒等等。
8. seek\* 移动到这个月的最后一天、这年的最后一天等等。
9. truncate
   _截取日期到天、周、月等等，和seek_
   操作相对。
10. smartPraseDate 和 castObjectToDate 前者将字符串转换为日期，后者将object转换为日期。
11. compareTwoDate 比较两个日期大小 ,避免 发生 NullPointerException 异常。

### Lunar类

这个是从网络上检索来的一个计算农历的类。

### ListOpt类

对list和array的通用操作，apachecommons和Array、collections有的通用方法都尽量避免重复。主要的方法有：

关联对象com.centit.support.common.TreeNode。

1. sortAsTree\* 将list按照树形结构进行排序，这个方式是这个类最重要的一个方法，也是这个类存在的一个原因。
2. compareTwoList 比较两个list，将他们相同的、删除的、新增的分别找出来，刚好对应sql的 update、delete和insert操作。
3. listToArray 和 arrayToList 通过反射的方式简化了传入的参数。
4. remove\* 一组对集合元素清理操作。
5. moveListItem 和 changeListItem ，前者为移动元素位置两个元素之间的所有item位置都有变化，后者为仅仅交换两个元素的位置
6. clone\* 复制集合。
7. storedAsTree、treeToJSONArray 对属性结构的存储或者序列化。

### NumberBaseOpt类

和Number相关的通用方法，主要方法有：

1. capitalization 将数据转换为大写，用户发票中的大写输出。123.45 - 壹佰贰拾叁点肆伍
2. uppercaseCN 将数据转换为中文，比如 2017 - 二〇一七。
3. getNumByte 获取数据字符串中某一位上的数值，比如获取十位上的数据参数就传入 2
4. castObjectTo\* 一组类型转换算法
5. compareTwo\* 数据之间比较，主要是为了避免 NullPointerException。
6. parse\* 转换字符串为数值类型， 主要是为了避免 NullPointerException。

### ReflectionOpt类

一组反射方面缺失功能的封装。关联对象com.centit.support.common.JavaBeanMetaData

1. getSetterMethod 、 getGetterMethod、getAllGetterMethod和getAllSetterMethod 获取对象的getter、setter方法
2. getFieldValue、setFieldValue、getBooleanFieldValue、forceGetProperty、forceSetProperty 获取属性和设置属性。
3. invoke\*Method、invoke\*Func 用反射调用方法。
4. is\* 判断类型，isPrimitiveType 判断一个类型是否是基础类型， isScalarType 判断一个类型是否为标量类型 等等。
5. getCurrentMethodName 获取当前方法的名称。
6. attainExpressionValue 根据表达式获取属性的值，类似于el表达式。
7. createObjectFromMap 根据一个map创建一个对象。和 JavaBeanMetaData 类中的createBeanObjectFromMap 功能相同，但是实现的方式不一样，使用时可以仔细比较一下。

### StringBaseOpt类和StringRegularOpt类。

StringBaseOpt类中主要是对字符串和字符串数组的操作，StringRegularOpt类主要是对字符串的规则验证。  
StringBaseOpt类中需要特别介绍的方法有：

1. getFirstLetter 获取中文的拼音的首字母。
2. nextCode 获取字符串的下个值。
3. castObjectToString 将对象转换为字符串，添加了对null值的特别处理，不会自动转换为“null”。
4. 


