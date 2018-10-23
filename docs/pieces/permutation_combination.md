# 动机
Apache Math包中有很多关分布的算法，但是没有找到排列组合相关的算法。索性自己写一个。排列组合可以分两个算法：

 1. 组合算法，就是在一个数组中取出m（小于等于数组的长度 n）个对象，有多少中不同的取法。不考虑重复元素，组合数应该为 n! / m! / (n-m)! 。
 2. 排列算法，给定一个数据，对这个数组进行排列。如果不考虑相同的元素，排列数应该式n！（n为数组长度），但是算法中需要考虑相同的元素。

# 算法
## 排列算法
在[前面的算24点文章](https://blog.csdn.net/code_fan/article/details/81096261)用到了排列的算法。排列算法如果用递归实现还是比较容易的，但是考虑到效率的问题算法用回溯法来实现，算法中引入一个消费者方法来处理一个排列，这样避免返回很大的数组，n！是一个很大的数。
```java
public static <T> void permutation(List<T> listSouce ,
                                       Comparator<? super T> comparable,
                                       Consumer<List<T>> consumer){
        int len = listSouce.size();
        if(len<2){
            consumer.accept(listSouce);
            return;
        }
        listSouce.sort(comparable);
        //标记排序位置的栈
        List<Integer> comPos = new ArrayList<>(len);
        //标记已经排好序的元素
        List<Boolean> usedItem = new ArrayList<>(len);
        //记录排序结果
        List<T> comRes = new ArrayList<>(len);

        for(int i=0;i<len;i++){
            comPos.add(-1);
            usedItem.add(false);
            comRes.add(null);
        }
        comPos.set(0,0);
        int sortIndex = 0;
        usedItem.set(0, true);
        while(sortIndex >=0 ){
            comRes.set(sortIndex, listSouce.get( comPos.get(sortIndex)));
            if( sortIndex == len - 2){ // 如果获得一个排序
                for(int i=0; i< len; i++){
                    if(!usedItem.get(i)){// 将最后一个未使用的添加到排列的最后
                        comRes.set( sortIndex +1, listSouce.get(i));
                        break;
                    }
                }
                consumer.accept(comRes);
                //usedItem.set(comPos.get(sortIndex), false);
                while(sortIndex >=0 ) {
                    //下一个
                    int prePos = comPos.get(sortIndex);
                    usedItem.set(prePos, false);
                    //当前pos ++ （步进）
                    while (comPos.get(sortIndex) + 1  < len &&
                            ( usedItem.get(comPos.get(sortIndex) + 1) || comparable.compare(
                                    listSouce.get(prePos),
                                    listSouce.get(comPos.get(sortIndex) + 1)
                    ) == 0 )) {
                        comPos.set(sortIndex, comPos.get(sortIndex) + 1);
                    }

                    comPos.set(sortIndex, comPos.get(sortIndex) + 1);
                    // 如果已经到上线，继续回退
                    if (comPos.get(sortIndex)  < len ) {
                        //重新计算下个列表
                        usedItem.set(comPos.get(sortIndex), true);
                        comRes.set( sortIndex, listSouce.get(comPos.get(sortIndex)));
                        break;
                    }else{ // 回退
                        sortIndex--;
                        //comPos.set(sortIndex, comPos.get(sortIndex) + 1);
                    }
                }
            } else { // 下一个
                for(int i=0; i< len; i++){
                    if(!usedItem.get(i)){
                        comPos.set(sortIndex + 1,i);
                        usedItem.set(i,true);
                        break;
                    }
                }
                sortIndex++;
            }
        }
    }
```
## 组合算法
组合算法比排列简单一点，重点式考虑重复元素的问题，和排列一样，先对数组进行排序。同样引入一个消费者方法来处理一个给点的组合，组合也是一个很大的数，不能直接返回数组。
```java
 public static <T> void combination(List<T> listSouce , int selected,
                                       Comparator<? super T> comparable,
                                       Consumer<List<T>> consumer) {
        int len = listSouce.size();
        if(len<selected || selected < 1){
            return;
        }
        if(len == selected){
            consumer.accept(listSouce);
            return;
        }
        listSouce.sort(comparable);
        //标记排序位置的栈
        List<Integer> selectPos = new ArrayList<>(selected);
        List<T> comRes = new ArrayList<>(selected);
        for(int i=0;i<selected;i++){
            selectPos.add(i);
            comRes.add(listSouce.get(i));
        }
        int sortIndex = selected-1;
        while(sortIndex >= 0){
            if(sortIndex == selected-1){
                consumer.accept(comRes);
            }
            while(selectPos.get(sortIndex) + 1  < len && comparable.compare(
                    listSouce.get(selectPos.get(sortIndex)),
                    listSouce.get(selectPos.get(sortIndex) + 1))==0){
                selectPos.set(sortIndex, selectPos.get(sortIndex)+1);
            }
            selectPos.set(sortIndex, selectPos.get(sortIndex)+1);
            if (selectPos.get(sortIndex)  <= len - selected + sortIndex ) {
                //重新计算下个列表
                comRes.set(sortIndex, listSouce.get( selectPos.get(sortIndex)));
                int startPos = selectPos.get(sortIndex) +1;
                for(int i = sortIndex+1 ; i < selected; i++) {
                    selectPos.set(i, startPos);
                    comRes.set(i, listSouce.get(startPos));
                    startPos ++;
                }
                sortIndex = selected-1;
                //continue;
            }else{ // 回退
                sortIndex--;
                //comPos.set(sortIndex, comPos.get(sortIndex) + 1);
            }
        }
    }
```
## 排列与组合
排列组合就是简单对两个方法整合一下。
```java
public static <T> void permutationAndCombination(List<T> listSouce , int selected,
                                       Comparator<? super T> comparable,
                                       Consumer<List<T>> consumer) {
        combination(listSouce , selected, comparable,
                ( oneCom ) -> permutation(oneCom, comparable,  consumer));
    }
```
## 测试代码

```java
public class MathOpt {
    //将 数字和操作排序
    public static void sortFormulaOpt( List<Integer> rList ){
        for(Integer i : rList){
            System.out.print(i);
            System.out.print(" ");
        }
        System.out.println();
    }
    public static void main(String arg[]) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        while (true) {
            System.out.println("输入用空格隔开整数，推出输入exit");
            String s = br.readLine().trim();
            if(StringUtils.isBlank(s)){
                continue;
            }
            if(StringUtils.equalsIgnoreCase("exit",s)){
                break;
            }
            int nSelect = -1;
            String[] nums = s.split(" ");
            List<Integer> alist = new ArrayList<>(4);
            for(int i=0; i<nums.length; i++){
                if(StringRegularOpt.isNumber(nums[i])){
                    if( nSelect == -1 ){
                        nSelect = NumberBaseOpt.castObjectToInteger(nums[i]);
                    }else {
                        alist.add(NumberBaseOpt.castObjectToInteger(nums[i]));
                    }
                }
            }

            if( alist.size() < 1){
                continue;
            }

            Mathematics.permutationAndCombination(
                    alist,nSelect, Integer::compare, MathOpt::sortFormulaOpt
            );
        }
    }
}

```
# 源码
[排列组合相关的源码](https://github.com/ndxt/centit-commons/blob/master/centit-utils/src/main/java/com/centit/support/algorithm/Mathematics.java);更多南大先腾开源项目参见[https://ndxt.github.io/](https://ndxt.github.io/)。