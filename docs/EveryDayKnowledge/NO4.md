# 每天一个小知识点
## 第四天
## 1、`object`和`Object`的区别？
js没有object,Object是基于构造函数,js对象都是基于Object
## 2、为什么字符串一个基本类型,会拥有比如subString、slice等方法？
 在调用这些方法时,js会把基础数据类型包装成内置对象,比如会用`new String()`调用字符串
## 3、扩展运算符和Object.assign()深浅拷贝？
```js
let a = {a: 1, b: 1}
let b = {...a}
b.a = 2
console.log(a, 'a')
console.log(b, 'b')
//打印结果
{ a: 1, b: 1 } a
{ a: 2, b: 1 } b

let a = {a:1, b:1}
let b = Object.assign({}, a)
b.a = 2
console.log(a, 'a')
console.log(b, 'b')
//打印结果
{ a: 1, b: 1 } a
{ a: 2, b: 1 } b

let a = {a: {c: 1}, b: 1}
let b = {...a}
b.a.c = 2
console.log(a, 'a')
console.log(b, 'b')
//打印结果
{ a: { c: 2 }, b: 1 } a
{ a: { c: 2 }, b: 1 } b

let a = {a:{c: 1}, b:1}
let b = Object.assign({}, a)
b.a.c = 2
console.log(a, 'a')
console.log(b, 'b')
//打印结果
{ a: { c: 2 }, b: 1 } a
{ a: { c: 2 }, b: 1 } b
```
结论：扩展运算符和Object.assign()都是浅拷贝,在合并对象时,如果合并对象存在相同属性，以第一个属性位置为准，值是后边的对象属性
```js
let a = {b:1, c:1}
let b = {d: 1, g: 3, c:2}
let dd = Object.assign({}, a, b)
console.log(dd)
console.log({...a,...b})
//打印结果
{ b: 1, c: 2, d: 1, g: 3 }
{ b: 1, c: 2, d: 1, g: 3 }
```