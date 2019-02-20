# 概述
在业务调研中用户经常会说这个申请表需要你的上级领导审批、或者需要分管领导审批或者需要兄弟单位进行同行评审，面对这样的需求一半都是要写很多逻辑代码的，问题是用户这样的规则还经常变化，如何快速的面对这样的需求变更呢？框架研发了一个用户机构关系的计算引擎来解决这个问题。先腾业务研发框架在[用户机构模型](https://blog.csdn.net/code_fan/article/details/82865124)的基础上设计了一个权限表达式来解决这问题。这个表达就是由一个**机构表达式**和**人员过滤器**组成的**权限表达式**。
## 源码
1. 机构表示式源码 [SysUnitFilterEngine.java](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/SysUnitFilterEngine.java) 。
2. 人员过滤器（权限表达式）源码[SysUserFilterEngine.java](https://github.com/ndxt/centit-framework/blob/master/framework-core/src/main/java/com/centit/framework/components/SysUserFilterEngine.java) 。

更多源码和开源项目参见[先腾开源框架](https://ndxt.github.io/)。 
## 应用场景
主要用于业务流程中的人员自动分配部分，比如：请假需要直接领导人（ D(u)R(r-1) ）审批还是部门最高责任人（ D(u)R(0-1) ）审批。 具体示例参见文档的最后部分。

# 机构表达式
## 表达式的范式说明
机构表达式中的所有变量、常量和运算结果都是一个集合，表达式形式如下：

1. **常量**：empty （空）| all （所有机构）|  "机构代码"（引号引起来的字符串，是机构的主键） ；
2. **变量**：标识符；变量在表达式运算时用一个map传入表达式的计算上下文中。
3. **数值**：层次； 是机构数的上下层次关系，只能用户计算的过程中。
4. **操作符**：+ （下层机构，层次由后面的数值决定） | - （上层机构）| * （最上层机构的下层机构 ,+- 的层次是相对当前的机构来计算的，* 的层次是相对当前机构的最上层机构来计算的）
5. **简单表达式** ：变量|常量 | 常量 + 数值|  变量 *|+ 数值 |  变量 - 数值 + 数值
6. **机构表达式** ： 简单表达式 | （机构表达式） |  机构表达式 || 机构表达式 | 机构表达式 && 机构表达式 | 机构表达式 ! 机构表达式 | S(机构表达式[,机构表达式]+)
7. **机构过滤器** D(机构表达式) ； 这个形式主要目的是和后面的人员过滤器一致起来； D 表示 department的意思。

* 机构表达式的结果是一个机构集合，||、&&、！均为集合运算符，||是取两个集合的并集，&&取两个集合的交集，！是在前一个集合中减去后一个集合。
* S(机构表达式[,机构表达式]+) ，这个表达式表示返回多个表达式中的 第一个结果不为空的集合
 
## 表达式示例
示例中的表达式基于下面的机构数，下图的每一个方框表示一个机构，方框中的代码是机构代码。假设计算是传入一个变量dep 对应的值是"D111"。
![机构树形图](https://img-blog.csdn.net/20180929185540204?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NvZGVfZmFu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
表达式示例：
1. U(empty)=>  ；返回空集合
2. U(all) => D1,D2,D11,D12,D111,D112,D1111,D1112 ；返回一个全部机构的集合
3. U(“D12”) =>D12 ； 一个常量
4. U(empty+1) =>D1,D2; 顶层机构
5. U(all+1) => D11,D12,D111,D112,D1111,D1112 ；非顶层机构，等价于 U(!(empty+1))
6. U(empty-1)=> D2,D12,D112,D1111,D1112 ；所有叶子机构
7. U(all-1) => D1,D11,D111；所有非叶子机构，等价于 U(!(empty-1))
8. U(dep) => D111 ；变量直接对应的机构
9. U(dep+1) => D1111,D1112; 下级机构
10. U(dep-1) => D11； 上级机构
11. U(dep-1+1) => D111,D112；所有同级机构
12. U(dep*1) => D1；包含dep机构的顶层机构
13. U(dep-1+1 ! dep) => D112；兄弟单位，就是和自己同级的机构去除掉自己

通过这个机构表达式可以计算，机构变量之间的相对关系，集合交集、并集和非的集合运算符可以应对大多数需求。

# 人员过滤器
有了机构表达式定位到机构，再根据人员的岗位、行政职务和行政职务的等级计算关系，就可以对人员进行过滤了。人员过滤器的形式如下：

 	 **D**/**P**(机构表达式)**gw**(岗位过滤器)**xz**(行政职务过滤器)**R**(行政职务等级过滤器)**U**(人员代码过滤器) 
 	 5个部分，每一部分都不是必须的，每一个部分的解释如下：
1. **D**/**P**(机构表达式) 就是上面的记过过滤器，如果是P表示只考虑默认在这个机构中的人，这样机构和人员的关系就是一对多的关系了。
2.  **gw**(岗位过滤器) ； 括号中为 岗位代码集合用“，”分割，可以是字符串常量也可以是map中的变量
3.  **xz**(行政职务过滤器)；和岗位一样，对应的是行政职务代码。
4. **R**(行政职务等级过滤器)；这个比较复杂，在框架的行政等级中数值越大等级越大，最高等级为1，所以+是下级，-是上级。它有以下几个形式
		
		*  R(r1) ；r1 可以是变量，也可以是常量，表示等级为r1的人，同一个等级可能对应多个行政职务。
		*  R(r1-1) ; r1 的上一级，因为一个机构中的人的等级不一定是连续的，所以他会找和 r1-1最接近的人，- 运算会向上找。
		*  R(r1+2)；r1的下两级，同样它会找和r1+2最接近的人，+运算会向下找。
		*  R(r1--)；比r1等级高的所有人
		*  R(r1++)；比r1等级低的所有人
		*  R(r1-1--)；比r1-1等级高的所有人
		*  R(r1+1++)；比r1+1等级低的所有人
5. **U**(人员代码过滤器) ；和岗位类似，对应的是人员代码；这个一般独立使用，因为它已经定位到某个具体的人。

# 权限表达式

**权限表达式** ：简单表达式 | S(权限表达式[,权限表达式]+) | （权限表达式） |  权限表达式 || 权限表达式 | 权限表达式 && 权限表达式 | 权限表达式 ! 权限表达式
这个就是上面简单表达式的集合运算。

## 权限表达式示例
首先假设一组关于当前用户的变量，它的形式是一个map：
u ：用户代码
d ：用户所在机构代码
s ：用户岗位代码
rank :   用户行政职务代码
r : 用户行政职位对应的等级
示例：
1. D(u)R(r-1) : 用户在本部门的直接领导；
2. D(u-1)R(0+1) : 用户上级部门等级最高的人，就是上级部门主管。
3. D(u*1)R(0+1) : 用户顶级级部门等级最高的人，就是分管领导。
4. gw(s)R(0+1)：同岗位（技术工种）中等级最高的人，一般是技术总管。