从值的转换到数学计算，ES6 为各种内置原生类型和对象新增了很多静态属性和方法，用 来辅助完成一些常见的任务。另外，某些原生类型的实例通过新的原型方法有了新的功能。

## Array

### Array.of(...)
```js
var arr = Array(3)
console.log(arr.length,arr[2]); //3 undefined

var arr2 = Array.of(3)
console.log(arr2.length, arr2[0]); //1 3

var c = Array.of( 1, 2, 3 );
c.length;                       // 3
c;                              // [1,2,3]
```

### Array.from(...)
使用Array.from()将一个伪数组转换成一个真正的数组或者复制一个数组
```js
var arrLike = {
    length: 3,
    0: 'foo',
    1: 'bar'
}
var arr = Array.prototype.slice.call(arrLike)
console.log(arr); //[ 'foo', 'bar', <1 empty item> ]

var arr2 = arr.slice()  
console.log(arr2, arr === arr2); //[ 'foo', 'bar', <1 empty item> ]   false

var arr3 = Array.from(arrLike)
console.log(arr3);  //[ 'foo', 'bar', undefined ]

var arr4 = Array.from(arr3)
console.log(arr3, arr3 === arr4);  //[ 'foo', 'bar', undefined ]   false
```
> 避免空槽位

前面代码中的 arr2 和 Array.from(..) 调用的结果有一个微妙但重要的区别。也就 是 Array.from(..) 永远不会产生空槽位。
```js
var a = Array( 4 ); // 4个空槽位!
var b = Array.apply( null, { length: 4 } ); // 4个undefined值

var c = Array.from( { length: 4 } ); // 4个undefined值


var arr = []
arr.length = 5
arr[2] = 'wq'
console.log(arr);  //[ <2 empty items>, 'wq', <2 empty items> ]
arr.forEach(item => console.log(item)) //wq
var arr2 = Array.from(arr)
arr2.forEach(item => console.log(item)) //undefined undefined wq undefined undefined
```
:::tip
像前面代码中的 a 那样使用空槽位数组能在某些数组函数上工作，但是另外 一些会忽略空槽位(比如 map(..) 等)。永远不要故意利用空槽位工作，因为 它几乎肯定会导致程序出现诡异 / 意料之外的行为。
:::

> 映射

Array.from（...）有第二个参数和第三个参数
```js
var arrLike = {
    length: 4,
2: "foo" };
Array.from( arrLike, function mapper(val,idx){
    if (typeof val == "string") {
        return val.toUpperCase();
    }
    else {
        return idx;
} } );
// [ 0, 1, "FOO", 3 ]
```
和其他接收回调的数组方法一样，Array.from(..) 接收一个可选的第三个参 数，如果设置了的话，这个参数为作为第二个参数传入的回调指定 this 绑 定。否则，this 将会是 undefined。

### 创建数组和子类型

### 原型方法copyWitnin(...)
参数是 target(要复制到的索引)、start(开始复制的源索引，包括在内)以及可选的 end (复制结束的不包含索引)。如果任何一个参数是负数，就被当作是相对于数组结束的相
对值。
```js
[1,2,3,4,5].copyWithin( 3, 0 );// [1,2,3,1,2]
[1,2,3,4,5].copyWithin( 3, 0, 1 );// [1,2,3,1,5]
[1,2,3,4,5].copyWithin( 0, -2 );// [4,5,3,4,5]
[1,2,3,4,5].copyWithin( 0, -2, -1 );// [4,2,3,4,5]
```
### 原型方法fill(...)
```js
var a = Array( 4 ).fill( undefined );
a;                  // [undefined,undefined,undefined,undefined

```
fill(..) 可选地接收参数 start 和 end，它们指定了数组要填充的子集位置，比如: 
```js
var a = [ null, null, null, null ].fill( 42, 1, 3 );
a;                  // [null,42,42,null]
```
### 原型方法 find(..)
```js
// 这种方式的缺点是如果找到匹配的值的时候，只能得到匹配的 true/false 指示，而无法
// 得到真正的匹配值本身
var a = [1,2,3,4,5];
a.some( function matcher(v){
    return v == "2";
} ); // true
a.some( function matcher(v){
    return v == 7;
} ); // false

// ES6 的 find(..) 解决了这个问题。基本上它和 some(..) 的工作方式一样，除了一旦回调
//  返回 true/ 真值，会返回实际的数组值
var a = [1,2,3,4,5];
a.find( function matcher(v){
    return v == "2";
} );  // 2
a.find( function matcher(v){
    return v == 7;
});  // undefined
```

