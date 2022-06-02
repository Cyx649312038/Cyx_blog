interface myType {
    x: number
    y: number
}
function f6(pt: myType) {

}
f6({
    x: 111,
    y: 222
})

// interface 和 type的区别
// 1、两者都能用来定义类型，几乎所有能用interface定义的类型都能用type定义

// 区别
// 拓展接口
interface Animal {
    name: string
}
interface Bear extends Animal {
    honey: boolean
}
const bear: Bear = {
    name: 'ccc',
    honey: false
}

type Animal2 = {
    name: string
}
type Bear2 = Animal2 & {
    honey: boolean
}
const bear2: Bear2 = {
    name: 'ccc',
    honey: true
}

//向现有的类型添加字段
interface myType2 {
    name: string
}
interface myType2 {
    age: number
}
const men: myType2 = {
    name: 'cyx',
    age: 25
}

// 会报错提示标识符“myType2”重复。
// type myType2 = {
//     name: string
// }
// type myType2 = {
//     age: number
// }