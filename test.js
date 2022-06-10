let lengthOfLIS = function (nums) {
  let dp = [];
  let n = nums.length;
  if (!n) {
    return 0;
  }

  dp[0] = 1;
  for (let i = 1; i < n; i++) {
    let num = nums[i];
    let max = 1;
    // j从[0, j)依次求出可以和i组成的最长上升子序列
    for (let j = 0; j < i; j++) {
      let prevNum = nums[j];
      if (num > prevNum) {
        // 循环中不断更新max值
        max = Math.max(max, dp[j] + 1);
      }
    }
    dp[i] = max;
  }
  console.log(dp);
  return Math.max(...dp);
};
lengthOfLIS([0, 2, 0, 3, 1, 3]);

function changeArg(x) {
  if (typeof x === 'object') {
    x.name = 'a';
  } else {
    x = 200;
  }
}

let num = 100;
changeArg(num);
console.log('changeA', num);
let obj = { name: 's' };
changeArg(obj);
console.log('obj', obj);
let obj1 = { city: 's' };
changeArg(obj1);
console.log('obj1', obj1);
