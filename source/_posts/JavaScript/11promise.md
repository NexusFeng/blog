---
title: Promise
date: 2022-02-12
categories: 
  - JavaScript
tags: 
  - JavaScript
---

## 核心内容(321):

- 3 种状态: pending(待定状态)、fulfilled(成功状态)、reject(失败状态)
- 2 个改变过程: pending --> resolve、pending --> reject
- 1 个 return 返回一个 promise

```js
const p1 = new Promise((resolve, reject) => {
  // 略
})
  .then((resolve, reject) => {
    // 处理p1的结果
    // 这里是用于链式调用的 return
  })
  .then((resolve, reject) => {
    // 这里的状态和结果由上面的return决定
  });

// then返回的是一个promise,如果是常量会包裹在resolve中返回
```

## 解决的问题

- 回调地狱,代码难以维护

```js
var sayhello = function (order, callback) {
  setTimeout(function () {
    console.log(order);
    callback();
  }, 1000);
};
sayhello('first', function () {
  sayhello('second', function () {
    sayhello('third', function () {
      console.log('end');
    });
  });
});
```

- 代码的可读性
- 信任问题
  回调函数不能保证什么时候去调用回调，以及使用什么方式去调用回调；而 Promise 一旦被确认成功或失败，就不能再被更改。
  Promise 成功之后仅调用一次 resolve()，不会产生回调多次执行的问题。除非 Promise 再次调用。所以 Promise 很好地解决了第三方工具导致的回调多次执行（控制反转）的问题。

## 注意的问题

- **并行 promise 的 then 会交替执行,编译器的优化,防止一个 promise 占据太久时间**
- **then 中返回 promise 实例,相当于多出了一个 promise 实例,也会遵循交替执行,但是和直接声明一个 promise 实例结果有些差异**

```js
Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(100);
  })
  .then((res) => {
    console.log(res);
  })
  .then(() => {
    console.log(200);
  })
  .then(() => {
    console.log(300);
  })
  .then(() => {
    console.log(400);
  })
  .then(() => {
    console.log(500);
  })
  .then(() => {
    console.log(600);
  })
  .then(() => {
    console.log(700);
  });

Promise.resolve()
  .then(() => {
    console.log(10);
  })
  .then(() => {
    console.log(20);
  })
  .then(() => {
    console.log(30);
  })
  .then(() => {
    console.log(40);
  })
  .then(() => {
    console.log(50);
  })
  .then(() => {
    console.log(60);
  })
  .then(() => {
    console.log(70);
  });
// 1 10 20 30 100 40 200 50 300 60 400 70 500 600 700
// then中返回promise实例,出现慢两拍情况
// 第一，promise需要由pending变为fulfilled。第二，then函数挂载到MicroTaskQueue
```

相当于

```js
Promise.resolve().then(() => {
  console.log(0);
});

Promise.resolve()
  .then(() => {
    console.log(10);
  })
  .then(() => {
    console.log(20);
  })
  .then(() => {
    console.log(30);
  })
  .then(() => {
    console.log(40);
  })
  .then(() => {
    console.log(50);
  })
  .then(() => {
    console.log(60);
  })
  .then(() => {
    console.log(70);
  });

Promise.resolve().then(() => {
  // 第一拍
  const p = Promise.resolve(100);
  Promise.resolve().then(() => {
    // 第二拍
    p.then((res) => console.log(res))
      .then(() => console.log(200))
      .then(() => console.log(300))
      .then(() => console.log(400))
      .then(() => console.log(500))
      .then(() => console.log(600))
      .then(() => console.log(700));
  });
});
```

- Promise 实例具有 then 方法,也就是说,then 方法时定义在原型对象 Promise.prototype 上的,then 方法返回的是一个新的 Promise 实例(不是原来的那个 Promise 示例)
- 如果 Promise 状态已变成 resolved,再抛出错误是无效的

```js
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function (value) {
    console.log(value);
  })
  .catch(function (error) {
    console.log(error);
  });
// ok
```

