# 表达式编译器

这个项目中核心的类主要有两个Lexer和VariableFormula。

## Lexer

lexer是一个简单的词法分析器。它的作用是从一个字符串中一个一个读出词，可以设定跳过注射，目前支持两种注释类别java和sql。它的作用就是用于分析一些有语义的字符串，比如从sql中读出所有的字段和条件。

## VariableFormula

这是一个支持变量的四则运算，支持括号、逻辑表达式，并且内置了丰富的函数，有点类似Excel中的公式。它的作用就是用于一些规则外置到字符串中。比如：工作流引擎中的业务规则计算。

