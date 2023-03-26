function debounce(fn, wait, immediate = false) {
  let timer = null, isFirstTime = false
  return function(...args){
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    if(immediate) {
      fn.apply(this, args)
      isFirstTime = true
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer)
      isFirstTime = false
      timer = null
    }, wait)
  }
}

function fn(){
  console.log('deb')
}

debounce(fn, 1000, true)()