# 动机
项目研发过程中经常会需要将业务逻辑外置，需要将业务逻辑和代码分离。一般面对这样的需求有以下几种解决办法：

 - 引入一个规则引擎，比如Drools。
 - 利用java的javax.script.ScriptEngineManager调用javascript脚本。
 - 利用antlr这样的开源项目定义自己的业务领域语言。
笔者在开发过程中经常需要对字符串进行分析，比如：从一个字符串中取出第一个符合标识符的单词;所以决定自己写一个词法分析器（Lexer），有了词法分析器后觉得写一个四则运算也非常简单，这样在[先腾框架（我的主要工作）](https://ndxt.github.io)就用这个四则运算作为规则引擎。虽然不像drools那么强大，但使用也算比较方便，并且经过项目的验证也算够用。词法分析器[参见相关源码](https://github.com/ndxt/centit-commons/tree/master/centit-compiler)。

# 词法分析器Lexer
虽然我们可以使用正则表达式来分析字符串，但是如果我们想从一个字符串或者文本文件中一个单词一个单词的分析，词法分析器是最合适的。一个词法分析器需要对应一个词法规则，设计在词法分析器遵循java和sql的词法，两个差别主要在注释方便，构造函数中需要区分。
```java
	public Lexer(String sFormula,int langType){
        this.languageType = langType;
        setFormula(sFormula);
    }
```
词法分析器的核心函数是 public String getAWord( ); 它返回的内容可能是：

 -  一个标识符，变量或者内置函数。
 -  一个字符串。
 -  一个操作符。

 ```java
 public String getARawWord(){
        int sl = formulaSen.length();
        while((startPos < sl ) && (formulaSen.charAt(startPos) == ' ' || formulaSen.charAt(startPos) == 9 || formulaSen.charAt(startPos) == 10|| formulaSen.charAt(startPos) == 13)) startPos++;
        if(startPos >= sl) return ""; 
        int bp = startPos;
        // 数字
        if( (formulaSen.charAt(startPos)>='0' && formulaSen.charAt(startPos)<='9') || 
            //m_Formula.charAt(m_iStart)== '.' ||
            ( ! canAcceptOpt && (formulaSen.charAt(startPos)== '-' || formulaSen.charAt(startPos)== '+' ) ) ){
            startPos++;
            int nPoints = 0;
            while ( startPos < sl  && (
                    ( formulaSen.charAt(startPos)>='0' && formulaSen.charAt(startPos)<='9') ||
                     formulaSen.charAt(startPos)=='.'  ))
            { 
                if( formulaSen.charAt(startPos)=='.' ){
                    nPoints ++;
                    if (nPoints>1)
                        break;
                }
                startPos ++;
            }
            canAcceptOpt = true;            
        // 标识符    
        } else if (( formulaSen.charAt(startPos)>='a' && formulaSen.charAt(startPos)<='z') ||
            ( formulaSen.charAt(startPos)>='A' && formulaSen.charAt(startPos)<='Z') ||
            formulaSen.charAt(startPos)=='_' ||
            formulaSen.charAt(startPos)=='@'  ){
            startPos++;
            while ( startPos < sl  && (
                    ( formulaSen.charAt(startPos)>='0' && formulaSen.charAt(startPos)<='9') ||
                    ( formulaSen.charAt(startPos)>='a' && formulaSen.charAt(startPos)<='z') ||
                    ( formulaSen.charAt(startPos)>='A' && formulaSen.charAt(startPos)<='Z') ||
                      formulaSen.charAt(startPos)=='_' || formulaSen.charAt(startPos)=='.' ||
                      formulaSen.charAt(startPos)=='@' ) ) 
                startPos ++;
            canAcceptOpt = true;
        }else {
            canAcceptOpt = false;
            switch(formulaSen.charAt(startPos)){
            case '+':
                ++startPos;
                if((startPos<sl) && ((formulaSen.charAt(startPos) == '=') || 
                                     (formulaSen.charAt(startPos) == '+')  ) ) startPos ++;
                break;
            case '-':
                ++startPos;
                if((startPos<sl) && ((formulaSen.charAt(startPos) == '=') || 
                                     (formulaSen.charAt(startPos) == '-')  ) ) startPos ++;
                break;
            case '*':
                ++startPos;
                if((startPos<sl) && ((formulaSen.charAt(startPos) == '*') || 
                                     (formulaSen.charAt(startPos) == '=') ||
                                     (formulaSen.charAt(startPos) == '/')   ) ) startPos ++;
                break;    
            case '/':
                ++startPos;
                if((startPos<sl) && ((formulaSen.charAt(startPos) == '=') || 
                                     (formulaSen.charAt(startPos) == '/') ||
                                     (formulaSen.charAt(startPos) == '*')   ) ) startPos ++;
                break;    
                
            case '<':
                ++startPos;
                if((startPos<sl) && ((formulaSen.charAt(startPos) == '=') || 
                                     (formulaSen.charAt(startPos) == '>') ||
                                     (formulaSen.charAt(startPos) == '<')   ) ) startPos ++;
                break;    
            case '>':
                ++startPos;
                if((startPos<sl) && ((formulaSen.charAt(startPos) == '=') || 
                                     (formulaSen.charAt(startPos) == '>')  ) ) startPos ++;
                break;
            case ':':
                ++startPos;
                if((startPos<sl) && (formulaSen.charAt(startPos) == '=')) startPos ++;
                break;
                
            case '=':
            case '!':
                ++startPos;
                if((startPos<sl) && (formulaSen.charAt(startPos) == '=')) startPos ++;
                break;
            case '|':
                ++startPos;
                if((startPos<sl) && (formulaSen.charAt(startPos) == '|')) startPos ++;
                break;
            case '&':
                ++startPos;
                if((startPos<sl) && (formulaSen.charAt(startPos) == '&')) startPos ++;
                break;
            case '\"': //字符串
            case '\'': //字符串
                canAcceptOpt = true;
                startPos ++;
                break;
            case '.':
                ++startPos;
                while ( startPos < sl  && 
                        ( formulaSen.charAt(startPos)>='0' && formulaSen.charAt(startPos)<='9') )
                { 
                    startPos ++;
                }                
                break;
            case ')':
                canAcceptOpt = true;
                startPos ++;
                break;
            default: //"+-*/"
                startPos ++;
                break;
            }
        }
        
        String str = formulaSen.substring(bp, startPos );
        return str;    
    }    
 ```
# 带变量四则运算 VariableFormula
 四则运行包括加减乘除、取模和与或非等等；表达式中的标识符对应的变量可以通过map传递给四则运算，也可以通过一个对象的属性传递。四则运算接口如下：

```java
	public static Object calculate(String szExpress,Object varMap) {
        ...................
    }
```
变量对应的类型可以式任意类型，数字、字符串、日期、数组都可以。因为他们不仅可以传递到四则运行中还可以传递到四则运算的内置函数中。
# 内置函数 EmbedFunc
为了对四则运行进行扩展，引入了内置函数来丰富表达式的功能。内置函数分一下几类：

 - 数学函数；比如：取整、开平方、对数等等。
 - 字符串处理函数；查找子串、数字大写、补齐等等。
 - 统计函数；求和、计数、统计非空数量等等。
 - 日期函数；当前时间、时间的加减。
 - 条件函数（逻辑函数）；if函数和case函数，不同的条件取对应的表达式结果。

# 测试与效果
测试代码

```java
	public static void testFormula3() {
        Map<String,Object> varMap = new HashMap<>();
        varMap.put("a", 10);
        varMap.put("b", 4);
        String formula = "(a*a-b)/b";
        Object s = VariableFormula.calculate(formula, varMap);
        System.out.println(StringBaseOpt.castObjectToString(s));
        System.out.println("Done!");
    }
```
运行结果

```
24
Done!
```

词法分析器[参见相关源码](https://github.com/ndxt/centit-commons/tree/master/centit-compiler)，更多先腾框架项目参见[先腾框架](https://ndxt.github.io)。