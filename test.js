var findRotation = function(mat, target) {
  let n = mat.length
  const rotate = grid => {
    for(let i = 0; i < n; i++) {
      for(let j = 0; j < i; j++) {
        [grid[i][j], grid[j][i]] = [grid[j][i], grid[i][j]]
      }
    }
    for(let i = 0; i < n; i++) {
      for(let j = 0; j < n/2; j++) {
        [grid[i][j], grid[i][n - j - 1]] = [grid[i][n - j - 1], grid[i][j]]
      }
    }
  }
  return [0,0,0,0].some(() => {
    rotate(mat)
    for(let i = 0; i < n; i++) {
      for(let j = 0; j < n; j++) {
        if(mat[i][j] !== target[i][j]) return false
      }
    }
    return true
  })
 };
let mat = [[0,0,0],[0,1,0],[1,1,1]], target = [[1,1,1],[0,1,0],[0,0,0]]
findRotation(mat, target)