### 原型方法 findIndex(..)
indexOf(..) 会匹配的元素索引值，但是无法控制匹配逻辑(关键!);它总是使用 === 严格相等。所以 ES6
的 findIndex(..) 才是解决方案:
```js
var points = [
    { x: 10, y: 20 },
    { x: 20, y: 30 },
    { x: 30, y: 40 },
    { x: 40, y: 50 },
    { x: 50, y: 60 }
];
points.findIndex( function matcher(point) {
    return (
        point.x % 3 == 0 &&
        point.y % 4 == 0
    );
} );  // 2

points.findIndex( function matcher(point) {
    return (
        point.x % 6 == 0 &&
        point.y % 7 == 0
    );
} );  // -1

```
不要使用findIndex(..) != -1(这是indexOf(..)的惯用法)从搜索中得到布尔值，因 为some(..)已经yield出你想要的true/false。也不要用a[ a.findIndex(..) ]来得到 匹配值，因为这是 find(..) 所做的事。最后，如果需要严格匹配的索引值，那么使用 indexOf(..);如果需要自定义匹配的索引值，那么使用 findIndex(..)。

### 原型方法 entries()、values()、keys()
因为 Array 对于 ES6 来说已经不是新的了，所以从传统角度来说，它可能不会被看作是 “集合”，但是它提供了同样的迭代器方法 entries()、values() 和 keys()，从这个意义上
说，它是一个集合
```js
var a = [1,2,3];
[...a.values()]; // [1,2,3]
[...a.keys()];  // [0,1,2]
[...a.entries()];  // [ [0,1], [1,2], [2,3] ]
[...a[Symbol.iterator]()];  // [1,2,3]
```

## Object

### 静态函数 Object.is(..)
Object.is(..) 调 用 底 层 SameValue 算 法(ES6 规 范，7.2.9 节 )。SameValue 算 法 基 本 上 和
=== 严格相等比较算法一样(ES6 规范，7.2.13 节)，但有两个重要的区别。
```js
// 比 === 比较更严格的值比较
var x = NaN, y = 0, z = -0;
x === x;  // false
y === z;  // true
Object.is( x, x );  // true
Object.is( y, z );  // false
```
你应该继续使用 === 进行严格相等比较;不应该把 Object.is(..) 当作这个运算符的替代。 但是，如果需要严格识别 NaN 或者 -0 值，那么应该选择 Object.is(..)。

### 静态函数 Object.getOwnPropertySymbols(..)
```js
var o = {
    a: 1,
    [Symbol('bar')]: 'cyx',
    b: 2
}
console.log(Object.getOwnPropertySymbols(o));  //[ Symbol(bar) ]
```

### 静态函数 Object.setPrototypeOf(..)
```js
// 把o2的__proto__指向o1
var o1 = {
    foo() {
        console.log('o1->foo');
    }
}
var o2 = {}
Object.setPrototypeOf(o2, o1)
o2.foo() //o1->foo
console.log(o2.__proto__);  //{ foo: [Function: foo] }
```

