# 动机
这业务系统开发的时候，我们经常需要根据前端查询页面输入的条件拼接sql查询语句，如果用过MyBatis就知道这个需要在Map.xml中用条件语句写sql片段；虽然MyBatis这个语法非常强大，但是笔者认为写这个xml文件非常繁琐（[先腾框架](https://ndxt.github.io/)中所有的项目都采用spring 4的配置类，消除了大部分xml文件）。


参数驱动sql采用想用更简洁的方式来解决这个sql拼接的问题。首先它是一个sql预处理引擎，他通过条件标签[]来代替条件语句。另外参数驱动sql语句是基于命名变量语句的，所有参数以":"+参数名的方式标识。不能用"?"作为参数占位符，也不能用MyBatis的方式。

驱动参数sql一共分多篇博文来介绍：

 1. sql语句拼接。
 2. sql语句变量处理和转换。
 3. 数据范围权限。
 4. 与Orm框架的整合。

# 设计思想
参数驱动sql是一个 sql预处理框架，它在sql的基础上，添加了自己的语法，在预处理方法中处理这部分语法，将参数驱动sql转变为带参数的sql语句和对应的参数列表。这个语句可以直接给spring的jdbcTemplate运行，也可以进一步转化为？形式的参数语句直接给jdbc运行。
```java
public class QueryAndNamedParams {
    /**
     * 查询语句，带命名参数的sql语句
     */
    private String queryStmt;
    /**
     * sql中的参数：变量和变量值的对应map
     */
    private Map<String, Object> params;
 };
    
 public static QueryAndNamedParams translateQuery(
            String queryStatement,Map<String,Object> paramsMap){
		...........................
 }
```
相关源码参见：[QueryAndParams、QueryAndNamedParams、QueryUtils](https://github.com/ndxt/centit-commons/tree/master/centit-database/src/main/java/com/centit/support/database/utils)。
# 条件标签语句
语法: [(条件)(参数列表)| sql语句片段]

意义是如果“条件”成立，sql语句片段将生效，并将参数列表中的参数加入最终sql语句的参数中，其中参数列表是可选的；如果没有参数列表，后面的语句就是一个固定的无参数的语句。

条件：条件是一个逻辑运算表达式，其中可以直接用参数引用描述符引用参数Map中的变量。如果变量名称中可能有中文获取其他特殊字符可以用${变量名称}来表示。表达式的格式参见[四则运算表达式](https://blog.csdn.net/code_fan/article/details/81352458)；这个表达的运行结果必须是一个布尔值或者数值，如果是数值非0 表示真。

再介绍一个名词**参数引用描述符**,它是来引用Map参数中变量的。可以直接用名称引用，也可以用value.attr的形式来引用Map中变量的属性。如果Map中的变量名称比较特殊不符合标识符规范比如中文，可以用${变量名称}。

参数列表：是用“，”分开的多个参数，形式为**参数引用描述符：(预处理指令列表)SQL语句变量名称**;如果参数引用描述符和sql语句变量名称一样，参数引用描述符可以省略。

举个例子：
```sql92
-- Map中有变量 a、b、c、d
-- 参数驱动sql如下：
select [(a>1)| t1.col1, ] t2.col2
from [(a>1)| table1 t1 join ] table2 t2 [(a>1)| on (t1.id=t2.id) ]
where t2.col3> 5 [(a>1 && b>1)(b:num)| and t1.col3 > :num][ (c>1)(:c) |and t2.col4 > :c ]
[(isnotempty(d))(:(inplace)d)| order by :d desc ]
--如果Map的值为 a:2, b:0 , c:2 , d: 't2.col4' 转换后的语句如下
select t1.col1, t2.col2
from table1 t1 join  table2 t2 on (t1.id=t2.id) 
where t2.col3> 5 and t2.col4 > :c
order by t2.col4 desc 
-- sql与的参数为 c:2
```
输出的参数式转化后的sql需要的参数，:(inplace)d 中的inplace是参数的预处理指令，下一节详细介绍。(b:num）表示把参数b重命名为num。

# 条件语句的简洁写法

如果条件只是判断输入的参数是否为空有则可以将条件省略并且同时需要省略参数列表外层的（）;如果这个参数仅用于判断则参数中的sql语句变量名称也要省略。举个例子：
```sql92
-- Map中的变量 a：'4'、user:{name：'先腾'}、c：notnull
select t1.col1, t1.col2
from table1 t1
where 1=1 [:(number)a| and t1.col3>:a] [user.name:name| and t1.name=:name ]
   [c | and t1.col4 not null] [:e| and t1.col5 =:e]
-- 转换后的语句为
select t1.col1, t1.col2
from table1 t1
where 1=1 and t1.col3>:a and t1.name=:name 
    and t1.col4 not null
-- sql与的参数为 a:4 , name:'先腾'
```
# 使用
[QueryUtils](https://github.com/ndxt/centit-commons/tree/master/centit-database/src/main/java/com/centit/support/database/utils)中的translateQuery只负责把参数驱动sql转化为普通的待参数的sql，并不复制sql语句的执行，执行可以通过多种方式，比如Hibernate中的NativeSql，MyBatis中中sql接口 、spring jdbcTemplate或者直接交给jdbc执行。这样设计的好处式，不讲参数驱动sql和具体的框架绑定在一起。