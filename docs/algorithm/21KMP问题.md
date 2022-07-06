## 什么是KMP
KMP主要应用在字符串匹配上  
主要思想: **当出现字符串不匹配时,可以知道一部分已经匹配的文本内容,可以利用这些信息避免从头再去做匹配了**  
如何记录已经匹配的文本内容,是KMP的重点,也是next数组的重任
## 什么是前缀表(next数组)
前缀: 指不包含最后一个字符的所有以第一个字符开头的连续子串  
后缀: 指不包含第一个字符的所有以最后一个字符结尾的连续子串  
**前缀表是用来回退的,他记录了模式串与文本串不匹配的时候,模式串应该从哪里开始重新匹配**

## LeetCode 459 重复的子字符串
```js
var repeatedSubstringPattern = function(s) {
  if(s.length === 0) return false

  const getNext = s => {
    let next = []
    let j = -1

    next.push(j)

    for(let i = 1;i < s.length; i++) {
      while(j >= 0 && s[i] !== s[j + 1]){
        j = next[j]
      }
      if(s[i] === s[j + 1]) j++
      next.push(j)
    }

    return next
  } 

  let next = getNext(s)

  if(next[next.length - 1] !== -1 && s.length % (s.length - (next[next.length - 1] + 1)) === 0) return true
  return false
}
```