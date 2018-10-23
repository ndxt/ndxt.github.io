# 概述
先腾框架的权限控制从控制点分两类：

1. 前端控制；前端页面显示和页面上的操作按钮的显示控制。
2. 后端控制；后端业务访问控制。

从控制的内容也分两类：

1. 功能控制；业务功能控制。比如：对某个业务的修改操作。
2. 数据范围控制；业务操作数据范围控制。

框架设计的时候是基于这样的假设：

1. 前后端式分离的，并且推荐前端都是静态文件，部署在http服务器上。
2. 前端通过ajax请求对后端进行访问。

所以，前端的访问控制是可以绕过去的，比如，你知道一个前端页面Url（通常是一个html文件），即使没有登录、没有权限你依然可以访问这个html，但是html中的如果有js访问后台是就会报没有权限。
   
# 后段访问控制
后端访问控制包括对业务功能的访问控制，业务范围的访问控制。
## 业务功能访问控制 
框架是基于Spring MVC开发的，每一个业务一般都对应一个controller类，每一个业务都一个标识（optId）。每一个业务功能对应到这个controller类中的一个@RequestMapping标注的方法，一般用方法名来标识（optMethod）。对功能的控制就是对应RequestMapping中标注的url的访问控制。框架中所有的url采用restful的风格。[framework-security](https://github.com/ndxt/centit-framework/blob/master/framework-security)中的[DaoAccessDecisionManager](https://github.com/ndxt/centit-framework/blob/master/framework-security/src/main/java/com/centit/framework/security/DaoAccessDecisionManager.java)类实现了功能访问的控制，它首先通过url来匹配对应的业务操作的方法（optMethod），然后根据这个optCode来查找权限配置库获取所有具有这个权限的角色列表，再用这个列表和用户的角色列表对比，如果有交集说明用户有这个权限，否在没有。

**注 :**
1. *框架采用了Spring Security作为安全组件，Spring Security提供了四种注解，分别是@PreAuthorize , @PreFilter , @PostAuthorize 和 @PostFilter来对方法级别的访问进行控制。它虽然可以非常细粒度的控制权限，但是要硬编码在代码中，不太适用于政府类的OA系统。所以框架没有采用这中方式。*
2. *访问控制模块自己匹配url和方法的对应关系，spring mvc同样也做了一边，这个在效率上不是高效的，目前没有解决这个问题，目前的算法是将所有的url按照层次组织成一个树形结构，匹配的算法复杂度和数的层次有关，就是和url中的/个数有关，性能还是不错的，对业务几乎没有影响。*

## 业务范围访问控制
业务范围的控制的主要式通过对数据库中的数据访问范围来实现的。它包括两个部分：查询和写入（包括增删改）。

数据范围控制比较复制，框架提供了一个统一的通用的解决办法，但这个方法只能用在关系数据库查询中，如果这个办法不能满足业务的需求，可以通过将数据范围权限转换为业务功能权限的方式解决。
### 查询控制
数据查询的范围控制是通过[参数驱动SQL](https://blog.csdn.net/code_fan/article/details/81452933)中的**外部过滤条件**实现的，框架在定义业务功能操作是同时定义了这个业务的数据范围过滤条件，用户在进入业务功能后可以获得自己对应的权限范围的过滤条件（可能有多个，区并集），将这个过滤条件传递给 参数驱动SQL 查询方法，返回的就是用户可以访问的数据。目前这个**还没有通过aop的方式实现**，所以需要在开发人员在需要范围控制的地方手动添加这个**程式代码**。
```java 程式代码
@Service("testCaseManager")
public class TestCaseManagerImpl implements TestCaseManager {
    //业务代码optId
    public String getOptId(){
        return "testCase";
    }
    // 框架通用的服务，可以访问框架的配置信息
    @Resource
    protected GeneralService generalService;
    // 业务对应的数据库访问到
    @Resource
    protected TestCaseDao testCaseDao;
    // * @param ud 当前用户信息， 在Controller中可以通过 getLoginUser() 获取 
    // 具体的业务操作，每一个业务操作有一个唯一的操作代码optCode
    @Override
    public JSONArray listObjectsAsJson(CentitUserDetails ud,
                                Map<String, Object> filterMap, PageDesc pageDesc){
        // 创建当权用户信息相关的上下文
        DataPowerFilter dataPowerFilter = generalService.createUserDataPowerFilter(ud);
        // 将当前查询参数（一般是前台输入的参数）添加到这个用户信息中 
        dataPowerFilter.addSourceData(filterMap);
        // 获取用户权限范围过滤条件，getOptId() 获取当前业务ID， query为当前业务操作方法名 optMethod
        List<String> filters = generalService.listUserDataFiltersByOptIDAndMethod(
            ud.getUserCode(), getOptId(), "query");
        return DictionaryMapUtils.mapJsonArray( // 数据字典翻译工作
            this.testCaseDao.listObjectsAsJson( // 执行数据驱动SQL查询, 具体的语句在框架中封装了
            									// 这儿也可以直接调用 传入自定义的动态sql语句
                dataPowerFilter.getSourceData(),// 参数 : 当前用户相关参数（已包括查询信息）
                filters,                        // 用户数据范围权限过滤条件
                pageDesc), TestCase.class);
    }
}
```
### 写入控制
写入控制同样也**还没有通过aop的方式实现**，所以需要在开发人员在需要范围控制的地方手动添加这个**程式代码**。对写入的检验可以把当前操作的对象作为数据库中的一条记录，用权限过滤表达式检验一下；对应的就是调用dataPowerFilter.checkObject 方法。完整的源码参见[centit-persistence]()。
```java
    //* @param ud 当前用户信息， 在Controller中可以通过 getLoginUser() 获取 
    @Override
    public boolean saveNewCase(CentitUserDetails ud, TestCase testCase){
        // 创建当权用户信息相关的上下文
        DataPowerFilter dataPowerFilter = generalService.createUserDataPowerFilter(ud);
        // 获取用户权限范围过滤条件，getOptId() 获取当前业务ID，  saveNew 为当前业务操作方法名 optMethod
        List<String> filters = generalService.listUserDataFiltersByOptIDAndMethod(
            ud.getUserCode(), getOptId(), "saveNew");
        boolean passed = dataPowerFilter.checkObject(testCase, filters);
        if(passed){
            this.testCaseDao.saveNewObject(testCase);
        }
        return passed;
    }
```
# 前端访问控制
前端访问控制分为业务入口（菜单展示）和页面显示（操作权限）两部分。

## 业务入口

和业务入口相关的一般包括：首页和菜单列表（业务导航栏）。根据用户所有的功能权限可以得到一个和这些权限对应的业务列表。这个类别是用户所有可操作的模块，对应的业务入口url就是用户所以可以访问的业务菜单。

**注** 
*1. 前台可以调用 /system/mainframe/menu 来获取用户的菜单列表*。
*2. 用户访问没有权限的业务url前端并不会拦截，但是只能访问对应的页面的静态页面，无法获取相关业务数据*。

## 页面显示

如果需要对页面上的操作进行权限控制（比如：对只有查看没有修改权限的人，隐藏修改按钮）。后台提供了接口 /system/mainframe/checkuserpower/{optId}/{method} 来查询当前用户是否有这个业务操作方法的权限。关于页面显示控制有几点说明：

1. 在页面上通过ajax访问后台的方法来判断是否有对应的操作权限，并依次对页面组件进行重画。
2. 在用户登录是获取用户所有的操作方法权限，保存在本地存储中，在页面展示时从本地获得数据对页面重画。
3. 上面两种方法框架都提供的通用的方法。这两种方法用户具有的权限都是和用户登录时间点有关，如果在用户登录后后台管理员给用户的权限进行变更，用户必须重新登录才能生效。
4. 和页面入口一样，页面显示也可以通过前端直接访问业务对应的操作方法url来绕过验证，但是后端的权限控制会返回403错误。
