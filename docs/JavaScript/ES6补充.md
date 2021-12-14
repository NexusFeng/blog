#### Number.EPSILON
极小的常量,表示1与大于1的最小浮点数之间的差。是js能够表示的最小精度,误差如果小于这个值,就可以认为已经没有意义了,即不存在误差.实质上是一个可以接受的最小误差范围
```js
Number.EPSILON === Math.pow(2, -52)// true
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```
#### Object.assign
- 与扩展运算符一样都是浅拷贝(不拷贝继承属性和不可枚举属性)
- 将源对象的所有可枚举值复制到目标对象
- 总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。
- 如果参数不是对象,则会先转成对象再返回(非首参数无法转成对象,则会跳过。undefined和null无法转成对象,处于首参数位置报错,其他位置跳过)
- **除了字符串以数组形式拷入目标对象,其他值都不会产生效果(只有字符串的包装对象会产生可枚举属性)**
```js
Object(true) // {[[PrimitiveValue]]: true}
Object(10)  //  {[[PrimitiveValue]]: 10}
Object('abc') // {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}

const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```
#### 可枚举性和遍历
有四个操作会忽略enumerable为false的属性
- for...in循环：只遍历对象自身的和继承的可枚举的属性
- Object.keys()：返回对象自身的所有可枚举的属性的键名
- JSON.stringify()：只串行化对象自身的可枚举的属性
- Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性
ES6可以遍历对象的属性的方法
- `for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性） 
- `Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名 
- `Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
- `Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性的键名
- `Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举
遵循的遍历次序规则
- 首先遍历所有数值键，按照数值升序排列
- 其次遍历所有字符串键，按照加入时间升序排列
- 最后遍历所有 Symbol 键，按照加入时间升序排列

#### Object.entries()
返回一个数组,包含所有可遍历属性的键值对数组
```js
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]

// 常用于遍历对象的属性
let obj = {a: 1, b: 2}
for(let [k, v] of Object.entries(obj)) {
  console.log(k,v)
}
```

#### Object.fromEntries()
Object.entires()的逆操作,用于将一个键值对数组转为对象
```js
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }


// Map结构转为对象
const map = new Map().set('foo', true).set('bar', false);
Object.fromEntries(map)
// { foo: true, bar: false }
```

#### Symbol
- **Symbol函数前不能使用new命令,否则会报错,这是因为生成的Symbol是一个原始类型的值,不是对象,不能添加属性。属于类似字符串的数据类型**
- symbol值不能与其他类型的值进行运算
- symbol值作为对象属性名时,不能用点运算符
```js
const mySymbol = Symbol()
const a = {}
a.mySymbol = 'hello'
a[mySymbol] // undefined
a['mySymbol'] // hello
```
- 在对象内部,使用Symbol定义属性时,Symbol必须放在`[]`内
```js
let s = Symbol()
let obj = {
  [s]: function(arg){}
}
obj[s](123)
```
- Symbol.for()重新使用同一个Symbol值(全局登记特性),会在全局搜索有无key值,有则返回
```js
let s1 = Symbol.for('foo')
let s2 = Symbol.for('foo')
s1 === s2 // true

let s3 = Symbol('foo')
let s4 = Symbol('foo')
s3 === s4 // false
```

#### Set和Map
**Set**
- 类似于数组,成员的值是唯一的,没有重复的值
```js
// 数组去重
[...new Set(array)]
// 字符串去重
[...new Set('aabbcc')].join('') // abc
```
- 添加值的时候,不会发生类型装换,'5'和5是两个不同的值,两个对象总是不相等的
##### Set实例具有的方法和属性:
- `Set.prototype.constructor`：构造函数,默认是Set函数
- `Set.prototype.size`: 返回Set实例的成员总数
- `Set.prototype.add(value)`添加某个值,返回Set结构本身
- `Set.prototype.delete(value)`删除某个值,返回布尔值,代表是否删除成功
- `Set.prototype.has(value)`返回一个布尔值,表示该值是否是Set的成员
- `Set.prototype.clear()`清除所有成员,没有返回值
##### Set实例遍历操作:
- `Set.prototype.keys()`返回键名的遍历器(没有键名,和`values`方法行为一致)
- `Set.prototype.values()`返回键值的遍历器
- `Set.prototype.entries()`返回键值对的遍历器
```js
let set = new Set(['a', 'b', 'c'])
for(let item of set.entries()) {
  console.log(item)
}
// ['a', 'a']
// ['b', 'b']
// ['c', 'c']
```
- `Set.prototype.forEach()`使用回调函数遍历每个成员
改变原来的Set结构
```js
// 方法一
let set = new Set([1, 2, 3])
set = new Set([...set].map(val => val*2))
// set值 2,4,6

