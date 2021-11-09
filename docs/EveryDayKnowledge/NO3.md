# 每天一个小知识点
## 第三天
## 1、`Object.create()`和`Object.setPrototypeOf()`的区别？  

## 2、`Object.create()`和`new Object()`区别？

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