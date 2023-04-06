---
title: Vue全局概览
date: 2022-02-12
categories: 
  - Vue2
tags: 
  - Vue2
---

## 内部流程

![](/images/vue/vue.png)

## 初始化及挂载

- 在`new vue()`之后,会调用`_init`函数进行初始化,初始化生命周期、事件、props、methods 等
- 初始化之后调用`$mount()`会挂载组件,如果是运行时编译(即不存在`render()`,但是存在`template`情况下,则需要编译)

## 编译

compile 编译可分为`parse、optimize、generate`三个阶段,最终得到`render()`

- `parse`会用正则等方式解析 template 模板中的指令、class、style 等数据,形成 AST
- `optimize`用来标记 static 静态节点。编译过程中的一处优化,当`update`更新界面时,会有一个`patch`过程,diff 算法会直接跳过静态节点,从而减少了比较的过程,优化`patch`性能
- `generate`将 AST 转化为`render()`字符串的过程

#### compiler 和 only 版对比

![](/images/vue/compiler.png)  
**？？？为什么 compiler 版得先生成 ast 树在编译成 render 函数？？？**\
**整个过程中 AST 树只生成一次($mount 执行了一次),render 也只生成了一次.整个过程中就是 html 中的一个标签,转化成 render 函数的代码,肯定要用一些变量来描述这个标签,例如有没有 v-if,有没有 v-for 等等,然后根据这些变量信息去判断改如何生成 render 函数,所以选择 ast 节点作为变量来描述这个源码标签的信息,然后判断这些信息就知道了如何生成 render 函数**

## 响应式

- 利用`Object.defineProperty`对对象进行`setter`和`getter`拦截
- 当`render()`被渲染的时候,读取所需对象的值时,会触发`getter`函数进行**依赖收集**、**依赖收集的目的是将观察者 Watcher 对象存放在当前闭包中的订阅者 Dep 的 subs 中**
- 在修改对象值得时候,会触发`setter`,`setter`通知之前依赖收集得到的 Dep 中的每一个 Watcher 当前值发生了变化,需要重新渲染视图,这时候这些 Watcher 就会开始调用`update`来更新视图,在此过程中还有一个`patch`的过程以及使用队列来异步更新的策略

## Virtual DOM

Virtual DOM 其实就是一棵以 js 对象(VNode)作为基础的树,用对象来描述节点,实际上只是一层对真实 DOM 的抽象

## 更新视图

将新的 VNode 与旧的 VNode 一起传入`patch`进行比较,经过 diff 算法得出他们的差异,最后只对这些差异的对应 DOM 进行修改即可
