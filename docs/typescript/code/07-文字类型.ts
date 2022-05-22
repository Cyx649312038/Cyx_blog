let str: 'hello' = 'hello'
//  str = 'world' //不能将类型“"word"”分配给类型“"hello"”
function printText(s: string, alignment: 'left' | 'right' | 'center') {

}
printText('77', 'center')
// printText('77','11') //类型“"11"”的参数不能赋给类型“"left" | "right" | "center"”的参数。

function fn1(a: number, b: number): -1 | 0 | 1 {
    return a - b > 0 ? -1 : a - b < 0 ? 1 : 0
}

interface Option {
    width: number
}
function configer(x: Option | 'auto') {

}
configer('auto')
configer({ width: 200 })

let a: true = true
let b: false = false

const obj2 = {
    url: 'xxxx',
    method: 'GET'
    // method: 'GET' as 'GET'
    // }
} as const
function myRequest(url: string, method: 'GET' | 'POST') {

}
myRequest(obj2.url, obj2.method)//类型“string”的参数不能赋给类型“"GET" | "POST"”的参数
// myRequest(obj2.url, obj2.method as 'GET')
