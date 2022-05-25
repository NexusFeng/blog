function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val
  this.left = left === undefined ? null : left
  this.right = right === undefined ? null : right
}

var generateTrees = function(n) {
  let memo = new Map()
  const build = (lo, hi) => {
    let res = []
    if (lo > hi) {
      res.push(null)
      return res
    }
    let memoKey = `${lo}&${hi}`
    if (memo.has(memoKey)) return memo.get(memoKey)
    for (let i = lo; i <= hi; i++) {
      let leftTree = build(lo, i - 1)
      let rightTree = build(i + 1, hi)
      for (let left of leftTree) {
        for (let right of rightTree) {
          res.push(new TreeNode(i, left, right))
        }
      }
    }
    memo.set(memoKey, res)
    return res
  }
  return build(1, n)
}
generateTrees(3)
