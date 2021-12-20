核心内容(321):
- 3种状态: pending(待定状态)、fulfilled(成功状态)、reject(失败状态)
- 2个改变过程: pending --> resolve、pending --> reject
- 1个return
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
  })
```
### 解决的问题
- 回调地狱,代码难以维护
```js
var sayhello = function (order, callback) {
	setTimeout(function () {
    console.log(order);
    callback();
  }, 1000);
}
sayhello("first", function () {
  sayhello("second", function () {
    sayhello("third", function () {
      console.log("end");
    });
  });
});
```
- 代码的可读性
- 信任问题
回调函数不能保证什么时候去调用回调，以及使用什么方式去调用回调；而Promise一旦被确认成功或失败，就不能再被更改。
Promise成功之后仅调用一次resolve()，不会产生回调多次执行的问题。除非Promise再次调用。所以Promise很好地解决了第三方工具导致的回调多次执行（控制反转）的问题。

### 注意的问题
- **并行promise的then会交替执行**
- Promise实例具有then方法,也就是说,then方法时定义在原型对象Promise.prototype上的,then方法返回的是一个新的Promise实例(不是原来的那个Promise示例)
- 如果Promise状态已变成resolved,再抛出错误是无效的
```js
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
```

#### Promise.prototype.finally()(ES2018)
无论Promise对象最后状态如何都会执行操作  
finally本质上是**then方法的特例**  
**注意**:finally方法的回调函数不接受任何参数,这意味着没有办法知道,前面的 Promise 状态到底是fulfilled还是rejected。这表明,finally方法里面的操作,应该是与状态无关的,不依赖于 Promise 的执行结果。  
例:
```js
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
    return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })
// 1
// finally2
// finally
// finally2后面的then函数 2
```
#### Promise.all()
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
  const p = new Promise(r =>
    setTimeout(() => r(x, console.log(x)), 1000)
  );
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) =>
    setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
  );
  return p;
}
Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log("result: ", res))
  .catch(err => console.log(err));
// 0
// Error: 0
// 1
// 2
// 3
```
**`all`和`race`传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被then的第二个参数或者后面的catch捕获；但并不会影响数组中其它的异步任务的执行。**
#### Promise.allSettled()(ES2020)
Promise.all()可以确定所有请求都成功了，但是只要有一个请求失败，它就会报错，而不管另外的请求是否结束  
Promise.allSettled()用来确定一组异步操作是否都结束了(不管成功或失败)
```js
const p = Promise.allSettled([p1, p2, p3])
// 当p1,p2,p3都执行完后,p的回调函数才会收到一个数组,数组的成员是对应的每个promise对象
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```
#### Promise.any()(ES2021)
该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。  
**只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。**
```js
Promise.any([
  fetch('https://v8.dev/').then(() => 'home'),
  fetch('https://v8.dev/blog').then(() => 'blog'),
  fetch('https://v8.dev/docs').then(() => 'docs')
]).then((first) => {  // 只要有一个 fetch() 请求成功
  console.log(first);
}).catch((error) => { // 所有三个 fetch() 全部请求失败
  console.log(error);
});
```
与`Promise.race()`区别: Promise.any()不会因为某一个Promise变为rejected状态而结束,必须等所有参数Promise都为rejected才会结束

案例分析:
```js
const promise = Promise.reolve().then(() => {
  return promise
})
promise.catch(console.err)
// Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```
**`.then``.catch`返回值不能是promise本身,否则会造成死循环**



```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
// 1
```
**`.then`或`.catch`的参数期望是函数,传入非函数则会发生值穿透**


```js
Promise.resolve().then(() => {
    console.log('1')
    throw 'Error';
}).then(() => {
    console.log('2')
}).catch(() => {
    console.log('3')
    throw 'Error';
}).then(() => {
    console.log('4')
}).catch(() => {
    console.log('5')
}).then(() => {
    console.log('6')
})
// 1 3 5 6
```
**无论是`.thne`还是`.catch`中,只要`throw` 抛出了错误，就会被`catch`捕获,如果没有`throw`出错误,就被继续执行后面的then。**