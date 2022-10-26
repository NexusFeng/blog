Promise.retry = function (promiseFn, times = 3) {
  let count = 0;
  const fn = () => {
    promiseFn()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log('1');
        ++count === times ? console.error('Error:',err) : fn();
      });
  };
  fn();
};
function getProm() {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => (n > 0.9 ? resolve(n) : reject(n)), 1000);
  });
}
Promise.retry(getProm);
