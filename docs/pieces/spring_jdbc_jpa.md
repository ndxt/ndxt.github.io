# 动机
主流的Orm框架有Hibernate、Mybatis和Spring Data。以往我一直推荐使用Hibernate，使用jpa注解不需要写sql语句也不要配置文件，确实比较便捷。说hibernate效率低下，主要式指用hibernate进行查询和统计，我觉得这是不公平的，查询可以原生sql直接返回jsonarry来做，没有必要用hibernate的orm模型做。hibernate功能确实强大，换一个方式来说也就是很难娴熟的掌握，光是对象的三种状态就把一半人搞晕。所以现在我也不推荐大家使用了，没有必要在持久化层花费太多尽力学习。MyBatis现在用的人越来越多，但是比较烦它的配置文件越来越讨厌xml格式的配置文件。Spring Data接触的较少；但是到时有很多人用spring jdbc。[先腾框架](https://ndxt.github.io/)中[持久化模块](https://github.com/ndxt/centit-persistence)中有三个自摸库分别对Hibernate、Mybatis和spring jdbc进行了封装，让开发人员可以选择不同的技术，但使用的接口有尽量统一。

这篇博文主要将用jdbc实现jpa，这个作用就是将使用jdbc的方式和hibernate一样，jpa的标准就是jboss提供的。[工程源码](https://github.com/ndxt/centit-commons/tree/master/centit-database/src/main/java/com/centit/support/database/orm)。先腾的Orm只实现了数据库增删改查的基本操作，没有实现缓存之类的额外特性。是JPA的一个最常用的子集，在系统开发的实践中验证过能够满足一般业务系统的开发需求。

# jpa注解扩展
JPA注解已经很全，但是一些细节不太满意，对其进行了扩展。

## Lazy 懒加载
JPA的关联注解（OneToMany、ManyToOne）中FetchType有lazy懒加载的选项。Lob字段的默认也是懒加载的，但是感觉并不是直观。 所以添加了一个Lazy注解，用于字段Column属性，明确的标注这个字段为懒加载，而不考虑这个字段是否式lob字段，任何类型都可以懒加载。
另外，所以的关联关系都是默认懒加载的，并且无法修改这个默认属性，如果需要同步加载，在调用方法中需要明确说明，这样避免没有必要的性能消耗。

## ValueGenerator 值生成器
JPA 有一个注解GeneratedValue 这个式用于主键的，并且不够灵活，所以定义了一个ValueGenerator注解，这个注解并不要一定用在主键上，任何字段都可以，可以把它作为insert 或者 update 的前置触发器。
```java
@Target({METHOD, FIELD})
@Retention(RUNTIME)
public @interface ValueGenerator {
    /**
     * 数值生成方式 
     *   Auto 数据库自动增长、 SEQUENCE 序列 value中保存序列名称 、
     *   UUID 、 CONSTANT 常量 value中保存常量、
     *   FUNCTION 公式 value中保存公式，是一个四则运算表达式，可以通过变量引用这个对象的其他属性
     * @return GeneratorType
     */
    GeneratorType strategy() default GeneratorType.AUTO;
    /**
     * 数值生成时机 NEW （insert） UPDATE （update） READ （select）
     * @return GeneratorTime
     */
    GeneratorTime occasion() default GeneratorTime.NEW;
    /**
     * 生成条件 IFNULL 数值为空时生成 ALWAYS 总是生成，会覆盖已有的值
     * @return GeneratorCondition
     */
    GeneratorCondition condition() default GeneratorCondition.IFNULL;
    /**
     * 具体生成参数 对应 GeneratorType 不同有不用的意思
     * @return
     */
    String value() default "";
}
```
需要特别说明的式strategy =  GeneratorType.FUNCTION 非常灵活可以通过对象的其他属性计算得出这个字段的值，这时value中的值为[四则运算表达式](https://blog.csdn.net/code_fan/article/details/81352458)。使用示例：
```java
/**
     * UPDATEDATE(更新时间) 更新时间
     */
    @Column(name = "UPDATE_DATE")
    @ValueGenerator( strategy= GeneratorType.FUNCTION, value = "today()", 
		    condition = GeneratorCondition.ALWAYS, occasion = GeneratorTime.ALWAYS )
    private Date  updateDate;
```
这个注解的意思就是只要这个对象有更新，updateDate字段就更新为当前日期，代码中无需对这个字段赋值。

# 元数据 JpaMetadata
JpaMetadata 中维护了类和数据库表结构的对应关系，在第一次使用到这个类的时候收集类上的注解信息，并将其保存在JpaMetadata中。每次访问数据库就是根据这个元数据来生成sql语句。框架中 JsonObjectDao 类实现了不同数据库之间的方言，这个不是本文的重点，有兴趣的可以看一下，欢迎给出宝贵建议。

# JPA的增删改查具体实现 OrmDaoUtils
OrmDaoUtils 中所有的方法都需要传递一个connection 数据库连接参数。其中的方法分以下几类：
## get*
getObject* 就是获取一个对象的查询。

## list*
listObjects* 就是更加属性查询一组对象，可以分页查询。

## query*
queryObjects* 是更加sql语句查询，这个相对更加灵活，可以分页查询。

## save*
save* Object * 保存新对象。
## update*
updateObject 更改对象。
## merge*
mergeObject 合并对象，可以理解为insert Or Update。
## *  Cascade *
方法名中有Cascade单词的，表示会级联查询，就是会根据OneToMany、OneToOne等等关联关系查询关联表。
## fetch*
fetch* 方法为获取Lazy对应的字段。

# 持久化框架考虑
在[先腾框架](https://ndxt.github.io/)中[持久化模块](https://github.com/ndxt/centit-persistence)中spring jdbc模块中，对这写方法进行了再次封装，将JdbcTemplate中的数据库链接传递给OrmDaoUtils，这样就不需要connection这个参数了，参见[BaseDaoImpl源码](https://github.com/ndxt/centit-persistence/blob/master/centit-persistence-jdbc/src/main/java/com/centit/framework/jdbc/dao/BaseDaoImpl.java)。