### Promise.prototype.finally()(ES2018)

无论 Promise 对象最后状态如何都会执行操作  
finally 本质上是**then 方法的特例**  
**注意**:finally 方法的回调函数不接受任何参数,这意味着没有办法知道,前面的 Promise 状态到底是 fulfilled 还是 rejected。这表明,finally 方法里面的操作,应该是与状态无关的,不依赖于 Promise 的执行结果。  
例:

```js
Promise.resolve('1')
  .then((res) => {
    console.log(res);
  })
  .finally(() => {
    console.log('finally');
  });
Promise.resolve('2')
  .finally(() => {
    console.log('finally2');
    return '我是finally2返回的值';
  })
  .then((res) => {
    console.log('finally2后面的then函数', res);
  });
// 1
// finally2
// finally
// finally2后面的then函数 2
```

### Promise.all()

Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

- **数组内执行的顺序并不是有序的,除非可迭代对象为空**

```js
const p = Promise.all([p1, p2, p3]);
// 只有p1,p2,p3的状态变为fulfilled时,p的状态才会变为fulfilled,p的回调函数会得到p1,p2,p3返回值组成的数组。只要有一个状态为rejected,p的状态就变为rejected,p的回调函数会得到为第一个rejected的返回值
```

#### Promise.race()

Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
const p = Promise.race([p1, p2, p3]);
// 只要p1,p2,p3中有一个实例率先改变状态,p的状态就会随之改变,实例的返回值会传给p的回调函数
```

例:

```js
function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) =>
    setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x),
  );
  return p;
}
Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
  .then((res) => console.log('result: ', res))
  .catch((err) => console.log(err));
// 0
// Error: 0
// 1
// 2
// 3
```

**`all`和`race`传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被 then 的第二个参数或者后面的 catch 捕获；但并不会影响数组中其它的异步任务的执行。**

#### Promise.allSettled()(ES2020)

Promise.all()可以确定所有请求都成功了，但是只要有一个请求失败，它就会报错，而不管另外的请求是否结束  
Promise.allSettled()用来确定一组异步操作是否都结束了(不管成功或失败)

```js
const p = Promise.allSettled([p1, p2, p3]);
// 当p1,p2,p3都执行完后,p的回调函数才会收到一个数组,数组的成员是对应的每个promise对象
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

#### Promise.any()(ES2021)

该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。  
**只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态；如果所有参数实例都变成 rejected 状态，包装实例就会变成 rejected 状态。**

```js
Promise.any([
  fetch('https://v8.dev/').then(() => 'home'),
  fetch('https://v8.dev/blog').then(() => 'blog'),
  fetch('https://v8.dev/docs').then(() => 'docs'),
])
  .then((first) => {
    // 只要有一个 fetch() 请求成功
    console.log(first);
  })
  .catch((error) => {
    // 所有三个 fetch() 全部请求失败
    console.log(error);
  });
```

与`Promise.race()`区别: Promise.any()不会因为某一个 Promise 变为 rejected 状态而结束,必须等所有参数 Promise 都为 rejected 才会结束

案例分析:

```js
const promise = Promise.reolve().then(() => {
  return promise;
});
promise.catch(console.err);
// Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```

**` .then``.catch `返回值不能是 promise 本身,否则会造成死循环**

```js
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
// 1
```

**`.then`或`.catch`的参数期望是函数,传入非函数则会发生值穿透**

```js
Promise.resolve()
  .then(() => {
    console.log('1');
    throw 'Error';
  })
  .then(() => {
    console.log('2');
  })
  .catch(() => {
    console.log('3');
    throw 'Error';
  })
  .then(() => {
    console.log('4');
  })
  .catch(() => {
    console.log('5');
  })
  .then(() => {
    console.log('6');
  });
// 1 3 5 6
```

**无论是`.then`还是`.catch`中,只要`throw` 抛出了错误，就会被`catch`捕获,如果没有`throw`出错误,就被继续执行后面的 then。**
