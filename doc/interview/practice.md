## Ajax Fetch Axios 三者的区别

**三者都是用于网络请求,但是不同维度**

- Ajax 是一种技术统称
- Fetch 是浏览器原生 api,用于网络请求,和 XMLHttpRequest 一个级别,语法更加简洁、易用,支持 Promise

```js
function ajax1(url, successFn) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 20) {
        successFn(xhr.responseText);
      }
    }
  };
  xhr.send(null);
}

function ajax2(url) {
  return fetch(url).then((res) => res.json());
}
```

- axios 是第三请求工具方库，内部可用 XMLHttpRequest 和 Fetch 来实现

## 防抖和节流的区别以及应用场景

- 防抖: 动作绑定事件,动作发生一定时间后触发事件,在这段时间内,如果该动作又发生,则重新等待一定的时间再触发事件,例: 搜索框输入

```js
function debounce(fn, delay) {
  let timer = 0;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = 0;
    }, delay);
  };
}
```

- 节流:动作绑定事件,动作发生一段时间后触发事件,在这段时间内,如果动作又发生,则无视该动作,直到这段时间后,才重新触发,例如: drag 或 scroll 期间触发某个回调,要设置一个时间间隔

```js
function throttle(fn, delay) {
  let timer = 0;
  return function () {
    if (timer) return;

    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = 0;
    }, delay);
  };
}
```

## px % em rem vw vh 有什么区别

- px 基本单位,绝对单位(其他都是相对单位)
- % 相对于**父元素**的宽度比例
- em 相对于**当前元素的 font-size**
- rem 相对于**根节点的 font-size**
- vw 是屏幕宽度的 1%
- vh 是屏幕高度的 1%
- vmin 两者的最小值,vmax 两者的最大值

## 箭头函数

缺点:

- 没有 arguments
- 无法通过 apply call bind 改变 this
- 某些箭头函数代码难以阅读

```js
const fn3 = (a, b) => (b === undefined ? (b) => a * b : a * b);
```

什么时候不能使用箭头函数:

- 对象方法

```js
const obj = {
  name: 'feng',
  getName: () => {
    return this.name;
  },
};
console.log(obj.getName()); // undefined
```

- 原型方法

```js
const obj = {
  name: 'feng',
};
obj.__proto__.getName = () => {
  return this.name;
};
console.log(obj.getName()); // undefined
```

- 构造函数

```js
const Foo = (name, age) => {
  this.name = name;
  this.age = age;
};
const f = new Foo('feng', 18); // Error: Foo is not a constructor
```

- 动态上下文中的回调函数

```js
const btn1 = document.getElementById('btn1');
btn1.addEventListener('click', () => {
  this.innerHtml = 'clicked'; // this 此时是window
});
```

- vue 生命周期和 methods
  **vue 组件本质上是一个 js 对象**

```js
mounted: () => {
  console.log('msg', this.msg); // Error: Cannot read properties of undefined(reading 'name')
};
```

**React 组件(非 hooks)本质上是一个 ES6 class**

```js
class Foo {
  constructor(name, city) {
    this.name = name;
    this.city = city;
  }
  getName = () => {
    return this.name;
  };
}
const f = new Foo('feng', 'nexus');
console.log(f.getName()); // feng
```

## 请描述 TCP 三次握手和四次挥手

**建立 TCP 连接**

- 先建立连接(确保双方都有收发消息的能力)
- 再传输内容(如发送一个 get 请求)
- 网络连接是 tcp 协议,传输内容是 HTTP 协议

**为什么是三次握手?**

- 保持序列号同步,三次不能保证序列号一样
- Client 发包,Server 接收。Server: 有 Client 要找我
- Server 发包,Client 接收。Client: Server 已经收到消息了
- Client 发包,Server 接收。Server: Client 要准备发送了

**四次挥手: 关闭连接**

- Client 发包,Server 接收。Server: Client 已请求结束
- Server 发包,Client 接收。Client: Server 已收到,等待她关闭
- Server 发包,Client 接收。Client: Server 此时可以关闭连接了
- Client 发包,Server 接收。Server: 可以关闭了(然后关闭连接)

## for...in 和 for...of 区别

