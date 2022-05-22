// 普通对象的[[prototype]]
const obj = {
    a:111
}
console.log(obj.__proto__); //object
// 屏蔽的第二种情况测试
var father = {
    name: 'cyx'
}
Object.defineProperty(father, 'name', {
    writable: false
})
var son = Object.create(father)
son.name = 'qq' // 修改失败

console.log(son.name, son.hasOwnProperty('name')); //false

Object.defineProperty(son,'name', {
    value: 'qq',
})
console.log(son.name, son.hasOwnProperty('name')); //qq true


//函数的prototype
function f1() {

}
console.log(f1.prototype, f1.prototype.constructor);  //{constructor: f1, __proto__} f1

// 关于判断两个对象之间是否通过[[prototype]]链关联
const obj1 = {
    a: 111
}
Object.defineProperty(obj1, 'b', {
    enumerable: false,
    value: 222
})
console.log(obj1.b); //222
const obj2 = Object.create(obj1)
console.log(obj1.isPrototypeOf(obj2));
console.log(Object.getPrototypeOf(obj2) === obj1);
console.log(obj2.__proto__, obj2.prototype); //{a:111} undefined
console.log(Object.prototype);
