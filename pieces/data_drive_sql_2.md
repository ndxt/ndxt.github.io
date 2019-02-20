# 动机
上一节讲了sql语句的拼接方式，参数驱动sql设计一个重要的目标就是让用户收集的前端输入 能够直接作为转换程序的输入参数。 但是前端输入的参数在类型、格式方面和sql语句需要的参数肯定有很多不一致的地方。前端一般输入的式字符串，sql语句要求的可能式日期、数字、字符串匹配模板甚至是一个用于in语句的数组。所以参数驱动sql设计了一套参数预处理系统。这样在业务系统中就不需要编写输入参数的转换代码，同时可以通过变更参数驱动sql来改变参数的处理方式，这样也增加了系统的灵活性。

# 设计思想

参数的语法为 ： **参数引用描述符：(预处理指令列表)SQL语句变量名称**；上一节也有介绍。
预处理指令列表，使用逗号分开的多个预处理指令；指令按照顺序执行，不区分大小写。预处理会按照顺序执行。预处理的主要作用有：类型转换、查询模式生产、语句替换等等。详细预处理列表参见 [QueryUtils.java](https://github.com/ndxt/centit-commons/blob/master/centit-database/src/main/java/com/centit/support/database/utils/QueryUtils.java)。

# 使用示例
```java
Map<String,Object> paramsMap = new HashMap<String,Object>();
        paramsMap.put("punitCode", "null");
        paramsMap.put("createDate", "2010-12-01");
        paramsMap.put("mathName", "江苏 先腾");
        paramsMap.put("array", "1,2,3,4,5");
        paramsMap.put("sort", "uu.unitType asc");

        String queryStatement =
                "select uu.unitCode,uu.unitName,uu.unitType,uu.isValid,uu.unitTag"
                        +"  from projectTable uu  "
                        +" where 1=1 [:(SPLITFORIN,LONG,CREEPFORIN)array| and uu.unitType in (:array)]"
                        + "[:(date)createDate | and uu.createDate >= :createDate ]"
                        + "[:(like)mathName | and uu.unitName like :mathName ]"
                        +"[:(inplace)sort | order by :sort  ]";

        printQueryAndNamedParams(QueryUtils.translateQuery(
                 queryStatement, null,
                  paramsMap, true));
```
上面的代码输出结果为：
```
--- sql语句
select uu.unitCode,uu.unitName,uu.unitType,uu.isValid,uu.unitTag  
from projectTable uu   
where 1=1  and uu.unitType in (:array_0,:array_1,:array_2,:array_3,:array_4)
 and uu.createDate >= :createDate 
 and uu.unitName like :mathName order by uu.unitType asc
--- 参数Map为
array_1----2
array_0----1
array_3----4
array_2----3
array----[1, 2, 3, 4, 5]
array_4----5
mathName----%江苏%先腾%
createDate----Wed Dec 01 00:00:00 CST 2010
```

# 详细预处理指令

```java
 /**
     * 表示这个参数不需要
     */
    public static final String SQL_PRETREAT_NO_PARAM = "NP";
    /**
     * 转化为模式匹配字符串,字符串中间的空格、tab都会被%替换
     */
    public static final String SQL_PRETREAT_LIKE = "LIKE";
    /**
     * 用于like语句，只在参数后面添加一个 %， MySql建议只用这个，其他的匹配方式在MySql中效率都比较低
     */
    public static final String SQL_PRETREAT_STARTWITH = "STARTWITH";
    /**
     * 用于like语句，只在参数前面添加一个 %
     */
    public static final String SQL_PRETREAT_ENDWITH = "ENDWITH";
    /**
     * 转化为日期类型,
     */
    public static final String SQL_PRETREAT_DATE = "DATE";
    /**
     * 转化为日期类型，并且计算第二天的日期，没有时间（时间为00:00:00） 用于区间查询的结束时间
     */
    public static final String SQL_PRETREAT_NEXTDAY = "NEXTDAY";
    /**
     * 转化为带时间的，日期的类型
     */
    public static final String SQL_PRETREAT_DATETIME = "DATETIME";
    /**
     * 转化为 2016-6-16这样的日期字符串
     */
    public static final String SQL_PRETREAT_DATESTR = "DATESTR";
    /**
     * 转化为 2016-6-16 10:25:34这样的日期和时间字符串
     */
    public static final String SQL_PRETREAT_DATETIMESTR = "DATETIMESTR";
    /**
     * 过滤掉所有非数字字符
     */
    public static final String SQL_PRETREAT_DIGIT = "DIGIT";
    /**
     * 大写
     */
    public static final String SQL_PRETREAT_UPPERCASE = "UPPERCASE";
    /**
     * 小写
     */
    public static final String SQL_PRETREAT_LOWERCASE = "LOWERCASE";
    /**
     * 转化为符合数字的字符串，
     */
    public static final String SQL_PRETREAT_NUMBER = "NUMBER";
    /**
     * 给子符串添加''使其可以拼接到sql语句中，并避免sql注入
     */
    public static final String SQL_PRETREAT_QUOTASTR = "QUOTASTR";
    /**
     * 应该转化 Integer类型，单对于数据库来说他和long没有区别所以也返回的Long类型
     */
    public static final String SQL_PRETREAT_INTEGER = "INTEGER";
    /**
     * 转化 Long 类型
     */
    public static final String SQL_PRETREAT_LONG = "LONG";
    /**
     * 转化为 Double 类型
     */
    public static final String SQL_PRETREAT_FLOAT = "FLOAT";
    /**
     * 将对象转换为 String， 如果是数组用 ','连接。
     */
    public static final String SQL_PRETREAT_STRING = "STRING";
    /**
     * 将字符串 用,分割返回 String[]；对于支持数组变量的spring jdbcTemplate或者hibernate中的hql用这个处理就可以了，先腾实现的jpa也支持数组参数
     */
    public static final String SQL_PRETREAT_SPLITFORIN = "SPLITFORIN";
    /** 对于不支持数组参数的执行引擎，需要将参数按照数值的格式进行扩展
     * 修改语句中的 命名参数，使其能够接受 多个参数以便用于in语句，比如： in(:a)
     * 传入a为一个数组，会根据a的实际长度变为 in(:a0,:a1,a2,......)
     */
    public static final String SQL_PRETREAT_CREEPFORIN = "CREEPFORIN";
    /**
     * 将参数值 拼接到 sql对应的参数位置，同时要避免sql注入；一般用与Order by中
     */
    public static final String SQL_PRETREAT_INPLACE = "INPLACE";
    /**
     * 过滤参数中的html标签
     */
    public static final String SQL_PRETREAT_ESCAPE_HTML = "ESCAPEHTML";
```