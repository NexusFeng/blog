# 每天一个小知识点
## 第一天
## js的数据类型有哪几种,分别是什么？  
js数据类型有两大类：引用类型和基本数据类型(原始数据类型)。  
**基本数据类型**：Number、String、Null、Boolean、Undefined、Symbol(ES6)、BigInt  
**引用类型分为**：对象类型(object)和函数(Function)  
**对象类型**：对象(Object)、数组(Array)、正则(RegExp)、时间(Date)、数学对象(Math)  
2、undefined、null两者区别？ 
```js
console.log(null==undefined);    //true  因为两者都默认转换成了false
console.log(typeof undefined);    //"undefined"  
console.log(typeof null);       //"object"  
console.log(null===undefined);    //false   "==="表示绝对相等，null和undefined类型不一样，所以输出false

//补充：
//任何数据类型和 undefined 运算都是 NaN;
//任何值和 null 运算，null 可看做 0 运算。
```
**null:**  
null专门用来定义一个**空对象**  
当定义一个变量用来存放引用类型,但是还不知道放啥内容时,可赋值为null
```js
let myObj = null;
cosole.log(typeof myObj); // 打印结果：object
```
**undefined:**  
1、变量已声明,但是未赋值
```js
let a
console.log(a) // undefined
```
2、变量未声明,未定义 
直接使用报错,类型检查时为`undefined`
```js
console.log(a); // 打印结果：Uncaught ReferenceError: a is not defined
console.log(typeof a); // undefined
```
3、函数无返回值
当函数没有返回值时,直接写return时,返回的是undefined,
```js
function add() {}
console.log(add()) // undefined
function add1() {
  return
}
console.log(add1()) // undefined
```
4、有形参,没实参
```js
function add(name) {
  console.log(name) // undefined
}
add()
```
两者转成number类型时：undefined为NaN,null为0