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