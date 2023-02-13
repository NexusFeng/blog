Array.prototype._forEach = function(fn, thisArg){
  if(typeof fn !== 'function') throw new Error('参数必须是函数')
  if(!Array.isArray(this)) throw new Error('。。。')
  let arr = this
  if(!arr.length) return
  for(let i = 0; i < arr.length; i++) {
    fn.call(thisArg, arr[i], i, arr)
  }
}

Array.prototype._map = function(fn, thisArg){
  let arr = this
  let res = []
  if(!arr.length) return
  for(let i = 0; i < arr.length; i++) {
    let tmp = fn.call(thisArg, arr[i], i, arr)
    res.push(tmp)
  }
}

Array.prototype._filter = function(fn, thisArg){
  let arr = this
  let res = []
  if(!arr.length) return
  for(let i = 0; i < arr.length; i++) {
    let tmp = fn.call(thisArg, arr[i], i, arr)
    if(tmp)res.push(tmp)
  }
}

Array.prototype._some = function(fn, thisArg){
  let arr = this
  let res = []
  if(!arr.length) return
  for(let i = 0; i < arr.length; i++) {
    let tmp = fn.call(thisArg, arr[i], i, arr)
    if(tmp)return true
  }
  return false
}

Array.prototype._reduce = function(fn, base){
  let arr = this, i
  if(!arr.length) return
  if(base) {
    i = 0
  } else {
    base = arr[0]
    i = 1
  }
  for(i; i < arr.length; i++) {
    base = fn(base, arr[i], i, arr)
  }
  return base
}

function compose(middleWares) {
  middleWares.reverse()
  return middleWares.reduce((pre,cur) => {
    return () => {
      return cur(pre)
    }
  }, () => {})
}

function compose2(middleWares) {
  function dispatch(index) {
    if(index === middleWares.length) return Promise.resolve()

    const cb = middleWares[index]

    return Promise.resolve(cb(() => dispatch(++index)))
  }

  dispatch(0)
}
const arr = [
  {
    id: 2,
    name: '部门B',
    parentId: 0,
  },
  {
    id: 3,
    name: '部门C',
    parentId: 1,
  },
  {
    id: 1,
    name: '部门A',
    parentId: 2,
  },
  {
    id: 4,
    name: '部门D',
    parentId: 1,
  },
  {
    id: 5,
    name: '部门E',
    parentId: 2,
  },
  {
    id: 6,
    name: '部门F',
    parentId: 3,
  },
  {
    id: 7,
    name: '部门G',
    parentId: 2,
  },
  {
    id: 8,
    name: '部门H',
    parentId: 4,
  },
]
function array2tree(arr) {
  let res = []
  let map = {}
  if(!Array.isArray(arr)) return res
  arr.forEach(item => {
    map[item.id] = item
  })
  arr.forEach(item => {
    let parent = map[item.parentId]
    if(parent) {
      (parent.children || (parent.children=[])).push(item)
    } else {
      res.push(item)
    }
  })
  return res
}
console.log(array2tree(arr))