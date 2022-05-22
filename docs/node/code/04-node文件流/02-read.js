const fs = require('fs')

const rs = fs.createReadStream('./book.pdf')
const ws = fs.createWriteStream('./bookCopy.pdf')
rs.on('open', () => {
    console.log('读取文件流开始');
})
rs.on('data', (chunk) => {
    console.log('单批读取内容', chunk, chunk.length);
    ws.write(chunk)
})
rs.on("close", () => {
    console.log('读取文件流结束');
    ws.end()
})