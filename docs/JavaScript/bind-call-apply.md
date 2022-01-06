## bind/call/apply区别
它们的作用是一样的,区别在于传入的参数形式的不同
- apply接受两个参数,第一个指定函数体内this对象的指向,第二个参数为一个带下标的集合(可为数组也可以为类数组),apply方法把这个集合中的元素作为参数传递给被调用的函数
- call传入的参数数量不固定,第一个参数也是代表函数体内的this指向
- call/apply第一个参数是null或者undefined,this就指向全局对象window
- **提示: 类数组无法使用forEach、splice、push等数组原型上的方法**

## bind模拟实现
- 两个特点: 1、返回一个函数  2、可以传入参数(多个)
- **一个绑定函数也能使用new操作符创建对象:这种行为就像把原函数当成构造器。提供的`this`值被忽略,同时调用时的参数被提供给模拟函数(也就是说,当bind返回的函数作为构造函数的时候,bind时指定的this值会失效,但传入的参数依然生效)**   

支持new
```js
// Object.create原理(创建一个新对象,使现有的对象来提供新创建的对象__proto__)
Object.create = function(prototype) {
  function F() {}
  F.prototype = prototype
  return new F()
}
Function.prototype.bind = function (context, ...otherArgs) {
  let thatFun = this  // 缓存当前函数Point
  let fBound = function(...innerArgs) {
    return thatFun.apply(
      // 如果是new这个绑定函数后,则bind绑定的时候传context没有用
      this instanceof thatFun ? this : context, [...otherArgs,...innerArgs]
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
  return this.x + ',' + this.y
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
## call模拟实现
- 调用call的对象,必须是函数
- call的一个参数是对象,不传默认全局对象window
- 从第二个参数开始,接受任意个参数,如果传数组,则会映射到第一个参数上
- 使用场景：1、对象的继承,2、借用方法
```js
Function.prototype.myCall= function(context) {
  // 判断对象是否是函数
  if (typeof this !== 'function') {
    throw new TypeError('error')
  }
  let result = null
  // 判断context是否存在,如果未传入则为window
  context = context || window
  // 将函数设为对象的方法
  context.fn = this
  // 调用方法
  if(arguments[1]) {
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
Function.prototype.myCall = function (context, ...args) {
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
## apply模拟实现
- 调用者必须是函数,只接受两个参数
- 第二个参数,必须是数组或者类数组
```js
Function.prototype.myApply = function(context) {
  // 判断调用对象
  if (typeof this !== 'function') {
    throw new TypeError('error')
  }
  // 获取参数
  let args = [...arguments].slice(1), result = null
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