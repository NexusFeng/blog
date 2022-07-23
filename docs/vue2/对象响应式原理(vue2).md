
```js
// 保存当前需要收集的全局函数
let activeReactiveFn = null
class Depend{
  constructor(){
    this.reactiveFns = new Set() // 去重
  }
  
  addDepend(reactiveFn){
    this.reactiveFns.add(reactiveFn)
  }

  depend() {
    if(activeReactiveFn) {
      this.reactiveFns.add(activeReactiveFn)
    }
  }

  notify() {
    this.reactiveFns,forEach(fn => {
      fn()
    })
  }
}

// 监听对象的属性变量,Proxy(vue3)/Object.defineProperty(vue2)
function reactive(obj) {
  Object.keys(obj).forEach(key => {
    let value
    Object.defineProperty(obj, key, {
      get: function() {
        const depend = getDepend(obj, key)
        depend.depend()
        return value
      },
      set: function(newVal) {
        value = newVal
        const depend = getDepend(obj, key)
        depend.notify()
      }
    })
  })
  return obj
}


// 封装一个响应式的函数
// let activeReactiveFn = null
function watchFn(fn){
  activeReactiveFn = fn
  fn()
  activeReactiveFn = null
}

// 封装一个获取depend函数
const targetMap = new WeakMap()
function getDepend(target, key) {
  // 根据target对象获取map
  const map = targetMap.get(target)
  if(!map) {
    map = new Map()
    targetMap.set(target, map)
  }

  // 根据key获取depend对象
  const depend = map.get(key)
  if(!depend) {
    depend = new Depend()
    map.set(key, depend)
  }
  return depend
}

// 对象的响应式
const obj = {
  name: 'why', // 每个属性对应一个depend对象
  age: 18
}
// 变为响应式
const objProxy = reactive(obj)

watchFn(function () {
  const newName = objProxy.name
  console.log(objProxy.name, 'name发生了变化')
})

watchFn(function () {
  console.log(objProxy.age, 'age 发生了变化')
})

watchFn(function () {
  console.log(objProxy.age, '-----')
  console.log(objProxy.age, '+++++')
})
// 获取age的函数需要只执行一次
objProxy.age = 19

objProxy.name = 'feng'
```