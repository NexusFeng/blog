---
title: Generator生成器
date: 2022-02-12
categories: 
  - JavaScript
tags: 
  - JavaScript
---

## 定义

生成器对象是由一个 FeneratorFunction 返回的,并且它符合迭代器协议和可迭代协议  
普通函数 vs 生成器函数

- 普通函数是 Function 的实例,普通函数实例.proto\_\_ === Function.prototype
- 生成器函数 GeneratorFunction 的实例,生成器函数实例.proto** === GeneratorFunction.prototype, GeneratorFunction.prototype.**proto\_\_ ===Function.prototype
- 生成器函数[[IsGenerator]]: true

## **生成器函数的实例不是通过 new,而是执行生成器函数,此时生成器函数的函数体并未执行**

```js
function* fn() {}
// 生成器函数的实例不是通过new,而是执行生成器函数,此时生成器函数的函数体并未执行
let itor = fn();
console.log(Object.prototype.toString.call(fn)); // [object GeneratorFunction]
console.log(Object.prototype.toString.call(itor)); // [object Generator]
```

- 生成器函数的实例是一个 Generator 对象,符合迭代器对象和可迭代协议
- 生成器函数的实例执行 next 方法,遇到 yield 或者 return 结束,返回一个包含 value 和 done 属性的对象
- value 的值是 yield 或者 return 返回的值,如果是 yield,done 就是 false,如果是 return,done 的值就是 true,且 value 的值是 undefined

```js
function* func() {
  console.log('1');
  yield 111;
  console.log('2');
  yield 222;
  console.log('3');
  yield 333;
  console.log('4');
  return 444;
  console.log('5');
  yield 555;
}
let itor = func();
console.log(itor); // Object [Generator] {}
console.log(itor.next()); // 1  { value: 111, done: false }
console.log(itor.next()); // 2  { value: 222, done: false }
console.log(itor.next()); // 3  { value: 333, done: false }
console.log(itor.next()); // 4  { value: 444, done: false }
console.log(itor.next()); // { value: undefined, done: true }
```

async/await VS promise:

- async/await 是基于 Generator 管理异步编程
- promise 是基于一种约定模式管理异步编程

- yield 既然作为执行的断点，那它应该也是有返回值的，那 yiled 的返回值是什么呢？
- yield 的返回值是由 next 传递的，下一次的 next 执行给 yiled 传值
- next 传值：下一次 next 传值给上一次 yield 执行的返回值(第一个 next 不给任何人传值)
- **注意，由于 next 方法的参数表示上一个 yield 表达式的返回值，所以在第一次使用 next 方法时，传递参数是无效的。V8 引擎直接忽略第一次使用 next 方法时的参数，只有从第二次使用 next 方法开始，参数才是有效的。从语义上讲，第一个 next 方法用来启动遍历器对象，所以不用带有参数。**

## **生成器函数如果有 return 语句，return 语句后面的 yiled 还是能执行，其他的代码不会执行**

```js
function* gen() {
  console.log('1');
  const res = yield 'a';
  console.log('2', res);
  const res2 = yield 'b';
  console.log('3', res2);
  return 'c';
  console.log('4'); // 不会执行
  const res4 = yield 'd'; // 会执行
  console.log('5', res4); // 不会执行
  const res5 = yield 'e'; // 会执行
  console.log('6', res5); // 不会执行
}
let handler = gen();
console.log(handler.next(100)); //1 { value: 'a', done: false }
console.log(handler.next(200)); //2 200 { value: 'b', done: false }
console.log(handler.next(300)); //3 300 { value: 'c', done: true }
console.log(handler.next(400)); // { value: undefined, done: true }
console.log(handler.next(500)); // { value: undefined, done: true }
console.log(handler.next(600)); // { value: undefined, done: true }
```
