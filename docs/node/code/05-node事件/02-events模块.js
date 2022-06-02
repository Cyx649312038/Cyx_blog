const events = require('events')
const fs = require('fs')
const ee = new events.EventEmitter()

fs.readFile('./hello.txt', {flag: 'r', encoding:'utf-8'}, (err,value) => {
    if(err) {
        console.log(err);
    } else {
        ee.emit('readSuccess', value)
    }
})

ee.on('readSuccess', (value) => {
    console.log('事件一', value);
})
ee.on('readSuccess', (value) => {
    console.log('事件二', value);
})
ee.on('readSuccess', (value) => {
    console.log('事件三', value);
})

// 可以自己定义一些事件类型然后选择在适当的时间去触发它， 利用内置的events模块可以增加代码的可读性，实现一些逻辑的分离