let longestPalindrome = function(s) {
  let n = s.length
  if (n < 2) {
    return s
  }

  let begin = 0
  let max = 1

  let spread = (start, end) => {
    while (s[start] === s[end] && start >= 0 && end < n) {
      let len = end - start + 1
      if (len > max) {
        max = len
        begin = start
      }
      start--
      end++
    }
  }

  for (let mid = 0; mid < n; mid++) {
    spread(mid, mid)
    // spread(mid, mid + 1)
  }
  return s.substr(begin, max)
}
console.log(longestPalindrome("babad"))
