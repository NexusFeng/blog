# 每天一个小知识点
## 第三天
## 1、`Object.create()`和`Object.setPrototypeOf()`的区别？
Object.create()创建对象,Object.setPrototypeOf()修改原型  
两者都能达到设置对象原型的功能，再具体表现上有区别  
**Object.create()**：  
语法：Object.create(proto[,propertiesObject])
第二个参数: 添加到新创建对象的可枚举属性
```js
let obj = {aa: 1, bb:2}
let a = Object.create(obj, {p: {
  value: 42,
  writable: true,
  enumerable: true,
  configurable: true
}})
console.log(a)
// 打印结果
{p: 42}
console.log(a.aa)
//打印结果
1
```
**Object.setPrototypeOf()**
语法：Object.setPrototypeOf(obj, prototype)
obj: 要设置原型的对象
prototype: 该对象的新原型
## 2、`Object.create()`和`new Object()`区别？
使用new Object()创建空对象时,是有隐式原型属性的,即_proto_,使用Object.create(null)创建空对象时,是没有原型属性的
## 3、创建数组,fill和from区别？
```js
let arr = Array.from({length: 3},()=> {
  return {form1:{},form2:{}}
})
arr[1].form1 = {a:1}
console.log(arr)
//打印结果
[
  { form1: {}, form2: {} },
  { form1: { a: 1 }, form2: {} },
  { form1: {}, form2: {} }
]

let arr1 = Array(3).fill({form1:{},form2:{}})
arr1[1].form1 = {a:1}
console.log(arr1)
//打印结果
[
  { form1: { a: 1 }, form2: {} },
  { form1: { a: 1 }, form2: {} },
  { form1: { a: 1 }, form2: {} }
]
```
用fill创建数组时,填充引用类型时,填充的是地址(也就是浅拷贝)