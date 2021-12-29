/**
 * 修约算法,小数位不足则补0
 * @param num 目标数字
 * @param decimalPlaces 小数位数
 */
function evenRound(num, decimalPlaces) {
  let d = decimalPlaces || 0
  let m = Math.pow(10, d)
  let n = +(d ? num * m : num).toFixed(8)
  let i = Math.floor(n), f = n - i
  let e = 1e-8
  let r = (f > 0.5 - e && f < 0.5 + e) ?((i % 2 == 0) ? i : i + 1) : Math.round(n)
  let str = (d ? r / m : r).toString()
  let decimalArr = str.split('.')
  if ((decimalArr[1] && d > decimalArr[1].length) || (!decimalArr[1] && d > 0 )) {
    let decimal = decimalArr.length > 1? decimalArr[1].padEnd(d, '0'):('').padStart(d, '0') 
    return `${decimalArr[0]}.${decimal}`
  } else {
    return str
  }
}
/**
 * 注册文件
 */
const modulesFiles = require.context('./modules', true, /.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
 // 忽略第1个js
 const moduleName = modulePath.replace(/.\//, '').replace('.js', '')
 // 执行modulesFiles函数，返回一个对象{default: {// 文件内容}, _esModule: true}
 const value = modulesFiles(modulePath)
 modules[moduleName] = value.default
 return modules
}, {})



export default modules