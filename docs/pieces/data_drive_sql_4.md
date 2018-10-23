# 动机
业务系统一般都会选择一个Orm框架，笔者强力推荐使用先腾[基于spring jdbc的的持久化框架](https://github.com/ndxt/centit-persistence/tree/master/centit-persistence-jdbc)，但现在这个框架还不是主流，主流的Orm框架还是Hibernate和MyBatis，[先腾持久化框架](https://github.com/ndxt/centit-persistence)对他们都有封装，提供了很多共用方法和整合参数驱动sql。

参数驱动sql和Orm框架在持久化方面进行分工，Orm用于数据的增删改，参数驱动sql主要用于数据的查询与统计工作。Hibernate由于提供了NativeQuery查询接口所以整合非常简单，就是在查询前做一个语句预处理工作。MyBatis是通过Mapper.xml提供查询语句的，和MyBatis的整合是通过插件来实现的。

# 参数驱动sql Mybatis插件

Mybatis使用Mapper.XML来配置sql语句，插件ParameterDriverSqlInterceptor在Mybatis执行前对sql语句进行预处理。

## 插件的启动方式

Mapper.XML中的语句ID（方法名称）如果以 ByPDSql 结尾，将会触发语句预处理活动。

如果不方便修改这个ID（方法名称），也可以在语句的最前面添加注释来触发， 比如：

```sql92
 -- PDSql
 /* PDSql */
 -- parameter driver sql 
 /* parameter driver sql */
-- parameters driver sql 
 /* parameters driver sql */
```
6种书写方式都可以，但是注释必须在语句的最前面。


## 配置方式 
spring 4 配置类配置方法
```java
    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(@Autowired DataSource dataSource) throws IOException {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        ......
        //添加数据权限拦击器
        configuration.addInterceptor(new ParameterDriverSqlInterceptor());
        ......
        sessionFactory.setConfiguration(configuration);
        ......
    }

```

# 参数驱动sql使用示例

```xml
<select id="pageQuery" parameterType="map" resultMap="OptLog">
        /* parameter driver sql */ /* 这个注释式触发插件的关键字 */
        <include refid="com.centit.framework.mybatis.dao.BaseDao.pageBeginByPDSql" />
        <include refid="coreSql" />
        where 1=1 [ :logId | and u.LOG_ID = :logId ]
        [ :(like)logLevel | and u.LOG_LEVEL like :logLevel]
        [ :userCode | and u.USER_CODE = :userCode]
        [ :(date)optTimeBegin | and u.OPT_TIME >= :optTimeBegin]
        [ :(nextday)optTimeEnd | and u.OPT_TIME <![CDATA[<= ]]> :optTimeEnd]
        [ :optId | and u.OPT_ID in (:optId)]
        [ :optCode | and u.OPT_CODE = :optCode]
        [ :(like)optContent | and u.OPT_CONTENT :optContent]
        [ :(like)oldValue| and u.OLD_VALUE like :oldValue]
        [ :(like)optMethod| and u.OPT_METHOD like :optMethod]
        [ :(INPLACE)mybatisOrderBy | order by :mybatisOrderBy]
        <include refid="com.centit.framework.mybatis.dao.BaseDao.pageEndByPDSql" />
    </select>
```
使用这个功能需要在项目中添加依赖
```xml
		<dependency>
            <groupId>com.centit.framework</groupId>
            <artifactId>centit-persistence-mybatis</artifactId>
            <version>1.1.1806</version>
        </dependency>
```
相关的包都已经发布到Maven的中央库中，更多框架信息参见[先腾框架](https://ndxt.github.io/)。