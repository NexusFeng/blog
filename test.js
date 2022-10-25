class Lazy {
  constructor(name) {
    this.tasks = []
    this.performTasks = []
    this.name = name
    setTimeout(() => {
      // this.next()
      this.perform()
    })
  }

  perform(){
    while(this.tasks.length) {
      this.performTasks.push(this.tasks.pop())
    }
    this.next()
  }

  next() {
    const task = this.performTasks.pop()
    if(task) task()
  }

  addStack() {
    const task = () => {
      console.log(`Hi! This is ${this.name}!`)
      this.next()
    }
    this.tasks.push(task)
    return this
  }

  eat(food) {
    const task = () => {
      console.log(`Eat ${food}`)
      this.next()
    }
    this.tasks.push(task)
    return this
  }

  sleep(second) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${second}!`)
        this.next()
      }, second*1000)
    }
    this.tasks.push(task)
    return this
  }

  sleepFirst(second) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${second}!`)
        this.next()
      }, second*1000)
    }
    this.tasks.unshift(task)
    return this
  }
}

function LazyMan(name){
  let lazyMan = new Lazy(name)
  lazyMan.addStack()
  return lazyMan
}

LazyMan('Hank').eat('dinner').eat('supper')