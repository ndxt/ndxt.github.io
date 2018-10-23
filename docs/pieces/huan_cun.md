# 动机
在研发中进场会碰到一些更改频率很低但是需要频繁访问的对象，比如：数据字典。这是缓存是最好的解决防范，Spring提供了一个通用的缓存框架Ehcache，那我为什么还要自己写一个呢？

 1. Spring ehcahe是一个通用的方案，他可以使用内存也可以使用磁盘，这是一个很好的优点，它拜托了内存大小的限制，但是会进行序列化导致性能降低。
 2. 如果一个对象集合同时需要list的形式存储已获得整体又需要以HashMap的形式组织以方便查询 Ehcache会缓存两次，所以我们需要一个缓存依赖关系。
鉴于以上原因我们设计了一个简单实用的缓存方案。

# 设计思想
 
做这个缓存方案主要目的是减少内存的消耗、增强缓存内容的访问效率。

 1. 设计一个接口 ICachedObject&lt;T&gt; 它有一个是缓存失效的方法。
 2. 设计一个抽象类AbstractCachedObject&lt;T&gt; 它维护一个缓存依赖关系和当前缓存状态。
 3. CachedObject&lt;T&gt;类是一个缓存的最简单的实现，它需要一个生产者Supplier&lt;T&gt; 在缓存失效时刷新数据，缓存对象在初始化时总是失效的。另外缓存在初始化时可以 设置其依赖的其它缓存对象，一个缓存可以依赖多个其它缓存对象。
 4. CachedMap&lt;K,T&gt;是按照键值缓存的对象，它和CachedObject&lt;Map&lt;K,T&gt;&gt;是不一样的，后者作为一个对象整体缓存，前者是按照key分别缓存，每个key的状态是不一样的。CachedMap需要个生产者Function&lt;K, T&gt;。
 5. DerivativeCachedMap<K, D ,T>是针对CachedMap派生的缓存，它需要一个转换函数Function&lt;D, T&gt;。

# 使用

```java
// 定义缓存对象 ，需要提供刷新函数 this::reloadUserInfo
private CachedObject<List<ExtSysUserInfo>> allUserInfoCache =
        new CachedObject<>( this::reloadUserInfo,
            // 缓存数据的有效期
            CodeRepositoryCache.CACHE_FRESH_PERIOD_MINITES);
// 缓存刷新函数，一般也是访问数据库获取真正对象的函数            
protected List<ExtSysUserInfo> reloadUserInfo() {
        try(Connection conn = getDatabaseConnection() ) {
            ..............................
            return allUserInfo;
        }catch (SQLException |IOException  e){
            logger.error(e.getLocalizedMessage());
            return null;
        }
    }
// 定义一个派生缓存
private CachedObject<Map<String,ExtSysUserInfo>> codeToUserMapCache=
		// 刷新函数
        new CachedObject<>( ()-> {
                // 从其它缓存获取数据
                List<ExtSysUserInfo> userInfos = allUserInfoCache.getCachedTarget();
                if(userInfos==null){
                    return null;
                }
                Map<String, ExtSysUserInfo> userCodeMap = new HashMap<>(userInfos.size()+1);
                for(ExtSysUserInfo userInfo : userInfos ){
                    userCodeMap.put(userInfo.getUserCode(), userInfo);
                }
                return userCodeMap;
            },
            // 依赖的缓存，可以是多个；派生缓存没有有效期，它随依赖的缓存失效而失效
            allUserInfoCache);

// 使用缓存，派生缓存的使用方法一样，CachedMap的使用参见源码 
public List<ExtSysUserInfo> listAllUserInfo() {
        return allUserInfoCache.getCachedTarget();
    }
```

# 源码

[ICachedObject.java AbstractCachedObject.java CachedObject.java CachedMap.java DerivativeCachedMap.java](https://github.com/ndxt/centit-commons/tree/master/centit-utils/src/main/java/com/centit/support/common)