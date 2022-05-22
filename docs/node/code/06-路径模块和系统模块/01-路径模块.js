const path = require('path')
const fs = require('fs')

console.log('path', path);

const p1 = path.resolve('cyx', 'test')
console.log(p1); ///Users/chenyongxin/Desktop/studycode/myNote/docs/node/code/06-路径模块和系统模块/cyx/test

const p2 = path.resolve('/', 'test')
console.log(p2); ///test

console.log(__dirname); //获取当前文件的目录  /Users/chenyongxin/Desktop/studycode/myNote/docs/node/code/06-路径模块和系统模块
console.log(__filename); ///Users/chenyongxin/Desktop/studycode/myNote/docs/node/code/06-路径模块和系统模块/01-路径模块.js
console.log(path.extname(__filename)); //.js

// 解析路径
console.log(path.parse(__filename));

// 更多path内置方法参考官网api