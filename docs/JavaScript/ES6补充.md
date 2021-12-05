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