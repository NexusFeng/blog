function getRepititions(str) {
  if(!str) return 0
  let num = 0,set = new Set(),start=0,end = 0
  while(end < str.length){
    str[end] === str[start]?set.add(str[end]):start = end
    end++
    if(start+1==end && str[end] !== str[start]){
      num = Math.max(set.size, num)
      set.clear()
    }
    
  }
  return num
}

console.log(getRepititions('a'))