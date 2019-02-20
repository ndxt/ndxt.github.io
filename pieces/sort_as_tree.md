# 问题
在项目中 我们经常需要将一个有父子关系的列表按照树的深度优先遍历的方式排序。所以写了一个通用的排序算法。

# 源码
github 地址： CollectionsOpt.java。更多分享参见 https://ndxt.github.io。 

 public interface ParentChild<T> {
        boolean parentAndChild(T p, T c);
    }
```java
public static <T> void sortAsTree(List<T> list, ParentChild<? super T> c) {
        int n=list.size();
        if(n<2)
            return ;
        //sorted 已经排序好的数量
        int sortedInd = 0;
        int [] parentInds = new int [n];
        while(sortedInd < n-1 ){
            // 找到所有的根节点
            int parentInd = -1;
            for(int i= sortedInd;i<n;i++){
                boolean isParent = true;
                for(int j=sortedInd;j<n;j++){
                    if(i != j && c.parentAndChild(list.get(j),list.get(i))){
                        isParent = false;
                        break;
                    }
                }
                if(isParent){
                    parentInd = i;
                    break;
                }
            }
            if(parentInd == -1)
                break;

            moveListItem(list,parentInd,sortedInd);
            parentInds[0]=sortedInd;
            sortedInd ++;
            int pathDeep=1;
            while(pathDeep>0){
                int newInsert = 0;
                for(int i=sortedInd;i<n;i++){
                    if(c.parentAndChild(list.get(parentInds[pathDeep-1]),list.get(i))){
                        moveListItem(list,i,sortedInd);
                        parentInds[pathDeep]=sortedInd;
                        pathDeep ++;
                        sortedInd ++;
                        newInsert ++;
                    }
                }
                if(newInsert==0){
                    pathDeep--;
                }
            }
            // 查找根节点的所有子元素
            //sortedInd = sortAsTreePiece(list,c,sortedInd);
        }
    }

```

# 测试
```java
    public static void main(String[] args) {
        List<Integer> nodeList = new ArrayList<Integer>();
        nodeList.add(223);
        nodeList.add(222);
        nodeList.add(221);
        nodeList.add(22);
        nodeList.add(123);
        nodeList.add(121);
        nodeList.add(11);
        nodeList.add(12);
        nodeList.add(21);
        nodeList.add(2);
        nodeList.add(1);

        CollectionsOpt.sortAsTree(nodeList,(p,c)-> p == c / 10);
        System.out.println(nodeList);
    }
```

