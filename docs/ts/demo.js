// 注释
function binarySearch1(arr, target) {
    var length = arr.length;
    if (length === 0)
        return -1;
    var startIndex = 0; // 开始位置
    var endIndex = length - 1; // 结束位置
    while (startIndex <= endIndex) {
        var midIndex = Math.floor((startIndex + endIndex) / 2);
        var midVal = arr[midIndex];
        if (target < midVal) {
            // 目标值较小,继续在左侧查找
            endIndex = midIndex - 1;
        }
        else if (target > midVal) {
            // 目标值较大,继续在右侧查找
            startIndex = midIndex + 1;
        }
        else {
            return midIndex;
        }
    }
    return -1;
}
var arr = [10, 20, 30, 40, 50, 60, 70];
var target = 20;
console.log(binarySearch1(arr, target));
