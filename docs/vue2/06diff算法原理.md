---
title: 7.diff算法原理
---

## 更新方法的定义

在生成 render 函数后,就会调用挂载方法,在挂载时就会经过 diff 计算,在初始化的时候,由于没有旧的虚拟节点,所以初次会将真实的 dom 节点与虚拟节点作对比,由于虚拟节点不是原生节点,所以第一次会做一个替换操作

```js
// /src/core/instance/lifecycle.js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode // 当前render函数产生的虚拟节点,保存后以便下次做对比
    if (!prevVnode) {
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false) //初次渲染
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
   ...
  }
```

## diff 算法两大主要分支

主体会有为两大分支: 前后虚拟节点一致、前后虚拟节点不一致

```js
// /src/core/vdom/patch.js
export function createPatchFunction (backend) {
  ...
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    ...
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        ...// 前后虚拟节点一致的方法
      } else {
        ...// 前后虚拟节点不一致的方法
      }
  }
}
```

### 前后虚拟节点不一致
分为三个步骤: 1.创建新的节点、2.更新父占位符节点、3.删除旧节点  
初次进行挂载组件时会判断如果是真实dom,就会将其转为虚拟节点并替换掉
```js
if (isRealElement) {
  ...
  //需要diff 所以将第一次的真实节点转换成虚拟节点
  oldVnode = emptyNodeAt(oldVnode) //<div id="app"></div>
}
// 拿到父类的dom节点
const oldElm = oldVnode.elm //app
const parentElm = nodeOps.parentNode(oldElm) // body
//创建新dom节点 内部包含组件逻辑
createElm(
  vnode,
  insertedVnodeQueue,
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
)
//更新父的占位符节点 (组件更新相关)
if (isDef(vnode.parent)) {
  // 在生成render函数时会生成占位符节点<Dialog>提示</Dialog> => <div>提示</div> <Dialog></Dialog>就是占位符节点
  let ancestor = vnode.parent
  // 判断是否可挂载
  const patchable = isPatchable(vnode)
  while (ancestor) {
    for (let i = 0; i < cbs.destroy.length; ++i) {
      cbs.destroy[i](ancestor)
    }
    //更新父占位符的element
    ancestor.elm = vnode.elm
    if (patchable) {
      ...
    } else {
      registerRef(ancestor)
    }
    ancestor = ancestor.parent
  }
}
// 删除旧节点
if (isDef(parentElm)) {
  removeVnodes([oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode)
}
```
### 前后虚拟节点一致
- 首先判断新节点是否为文本,是则直接设置文本,不是则继续判断
- 新、旧节点都有children,深度对比(重点)
- 新节点有children,老节点没有,循环添加新节点
- 新节点没有,老节点有children,直接删除老节点
```js
function patchVnode (oldVnode,vnode,insertedVnodeQueue,ownerArray,index,removeOnly) {
    const elm = vnode.elm = oldVnode.elm

    let i
    const data = vnode.data 
    // 是组件vnode,在组件更新会调用组件的prepatch方法
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    //比较属性
    if (isDef(data) && isPatchable(vnode)) { 
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    // 是否是text
    if (isUndef(vnode.text)) {
      // 新旧节点都有children
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      // 新有 老没有 children 循环创建新节点
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      // 新没有 老有 children 直接删除老节点
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1)
      // 新老都没有 children 老的是文本 就置为空
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    // 是text 直接设置文本
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```