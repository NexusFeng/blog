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

let arr = [4, 2, 1, 3];
for (let i = 0; i < arr.length - 1; i++) {
  if (arr[i] > arr[i + 1]) {
    let tmp = arr[i];
    arr[i] = arr[i + 1];
    arr[i + 1] = tmp;
  }
}
console.log(arr);

function Foo() {
  Foo.a = function () {
    console.log(1);
  };
  // this.a = function(){console.log(2)}
}

Foo.prototype.a = function () {
  console.log(3);
};
Foo.a = function () {
  console.log(4);
};

Foo.a();
let obj12 = new Foo();
obj12.a();
Foo.a();

let a = { n: 1 };
let b = a;
a.x = a = { n: 2 };

console.log(a);
console.log(b.x);

Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  })
  .then(() => {
    console.log(6);
  });

Promise.resolve().then(() => {
  console.log(0);
});

Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  });

Promise.resolve().then(() => {
  // 交替第一次处理
  let p = Promise.resolve(4);
  Promise.resolve().then(() => {
    // 交替第二次处理
    p.then((res) => {
      console.log(res);
    }).then(() => {
      console.log(6);
    });
  });
});
