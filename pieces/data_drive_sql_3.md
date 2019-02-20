# 动机
业务系统开发过程中经常会面对数据范围权限的问题，比如：部分敏感字段只有领导能开、某些业务只能看自己经手的或者只能看自己所在部门的等等。归纳起来和关系数据库相关的数据范围权限可以分为两类：

 1. 字段权限，通常有称为列权限。
 2. 数据范围权限，通常称为行权限。

参数驱动sql通过两种方式来解决权限问题一、条件标签语句；二、外部顾虑条件。

# 条件标签语句

在[参数驱动SQL（一）sql语句拼接](https://blog.csdn.net/code_fan/article/details/81388777)已经描述过条件标签语句。条件语句是根据参数表达式来判断是否加入到最终的sql语句中的。这个参数列表是有客户端用户输入的，同样这个参数也可以是session中和当前用户相关的参数。同样条件标签语句可以在where条件中也可以在select相关的字段中。所以通过条件语句来进行数据范围权限控制。
```sql92
select [（'admin' in (currUser.roles)） | a.salary ], // 只有用户角色包含admin的人才能查看用户的薪水
        a.userName, a.departMent
from user_info a
where [ currUser.departNo: deptNo | a.departNo = :deptNo ] // 只能查看用户所在部门的用户信息
```
# 外部过滤条件

条件标签语句虽然可以处理数据范围权限的问题，但是必须提前知道权限的规则，不能动态的定义用户的数据范围。外部过滤条件就是针对这个应用场景设计的。

**语法**：{数据库表名列表}, 多个表名用","分隔，表名和别名用空格或者":"分隔。
**示例**：{table1 t1, table2 t2}

这个标签作用是将针对标签中的表对应的额外的顾虑条件插入到标签所在的位置，现在这个标签只能放在where语句部分。

外部语句是作为字符串列表来传入的，每个字符串为一个条件语句；条件语句为一个sql语句条件表达式，其中用[表名称.字段名]来指定字段，用{参数引用描述符：(预处理指令列表)SQL语句变量名称}来引用变量，可以是用户相关的变量、环境变量或者前端输入的变量等等。

举个例子：
```java
    //外部数据范围条件语句
    List<String> filters = new ArrayList<String> ();
    filters.add("[table1.c] like {p1.1:ps}");
    filters.add("[table1.b] = {p5}");
    filters.add("[table4.b] = {p4}");
    filters.add("([table2.f]={p2} and [table3.f]={p3})");
    Map<String,Object> paramsMap = new HashMap<String,Object>();       
    paramsMap.put("p1.1", "1");
    paramsMap.put("p2", "3");
    String queryStatement = "select t1.a,t2.b,t3.c "+
        "from table1 t1,table2 t2,table3 t3 "+
        "where 1=1 {table1:t1} order by 1,2";
    System.out.println(QueryUtils.translateQuery(queryStatement,filters,paramsMap,true).getQuery());
    结果是：
    select t1.a,t2.b,t3.c from table1 t1,table2 t2,table3 t3
    where 1=1  and (t1.c like :ps ) order by 1,2
```
在实际使用中可以将外置条件配置在数据库中并和具体的操作关联，在配置角色操作时同事指定对应的范围条件，条件中通过{参数引用描述符}应用用户属性。这样在具体的查询时可以获得额外的语句，根据当前用户属性获得对应的参数值。框架中[GeneralServiceImpl](https://github.com/ndxt/centit-framework-system/blob/master/framework-system-module/src/main/java/com/centit/framework/system/service/impl/GeneralServiceImpl.java) 可也作为外部条件和用户变量生产示例，具体业务可以模仿这个类来实现。