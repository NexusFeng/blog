## MVVM的理解
vue不是完整的`MVVM`模式,只是做视图层\
MVC(Model/View/Controller)模式对于前端而言,数据变化无法同步到视图中,需要将逻辑聚拢在`controller`层,主要针对后端,对于前端不太好用\
MVVM(Model/View/ViewModel)模式: 映射关系的简化(隐藏controller)为了解决不写controller层,vue只做view视图层,ViewModel实现双向连接(感受不到，设置数据时自动更新)
## 响应式数据
数据和对象类型值变化时,对象内部定义了defineReactive方法,使用Object.definePrototype将属性进行劫持(只会劫持已经存在的属性),数组则是通过重写数组方法来实现.但是对象监控只能监控一层,多层对象通过**递归**来实现劫持(`src/core/observer/index.js:135`)
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
arr[0] = 'test'//此时监控不到, vue不对下标进行监控
```
## vue中如何进行依赖收集
每个属性都拥有自己的dep属性,存放他所依赖的watcher,当属性变化后会通知自己对应的watcher去更新\
默认再初始化时会调用render函数,此时会触发属性依赖收集,`dep.depend`\
当属性发生修改时会触发watcher更新`dep.notify()`\
![vue流程](/docs/images/vue/vue_init.jpg)

## vue中模板编译原理(核心: 如何将template转换成render函数的)
(src/complier\index.js:11)\
1.将template模板转化成ast语法树 => `parserHTML`\
2.对静态语法做静态标记 => `markUp`\
3.重新生成代码 => `codeGen`\

## vue生命周期钩子是如何实现的
(src/core/instance/init.js:38) 初始化合并\
(src/core/util/options.js:388) 合并选项\
1.vue的生命钩子就是回调函数,当创建组件的实例的过程中会调用对应的钩子方法\
2.内部会对钩子函数进行处理,将钩子函数维护成数组的形式

## vue的生命周期方法有哪些?
`beforeCreate`:在实例初始化之后,数据观测和event/watcher事件配置之前\
`created`:实例已经创建完成之后被调用,实例完成数据观测、属性和方法的运算、watch/event事件回调，这里没有$el
`beforeMount`:在挂载之前被调用，相关的render函数首次被调用
`mounted`:el被新创建的vm.$el替换,并挂载到实例上去之后调用该钩子
`beforeUpdate`:数据更新时调用,发生在虚拟DOM重新渲染和补丁之前
`updated`:由于数据更改导致虚拟DOM重新渲染和打补丁,在这之后调用该钩子
`beforeDestroy`: 实例销毁之前调用,实例仍然可以使用
`destroy`:实例销毁后调用,实例的所有的东西都会解绑,所有的事件监听器都会被移除，所有的子实例也会被销毁

## vue.mixin的使用场景和原理
Vue.mixin的作用就是抽离公共的业务逻辑,原理类似于'对象的继承',当组件初始化时会调用mergeOptions方法进行合并,采用策略模式针对不同的属性进行合并,如果混入的数据和本身组件中的数据冲突,会采用'就近原则'以组件的数据为准\
mixin中有很多缺陷'命名冲突问题'、'依赖问题'、'数据来源问题'

## 为什么组件中的data是一个函数
(根可以是对象,但是组件必须是函数)根不需要任何的合并操作 new Vue 单例模式  根才有vm属性,所以他可以是函数和对象 但是组件和mixin他们都没有vm 所以就可以判断当前data是不是个函数\
每次使用组件时都会对组件进行实例化操作,并且调用data函数返回一个对象作为组件的数据源,这样可以保证多个组件见数据互不影响

## nextTick的原理
nextTick中的回调是在下次DOM更新循环结束之后执行的延迟回调\
可用于获取更新后的DOM\
Vue中数据更新是异步的,使用nextTick方法可以保证用户定义的逻辑在更新之后执行

## computed和watch的区别
(src/core/instance/state.js:58)\
(src/core/instance/state.js:241)计算属性取值函数\
(src/core/instance/state.js:345)watch的实现\
computed和watch都是基于Watcher来实现的\
computed属性是具备缓存的,依赖的值不发生变化,对其取值时计算属性方法不会重新计算\
watch则是监控值变化,当值变化时掉哦用对应的回调函数

## Vue.set方法是如何实现的
可以看做defineReactive 和 splice方法的集合\
(src/core/observer:45)给对象增加dep属性\
(src/core/observer:201)set方法的定义
给对象和数组本身都增加了dep属性\
当给对象新增不存在的属性则会触发对象依赖的watcher去更新\
当修改数组索引时我们调用数组本身的splice方法去更新数组

## Vue为什么需要虚拟dom
(src/core/vdom/create-element.js:28)\
(src/core/vdom/vnode.js)虚拟dom的实现\
虚拟dom就是用js对象来描述真实DOM，是对真实DOM的抽象\
由于直接操作DOM性能低但是js层的操作效率高,可以将DOM操作转化成对象操作,最终通过diff算法比对差异进行更新DOM(减少了对真实DOM的操作)\
虚拟DOM不依赖真实平台环境从而也可以实现跨平台

## Vue中的diff算法原理
(src/core/vdom/patch.js:700)\
(src/core/vdom/patch.js:501)比较两个虚拟节点 patchVnode()\
(src/core/vdom/patch.js:404)比较两个虚拟节点 patchChildren()\
Vue的diff算法是平级比较,不考虑跨级比较的情况,内部采用**深度递归的方式+双指针**的方式进行比较\
- 先比较是否相同节点 **以tag和key为主**
- 相同节点比较属性,并复用老节点
- 比较儿子节点,考虑老节点和新节点儿子的情况
- 优化比较: 头头、尾尾、头尾、尾头
- 比对查找进行复用

## 既然Vue通过数据劫持可以精准探测到数据变化,为什么还需要虚拟dom进行diff检测差异
- 响应式数据变化,Vue确实可以在数据发生变化时,响应式系统可以立刻得知。但是如果给每个属性都添加watcher用于更新的话,会产生大量的watcher从而降低性能
- 而且颗粒度过细也会导致更新不精准的问题,所以Vue采用了组件级的watcher配合diff来检测差异

## vue中key的作用和原理
- Vue在patch过程中通过key可以判断两个虚拟节点是否是相同节点(可以复用老节点)
- 无key会导致更新的时候出问题
- 尽量不采用索引作为key

## 对vue组件化的理解
- 组件化开发能大幅度提高应用开发效率、测试性、复用性等
- 常用的组件化技术：属性、自定义事件、插槽等
- 降低更新范围，只是重新渲染变化的组件
- 组件的特点：高内聚、低耦合、单项数据流

## Vue组件的渲染流程
产生组件的虚拟节点 => 创建组件的真实节点 => 插入到页面中
![vue流程](/docs/images/vue/liucheng.PNG)

## 组件的更新流程
属性更新时会触发patchVnode方法 => 组件虚拟节点会调用prepatch钩子 => 更新属性 => 组件更新
![vue流程](/docs/images/vue/update.PNG)

## 异步组件的原理
默认渲染异步占位符节点 => 组件加载完毕后调用forceUpdate强制更新

## 函数式组件的优势及原理
函数式组件的特性: 无状态、无声明周、无this。但是性能高，正常组件是一个类,继承了Vue,函数式组件就是一个普通的函数,没有new过程,也没有init、prepatch等钩子

## vue组件间传值的方式以及之间的区别
- `props`和`$emit`父组件向子组件传递数据通过prop传递的,子组件传递数据给父组件是通过`$emit`触发事件
props原理(src\core\vdom\create-component.js:192)\
(src\core\instance\init.js:36)
- `$parent/$children`获取当前组件的父组件和当前组件的子组件
- `$attrs/$listeners` A->B->C。vue2.4开始提供了`$attrs/$listeners`来解决这个问题
- 父组件中通过`provide`来提供变量,然后在子组件中通过`inject`来注入变量
- `$refs`获取实例
（ref有两个值 1、放在组件上 获取组件的实例  2、放到元素上 会获取真实dom）
- `eventBus`平级组件数据传递 这种情况下可以使用中央事件总线的方式
- vuex状态管理

## $attrs(2.4新增)是为了解决什么问题出现的,provide和inject不能解决他能解决的问题吗 
`$attrs`主要的作用就是实现批量传递数据。provide/inject更合适应用在插件中,主要是跨级数据传递

## v-for和v-if那个优先级更高
v-for和v-if不要在同一个标签中使用,因为解析时先解析v-for再解析v-if.如果遇到需要同时使用时可以考虑写成计算属性的方式\
(src/compiler/index.js:19)\
(src/compiler/codegen/index.js:56)解析v-if和v-for

##  v-model,  v-model放在组件和元素上有啥区别
- v-for实现原理(src/compiler/codegen/index.js:187)

- v-model在组件上相当于 `value + @input`
普通元素上的v-model指令(src/compiler/codegen/index.js:310)
![v-model](/docs/images/vue/v-model.PNG)
在普通元素上v-model会生成指令 + value和input，不通的类型生成的事件不同\
组件上 生成model:{value, callback}

## vue中slot是如何实现的？什么时候使用
![v-model](/docs/images/vue/slot.PNG)
普通插槽和作用域插槽的区别:\
渲染位置不同
- 普通插槽是父组件渲染完毕后替换子组件的内容
- 作用域插槽是在子组件里边渲染插槽的内容

## Vue.use是干什么的?原理是什么
(src/core/global-api/use.js)
Vue.use是用来使用插件的，我们可以在插件中扩展全局组件、指令、原型方法等\
会调用插件的install方法,将vue的构造函数默认传入,这样在插件中可以使用vue无需依赖vue库\

## vue的事件修饰符有哪些?实现原理是什么
.stop/.prevent/.capture/.self/.once/.passive\
(src/compiler/helpers.js:69)
.sync实现原理(src/compiler/parser/index.js:789)

## 如何理解自定义指令
- 1.在生成ast语法树时,遇到指令会给当前元素添加directive属性
- 2.通过genDeirectives生成指令代码
- 3.在patch前将指令的钩子提取到cbs中,在patch过程中调用对应的钩子
- 4.当执行cbs对应的钩子时,调用对应指令定义的方法
(src/vdom/patch.js:77)提取钩子函数\
(src/vdom/modules/directives.js:7)指令钩子

## keep-alive的实现原理
keep-alive包裹动态组件时,会对组件进行缓存,避免组件的重新创建
lru算法 最近最久未使用

## vue-router有几种钩子函数,具体是什么以及执行流程是怎样的

钩子函数的种类有: 全局守卫、路由守卫、组件守卫
- 1.导航被触发
- 2.在失活的组件里调用beforeRouteLeave守卫
- 3.调用全局的beforeEach守卫
- 4.在重用的组件里调用beforeRouteUpdate守卫(2.2+)
- 5.在路由配置里调用beforeEnter
- 6.解析异步路由组件
- 7.在被激活的组件里调用beforeRouteEnter
- 8.调用全局的beforeResolve守卫(2.5+)
- 9.导航被确认
- 10.调用全局的afterEach钩子
- 11.触发DOM更新
- 12.调用beforeRouteEnter守卫中传给next的回调函数,创建好的组件实例会作为回调函数的参数传入

## vue-router的两种模式的区别
- vue-router有三种模式hash、history、abstract
- abstract模式是在不支持浏览器PAI环境使用,不依赖浏览器历史
- hash模式: hash + popState/hashChange兼容性好但是不够美观,hash服务端无法获取,不利于seo优化
- history模式：historyApi + popState美观,刷新会出现404 => cli webpack 配置了一个插件 history-fallback,不会出现404

## 对vuex的个人理解

- vuex是专门为vue提供的全局状态管理系统,用于多个组件中数据共享、数据缓存等。(无法持久化、内部核心原理是通过创造一个全局实例new Vue)
实现的原理方法: replaceState、subscribe、registerModule、namespace(modules)、辅助函数....

## vue中的性能优化有哪些
- 数据层级不易过深,合理设置响应式数据
- 使用数据时缓存值的结果,不频繁取值
- 合理设置key属性
- v-show和v-if的选取
- 控制组件粒度 => vue采用组件级更新
- 采用函数式组件 => 函数式组件开销低
- 采用异步组件 => 借助webpack分包的能力
- 使用keep-alive缓存组件
- 虚拟滚动，时间分片等策略
- 打包优化 

## mutation和action的区别
mutation: 主要在于修改状态,必须是同步执行\
action：执行业务代码,方便复用,逻辑可以为异步,不能直接修改状态

## vue中的设计模式
- **单例模式**：单例模式就是整个程序有且仅有一个实例
- **工厂模式**: 传入参数即可创建实例(createElement)
- **发布订阅模式**：订阅者把自己想订阅的事件注册到调度中心,当该事件触发时候,发布者发布该事件到调度中心,由调度中心统一调度订阅者注册到调度中心的处理代码
- **观察者模式**：watcher&dep的关系
- **代理模式**：代理模式给某一个对象提供一个代理对象,并由代理对象控制对原对象的引用。_data属性、proxy、节流防抖(vm.xxx = vm.data.xxx)
- **装饰模式**：vue2装饰器的用法(对功能进行增强 @)
- **中介者模式**： 中介者是一个行为设计模式,通过提供一个统一的接口让系统的不同部分进行通信-vuex
- **策略模式**：策略模式指对象有某个行为,但是在不同的场景中,该行为有不同的实现方案
- **外观模式**：提供了统一的接口,用来访问子系统中的一群接口

## v-show和v-if的区别
- v-show是不支持template,不可以和v-else一起使用
- v-show它的DOM都是有渲染的,只是通过css的display属性来切换
- v-if为false时,元素不会出现在DOM中