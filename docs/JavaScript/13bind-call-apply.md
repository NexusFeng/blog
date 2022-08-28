---
title: 13.关于bind/call/apply
---
## bind/call/apply 区别

它们的作用是一样的,区别在于传入的参数形式的不同

- apply 接受两个参数,第一个指定函数体内 this 对象的指向,第二个参数为一个带下标的集合(可为数组也可以为类数组),apply 方法把这个集合中的元素作为参数传递给被调用的函数
- call 传入的参数数量不固定,第一个参数也是代表函数体内的 this 指向
- call/apply/bind 第一个参数是 null 或者 undefined,this 就指向全局对象 window
- **提示: 类数组无法使用 forEach、splice、push 等数组原型上的方法**

## bind 模拟实现

- 两个特点: 1、返回一个函数 2、可以传入参数(多个)
- **一个绑定函数也能使用 new 操作符创建对象:这种行为就像把原函数当成构造器。提供的`this`值被忽略,同时调用时的参数被提供给模拟函数(也就是说,当 bind 返回的函数作为构造函数的时候,bind 时指定的 this 值会失效,但传入的参数依然生效)**

支持 new

```js
// Object.create原理(创建一个新对象,使现有的对象来提供新创建的对象__proto__)
Object.create = function(prototype) {
  function F() {}
  F.prototype = prototype
  return new F()
}
Function.prototype.bind = function(context, ...otherArgs) {
  let thatFun = this // 缓存当前函数Point
  let fBound = function(...innerArgs) {
    return thatFun.apply(
      // 如果是new这个绑定函数后,则bind绑定的时候传context没有用
      // 由于new操作符作用 this指向构造函数的实例对象
      // this instanceof thatFun 判断函数是否被new
      this instanceof thatFun ? this : context,
      [...otherArgs, ...innerArgs]
    )
  }
  // new的时候,将fBound和thatFun建立原型链
  fBound.prototype = Object.create(thatFun.prototype)
  // 可能会污染fBound.prototype, fBound.prototype = thatFun.prototype
  return fBound
}
// 示例
function Point(x, y) {
  this.x = x
  this.y = y
}
Point.prototype.toString = function() {
  return this.x + "," + this.y
}
let YPoint = Point.bind(null, 1)
let axiosPoint = new YPoint(2)
console.log(axiosPoint instanceof Point) //true
console.log(axiosPoint instanceof YPoint) //true
```

第二版

```js
Function.prototype.myBind = fucntion (context, ...args){
  if(!context || context === null) {
    context = window
  }
  // 创建唯一key值,作为构造的context内部方法
  let fn = Symbol()
  context[fn] = this
  let _this = this
  const result = function(...innerArgs) {
    // 第一种情况,若是将bind绑定之后作为构造函数,通过new操作符使用,此时传入的this失效,this指向实例化出来的对象
    // 此时由于new操作符作用 this指向result实例对象,而result又继承自传入的_this,根据原型链知识可得
    // this.__proto__ === result.prototype => this instanceof result ===true
    // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype => this instanceof _this === true
    // 判断函数是否被new,当使用new时,传入的this会失效
    if (this instanceof _this === true) {
      // 此时this指向result的实例 这时不需要改变this指向
      this[fn] = _this
      this[fn](...[...args, ...innerArgs])
    } else {
      // 如果作为普通函数调用,直接改变this指向为传入的context
      context[fn](...[...args, ...innerArgs])
    }
  }
  // 如果绑定的是构造函数 那麽需要继承构造函数原型属性和方法
  // 实现继承的方法：Object.create()
  result.prototype = Object.create(this.prototype)
  return result
}
```
第三版
```js
Function.prototype.myBind = function(thisArg, ...argArray) {
  var fn = this
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg) : window

  function proxyFn(...args){
    thisArg.fn = fn
    let result = thisArg.fn()

    let finalArg = [...argArray, ..args]
    delete thisArg.fn(...finalArg)
    delete thisArg.fn
    return result
  }

  return proxyFn
}
```

## call 模拟实现

- 调用 call 的对象,必须是函数
- call 的一个参数是对象,不传默认全局对象 window
- 从第二个参数开始,接受任意个参数,如果传数组,则会映射到第一个参数上
- 使用场景：1、对象的继承,2、借用方法

```js
Function.prototype.myCall = function(context) {
  // 判断调用对象
  if (typeof this !== "function") {
    throw new TypeError("error")
  }
  // 获取参数
  let args = [...arguments].slice(1),
    result = null
  // 判断context是否传入,如果未传入则设置为window
  context = context || window
  // 将调用函数设置为对象的方法
  context.fn = this
  // 调用函数
  result = context.fn(...args)
  // 将属性删除
  delete context.fn
  return result
}
```

第二版

```js
Function.prototype.myCall = function(context, ...args) {
  if (!context || context === null) {
    context = window
  }
  // 创建唯一key值 作为构造的context内部方法
  let fn = Symbol()
  context[fn] = this // this指向调用call的函数
  // 执行函数并返回结果,相当于把自身作为传入的cotext的方法进行调用了
  return context[fn](...args)
}
```

第三版
```js
Function.prototype.myCall = function(thisArg,...args) {
  var fn = this
  // 对thisArg转成对象类型(防止它传入的是非对象类型)
  thisArg = thisArg ? Object(thisArg) : window

  thisArg.fn = fn
  let result = thisArg.fn(...args)

  delete thisArg.fn
  return result
}
```

## apply 模拟实现

- 调用者必须是函数,只接受两个参数
- 第二个参数,必须是数组或者类数组

第一版
```js
Function.prototype.myApply = function(context) {
  // 判断对象是否是函数
  if (typeof this !== "function") {
    throw new TypeError("error")
  }
  let result = null
  // 判断context是否存在,如果未传入则为window
  context = context || window
  // 将函数设为对象的方法
  context.fn = this
  // 调用方法
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  //将属性删除
  delete context.fn
  return result
}
```
第二版
```js
Function.prototype.myApply = function(thisArg, argArray){
 var fn = this

 thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg) : window

 thisArg.fn = fn

 argArray = argArray || []
 let result = thisArg.fn(...argArray)
 delete thisArg.fn
 return result 
}
```

## 类数组传数组`Array.prototype.slice.call()`

```js
Array.prototype.mySlice = function(start, end){
  let arr = this
  let newArr = []
  for(let i = start; i < end; i++) {
    newArr.push(arr[i])
  }
  return newArr
}

let newArr = Array.prototype.mySlice.call(['aa', 'bb', 'cc'], 1, 2)
console.log(newArr) // ['bb', 'cc']

```