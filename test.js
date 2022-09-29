function num(str) {
  let arr = str.split(' ')
  if(arr.length < 2) return 0
  let set = new Set()
  for(let i = 0; i < arr.length; i++) {
    set.add(arr[i].toLowerCase())
  }
  return arr.length - set.size
}
console.log(num('dog cat DOG'))
