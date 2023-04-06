---
title: diff算法原理
categories: 
  - Vue2
tags: 
  - Vue2
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

主体分为两大分支: 前后虚拟节点一致、前后虚拟节点不一致

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
初次进行挂载组件时两者不相同,之后会判断如果是真实 dom,就会将其转为虚拟节点并替换掉

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
- 新、旧节点都有 children,深度对比(重点)
- 新节点有 children,老节点没有,循环添加新节点
- 新节点没有,老节点有 children,直接删除老节点

```js
function patchVnode(
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly,
) {
  const elm = (vnode.elm = oldVnode.elm);

  let i;
  const data = vnode.data;
  // 是组件vnode,在组件更新会调用组件的prepatch方法
  if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
    i(oldVnode, vnode);
  }

  const oldCh = oldVnode.children;
  const ch = vnode.children;
  //比较属性
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
  }
  // 是否是text
  if (isUndef(vnode.text)) {
    // 新旧节点都有children
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
      // 新有 老没有 children 循环创建新节点
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '');
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      // 新没有 老有 children 直接删除老节点
    } else if (isDef(oldCh)) {
      removeVnodes(oldCh, 0, oldCh.length - 1);
      // 新老都没有 children 老的是文本 就置为空
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '');
    }
    // 是text 直接设置文本
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  }
  if (isDef(data)) {
    if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
  }
}
```

新旧节点都有 children 情况的对比

```js
// /src/core/vdom/patch.js
function updateChildren(
  parentElm,
  oldCh,
  newCh,
  insertedVnodeQueue,
  removeOnly,
) {
  let oldStartIdx = 0; // 老节点开始索引
  let newStartIdx = 0; // 新节点开始索引
  let oldEndIdx = oldCh.length - 1; // 老节点末尾索引
  let oldStartVnode = oldCh[0]; // 老节点开始元素
  let oldEndVnode = oldCh[oldEndIdx]; // 老节点末尾元素
  let newEndIdx = newCh.length - 1; // 新节点末尾索引
  let newStartVnode = newCh[0]; // 新节点开始元素
  let newEndVnode = newCh[newEndIdx]; // 新节点末尾元素
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm;
  const canMove = !removeOnly;
  // 满足新节点开始索引小于新节点结束索引,旧节点开始索引小于旧节点结束索引
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      // 是否定义老节点开始元素
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (isUndef(oldEndVnode)) {
      // 是否定义老节点结束元素
      oldEndVnode = oldCh[--oldEndIdx];
      // 头(旧节点开始元素)头(新节点开始元素)对比 例如四个li,末尾新增一个li,这种情况头头对比性能高
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // sameVnode判断key和tag是否相同
      patchVnode(
        oldStartVnode,
        newStartVnode,
        insertedVnodeQueue,
        newCh,
        newStartIdx,
      );
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 尾尾对比 例如四个li,头部新增一个li,这种情况尾尾对比性能高
      patchVnode(
        oldEndVnode,
        newEndVnode,
        insertedVnodeQueue,
        newCh,
        newEndIdx,
      );
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 头尾对比 节点反转优化 reverse
      patchVnode(
        oldStartVnode,
        newEndVnode,
        insertedVnodeQueue,
        newCh,
        newEndIdx,
      );
      canMove &&
        nodeOps.insertBefore(
          parentElm,
          oldStartVnode.elm,
          nodeOps.nextSibling(oldEndVnode.elm),
        );
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 尾头对比
      patchVnode(
        oldEndVnode,
        newStartVnode,
        insertedVnodeQueue,
        newCh,
        newStartIdx,
      );
      canMove &&
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 乱序对比(核心diff,其他方式为优化)
      if (isUndef(oldKeyToIdx))
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      if (isUndef(idxInOld)) {
        createElm(
          newStartVnode,
          insertedVnodeQueue,
          parentElm,
          oldStartVnode.elm,
          false,
          newCh,
          newStartIdx,
        );
      } else {
        vnodeToMove = oldCh[idxInOld];
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(
            vnodeToMove,
            newStartVnode,
            insertedVnodeQueue,
            newCh,
            newStartIdx,
          );
          oldCh[idxInOld] = undefined;
          canMove &&
            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        } else {
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            false,
            newCh,
            newStartIdx,
          );
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  // 多出来的新节点直接做插入 多出来的旧节点删除
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
    addVnodes(
      parentElm,
      refElm,
      newCh,
      newStartIdx,
      newEndIdx,
      insertedVnodeQueue,
    );
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
}
```

## 注意点

- key 某些情况下不能使用索引,因为改变前后的索引都是一样的,当在头部添加元素时,如果用索引做 key 就会出现更新错误问题,vue 会理解为在末尾添加一个元素(因为前后的 key 都是 0)
- 在各种对比情况下,只要找到两者相同就会去递归对比 children
- 在乱序对比中,key 的作用是极大的。无 key 会出现更新出错问题,同时达不到复用效果
- diff 对比是**深度优先,同层比较**

## 总结

在挂载时会经过 diff 算法后进行模板更新,初次会将真实 dom 节点和生成的虚拟节点进行对比,并将生成的虚拟节点储存起来,以便之后更新做对比。diff 算法主要分为两个分支,前后虚拟节点一致和前后虚拟节点不一致。当前后虚拟节点不一致时,会创建新节点、更新父占位符、删除旧节点。如果旧节点是真实节点,就将其转为虚拟节点,拿到旧节点的父节点后替换旧节点。当前后虚拟节点一致时,会先判断新节点是否为文本,如果值则直接添加,如果不是先比较属性,再判断如果新节点有 children,旧节点没 children,就直接添加新节点 children,如果新节点没有,旧节点有,就会将旧节点的 children 移除,如果新旧节点都有 children,利用双指针同层对比,通过头头对比、尾尾对比、头尾对比、尾头对比、乱序对比不断迭代对其进行判断更新,最大程度的利用旧节点,之后如果有多余的新节点就会将其添加,多余的旧节点将其删除,最后将对比后的虚拟节点返回储存起来,作为下次对比的旧节点。

- 头头对比  
  如果新旧开始元素是相同 vnode,递归调用`patchVnode`方法进行深层对比,之后移动索引至下一个元素
- 尾尾对比  
  如果新旧结束元素是相同 vnode,递归调用`patchVnode`方法进行深层对比,之后移动索引至上一个元素
- 头尾对比  
  将老节点开始元素和旧节点尾元素进行对比,相同就递归调用`patchVnode`方法进行深层对比,之后将旧节点元素移动至最后,旧节点头指针移动到下一个,新节点的尾指针移动至上一个。例如旧:A,B,C,新:C,B,A,第一次对比将旧 A 移动到 C 后边
- 尾头对比  
  将老节点尾元素和旧节点开始元素进行对比,相同就递归调用`patchVnode`方法进行深层对比,之后将旧节点元素移动至最前,旧节点尾指针移动到上一个,新节点的头指针移动至下一个。例如旧:A,B,C,新:C,B,A,D 第一次对比将旧 C 移动到 A 前边
- 乱序对比  
  在做比较前会根据 key 和对应的索引将旧节点生成映射表。在乱序对比时会用当前的 key 去找旧节点的 key,如果能复用,就将节点移动到旧的节点开头处并递归对比 children,如果不能复用就创建新的节点插入到旧的节点开头处。之后将新的索引移至下一个元素