// 方法二
let set = new Set([1, 2, 3])
set = new Set(Array.from(set, val => val*2))
// set值 2,4,6
```
##### WeakSet(不重复值的集合)
与Set的区别
- WeakSet的成员只能是对象,而不是其他类型的值
- WeakSet中的对象都是弱引用类型(适合临时存放一组对象,只要这些对象在外部消失,它在WeakSet里的引用就会自动消失)
- WeakSet不可遍历
- 没有`clear()`方法,没有size属性

**Map**
键值对的集合,键的范围不限于字符串,各类型的值都可以
##### 实例具有的方法和属性:
- `Map.prototype.size`: 返回Map结构的成员总数
- `Map.prototype.set(key, value)`: 设置键值,返回整个Map结构(可用链式写法)
- `Map.prototype.get(key)`: 获取键对应的值,如果没有返回undefined
- `Map.prototype.has(key)`: 判断某键是否在当前Map对象中,返回布尔值
- `Map.prototype.delete(key)`删除某个键,返回布尔值,代表是否删除成功
- `Map.prototype.clear()`清除所有成员,没有返回值
##### 遍历操作
- `Set.prototype.keys()`返回键名的遍历器
- `Set.prototype.values()`返回键值的遍历器
- `Set.prototype.entries()`返回所有成员的遍历器
- `Set.prototype.forEach()`使用回调函数遍历每个成员
转为数组
- 使用扩展运算符
##### WeakMap
与Map的区别
- WeakMap只接受对象作为键名(null除外)
- 弱引用类型,键名所指的对象,不计入垃圾回收机制
- **弱引用只是键名,而不是键值,键值依然可以引用**
- 不可遍历,没有遍历方法
- 没有size属性和clear方法
**使用场景:当js对dom操作时,如果存在对DOM的引用,在删除dom后得手动清除引用,此时可以用WeakMap**

##### Proxy
用于修改某些操作的默认行为,在访问目标对象之前必须通过拦截  
语法：`var proxy = new Proxy(target, handler)`
- Proxy实例也可以作为其他对象的原型对象
```js
var proxy = new Proxy({}, {
  // target目标对象  proKey所要访问的属性
  get: function(target, propKey) {
    return 35
  }
})
let obj = Object.create(proxy)
obj.time // 35
```
Proxy支持的拦截操作
- `get(target, proKey, receiver)`: 拦截对象属性的读取(参数：目标对象、属性名、proxy实例本身(可选))
- `set(target, proKey,vaule, reveiver)`: 拦截对象属性的设置,返回一个布尔值(参数：目标对象、属性名、属性值、proxy实例本身(可选))
- `has(target, proKey)`: 拦截`proKey in proxy`的操作,返回一个布尔值
- `deletePropety(target, proKey)`: 拦截`delete proxy[proKey]`操作,返回一个布尔值
- `ownKeys(target)`: 拦截`Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in`循环，返回一个数组。该方法返回**目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性**。 
- `getOwnPropertyDescriptor(target, propKey)`：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- `defineProperty(target, propKey, propDesc)`：拦截`Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- `preventExtensions(target)`：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- `getPrototypeOf(target)`：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- `isExtensible(target)`：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- `setPrototypeOf(target, proto)`：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- `apply(target, object, args)`：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)`。(参数: 目标对象、目标对象的上下文对象、目标对象的参数数组)
- `construct(target, args, newTarget)`：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`(参数: 目标对象、构造函数的参数数组、创造实例对象时,new命令作用的构造函数)

##### Reflect
设计目的
- 将Object对象的一些明显属于语言内部的方法放在Reflect对象上
- 修改某些Object方法的返回结果,让其变得合理
- 让Object操作都变成函数行为
- Reflect对象的方法与Proxy对象的方法一一对应(13种)
```js
// Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法
// Reflect 将对象的操作集中起来，可以通过 Reflect. 的方式来使用
// 01. Reflect.ownKeys 可以获取到对象普通属性和Symbol类型的属性
let obj = {
  a: 1,
  [Symbol('b')]: 2
}
Reflect.ownKeys(obj).forEach(key => {
  console.log(key, obj[key])
})// a 1 Symbol('b') 2
// 02. Reflect.has 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同(for in 会遍历原型链)
Object.prototype.x = 'x'
for (let key in obj) {
  console.log(key)
}
console.log('a' in obj, 'x' in obj)
console.log(Reflect.has(obj, 'a'), Reflect.has(obj, 'x'))
```
##### Iterator(遍历器)
为各种不同的数据结构提供统一的访问机制,任何数据结构只要部署Iterator接口,就可以完成便利操作.  
主要作用：
- 为各种数据结构提供一个统一的、简便的访问接口
- 使得数据结构的成员能够按某种次序排序
- 只要供`for...of`消费

