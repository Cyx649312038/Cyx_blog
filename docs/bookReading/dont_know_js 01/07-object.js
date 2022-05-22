var str = '1111'
console.log(str instanceof String);//false  因为str只是一个字符串类型的字面量而不是对象，但在使用操作字符串的一些方法时即在必要时语言会自动把字符串字面量转换成一个 String 对象，也就是说你并不需要 显式创建一个对象
var str2 = new String()
console.log(str2 instanceof String) //true



var prefix = "foo";
var myObject = {
    [prefix + "bar"]:"hello",
    [prefix + "baz"]: "world"
};
console.log(myObject["foobar"],myObject["foobaz"],myObject.foobar);
// myObject["foobar"]; // hello
// myObject["foobaz"]; // world
// myObject.foobar  //hello

const sy1 = Symbol('sy')
const sy2 = Symbol('sy')
console.log(sy1,sy2);
const obj = {
    [sy1]: 'cc',
    [sy2]: 'qq'
}
console.log(obj[sy1],obj[sy2]);


var obj2 = {
    a:2
}
console.log(Object.getOwnPropertyDescriptor(obj2,'a'));
Object.defineProperty(obj2,'a', {
    value: 2,
    writable: false,
    configurable: true,
    enumerable: true
})
obj2.a = 3
console.log(obj2.a); //2


var myObj = {}
Object.defineProperty(myObj, 'a', {
    value: 25,
    writable: false,
    configurable: false
})
console.log(myObj.a);


var myObj2 = {
    a: 2
}
Object.preventExtensions(myObj2)
myObj2.a = 4
myObj2.b = 3
console.log(myObj2.b, myObj2.a);//undefined 4

// 闭包验证(自定义迭代器中的idx 及next里面操作的next不被回收就是利用了闭包的机制)
function f1 () {
    var index = 0
    return function f2 () {
        index += 1
        console.log(index);
    }
}
let f3 = f1()
f3(),f3(),f3()  //1,2,3

// 利用内置的@@iterator手动遍历数组
var myArray = [1,2,3]
var it = myArray[Symbol.iterator]
console.log('it.next()',it.next(),it.next(),it.next(),it.next());

