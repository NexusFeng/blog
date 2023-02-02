const tree = [
  { name: 'A' },
  {
    name: 'B',
    children: [{ name: 'A' }, { name: 'AA', children: [{ name: 'AAA' }] }],
  },
  { name: 'C' },
]
const searchTree = (tree, str) => {
  if (!tree) return [];//处理叶节点
  let result = [];
  tree.map((item) => {
    let it = { ...item }; //每项浅拷贝一下保证不影响原来的tree
    if (it.name === str) {
      result.push(it);
    } else {
      let obj = searchTree(it.children, str);
      //得到children的返回的result数组，放到拷贝对象的children中
      if (obj.length > 0) {
        it.children = obj;
        result.push(it);
      }
    }
  });
  return result;//每层返回一个数组
}

console.log(searchTree(tree, 'A'))