var a = 1
var b = 2

console.log('导入我会运行几次呢');  //模块中的代码仅在模块第一次被导入时执行一次
// exports = {}// 默认初始exports和module指向同一块地址 如果前面改变了exports的指向则exports导出的内容将失效
exports.a = a
module.exports.b = b  
// module.exports = {c: '我才是默认的导出对象'}  //系统真正的默认导出对象是module.exports


// 综上
// 1、使用exports导出时只能导出单个属性(不能改变原exports的引用)，而使用module.exports导出时可以导出对象

