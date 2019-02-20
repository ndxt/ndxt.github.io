# 动机
业务系统对数据库进行查询通常需要分页查询(否则数据量太大无法返回)，所以需要通用的分页查询。分页查询一般需要做两件事情：

 1. 生成分页查询语句，进行分页查询。
 2. 生成求总数的语句，查询所有符合条件的数量，以求一共有多少页。

在开发过程中能力强的程序员可以直接写这两个语句，作为[先腾框架](https://ndxt.github.io/)提供了自动转换的函数，传入一个正常查询的语句，函数会自动转换为上述的两个语句。

# 源码详解
所有源码参见[QueryUtils](https://github.com/ndxt/centit-commons/blob/master/centit-database/src/main/java/com/centit/support/database/utils/QueryUtils.java)中的buildLimitQuerySQL 方法和buildGetCountSQL 方法。

## buildLimitQuerySQL

不同的数据库分页方法是不一样的， 所有的方法都用到了[编译原理中的lexer词法分析器](https://blog.csdn.net/code_fan/article/details/81352458)。
```java
/* 参数 asParameter 表示分页参数 直接作为参数 还是直接 拼接到sql语句中 */
public static String buildLimitQuerySQL(String sql,int offset,int maxsize,
                                            boolean asParameter, DBType dbType){
        switch (dbType){
            case Oracle:
                return buildOracleLimitQuerySQL(sql,offset, maxsize,asParameter);
            case DB2:
                return buildDB2LimitQuerySQL(sql,offset, maxsize);
            case SqlServer:
                return buildSqlServerLimitQuerySQL(sql,offset, maxsize);
            case MySql:
                return buildMySqlLimitQuerySQL(sql,offset, maxsize,asParameter);
            case H2:
                return buildMySqlLimitQuerySQL(sql,offset, maxsize,asParameter);
            case Access:
            default:
                throw new PersistenceException(PersistenceException.ORM_METADATA_EXCEPTION,
                        "不支持的数据库类型："+dbType.toString());
        }
    }
```
### buildOracleLimitQuerySQL
```java
public static String buildOracleLimitQuerySQL(String sql,int offset,int maxsize,boolean asParameter) {

        final StringBuilder pagingSelect = new StringBuilder( sql.length()+100 );
        if(asParameter){
            if (offset>0) {
                pagingSelect.append( "select * from ( select row_.*, rownum rownum_ from ( " );
            }
            else {
                pagingSelect.append( "select * from ( " );
            }
            pagingSelect.append( sql );
            if (offset>0) {
                pagingSelect.append( " ) row_ ) where rownum_ <= ? and rownum_ > ?" );
            }
            else {
                pagingSelect.append( " ) where rownum <= ?" );
            }
        }else{
            if (offset>0) {
                pagingSelect.append( "select * from ( select row_.*, rownum rownum_ from ( " );
            }
            else {
                pagingSelect.append( "select * from ( " );
            }
            pagingSelect.append( sql );
            if (offset>0) {
                pagingSelect.append( " ) row_ ) where rownum_ <= ")
                    .append(offset + maxsize)
                    .append(" and rownum_ > ")
                    .append(offset);
            }
            else {
                pagingSelect.append( " ) where rownum <= " ).append(maxsize);
            }
        }
        return pagingSelect.toString();
    }
```
### buildDB2LimitQuerySQL
```java
public static String buildDB2LimitQuerySQL(String sql,int offset,int maxsize/*,boolean asParameter*/)
        /*throws SQLException*/{
        /*if(asParameter)*/
            //throw new SQLException("DB2 unsupported parameter in fetch statement.");
        if ( offset == 0 ) {
            return maxsize>1?sql + " fetch first " + maxsize + " rows only":
                                   " fetch first 1 row only";
        }
        //nest the main query in an outer select
        return "select * from ( select inner2_.*, rownumber() over(order by order of inner2_) as rownumber_ from ( "
                + sql + " fetch first " + String.valueOf(offset+maxsize) 
                + + " rows only ) as inner2_ ) as inner1_ where rownumber_ > "
                + offset + " order by rownumber_";
    }    
```
### buildSqlServerLimitQuerySQL
```java
public static String buildSqlServerLimitQuerySQL(String sql,int offset,int maxsize){
        if ( offset > 0 ) {
            // SQL SERVER 2012  才支持
            String alias_list = StringBaseOpt.objectToString( getSqlFiledNames(sql));
            return "WITH query AS ("
                     +"SELECT inner_query.* "
                     +", ROW_NUMBER() OVER (ORDER BY CURRENT_TIMESTAMP) as __row_nr__ "
                     +" FROM ( " + sql + ") inner_query"
                     +" ) "
                     +" SELECT "+ alias_list +" FROM query WHERE __row_nr__ >=" + String.valueOf(offset)
                     + " AND __row_nr__ < " + String.valueOf(offset + maxsize);

        }else{
               int selectIndex = sql.toLowerCase(Locale.ROOT).indexOf( "select" );
            int selectDistinctIndex = sql.toLowerCase(Locale.ROOT).indexOf( "select distinct" );
            selectIndex =  selectIndex + (selectDistinctIndex == selectIndex ? 15 : 6);
            return new StringBuilder( sql.length() + 8 )
                    .append( sql )
                    .insert( selectIndex, " top " + maxsize )
                    .toString();
        }
    }
```

### buildMySqlLimitQuerySQL
```java
   public static String buildMySqlLimitQuerySQL(String sql,int offset,int maxsize,boolean asParameter) {
        if(asParameter)
            return sql + (offset>0 ? " limit ?, ?" : " limit ?");
        else
            return sql + (offset>0 ? " limit "+String.valueOf(offset)+","+String.valueOf(maxsize) :
                                     " limit "+String.valueOf(maxsize));
    }
```

## buildGetCountSQL
获取总数的语句转换有两种方式，一种比较保险的方法就是子查询方法，还有一种式将select语句替换为select count(*) 但是这个在有group分组时就不能正确返回结果了。附带码：
```java
/**
     * 通过子查询来实现获取计数语句
     * @param sql sql 或者 hql 语句
     * @return sql
     */
public static String buildGetCountSQLBySubSelect(String sql) {
        List<String> sqlPieces = splitSqlByFields(sql);
        if (sqlPieces == null || sqlPieces.size() < 3)
            return "";

        if(StringUtils.isBlank(sqlPieces.get(0))) {
            sqlPieces.set(0, "select");
        }
        //这个仅仅为了兼容hibernate
        if("from".equalsIgnoreCase(sqlPieces.get(1).trim())) {
            sqlPieces.set(1, " * from");
        }

        return sqlPieces.get(0) + " count(*) as rowCount from (select "+
            sqlPieces.get(1) + sqlPieces.get(2) + ") a";
    }
/**
     * 将查询语句转换为相同条件的查询符合条件的记录数的语句, 需要考虑with语句
     * 即将 select 的字段部分替换为 count(*) 并去掉 order by排序部分
     * 对查询语句中有distinct的sql语句不使用
     * @param sql sql
     * @return sql
     */
    public static String buildGetCountSQLByReplaceFields(String sql) {
        List<String> sqlPieces = splitSqlByFields(sql);
        if (sqlPieces == null || sqlPieces.size() < 3)
            return "";
        if(StringUtils.isBlank(sqlPieces.get(0))) {
            sqlPieces.set(0, "select");
        }
         
        String groupByField = QueryUtils.getGroupByField(sqlPieces.get(2));
        if(groupByField==null)
             return sqlPieces.get(0) + " count(*) as rowcount from " +
                     removeOrderBy(sqlPieces.get(2));

        return sqlPieces.get(0) + " count(*) as rowcount from (select "+
             groupByField  + " from " + removeOrderBy(sqlPieces.get(2)) + ") a";
    }

```