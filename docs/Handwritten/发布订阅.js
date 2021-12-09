// 简易版
class EventEmitter {
  constructor() {
    this.events = {}
  }
  // 实现订阅
  on(type, callBack) {
    if(!this.events) this.events = Object.create(null)
    if(!this.events[type]) {
      this.events[type] = [callBack]
    } else {
      this.events[type].push(callBack)
    }
  }
  // 删除订阅
  off(type, callBack) {
    if(!this.events[type]) return 
    this.events[type] = this.events[type].filter(item => {
      return item !== callBack
    })
  }
  // 只执行一次订阅事件
  once(type, callBack) {
    function fn() {
      callBack()
      this.off(type, fn)
    }
    this.on(type, fn)
  }
  // 触发事件
  emit(type, ...rest) {
    this.events[type] && this.events[type].forEach(fn => fn.apply(this, rest))
  }
}
// 使用
const events = new EventEmitter()
const handle = (...rest) => {
  console.log(rest)
}
events.on('click', handle)

events.emit('click', 1,2,3,4)

events.off('click', 1,2)

events.emit('click', 1, 2)

events.once('dbClick', () => {
  console.log(123456)
})

events.emit('dbClick')
events.emit('dbClick')