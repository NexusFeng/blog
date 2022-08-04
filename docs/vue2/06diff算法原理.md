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
