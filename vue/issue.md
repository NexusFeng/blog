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