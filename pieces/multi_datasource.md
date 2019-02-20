# 动机
业务系统中经常会需要同时操作多个数据库。常见的场景有：

 - 数据量太大，需要分表分库存储。
 - 一些数据库操作类工具，比如：报表工具、自定义表单工具，需要随时添加和编辑数据源信息。

对应的处理方法已有两种：

 - 对多个数据源是已知的、固定的，可以通过spring的AbstractRoutingDataSource类来实现数据库的路由。[先腾框架](https://ndxt.github.io/)中[持久化模块](https://github.com/ndxt/centit-persistence)中的[动态数据源DynamicDataSource](https://github.com/ndxt/centit-persistence/tree/master/centit-persistence-core/src/main/java/com/centit/framework/core/datasource) 对AbstractRoutingDataSource进行了封装，并通过AOP 的方式用注解实现了数据源的路由。
 - 对于数据源不确定的场景[先腾框架](https://ndxt.github.io/)中的[数据基础操作模块](https://github.com/ndxt/centit-commons/blob/master/centit-database-datasource)中的DbcpConnectPools对数据库链接池进行了封装，使得对数据源的操作根简单，并且提供了事务执行框架TransactionHandler.java。


#  动态数据源DynamicDataSource

## DynamicDataSource 设计思想
**DynamicDataSource** 动态数据源，通过对Spring的AbstractRoutingDataSource 的封装提供动态数据源获取支持。

> **原理：**
> 
> **DynamicDataSource** 采用 AOP 机制拦截所有使用了注解 `@TargetDataSource("...")` 定义的类和方法，然后在此类中的方法和这些方法**被调用之前自动切换**当前数据源为 `@TargetDataSource("...")` 定义的数据源，为方法中使用提供适合的数据源（`org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource` 提供了多数据源注册和根据注册类型查找对应的数据源能力）。


## DynamicDataSource 使用步骤

### 步骤1： 在Spring配置文件中配置多个数据源。
```xml
<bean id="ds1" class="org.apache.commons.dbcp2.BasicDataSource" ...>...</bean>
<bean id="ds2" class="org.apache.commons.dbcp2.BasicDataSource" ...>...</bean>
<bean id="ds3" class="org.apache.commons.dbcp2.BasicDataSource" ...>...</bean>
<bean id="ds4" class="org.apache.commons.dbcp2.BasicDataSource" ...>...</bean>
```

### 步骤2： 将这些数据源注册给 
`com.centit.framework.core.datasource.DynamicDataSource`
```xml
<bean id="dynamic_datasource" class="com.centit.framework.core.datasource.DynamicDataSource">
    <!-- 注册目标多个数据源 -->
	<property name="targetDataSources">  
		<map key-type="java.lang.String">
		   <!--这里的key值将是 @TargetDataSource("...") 的值-->  
		   <entry key="ds1" value-ref="ds0"/> 
		   <entry key="ds2" value-ref="ds1"/>
		   <entry key="ds2" value-ref="ds2"/>
		   <entry key="ds2" value-ref="ds3"/>
		</map>  
    </property>
    <!-- 如果出现了未知的数据源，则将使用这里配置的默认数据源替代 -->
    <property name="defaultTargetDataSource" ref="ds1"/>  
</bean>
```

### 步骤3： 配置生效 `DynamicDataSourceAspect` AOP切面拦截器。
```xml
<bean id="dynamicDataSourceAspect" class="com.centit.framework.core.datasource.DynamicDataSourceAspect">
</bean>
```

### 步骤4： 使用注解 `@TargetDatasource("...")` 定义类或方法要用到的数据源即可。
注解定义在类上，类中的所有方法都使用这个数据源。
```java
/** 
 * use on class, all methods in this class will be use 'ds1' datasource.
 */
@Service("userService")
@TargetDataSource("ds1")
public class UserService {
    public List<User> findUsers() {
        // ...
    }
}
```
注解定义在方法上，这个方法使用这个数据源。
```java
/** 
 * use on method, the method will be use 'ds4' datasource.
 */
@Service("orderService")
public class OrderService {
    
    @TargetDataSource("ds4")
    public List<OrderItem> findOrderItems() {
        // ...
    }
}
```
根据参数动态的计算模板库，需要将mapByParameter 设置为true，value中的值为[四则运算表达式](https://blog.csdn.net/code_fan/article/details/81352458)。
```java
/** 
 * 根据参数动态的计算数据源
 */
@Service("shoppingCartService")
public class ShoppingCartService {

    public List<ShoppingItem> findShoppingItems() {
        // ...
    }    

    @TargetDataSource(value = "'ds'+ (userId mod 4 + 1)", mapByParameter = true)
    public Address getDefaultDeliverAddress(long userId) {
        // ...
    }
}
```

# 动态链接池管理 DbcpConnectPools
动态连接池管理通过三个类实现：
## 数据源描述 DataSourceDescription
数据源通过数据的jdbc-url和用户名唯一确定，就是同一个url不同的用户也是认为不同的数据源的。每个数据源可以有自己的不同的配置信息。
```java
public final class DataSourceDescription implements  Serializable{
    private String connUrl ;
    private String username ;
    private String driver ;
    private String password ;
    private DBType dbType;
    private int    maxTotal ;
    private int    maxIdle ;
    private int    minIdle ;
    private int    maxWaitMillis;
    private int    initialSize ;
    private String databaseCode;
    ...................
    @Override
    public boolean equals(Object dbco){
        ...........
    }

    @Override
    public int hashCode(){
        ...................
    }
```
## 动态数据源管理类DbcpConnectPools
这个类管理所有的数据源链接池；获取数据库链接式只需要调用 getDbcpConnect 方法就可以。
```java
public static synchronized Connection getDbcpConnect(DataSourceDescription dsDesc)
 throws SQLException{
        BasicDataSource ds = dbcpDataSourcePools.get(dsDesc);
        if(ds==null)
            ds = addDataSource(dsDesc);
        Connection conn = null;
        conn = ds.getConnection();
        conn.setAutoCommit(false);  
        ///*dsDesc.getUsername(),dsDesc.getDbType(),*/
        return conn;
    }
```

## 事物执行框架 TransactionHandler
这个类只提供了一个方法executeInTransaction使用也很简单：
```java
public  static void runInTransaction()  {
        DataSourceDescription dbc = new DataSourceDescription();
        dbc.setConnUrl("jdbc:oracle:thin:@192.168.131.81:1521:orcl");
        dbc.setUsername("fdemo2");
        dbc.setPassword("fdemo2");
        /**
         * 假设这个对象是你要保存的; 如果调用 OrmDaoUtils.saveNewObject 成功，这个对象上必须有jpa注解
         * 有jpa注解就不用自己写sql语句了，否则自己写insert语句也是可以的
         */
        Object userInfo = new Object();
        try {
            Integer ret = TransactionHandler.executeInTransaction(dbc, (conn) -> {
                /**
                 * 这两个操作是在一个事物中的
                 */
                DatabaseAccess.doExecuteSql(conn, "delete from table where a=? and b=?",
                        new Object[]{"a",5});
                return OrmDaoUtils.saveNewObject(conn, userInfo);
            });
            System.out.println(ret);
        }catch (SQLException e){
            System.out.println(e.getLocalizedMessage());
        }
    }
```

# 源码

 - [先腾框架](https://ndxt.github.io/)中[持久化模块](https://github.com/ndxt/centit-persistence)。
 - [先腾框架](https://ndxt.github.io/)中的[数据基础操作模块](https://github.com/ndxt/centit-commons/blob/master/centit-database-datasource)。