默认的Iterator接口部署在数据结构的Symbol.iterator(函数,预定义好的、类型为Symbol的特殊值)属性,即一个数据结构只要具有Symbol.iterator属性,就可以认为是可遍历的  
原生具备Iterator接口的数据结构：
- Array
- Map
- Set
- String
- TypedArray
- 函数的arguments对象
- NodeList对象
```js
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

默认调用Iterator接口(即Symbol.iterator方法)的场合
- 解构赋值
- 扩展运算符
- yield*
```js
// yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```
- for...of遍历(普通对象使用for...of会报错)
```js
// 普通对象使用for...of遍历,就给对象添加一个[Symbol.iterator]属性,并指向一个迭代器
//方式一
let obj = {a: 1, b: 2, c: 3}
obj[Symbol.iterator] = function* () {
  let keys = Object.keys(obj)
  for(let k of keys) {
    yield [k, obj[k]]
  }
}
for (let [k, v] of obj) {
  console.log(k,v)
}
// 方式二
let obj = {a: 1, b: 2, c: 3}
obj[Symbol.iterator] = function () {
  let keys = Object.keys(this)
  let count = 0
  return {
    next() {
      if (count < keys.length){
        return { value: obj[keys[count++]], done: false }
      } else {
        return { value: undefined, done: true }
      }
    }
  }
}
for (let k of obj) {
  console.log(k)
}
```
  
##### 类
注意点
- 类内部是严格模式
- 不存在变量提升
- name属性(返回class关键字后边的类名)
- **类得到所有方法都定义在类的`perotortype`属性上,实例调用其实调用的是原型上的方法**
```js
class Point {}
Point.name // Point
```
- 方法之前加*，表示为一个generator函数
- this指向,类的方法内部含有this,它默认指向类的实例
- 静态方法和非静态方法可以重名
- 静态方法不能被实例调用,可以被子类继承调用
- 静态属性是Class本身的属性,而不是定义在实例对象上的属性
```js
// 静态属性
//老写法
class Foo{
}
Foo.prop = 1
//新写法
class Foo {
  static prop = 1
}
```
- 私有方法(**也可以在在方法前面加#号**)和私有属性(**在属性前面加#号**)只能在类的内部访问,外部不能访问。也可加`static`变为静态的私有方法或属性
```js
//现有的解决方案
//第一种 只是命名上加以区分,但实际上类的外部还是能调用
class Widget {
  // 公有方法
  foo (baz){
    this._bar(baz)
  }
  // 私有方法
  _bar(baz) {
    return this.snaf = baz
  }
}
// 第二种 将私有方法移出类,类的内部所有方法对外可见的
class Widget {
  foo(baz) {
    bar.call(this, baz)
  }
}
function bar(baz) {
  return this.snaf = baz
}
// 第三种 Symbol,但是Reflect.ownKeys()依然可以拿到他们
const bar = Symbol('bar')
const snaf = Symbol('snaf')
export default class myClass{
  // 公有方法
  foo(baz){
    this[bar](baz)
  }
  // 私有方法
  [baz](baz){
    return this[snaf] = baz
  }
}
--------
const inst = myClass()
Reflect.ownKeys(myclass.prototype)
// ['constructor', 'foo', 'Symbol(bar)']
```
类的继承
- extends实现继承
- super表示父类的构造函数,用来新建父类的this对象,子类必须在constructor方法中调用super方法,否则新建实例会报错
- 子类构造函数中,只有调用`super`之后才能使用this关键字
- 父类的静态方法也会被子类继承
- `Object.getPrototypeOf`判断是否存在继承关系
  
**ES5和ES6继承机制对比:**  
- ES5先创造子类的实例对象this,然后将父类的方法添加到this上(Parent.apply(this))
- ES6先将父类实例对象的方法和属性,添加到this上(必须先调用super方法),然后再用子类的构造函数修改this
- 基于以上两条,ES5无法继承原生的构造函数(`Boolean()、Number()、Array()等`),es6可以(`extends`关键字)
- **注意:ES6改变了Object构造函数的行为,一旦发现不是通过`new Object()`这种形式调用,Object构造函数会忽略参数,无法通过super向父类Object传参**

super关键字
- 作为函数调用,子类的构造函数必须执行一次super函数(super内部的this指向的是子类的实例,相当于`Parent.prototype.constructor.call(this)`)
- 作为函数,只能用在子类的构造函数中
- 作为对象时,**在普通方法中,指向父类的原型对象,在静态方法中,指向父类**
```js
// 普通对象
class A{
  p(){
    return 2
  }
}
class B extends A {
  constructor(){
    super()
    console.log(super.p()) //2 普通方法中,super.p()相当于A.prototype.p()
  }
}
// super指向父类的原型,定义在父类实例上的属性或方法是无法调用的

// 静态对象
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
// 指向父类
```
- 子类静态方法中通过`super`调用父类方法时,方法内部的this指向当前的子类
- 使用`super`时,必须显式指定是作为对象还是函数使用,不能只写`console.log(super)//报错`

类的原型链
- 类同时有prototype属性和__proto__属性
- **子类的__proto__属性,表示构造函数的继承,总是指向父类**
- **子类prototype属性的__proto__属性,表示方法的继承,总是指向父类的prototype属性**
```js
class A {
}
class B extends A {
}
// Object.setPrototypeOf(B, A)
B.__proto__ === A // true
// B.prototype = Object.create(A.prototype)
B.prototype.__proto__ === A.prototype // true
// 作为一个对象,子类B的原型(__proto__)是父类A
// 作为一个构造函数, 子类B的原型对象(prototype属性)是父类的原型对象(prototype属性)的实例
```
- 子类的原型的原型是父类的原型(`B.__proto__.__proto__ === A.__proto__`)
