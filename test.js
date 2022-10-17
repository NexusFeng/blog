const bfs = root => {
  const stacks = [root]
  while(stacks.length) {
    const stack = stacks.pop()
    console.log(stack.val)
    stack.children.forEach(child => {
      stacks.push(child)
    })
  }
}

const dfs = root => {
  console.log(root.val)
  root.children.forEach(item => {
    dfs(item)
  })
}

function transTree(data) {
  let result = []
  let map = {}
  if(!Array.isArray(data)) return []
  data.forEach(item => map[item.id] = item)
  data.forEach(item => {
    let parent = map[item.parentId]
    if(parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

function transArr(tree){
  let queue = [node]
  let data = []
  while(queue.length){
    let item = queue.shift()
    data.push({
      id: item.id,
      parentId: item.parentId,
      name: item.name
    })
    let children = item.children
    if(children) {
      for(let i = 0; i < children.length; i++) {
        queue.push(children[i])
      }
    }
  }
  return data
}

Object.create = function(o){
  function fn(){}
  fn.prototype = o
  return new fn()
}
