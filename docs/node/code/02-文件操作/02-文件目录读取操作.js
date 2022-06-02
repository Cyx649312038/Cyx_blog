const {fsRead, fsWrite} = require('./fsAction')
const fs = require('fs')
fs.readdir('../02-文件操作', (err, files) => {
    if(err) {
        console.log(err);
    } else {
        console.log(files);
        files.forEach( (async (item) => {
            const res = await fsRead(item)
            await fsWrite('./allConetnt.txt', res)
        }))
    }
})


