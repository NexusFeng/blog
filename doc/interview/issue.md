## MVVM 的理解

vue 不是完整的`MVVM`模式,只是做视图层\
MVC(Model/View/Controller)模式对于前端而言,数据变化无法同步到视图中,需要将逻辑聚拢在`controller`层,主要针对后端,对于前端不太好用\
MVVM(Model/View/ViewModel)模式: 映射关系的简化(隐藏 controller)为了解决不写 controller 层,vue 只做 view 视图层,ViewModel 实现双向连接(感受不到，设置数据时自动更新)

## 响应式数据

数据和对象类型值变化时,对象内部定义了 defineReactive 方法,使用 Object.definePrototype 将属性进行劫持(只会劫持已经存在的属性),数组则是通过重写数组方法来实现.但是对象监控只能监控一层,多层对象通过**递归**来实现劫持(`src/core/observer/index.js:135`)

```js
data() {
  return {
    arr: []
  } // 共有三个dep,{} arr []数组本身的dep
}
```

## 如何检测数组的变化

选择重写数组方法(push/shift/pop/unshift/splice/sort/reverse)\
数组中如果是对象数据类型也会进行递归劫持\
数组的索引和长度变化时无法监控到的
(`src/core/observer/array.js`)

```js
arr[0] = 'test'; //此时监控不到, vue不对下标进行监控
```

## vue 中如何进行依赖收集

每个属性都拥有自己的 dep 属性,存放他所依赖的 watcher,当属性变化后会通知自己对应的 watcher 去更新\
默认再初始化时会调用 render 函数,此时会触发属性依赖收集,`dep.depend`\
当属性发生修改时会触发 watcher 更新`dep.notify()`\
![vue流程](/docs/images/vue/vue_init.jpg)

## vue 中模板编译原理(核心: 如何将 template 转换成 render 函数的)

(src/complier\index.js:11)\
1.将 template 模板转化成 ast 语法树 => `parserHTML`\
2.对静态语法做静态标记 => `markUp`\
3.重新生成代码 => `codeGen`\

## vue 生命周期钩子是如何实现的

(src/core/instance/init.js:38) 初始化合并\
(src/core/util/options.js:388) 合并选项\
1.vue 的生命钩子就是回调函数,当创建组件的实例的过程中会调用对应的钩子方法\
2.内部会对钩子函数进行处理,将钩子函数维护成数组的形式

## vue 的生命周期方法有哪些?

`beforeCreate`:在实例初始化之后,数据观测和 event/watcher 事件配置之前\
`created`:实例已经创建完成之后被调用,实例完成数据观测、属性和方法的运算、watch/event 事件回调，这里没有$el
`beforeMount`:在挂载之前被调用，相关的render函数首次被调用
`mounted`:el被新创建的vm.$el 替换,并挂载到实例上去之后调用该钩子
`beforeUpdate`:数据更新时调用,发生在虚拟 DOM 重新渲染和补丁之前
`updated`:由于数据更改导致虚拟 DOM 重新渲染和打补丁,在这之后调用该钩子
`beforeDestroy`: 实例销毁之前调用,实例仍然可以使用
`destroy`:实例销毁后调用,实例的所有的东西都会解绑,所有的事件监听器都会被移除，所有的子实例也会被销毁

## vue.mixin 的使用场景和原理

Vue.mixin 的作用就是抽离公共的业务逻辑,原理类似于'对象的继承',当组件初始化时会调用 mergeOptions 方法进行合并,采用策略模式针对不同的属性进行合并,如果混入的数据和本身组件中的数据冲突,会采用'就近原则'以组件的数据为准\
mixin 中有很多缺陷'命名冲突问题'、'依赖问题'、'数据来源问题'

## 为什么组件中的 data 是一个函数

(根可以是对象,但是组件必须是函数)根不需要任何的合并操作 new Vue 单例模式 根才有 vm 属性,所以他可以是函数和对象 但是组件和 mixin 他们都没有 vm 所以就可以判断当前 data 是不是个函数\
每次使用组件时都会对组件进行实例化操作,并且调用 data 函数返回一个对象作为组件的数据源,这样可以保证多个组件见数据互不影响

## nextTick 的原理

