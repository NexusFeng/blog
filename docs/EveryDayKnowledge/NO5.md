# 每天一个小知识点
## 第五天
## 1、es6的let和es5的var有什么区别？具体实现原理  
`let`和`var`区别：  
1、`let`定义的变量是局部变量,块级作用域,`var`定义的变量是全局变量,会挂在顶层对象下边  
2、`let`有变量提升(词法环境),但是有暂时性死区,也就是说`let`定义之前不能使用变量,`var`有变量提升,未定义之前可以使用,值为`undefined`  
3、`let`定义的变量不能重复声明，但是`var`可以  
提示: js所有的变量声明全部被变量提升了,只是有的提升创建,有的提升初始化,有的提升赋值。变量提升其实就是在编译阶段把var声明的变量注入到变量环境中,而块级作用域的实现其实就是通过不同的块来保存块中使用let、const声明的变量,通过栈的机制来处理不同的块。**块级作用域的变量是在代码要执行时才会加入到词法环境中。**

相关文章: <https://juejin.cn/post/6844903752139276301>  
<https://juejin.cn/post/6844904051369312263>   
<https://www.jianshu.com/p/0f49c88cf169>
## 2、箭头函数可以调用call、apply、bind吗？能否改变this指向？调用会不会报错？ 
**可以调用,也不会报错,但是不会改变`this`指向**
```js
var id = 'Global'
let fun1 = () => {
    console.log(this.id)
}
fun1()                     // 'Global'
fun1.call({id: 'Obj'})     // 'Global'
fun1.apply({id: 'Obj'})    // 'Global'
fun1.bind({id: 'Obj'})()   // 'Global'
```
原因: 箭头函数也是函数,但是箭头函数没有prototype,由于是函数,所以能调用Function.prototype上面的方法不会报错。此外,任何函数的_proto_都是Function.prototype,并且Function._proto_和Function.prototype是相等的,函数是个特殊情况,其他的不会出现自己的隐式原型和自己的显式原型一样的情况。