### 静态函数 Object.assign(..)
ES6 新增了 Object.assign(..)，这是把一个对象的属性复制 / 混合到另一个对象中的简化版本。第一个参数是 target，其他 传入的参数都是源，它们将按照列出的顺序依次被处理。对于每个源来说，它的可枚举 和自己拥有的(也就是不是“继承来的”)键值，包括符号都会通过简单 = 赋值被复制。 Object.assign(..) 返回目标对象。
```js
var target = {},
    o1 = { a: 1 }, o2 = { b: 2 },
    o3 = { c: 3 }, o4 = { d: 4 };
// 设定只读属性 
Object.defineProperty( o3, "e", {
    value: 5,
    enumerable: true,
    writable: false,
    configurable: false
} );
// 设定不可枚举属性 
Object.defineProperty( o3, "f", {
    value: 6,
    enumerable: false
} );
o3[ Symbol( "g" ) ] = 7;
// 设定不可枚举符号
Object.defineProperty( o3, Symbol( "h" ), {
    value: 8,
    enumerable: false
} );
Object.setPrototypeOf( o3, o4 );
// 只有属性 a、b、c、e 以及 Symbol("g") 会被复制到 target 中:
Object.assign( target, o1, o2, o3 );
target.a; //1
target.b; //2
target.c; //3
Object.getOwnPropertyDescriptor( target, "e" );
// { value: 5, writable: true, enumerable: true,
//   configurable: true }
Object.getOwnPropertySymbols( target );
// [Symbol("g")]

```
复制过程会忽略属性 d、f 和 Symbol("h");不可枚举的属性和非自有的属性都被排除在赋 值过程之外。另外，e 作为一个普通属性赋值被复制，而不是作为只读属性复制。

## Math

## Number

### 静态属性
ES6 新增了一些作为静态属性的辅助数字常量:
```js
Number.EPSILON
// 任意两个值之间的最小差:2^-52(参见本系列《你不知道的 JavaScript(中卷)》第一 部分的第 2 章，其使用了这个值作为浮点数算法的精度误差值)
Number.MAX_SAFE_INTEGER
// JavaScript 可以用数字值无歧义“安全”表达的最大整数:2^53 - 1
Number.MIN_SAFE_INTEGER
// JavaScript 可以用数字值无歧义“安全”表达的最小整数:-(2^53 - 1) 或 (-2)^53 + 1
```

### 静态函数 Number.isNaN(..)
标准全局工具 isNaN(..) 自出现以来就是有缺陷的，它对非数字的东西都会返回 true，而
不是只对真实的 NaN 值返回 true，因为它把参数强制转换为数字类型(可能会错误地导致NaN)。ES6 增加了一个修正工具 Number.isNaN(..)，可以按照期望工作:
```js
var a = NaN, b = "NaN", c = 42;
isNaN( a );  // true
isNaN( b ); // true--oops!
isNaN( c );  // false
Number.isNaN( a );  // true
Number.isNaN( b );  // false--修正了! 
Number.isNaN( c );  // false
```

### 静态函数 Number.isFinite(..)
isFinite() 函数可确定数字是否是有限的合法数字,标准的全局 isFinite(..) 会对参数进行强制类型转换，但是 Number.isFinite(..) 会略去
这种强制行为:
```js
var a = "42";
isFinite( a );                    // true
Number.isFinite( a );             // false
```

### 整型相关静态函数
JavaScript 的数字值永远都是浮点数(IEE-754)。要检查一个值是否为整形需要检查其小数部分是不是不为0(在 JavaScript 中，4、4.、4.0 或者 4.0000 之间并没有区别。所有这些都会被 当作“整型”并且从 Number.isInteger(..) 中返回 true)

最简单的实现方法通常是:
```js
x === Math.floor( x );
```
ES6 新增了一个辅助工具 Number.isInteger(..) ，这个工具可能会更有效地确定这个性质
```js
Number.isInteger( 4 );              // true
Number.isInteger( 4.2 );            // false
```
另外，Number.isInteger(..) 会过滤掉 x === Math.floor(x) 可能会搞混的明显非整数值 :
```js
Number.isInteger( NaN ); // false
Number.isInteger( Infinity );       // false
```
## 字符串
### 静态函数 String.raw(..)
```js
var str = "bc";
String.raw`\ta${str}d\xE9`;
// "\tabcd\xE9", 而不是" abcdé"
```

### 原型函数 repeat(..)
```js
"foo".repeat( 3 ); // "foofoofoo
```

### 字符串检查函数
除了 ES6 之前的 String#indexOf(..) 和 String#lastIndexOf(..)，又新增了 3 个用于搜索 /
检查的新方法:startsWith(..)、endsWidth(..) 和 includes(..)。
```js
var palindrome = "step on no pets";  
palindrome.startsWith( "step on" );  // true
palindrome.startsWith( "on", 5 );  // true
palindrome.endsWith( "no pets" );  // true
palindrome.endsWith( "no", 10 );// true
palindrome.includes( "on" );// true
palindrome.includes( "on", 6 ); //false
 





```