nextTick 中的回调是在下次 DOM 更新循环结束之后执行的延迟回调\
可用于获取更新后的 DOM\
Vue 中数据更新是异步的,使用 nextTick 方法可以保证用户定义的逻辑在更新之后执行

## computed 和 watch 的区别

(src/core/instance/state.js:58)\
(src/core/instance/state.js:241)计算属性取值函数\
(src/core/instance/state.js:345)watch 的实现\
computed 和 watch 都是基于 Watcher 来实现的\
computed 属性是具备缓存的,依赖的值不发生变化,对其取值时计算属性方法不会重新计算\
watch 则是监控值变化,当值变化时掉哦用对应的回调函数

## Vue.set 方法是如何实现的

可以看做 defineReactive 和 splice 方法的集合\
(src/core/observer:45)给对象增加 dep 属性\
(src/core/observer:201)set 方法的定义
给对象和数组本身都增加了 dep 属性\
当给对象新增不存在的属性则会触发对象依赖的 watcher 去更新\
当修改数组索引时我们调用数组本身的 splice 方法去更新数组

## Vue 为什么需要虚拟 dom

(src/core/vdom/create-element.js:28)\
(src/core/vdom/vnode.js)虚拟 dom 的实现\
虚拟 dom 就是用 js 对象来描述真实 DOM，是对真实 DOM 的抽象\
由于直接操作 DOM 性能低但是 js 层的操作效率高,可以将 DOM 操作转化成对象操作,最终通过 diff 算法比对差异进行更新 DOM(减少了对真实 DOM 的操作)\
虚拟 DOM 不依赖真实平台环境从而也可以实现跨平台

## Vue 中的 diff 算法原理

(src/core/vdom/patch.js:700)\
(src/core/vdom/patch.js:501)比较两个虚拟节点 patchVnode()\
(src/core/vdom/patch.js:404)比较两个虚拟节点 patchChildren()\
Vue 的 diff 算法是平级比较,不考虑跨级比较的情况,内部采用**深度递归的方式+双指针**的方式进行比较\

- 先比较是否相同节点 **以 tag 和 key 为主**
- 相同节点比较属性,并复用老节点
- 比较儿子节点,考虑老节点和新节点儿子的情况
- 优化比较: 头头、尾尾、头尾、尾头
- 比对查找进行复用

## 既然 Vue 通过数据劫持可以精准探测到数据变化,为什么还需要虚拟 dom 进行 diff 检测差异

- 响应式数据变化,Vue 确实可以在数据发生变化时,响应式系统可以立刻得知。但是如果给每个属性都添加 watcher 用于更新的话,会产生大量的 watcher 从而降低性能
- 而且颗粒度过细也会导致更新不精准的问题,所以 Vue 采用了组件级的 watcher 配合 diff 来检测差异

## vue 中 key 的作用和原理

- Vue 在 patch 过程中通过 key 可以判断两个虚拟节点是否是相同节点(可以复用老节点)
- 无 key 会导致更新的时候出问题
- 尽量不采用索引作为 key

## 对 vue 组件化的理解

- 组件化开发能大幅度提高应用开发效率、测试性、复用性等
- 常用的组件化技术：属性、自定义事件、插槽等
- 降低更新范围，只是重新渲染变化的组件
- 组件的特点：高内聚、低耦合、单项数据流

## Vue 组件的渲染流程

产生组件的虚拟节点 => 创建组件的真实节点 => 插入到页面中
![vue流程](/docs/images/vue/liucheng.PNG)

## 组件的更新流程

属性更新时会触发 patchVnode 方法 => 组件虚拟节点会调用 prepatch 钩子 => 更新属性 => 组件更新
![vue流程](/docs/images/vue/update.PNG)

## 异步组件的原理

默认渲染异步占位符节点 => 组件加载完毕后调用 forceUpdate 强制更新

## 函数式组件的优势及原理

函数式组件的特性: 无状态、无声明周、无 this。但是性能高，正常组件是一个类,继承了 Vue,函数式组件就是一个普通的函数,没有 new 过程,也没有 init、prepatch 等钩子

## vue 组件间传值的方式以及之间的区别