- for...in 遍历得到 key
- for...of 遍历得到 value
- 遍历对象: for...in 可以,for...of 不可以
- 遍历 Map Set: for...of 可以,for...in 不可以
- 遍历 generator: for...of 可以,for...in 不可以
  **for...in 用于*可枚举*数据,如对象、数组、字符串,得到 key**  
  **for...of 用于*可迭代*数据,如字符串、数组、Map、Set,得到 value**

## for await ...of 有什么作用?

- for await...of 用于遍历多个 promise

```js
function createPromise(val) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, 1000);
  });
}

const p1 = createPromise(100);
const p2 = createPromise(200);
const p3 = createPromise(300);

const list = [p1, p2, p3];
// Promise.all(list).then((res) => console.log(res))
for await (let res of list) {
  console.log(res);
}

const arr = [10, 20, 30];
for (let num of arr) {
  const res = await createPromise(num);
  console.log(res); // 一秒一秒输出数字
}
```

## offsetHeight、scrollHeight、clientHeight 区别

- offsetHeight offsetWidth: **border + padding + content**
- clientHeight clientWidth: **padding + content**
- scrollHeight scrollWidth: **padding + 实际内容尺寸**

## HTMLCollection 和 NodeList 区别

**Node 和 Element**

- DOM 是一棵树,所有节点都是 Node
- Node 是 Element 的基类
- Element 是其他 HTML 元素的基类,如 HTMLDivElement

**HTMLCollection 和 NodeList**

- **两者都不是数组,而是类数组**
- HTMLCollection 是 Element 的集合
- NodeList 是 Node 的集合
  **获取 Node 和 Element 的返回的结果可能不一样,如: elem.childNodes 和 elem.children 不一样,前者会包含 Text 和 Comment 节点,后者不会**

## vue computed 和 watch 的区别

- computed 用于计算产生新的数据
- watch 用于监听现有数据

## Vue 组件的通讯方式

- props 和`$emit`
- 自定义事件(bus)

```js
// vue2new vue即可,vue3得引入第三方库
let bus = new vue();

// 接收
bus.on('add', this.add);
//关闭
bus.off('add', this.add);

// 发送
bus.emit('add', 'hello');
```

- `$attrs $listeners`,vue3 移除了`$listeners`

- `$parent $children`,vue3 移除了`$children`
- `$refs`
- provide/inject
- Vuex

不同场景

- 父子组件
- 上下级组件(跨多级)通讯
- 全局组件

## vuex mutation action 区别

- mutation:原子操作；必须包含同步代码
- action: 可包含多个 mutation；可包含异步代码

## js 严格模式有什么特点

- 全局变量必须先声明
- 禁止使用 with
- 创建 eval 作用域
- 禁止 this 指向 window
- 函数参数不能重名

## HTTP 跨域时为何要发送 options 请求

- options 请求,是跨域请求之前的预检查
- **浏览器自行发起的**,无需我们干预
- 不影响实际功能

**跨域请求**

- 浏览器同源策略
- 同源策略一般限制 Ajax 网络请求,不能跨域请求 server
- 不会限制`<link><img><script><iframe>`加载第三方资源

**JSONP 解决跨域**

```js
// www.a.com
<script>
window.onSuccess = function(data){
  console.log(data)
}
</script>
<script scr = 'https://www.b.com'>
// https://www.b.com返回一段字符串: 'onSuccess({error: 0, data: {}})'
```

**CORS 解决跨域**

```js
// CORS配置允许跨域(服务端)
response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081'); //或者"*"
response.setHeader('Access-Control-Allow-Headers', 'X-Requested-with');
response.setHeader(
  'Access-Control-Allow-Methods',
  'PUT,POST,GET,DELETE,OPTIONS',
);
response.setHeader('Access-Control-Allow-Credentials', 'true'); //允许跨域接收cookie
```

token 需要手动加,cookie 浏览器会自带,

## js 内存泄漏如何检测?场景有哪些?

performance，memory 一直在上升,锯齿状最佳

场景

- 被全局变量、函数引用,组件销毁时未清除
- 被全局事件、定时器引用,组件销毁时未清除
- 被自定义事件引用,组件销毁时未清除

  垃圾回收算法

- 引用计数(有循环引用问题)
- 标记清除(目前方式)

**WeakMap、WeakSet 弱引用**

- WeakMap 的 key 只能是引用类型,因为值类型会直接被回收,没法用 size、forEach,内部元素不稳定

## nodejs 和浏览器的事件循环有什么区别

**浏览器事件循环: 宏任务和微任务**

