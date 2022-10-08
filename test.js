function getAllPath (tree) {
  const paths = []
  for(let i = 0; i < tree.length; i++) {
    if(tree[i].children && tree[i].children.length) {
      const res = getAllPath(tree[i].children)
      for(let j = 0; j < res.length; j++) {
        paths.push([tree[i], ...res[j]])
      }
    } else {
      paths.push([tree[i]])
    }
  }
  return paths
}
let tree = [{
  name: '1',
  children: [
    {
      name: '1-1',
      children: [
        {
          name: '1-1-1',
          children: []
        }
      ]
    },
    {
      name: '1-2',
      children: [
        {
          name: '1-2-1',
          children: []
        }
      ]
    },
  ]
}]
console.log(getAllPath(tree))
