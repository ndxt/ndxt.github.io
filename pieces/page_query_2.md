# 动机

选择MyBatis作为项目持久化方案时，通常第一件事就是写一个的分页查询作为项目组的通用解决方案。百度会告诉你有很多别人写好的MyBatis 分页插件。实现的方法也比较简单，类似与[参数驱动sql插件](https://blog.csdn.net/code_fan/article/details/81456138)。笔者推荐使用MyBatis配置文件中的include来解决分页的问题。

# 配置MyBatis对不同数据库的支持
spring 4 配置类配置 MyBatis 的 sqlSessionFactory 。这个配置是为了解决不同数据库之间的方言差别。
```java
@SuppressWarnings("SpringJavaAutowiringInspection")
    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(@Autowired DataSource dataSource) throws IOException {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
		...........................
        Properties properties = new Properties();
        properties.setProperty("Oracle","oracle");
        properties.setProperty("DB2","db2");
        properties.setProperty("MySQL","mysql");
        properties.setProperty("SQL Server","sqlserver");
        properties.setProperty("H2","h2");

        /*PropertiesFactoryBean propertiesFactory = new PropertiesFactoryBean();
        propertiesFactory.setProperties(properties);*/

        DatabaseIdProvider databaseIdProvider = new VendorDatabaseIdProvider();
        databaseIdProvider.setProperties(properties);
        sessionFactory.setDatabaseIdProvider(databaseIdProvider);

        ...........
        return  sessionFactory;
    }
```

# 配置一个共用的Mapper.xml
这个Mapper.xml中配置分页sql语句片段，是这个方案的重点。完整的文档参见[BaseMapper.xml](https://github.com/ndxt/centit-persistence/blob/master/centit-persistence-mybatis/src/main/java/com/centit/framework/mybatis/dao/BaseMapper.xml)在这个文件中定义了各种数据库分页的语法。
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.centit.framework.mybatis.dao.BaseDao">
	<!-- 分页前面包装部分 oracle -->
	<sql id="pageBegin" databaseId="oracle">
	<![CDATA[ select t.* from (select row_.*, rownum rownum_ from ( ]]></sql>

	<!-- 分页后面包装部分 oracle -->
	<sql id="pageEnd" databaseId="oracle"><![CDATA[ ) row_  
	where rownum <= #{endRow} ) t where t.rownum_ > #{startRow} ]]></sql>

	<!-- 分页前面包装部分 mysql -->
	<sql id="pageBegin" databaseId="mysql"></sql>

	<!-- 分页后面包装部分 mysql -->
	<sql id="pageEnd" databaseId="mysql"><![CDATA[  limit #{startRow}, #{maxSize}]]></sql>


	<!-- 分页前面包装部分 sqlserver -->
	<sql id="pageBegin" databaseId="sqlserver"><![CDATA[ WITH query AS ( SELECT inner_query.* , ROW_NUMBER() OVER (ORDER BY CURRENT_TIMESTAMP) as __row_nr__ FROM ( ]]></sql>

	<!-- 分页后面包装部分 sqlserver -->
	<sql id="pageEnd" databaseId="sqlserver"><![CDATA[  ) inner_query) SELECT query.* FROM query WHERE __row_nr__ >= #{startRow} AND __row_nr__ < #{endRow} ]]></sql>


	<!-- 分页前面包装部分 db2 -->
	<sql id="pageBegin" databaseId="db2"><![CDATA[ select * from ( select inner2_.*, rownumber() over( order by order of inner2_) as rownumber_ from ( ]]></sql>

	<!-- 分页后面包装部分 sqlserver -->
	<sql id="pageEnd" databaseId="db2"><![CDATA[  fetch first #{endRow}  rows only ) as inner2_ ) as inner1_ where rownumber_ > #{startRow} order by rownumber_ ]]></sql>

	<!-- 分页前面包装部分 h2 -->
	<sql id="pageBegin" databaseId="h2"><![CDATA[ ]]></sql>

	<!-- 分页后面包装部分 h2 -->
	<sql id="pageEnd" databaseId="h2"><![CDATA[  limit #{startRow}, #{maxSize}]]></sql>
</mapper>
```
# 分页查询使用示例
调用分页查询的传入的Map参数必须要 **startRow、maxSize、endRow** 这三个参数。
```xml
 <!--分页查询 -->
    <select id="pageQuery" parameterType="map" resultMap="UnitInfo">
	    <!--插入分页查询起始标签 -->
        <include refid="com.centit.framework.mybatis.dao.BaseDao.pageBegin" />
        <include refid="coreSql" />
        <where>
            <include refid="condition" />
        </where>
        <if test="mybatisOrderBy != null and mybatisOrderBy != '' ">
            order by ${mybatisOrderBy}
        </if>
        <!--插入分页查询结束标签 -->
        <include refid="com.centit.framework.mybatis.dao.BaseDao.pageEnd" />
    </select>
    
```

# 总结
感觉这样做的好处是充分利用MyBatis原有的特性，并且修改也相对灵活，只要修改xml配置文件，虽然笔者非常讨厌xml配置文件，在[南大先腾框架](https://ndxt.github,io)中引入spring 4 的配置类消灭了几乎所有可以消灭的配置xml文件。