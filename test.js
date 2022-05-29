function permute(nums) {
  const res = []
  const backtrack = (path) => {
    console.log(path)
    if (path.length === nums.length) {
      res.push(path)
      return
    }
    1
    nums.forEach((n) => {
      if (path.includes(n)) return
      backtrack(path.concat(n))
    })
  }

  backtrack([])
  return res
}
permute([1, 2, 3])
