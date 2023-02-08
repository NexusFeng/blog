class EventEmitter {
  constructor(){
    this.events = {}
  }

  on(type, cb){
    if(!this.events) this.events = Object.create(null)
    if(!this.events[type]) {
      this.events[type] = [cb]
    } else {
      this.events[type].push(cb)
    }
  }

  off(type, cb) {
    if(!this.events[type]) return
    if(cb) {
      this.events[type] = this.events[type].filter(item => {
        item != cb
      })
    } else {
      delete this.events[type]
    }
  }

  emit(type, ...args) {
    this.events[type] && this.events[type].forEach(cb => {
      if(cb) {
        cb.apply(this, args)
        cb.isOnce && this.off(type, cb)
      }
    })
  }

  once(type, cb) {
    cb.isOnce = true
    this.on(type, cb)
  }

}

function parseQueryParams(url){
  return url.split('?')[1].split('&').reduce((target, cur) => {
    const [key, val] = cur.split('=')
    target[key] = val
    return target
  }, {})
}


const observer = new IntersectionObserver((entires, self) => {
  entires.forEach(entry => {
    if(entry.isIntersecting) {
      const {target} = entry
      const src = target.dataset.src
      target.src = src
      target.removeAttribute('data-src')
      self.unobserve(target)
    }
  })
})

imgs.forEach(img => {
  observer.observe(img)
})



class myPromise {
  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0
      const result = []
      for(let i = 0; i < promises.length; i++) {
        const cur = promises[i]
        Promise.resolve(item).then(res => {
          result[i] = res
          count++
          if(count === promises.length)
            resolve(result)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  static allSettled(promises){
    let count = 0
    let len = promises.length
    let result = []
    return new Promise((resolve, reject) => {
      if(!Array.isArray(promises)) {
        return reject(new Error('必须传入数组类型'));
      }
      promises.forEach((promise, idx) => {
        promise.then(res => {
          result[idx] = {
            status: 'fulfilled',
            value: res
          }
          count++
          if(count === len) resolve(result)
        }).catch(err => {
          result[idx] = {
            reason: err,
            status: 'rejected'
          }
          count++
          if(count === len) resolve(result)
        })
      })
    })
  }

  static any(promises) {
    return new Promise((resolve, reject) => {
      promises.then(resolve, reject)
    })
  }

  static race(promises) {
    const res = []
    return new Promise((resolve, reject) => {
      
    })
  }
}