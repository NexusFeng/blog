## bind/call/apply区别
它们的作用是一样的,区别在于传入的参数形式的不同
- apply接受两个参数,第一个指定函数体内疯人this对象的指向,第二个参数为一个带下标的集合(可为数组也可以为类数组),apply方法把这个集合中的元素作为参数传递给被调用的函数
- call传入的参数数量不固定,第一个参数也是代表函数体内的this指向
- 第一个参数是null或者undefined,this就指向全局对象window

## bind模拟实现
- 两个特点: 1、返回一个函数  2、可以传入参数(多个)
- **一个绑定函数也能使用new操作符创建对象:这种行为就像把原函数当成构造器。提供的`this`值被忽略,同时调用时的参数被提供给模拟函数(也就是说,当bind返回的函数作为构造函数的时候,bind时指定的this值会失效,但传入的参数依然生效)**
```js
// 简易版-不支持new
Function.prototype.myBind = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 获取参数
  let args = [...arguments].slice(1), fn = this
  return function Fn() {
    // 根据调用方式,传入不同的绑定值
    return fn.apply(
      this instanceof Fn ? this : context, args.concat(...arguments)
    )
  }
}
```
## call模拟实现

## apply模拟实现