- `props`和`$emit`父组件向子组件传递数据通过 prop 传递的,子组件传递数据给父组件是通过`$emit`触发事件
  props 原理(src\core\vdom\create-component.js:192)\
  (src\core\instance\init.js:36)
- `$parent/$children`获取当前组件的父组件和当前组件的子组件
- `$attrs/$listeners` A->B->C。vue2.4 开始提供了`$attrs/$listeners`来解决这个问题
- 父组件中通过`provide`来提供变量,然后在子组件中通过`inject`来注入变量
- `$refs`获取实例
  （ref 有两个值 1、放在组件上 获取组件的实例 2、放到元素上 会获取真实 dom）
- `eventBus`平级组件数据传递 这种情况下可以使用中央事件总线的方式
- vuex 状态管理

## $attrs(2.4 新增)是为了解决什么问题出现的,provide 和 inject 不能解决他能解决的问题吗

`$attrs`主要的作用就是实现批量传递数据。provide/inject 更合适应用在插件中,主要是跨级数据传递

## v-for 和 v-if 那个优先级更高

v-for 和 v-if 不要在同一个标签中使用,因为解析时先解析 v-for 再解析 v-if.如果遇到需要同时使用时可以考虑写成计算属性的方式\
(src/compiler/index.js:19)\
(src/compiler/codegen/index.js:56)解析 v-if 和 v-for

## v-model, v-model 放在组件和元素上有啥区别

- v-for 实现原理(src/compiler/codegen/index.js:187)

- v-model 在组件上相当于 `value + @input`
  普通元素上的 v-model 指令(src/compiler/codegen/index.js:310)
  ![v-model](/docs/images/vue/v-model.PNG)
  在普通元素上 v-model 会生成指令 + value 和 input，不通的类型生成的事件不同\
  组件上 生成 model:{value, callback}

## vue 中 slot 是如何实现的？什么时候使用

![v-model](/docs/images/vue/slot.PNG)
普通插槽和作用域插槽的区别:\
渲染位置不同

- 普通插槽是父组件渲染完毕后替换子组件的内容
- 作用域插槽是在子组件里边渲染插槽的内容

## Vue.use 是干什么的?原理是什么

(src/core/global-api/use.js)
Vue.use 是用来使用插件的，我们可以在插件中扩展全局组件、指令、原型方法等\
会调用插件的 install 方法,将 vue 的构造函数默认传入,这样在插件中可以使用 vue 无需依赖 vue 库\

## vue 的事件修饰符有哪些?实现原理是什么

.stop/.prevent/.capture/.self/.once/.passive\
(src/compiler/helpers.js:69)
.sync 实现原理(src/compiler/parser/index.js:789)

## 如何理解自定义指令

- 1.在生成 ast 语法树时,遇到指令会给当前元素添加 directive 属性
- 2.通过 genDeirectives 生成指令代码
- 3.在 patch 前将指令的钩子提取到 cbs 中,在 patch 过程中调用对应的钩子
- 4.当执行 cbs 对应的钩子时,调用对应指令定义的方法
  (src/vdom/patch.js:77)提取钩子函数\
  (src/vdom/modules/directives.js:7)指令钩子

## keep-alive 的实现原理

keep-alive 包裹动态组件时,会对组件进行缓存,避免组件的重新创建
lru 算法 最近最久未使用

## vue-router 有几种钩子函数,具体是什么以及执行流程是怎样的

钩子函数的种类有: 全局守卫、路由守卫、组件守卫

- 1.导航被触发
- 2.在失活的组件里调用 beforeRouteLeave 守卫
- 3.调用全局的 beforeEach 守卫
- 4.在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)
- 5.在路由配置里调用 beforeEnter
- 6.解析异步路由组件
- 7.在被激活的组件里调用 beforeRouteEnter
- 8.调用全局的 beforeResolve 守卫(2.5+)
- 9.导航被确认
- 10.调用全局的 afterEach 钩子
- 11.触发 DOM 更新
- 12.调用 beforeRouteEnter 守卫中传给 next 的回调函数,创建好的组件实例会作为回调函数的参数传入

## vue-router 的两种模式的区别

