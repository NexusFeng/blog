function newSetInterval(fn, t){
  let timer = null
  function interval(){
    fn()
    timer = setTimeout(interval, t)
  }
  interval()
  return {
    cancel: () => {
      clearTimeout(timer)
    }
  }
}
function a() {
  console.log(1)
}
let time = newSetInterval(a, 2000)
setTimeout(() => {
  time.cancel()
}, 10000)