- 宏任务,如 setTimeout setInterval 网络请求 ajax
- 微任务,如 promise async/await,页面渲染之前触发
- 微任务在下一轮 DOM 渲染之前执行,宏任务在之后执行

**nodejs 异步**

- Nodejs 同样使用 ES 语法,也是单线程,也需要异步
- 异步任务也分: 宏任务 + 微任务
- 宏任务和微任务,**分不同类型,有不同优先级**

- 执行同步代码
- 执行微任务
- 按顺序执行 6 个类型的宏任务(每个开始之前都执行当前的微任务)

**宏任务优先级**

- Timers - setTimeout setInterval
- I/O callbacks - 处理网络、流、TCP 的错误回调
- idle,prepare - 闲置状态(nodejs 内部使用)
- Poll 轮询 - 执行 poll 中的 I/O 队列
- Check 检查 - 储存 setImmediate 回调
- Close callbacks - 关闭回调,如 socket.on('close')

**微任务优先级**

- promise,async/await,process.nextTick
- **process.nextTick 优先级最高**

```js
console.info('start');
setImmediate(() => {
  console.info('setImmediate');
});
setTimeout(() => {
  console.info(timeout);
});
Promise.resolve().then(() => {
  console.info('promise then');
});
process.nextTick(() => {
  console.info('nextTick');
});
console.info('end');
// start
// end
// nextTick
// promise then
// timeout
// setImmediate
```

## vdom 很快吗

- vdom 并不快,JS 直接操作 DOM 才是最快的
- 但'数据驱动视图'要有合适的技术方案,不能全部 DOM 重建
- vdom 就是目前最合适的技术方案(并不是因为他快,而是合适)

## 遍历数组,for 和 forEach 那个快

- for 更快
- forEach 每次都要创建一个函数来调用,而 for 不会创建函数
- 函数需要独立作用域,会有额外的开销

```js
const arr = [];
for (let i = 0; i < 100 * 10000; i++) {
  arr.push(i);
}
const length = arr.length;

console.time('for');
let n1 = 0;
for (let i = 0; i < length; i++) {
  n1++;
}
console.timeEnd('for'); //3.7ms

console.time('forEach');
let n2 = 0;
arr.forEach(() => n2++);
console.timeEnd('forEach'); // 15.1ms
```

## 描述 js-bridge 的实现原理

**概念**

- js 无法直接调用 native API(手机 app)
- 需要通过一些特定的'格式'来调用
- 这些'格式'就统称为 JS-Bridge,例如微信 JSSDK

**常见实现方式**

- 注册全局 api
- URL Scheme(自造一种协议标准,在 app 层做拦截)

## RAF 和 RIC 区别