- vue-router 有三种模式 hash、history、abstract
- abstract 模式是在不支持浏览器 PAI 环境使用,不依赖浏览器历史
- hash 模式: hash + popState/hashChange 兼容性好但是不够美观,hash 服务端无法获取,不利于 seo 优化
- history 模式：historyApi + popState 美观,刷新会出现 404 => cli webpack 配置了一个插件 history-fallback,不会出现 404

## 对 vuex 的个人理解

- vuex 是专门为 vue 提供的全局状态管理系统,用于多个组件中数据共享、数据缓存等。(无法持久化、内部核心原理是通过创造一个全局实例 new Vue)
  实现的原理方法: replaceState、subscribe、registerModule、namespace(modules)、辅助函数....

## vue 中的性能优化有哪些

- 数据层级不易过深,合理设置响应式数据
- 使用数据时缓存值的结果,不频繁取值
- 合理设置 key 属性
- v-show 和 v-if 的选取
- 控制组件粒度 => vue 采用组件级更新
- 采用函数式组件 => 函数式组件开销低
- 采用异步组件 => 借助 webpack 分包的能力
- 使用 keep-alive 缓存组件
- 虚拟滚动，时间分片等策略
- 打包优化

## mutation 和 action 的区别

mutation: 主要在于修改状态,必须是同步执行\
action：执行业务代码,方便复用,逻辑可以为异步,不能直接修改状态

## vue 中的设计模式

- **单例模式**：单例模式就是整个程序有且仅有一个实例
- **工厂模式**: 传入参数即可创建实例(createElement)
- **发布订阅模式**：订阅者把自己想订阅的事件注册到调度中心,当该事件触发时候,发布者发布该事件到调度中心,由调度中心统一调度订阅者注册到调度中心的处理代码
- **观察者模式**：watcher&dep 的关系
- **代理模式**：代理模式给某一个对象提供一个代理对象,并由代理对象控制对原对象的引用。\_data 属性、proxy、节流防抖(vm.xxx = vm.data.xxx)
- **装饰模式**：vue2 装饰器的用法(对功能进行增强 @)
- **中介者模式**： 中介者是一个行为设计模式,通过提供一个统一的接口让系统的不同部分进行通信-vuex
- **策略模式**：策略模式指对象有某个行为,但是在不同的场景中,该行为有不同的实现方案
- **外观模式**：提供了统一的接口,用来访问子系统中的一群接口

## v-show 和 v-if 的区别

- v-show 是不支持 template,不可以和 v-else 一起使用
- v-show 它的 DOM 都是有渲染的,只是通过 css 的 display 属性来切换
- v-if 为 false 时,元素不会出现在 DOM 中

## v-model 修饰符 - lazy

- v-model 在进行双向绑定时,绑定的是 input 事件,每次输入最新值将和绑定值进行同步
- lazy 修饰符将绑定的事件切换为 change 事件,只有在提交时才会触发

## Options API 的弊端

- 对应的属性编写对应的功能模块,这种弊端在实现某一个功能时,这个功能**对应的代码逻辑**会被**拆分到各个属性**中
- 当组件更大更复杂时,逻辑关注点的列表就会增长,**同一个功能的逻辑就会被拆的很分散**

## 事件模型

- DOM0 级: 事件处理程序直接作为元素的属性来指定

```html
<button onclick="alert('Hello, world!')">Click me!</button>
```

- DOM1 级: 事件处理程序是通过元素的属性来指定，但是属性的名称使用 on 前缀和事件名称组合而成.将 onclick 属性设置为一个 JavaScript 函数，从而指定单击事件处理程

```html
<button id="myButton">Click me!</button>

<script>
  var btn = document.getElementById('myButton');
  btn.onclick = function () {
    alert('Hello, world!');
  };
</script>
```

- DOM2 级: 使用 addEventListener()方法向元素添加事件处理程序

```html
<button id="myButton">Click me!</button>

<script>
  var btn = document.getElementById('myButton');
  btn.addEventListener(
    'click',
    function () {
      alert('Hello, world!');
    },
    false,
  );
</script>
```

- DOM3 级
  DOM3 级在 DOM2 级的基础上增加了更多的事件类型和事件处理程序，并对事件模型进行了扩展和优化，包括键盘事件、鼠标滚轮事件、变动事件等，虽然 DOM3 级事件模型是一个标准规范，但是并不是所有浏览器都完全支持该规范
