const fs = require('fs')

// 创建写入流实例
const ws = fs.createWriteStream('./writeStream.txt', {flags: 'w', encoding: 'utf-8'})
console.log('写入流', ws);

ws.on('open', () => {
    console.log('文件打开');
})

ws.on('ready', () => {
    console.log('文件写入已准备状态');
})

ws.on('close', () => {
    console.log('文件关闭');
})

ws.write('helloworld1', (err) => {
    if(err) {
        console.log('err',err);
    } else {
        console.log('文件1流入完成');
    }
})
ws.write('helloworld2', (err) => {
    if(err) {
        console.log('err',err);
    } else {
        console.log('文件2流入完成');
    }
})

//文件写入完成
ws.end(() => {
    console.log('文件写入关闭');
})

// 执行顺序:
// 文件打开
// 文件写入已准备状态
// 文件流1入完成
// 文件流2入完成
// 文件写入关闭
// 文件关闭