- requestAnimationFrame 每一帧都会执行,**高优**,在布局之前执行
  ![](/docs/images//interview/%E6%B8%B2%E6%9F%93%E6%B5%81%E7%A8%8B.jpg)
- requestIdleCallback 空闲时才执行,**低优**
- **RAF 任务队列被执行时,会将此刻队列中所有任务都执行完,所以 RAF 任务不属于宏任务也不属于微任务**

## vue 什么时候操作 DOM 比较合适

- mounted 和 updated 都不能保证子组件全部挂载完成
- 使用`$nextTick` 渲染 DOM

## vue2 vue3 React 三者 diff 算法有何区别

tree diff 优化,优化后时间复杂度为 O(n),之前为 O(n^3)

- 只比较同一层级,不跨级比较
- tag 不同则删掉重建(不再去比较内部细节)
- 子节点通过 key 区分(key 的重要性)

- React diff 仅右移
- Vue2 双端比较
- Vue3 最长递增子序列

## vue-router MemoryHistory

vue-router 三种模式

- Hash
- WebHistory
- MemoryHistory(v4 之前叫 abstract history)
  路由不能前进和后退,地址栏不会展示子组件的路由

## 移动端 H5 click 有 300ms 延迟,如何解决

- 初期解决方案 FastClick 库
- 现代浏览器的改进`content="width=device-width"`不会有 300ms 延迟

```js
<meta name="viewport" content="width=device-width"></meta>
```

## 网络请求中,token 和 cookie 有什么区别

- cookie: HTTP 标准;跨域限制;配合 session 使用
- token: 无标准;无跨域限制;用于 JWT

**cookie**

- HTTP 无状态,每次请求都要带 cookie,以帮助识别身份
- 服务端也可以向客户端 set-cookie,cookie 大小限制 4kb
- 默认有跨域限制: 不可跨域共享、传递 cookie
  ![cookie](/docs/images/interview/cookie.jpg)

**cookie 和 session**

- cookie 用于登录验证,储存用户标识(如 userId)
- session 在服务端,储存用户详细信息,和 cookie 信息一一对应
- cookie+session 是常见登录验证解决方案
- session 会存很多用户信息,cookie 存一个用户信息

**token vs cookie**

- cookie 是 HTTP 规范,而 token 是自定义传递
- cookie 会默认被浏览器储存,而 token 需自己储存
- token 默认没有跨域限制

**JWT(JSON WEB TOKEN)**: 用户登录校验,取代 cookie+ session 方式

- 前端发起登录,后端验证成功之后,返回一个加密的 token
- 前端自行储存这个 token(其中包含了用户信息,加密了)
- 以后访问服务端接口,都带着这个 token,作为用户信息

## session 和 JWT 那个更好

**session 优点**

- 原理简单,易于学习
- 用户信息储存再服务端,可快速封禁某个用户

**session 缺点**

- 占用服务端内存,硬件成本高
- 多进程,多服务时,不好同步--需要使用第三方缓存,如 redis
- 默认有跨域限制

**JWT 优点**

- 不占用服务端内存
- 多进程、多服务器 不受影响
- 没有跨域限制

**JWT 缺点**

- 用户信息储存再客户端,无法快速封禁某用户
- 万一服务端秘钥被泄漏,则用户信息全部丢失
- token 体积一般大于 cookie,会增加请求的数据量

## 如何实现 sso 单点登录

- 主域名相同,则可共享 cookie
- 主域名不同,则需使用 SSO(类似于 OAuth 2.0)

**基于 cookie**

- cookie 默认不可跨域共享,但是有些情况下可设置为共享(主域名相同 www.baidu.com image.baidu.com)
- 设置 cookie domain 为主域名,即可共享 cookie

**SSO**

- 主域名完全不同,则 cookie 无法共享
- 可使用 SSO 技术方案

## prefetch 和 dns-prefetch 有什么区别

**preload 和 preftech**

- preload 资源在在当前页面使用,会**优先**加载
- prefetch 资源在未来页面使用,**空闲时**加载

**dns-prefetch 和 preconnet**

- dns-prefetch 即 DNS 预查询
- preconnet 即 DNS 预连接

## 如何实现多网页多标签 tab 通信

**使用 WebSocket**

- 无跨域限制
- 需要服务端支持,成本高

**通过 localStorage(跨域不同享) 通讯**

- **同域**的 A 和 B 两个页面
- A 页面设置 localStorage
- B 页面可监听到 localStorage 值得修改

**通过 SharedWorker(IE11 不支持) 通讯**

- SharedWorker 是 WebWorker 的一种
- WebWorker 可开启**子进程**执行 JS,但是不能操作 DOM
- SharedWorker 可单独开启一个进程,用于**同域**页面通讯

**网页和 iframe 如何通讯**

- 使用 postMessage 通讯
- 注意跨域的限制和判断

## 后端一次性返回 10w 条数据,该怎么渲染

- 后端返回 10w 条数据,本身技术方案设计就不合理
- 沟通

- js 处理没问题,渲染到 DOM 会非常卡顿

- 自定义 node 中间层,获取并拆分这 10w 条数据
- 虚拟列表

## 前端常用的设计模式以及使用场景

**设计原则**

- 最重要的思想: 开放封闭原则
- 对扩展开放
- 对修改封闭

**工厂模式**

- 用一个工厂函数,来创建实例,隐藏 new
- 例：jQuery `$`函数,React crateElement 函数

```js
class Foo {}

// 工厂模式
function factory(a, b, c) {
  return new Foo();
}

const f1 = factory(1, 2, 3);
const f2 = factory(1, 2, 3);
const f3 = factory(1, 2, 3);
```

**单例模式**

- 全局唯一的实例(无法生成第二个)
- 如 Vuex Redux 的 store
- 如全局唯一的 dialog modal
- js 是单线程,创建单例很简单,java 是多线程,创建单例要考虑锁死线程,否则多个线程同时创建,单例就重复了

```ts
class SingTon {
  private static instance: SingleTon | null = null;
  private constructor() {}
  public static getInstance(): SingTon {
    if (this.instance == null) {
      this.instance = new SingleTon();
    }
    return this.instance;
  }
  fn1() {}
  fn2() {}
}

const s = new SingleTon(); // 报错
const s = SingleTon.getInstance();
s.fn1();
s.fn2();

const s1 = SingleTon.getInstance();

s === s1; //true
```

**代理模式**

- 使用者不能直接访问对象,而是访问一个代理层
- 在代理层可以监听 get set 做很多事情
- 如 ES6 Proxy 实现 Vue3 响应式

**观察者模式**

- 一个主题,一个观察者,主题变化之后触发观察者执行

```js
btn.addEventListener('click', () => {...})
```

**发布订阅**

```js
// 绑定
event.on('event-key', () => {
  // 事件1
});
event.on('event-key', () => {
  // 事件2
});

// 触发执行
event.emit('event-key');
```

**装饰器模式**

- 原功能不变,增加一些新功能(AOP 面向切面编程)
- ES 和 Typescript 的 Decorator 语法
- 类装饰器,方法装饰器

**观察者模式和发布订阅模式的区别**

- 观察者模式 Subject 和 Observer 直接绑定,没有中间媒介,如 addEventListener 绑定事件
- 发布订阅模式 Publisher 和 Observer 互不相识,需要中间媒介 Event channel,如 EventBus 自定义事件

**对 vue 项目做过那些优化**

- v-if 和 v-show
- 使用 computed 缓存数据
- keep-alive 缓存组件
- 异步组件,路由懒加载(拆包,需要时异步加载)
- 服务端 SSR
- 异步加载组件

**vue 遇到的坑**
**内存泄漏**

- 全局变量,全局事件,全局定时器,自定义事件

**Vue2 响应式的缺陷**

- data 新增属性用 Vue.set
- data 删除属性用 Vue.delete
- 无法直接修改数据 arr[index] = value

**路由切换时 scroll 到顶部**

- SPA 通病,不仅仅是 Vue
- 如,列表页,滚动到第二屏,点击进入详情页,再返回到列表页(此时组件重新渲染),就 scroll 到顶部

**解决方案**

- 在列表页缓存数据和 scrollTop 值
- 当再次返回列表页时,渲染组件,执行 scrollTop(xx)
- 终极解决方案: MPA + App WebView

## 如何统一监听 Vue 组件报错

**window.onerror**

- 全局监听所有 js 错误
- 但是 js 级别的,识别不了 vue 组件信息
- 捕捉一些 vue 监听不到的错误

```js
// App.vue
mounted() {
  window.onerror = function(msg, source, line, column, error){

  }
}
```

**vue 整个错误监听机制对异步报错监听不了**\
**errorCaptured**

- 监听所有**下级**组件的错误
- 返回 false 会阻止向上传播

```js
// App.vue
errorCaptured: (err, vm, info) {
  return false
}
```

**errorHandler**

- Vue 全局错误监听,所有组件错误都会汇总到这里
- 但是 errorCaptured 返回 false,不会传播到这里

```js
// main.js(vue3)
const app = createApp(App);

app.config.errorHandler = (error, vm, info) => {};
app.use(router).mount('#app');
```

## 代码输出

- a.x 比赋值的优先级高

```js
let a = { n: 1 };
a.x = a = { n: 2 };
console.log(a); // {n:2}
// 可拆解为
// a.x = undefined
// let x = a.x x变量假的,实际执行不会有
// x = a = {n:2}
```

```js
let a = { n: 1 };
let b = a;
a.x = a = { n: 2 };

console.log(a);
console.log(b.x);
// {n:2} {n:1,x:{n:2}}
```

## sourcemap 的作用

- js 上线时要压缩、混淆
- 线上 js 报错信息,将无法识别行、列
- sourcemap 可解决这个问题

- webpack 通过 devtool 配置 sourcemap

## 何时应该使用 SSR,何时不用

### SSR 优势

- 性能好
- 对 SEO 优化

### 劣势

- 前后端同构,开发成本高

### 场景

C 端,以阅读为主的单页面,如新闻页,官网等。需要快且需要 SEO

## 权限设计模型 RBAC

- 三个模型,两个关系
  用户 --关系--> 角色 --关系--> 权限

## 如何做技术选型

依据

- 社区是否够成熟
- 公司是否已有经验积累
- 团队成员的学习成本

成本

- 学习成本
- 管理成本
- 运维成本
