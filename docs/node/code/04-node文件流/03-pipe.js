const fs = require('fs')

const rs = fs.createReadStream('./book.pdf')
const ws = fs.createWriteStream('./bookCopy2.pdf')
rs.on('open', () => {
    console.log('读取文件流开始');
})
rs.on('data', (chunk) => {
    console.log('单批读取内容', chunk, chunk.length);
})
rs.on("close", () => {
    console.log('读取文件流结束');
})

// 从读的流通过管道直接流进写的流内
rs.pipe(ws)