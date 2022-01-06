### 实现步骤
- 1.创建一个对象
- 2.将构造函数的作用域赋给新对象(也就是将对象的__proto__属性指向构造函数的prototype)
- 3.执行构造函数中的代码,构造函数中的this指向该对象(也就是为这个对象添加属性和方法)
- 4.返回新对象,如果是值类型,返回创建的对象。如果是引用类型,就返回引用类型的对象
```js
function objectFunction() {
  let newObject = null
  let constructor = Array.prototype.shift.call(arguments)
  let result = null
  // 判断参数是否是一个函数
  if (typeof constructor !== 'function') {
    throw new TypeError('type error')
  }
  // 新建一个空对象,对象的原型为构造函数的prototype对象,建立原型链关系
  newObject = Object.create(constructor.prototype)
  // 将this指向新对象,并执行函数,为了让构造函数能够进行this.name = name 的操作
  result = constructor.apply(newObject, arguments)
  // 判断返回对象
  let flag = result && (typeof result === 'object' || typeof result === 'function')
  // 判断返回结果
  return flag ? result : newObject
}
// 使用
objectFunction(构造函数, 初始化参数)
```
第二版
```js
function myNew(fn, ...args) {
  let obj = Object.create(fn.prototype)
  let res = fn.call(obj, ...args)
  if (res && (typeof res === 'object' || typeof res === 'function')) {
    return res
  }
  return obj
}
用法如下：
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.say = function() {
  console.log(this.age)
}
let p1 = myNew(Person, "lihua", 18)
console.log(p1.name)
console.log(p1)
p1.say()
```