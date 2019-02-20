# 概述
框架中用户组织机构设计的对象有三个：
1. 机构信息，机构是有层级关系的，是一个森林（多个树）的关系。
2. 用户信息。
3. 机构用户关系，机构和用户是多对多的关系。

相关源码参见：[github/framework-core/basedata](https://github.com/ndxt/centit-framework/tree/master/framework-core/src/main/java/com/centit/framework/model/basedata);

# 机构信息
机构信息中需要特别说明的就是设计了一个机构路径unitPath属性，它的取值是这个机构所有上级机构的代码 用'/'连接的字符串。 通过这个机构可以查找其所有的上级机构代码， 用'/'分割这个字符串就可以；也可以从数据库中查找出所有他的下级机构，只要判断其 unitPath 是否已本机构的unitPath为前缀。这样设计避免了级联查询。
```java
public interface IUnitInfo{
    /**机构代码 是机构的主键
     * @return 机构代码 是机构的主键
     */
     String getUnitCode();
     /** 机构自编代码
     * @return 机构自编代码
     */
     String getDepNo();
    /** 机构名称
     * @return 机构名称
     */
     String getUnitName();
   /** 机构简称
     * @return 机构简称
     */
    String getUnitShortName();
    /** 上级机构代码
     * @return 上级机构代码
     */
     String getParentUnit();
    /** 机构类别
     * @return 机构类别
     */
     String getUnitType();
    /** 机构是否有效 T/F/A  T 正常 ， F 禁用,A为新建可以删除
     * @return 机构是否有效 T/F/A  T 正常 ， F 禁用,A为新建可以删除
     */
     String getIsValid();
    /** 机构路径，为这个机构所有上级机构的代码 用'/'连接的字符串
     * 通过这个机构可以查找其所有的上级机构代码， 用'/'分割这个字符串就可以
     * 也可以从数据库中查找出所有他的下级机构，只要判断其 unitPath 是否已本机构的unitPath为前缀
     * @return 机构路径
     */
     String getUnitPath();
    /** 机构排序
     * @return 机构排序
     */
     Long getUnitOrder();
    /** 分管领导（机构管理员）
     * @return 分管领导（机构管理员）
     */
     String getUnitManager();
    /** 获取和第三方对接数据，一般为第三方业务数据组件
     * @return 机构第三发业务中的主键
     */
    String getUnitTag();
}
```
# 用户信息
在框架中用户信息对象做了最简化设计，仅仅包括框架权限管理需要的必须的字段，应用系统可以通过额外的表，比如人员档案信息或者用户扩展信息来对这些信息进行扩展。
```java
public interface IUserInfo{
    /** 用户编码，是用户的主键
    * @return 用户编码，是用户的主键
    */
    String getUserCode();
    /**用户密码的密文, 密码为加盐的散列算法
    * @return getUserPin
    */
    @JSONField(serialize = false)
    String getUserPin();
    /** 用户登录名 同 getUsername
    * @return 用户登录名
    */
    String getLoginName();
     /** 用户排序号
    * @return 用户排序号
    */
    Long getUserOrder();
    .......
}
```
# 用户机构关系
这个对象框架权限的核心。设计的原则就是真实的反映用户在其机构中的角色。首先这是一个多对多的关系，一个用户可以在多个机构中，也有可能在一个机构中担任多个角色，每一个角色需要对应一条记录。其中：
1. userStation 用户岗位，是反映用户在这个机构中做什么事情，比如：收费员、营业员、程序员等等。是反映其工作内容的或者其专业的。所以这个是没有等级没有序的。
2. userRank 用户行政职务，是反映用户等级的，所以是有序的。比如：收费组组长、营业组组长、开发经理等等。
这两个属性在两个维度上反映了用户在组织中的岗位和职责。
```java
public interface IUserUnit{
    /**关联关系主键
     * @return 关联关系主键
     */
    String getUserUnitId();
    /**用户编码，是用户的主键
     * @return 用户编码，是用户的主键
     */
    String getUserCode();
    /**机构代码 是机构的主键
     * @return 机构代码 是机构的主键
     */
    String getUnitCode();
    /** 是否为默认(主)机构 T:主机构 F：辅机构
     * @return 是否为默认(主)机构 T:主机构 F：辅机构
     */
    String getIsPrimary();
    /**用户在本机构的岗位
     * @return 用户在本机构的岗位
     */
    String getUserStation();
    /** 用户在本机构的行政职务
     * @return 用户在本机构的行政职务
     */
    String getUserRank();
    /** 用户在本单位的排序号
     * @return 排序号
     */
    Long getUserOrder();
}

```
# 特别说明
上面三个对象都有一个共同的属性 order 排序号，这个在对排位敏感的单位非常重要，所以也把它放到框架中。