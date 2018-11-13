[^]:title:江苏南大先腾业务框架（九）数据字典与框架数据缓存[附源码]
#  概述
框架中除了用户、机构、业务、权限等信息，还有一类信息也是每个应用都需要，并且在同一个“客户”的不同业务系统中需要统一的数据，数据字典。比如：一般我们都习惯用一个字母来表示人员的性别，但是各个业务系统可能不一样，这样数据交换是就会导致需要做编码之间的转换，所以如果做一个统一的数据字典就能避免这个问题。

框架将上面的所有数据统称为主数据，这些数据因为需要频繁被访问所以需要将他们缓存起来，以提高性能。框架3.x以前的版本使用的是Ehcache，4.X改用[用静态变量缓存数据](https://blog.csdn.net/code_fan/article/details/81316281)。配套的框架提供了一套缓存访问接口和一个字典映射注解。

# 数据字典

和数据字典相关的对象有两个，一个式catalog（类别），一个式dictionary（字典）。

1. catalog 类别中描述了，数字字典的内容，形式（列表或者树形），各个字段的名称和取值范围。
2. dictionary 字典为数据明细，除了代码（code）数值（value）对，还有状态、排序、描述等信息。这些字段在每个类别中都可以有不同的解释。

# 数据缓存

框架中的[CodeRepositoryCache](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/CodeRepositoryCache.java)类，将上面的所有主数据用[用静态变量缓存数据](https://blog.csdn.net/code_fan/article/details/81316281)。框架通过[CodeRepositoryUtil](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/CodeRepositoryUtil.java)类提供了一组静态方法访问缓存类，请不要直接方位缓存对象。

# 代码映射

框架提供了一个注解DictionaryMap，将这个注解添加到po对应的属性上面，在将这个对象通过框架中的[DictionaryMapUtils](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/core/dao/DictionaryMapUtils.java)类转换为json是会自动添加对应的数据字典值。