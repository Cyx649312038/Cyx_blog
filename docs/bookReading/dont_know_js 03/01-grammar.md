ES6 新增了很多新的语法形式，需要我们去熟悉。本章我们将会介绍这些新的语法 形式，看看它们提供了哪些新东西
## 块作用域声明
### let
和传统的var声明变量不同，不管出 现在什么位置，var 都是归属于包含它的整个函数作用域。let 声明归属于块作用域，但是 直到在块中出现才会被初始化。

在 let 声明 / 初始化之前访问 let 声明的变量会导致错误，而使用 var 的话这个顺序是无 关紧要的(除了代码风格方面)。

> let + for
```js
var funcs = [];
    for (let i = 0; i < 5; i++) {
        funcs.push( function(){
            console.log( i );
        } );
    }
funcs[3]();    // 3
```
for循环头部的let i不只为for循环本身声明了一个i，而是为循环的每一次迭代都重新 声明了一个新的 i。这意味着 loop 迭代内部创建的闭包封闭的是每次迭代中的变量，就像 期望的那样。

如果试验同样的代码，只把 var i 放在 for 循环头部，得到的结果就会是 5 而不是 3，因 为在外层作用域中只有一个 i，这个 i 被封闭进去，而不是每个迭代的函数会封闭一个 新的 i。

### const

### 块作用域函数
```js
{
foo(); // 可以这么做!
    function foo() {
        // ..
    } 
}
foo();  //ReferenceError
```

## spread/rest(...展开运算符)
```js
function foo(x,y,z) {
    console.log( x, y, z );
}
foo( ...[1,2,3] );               // 1 2 3
```

```js
var a = [2,3,4];
var b = [ 1, ...a, 5 ];
console.log( b ); // [1,2,3,4,5]
```

... 的另外一种常见用法基本上可以被看作反向的行为;与把一个值展开不同，... 把一系 列值收集到一起成为一个数组。考虑:
```js
function foo(x,y,...z) {
    console.log(x,y,z);
}
foo(1,2,3,4,5,6) //1 2 [ 3, 4, 5, 6 ]
foo(1,2,[3,4,5]) //1 2 [ [ 3, 4, 5 ] ]
```

:::tip
foo(..) 函数声明中的 ...args 通常称为“rest 参数”，因为这里是在收集其余的参数.
:::


这种用法最好的一点是，它为弃用很久的 arguments 数组——实际上它并不是真正的数 组，而是类似数组的对象——提供了一个非常可靠的替代形式。因为 args(或者随便你 给它起什么名字——很多人喜欢用 r 或 rest)是一个真正的数组，前 ES6 中有很多技巧 用来把 arguments 转变为某种我们可以当作数组来使用的东西，现在我们可以摆脱这些愚 蠢的技巧了。

## 默认参数值
```js
function foo(x = 11, y = 31) {
    console.log( x + y );
}
foo();// 42
foo( 5, 6 );// 11
foo( 0, 42 );// 42  <-- 丢了undefined
foo( 5 );// 36 
foo( 5, undefined );// 36  <-- 丢了undefined
foo( 5, null );// 5  <-- null被强制转换为0
foo( undefined, 6 );// 17
foo( null, 6 );// 6  <-- null被强制转换为0
```

> 默认值表达式
```js
function bar(val) {
    console.log( "bar called!" );
    return y + val;
}
function foo(x = y + 3, z = bar( x )) {
    console.log( x, z );
}
var y = 5;
foo();  // "bar called" 8,13
foo( 10 );  // "bar called" 10,15
y = 6;
foo( undefined, 10 ); // 9,10

```

注意函数声明中形式参数是在它们自己的作用域中(可以把它看 作是就在函数声明包裹的( .. )的作用域中)，而不是在函数体作用域中。这意味着在默 认值表达式中的标识符引用首先匹配到形式参数作用域，然后才会搜索外层作用域。

```js
var w = 1, z = 2;
    function foo( x = w + 1, y = x + 1, z = z + 1 ) {  // 注意z = z + 1这里
        console.log( x, y, z );
    }
foo();                   // ReferenceError
```

## 解构
```js
var [ a, b, c ] = [1,2,3];
var { x: x, y: y, z: z } = {
    x:4,
    y:5,
    z:6
};
console.log( a, b, c );              // 1 2 3
console.log( x, y, z );              // 4 5 6
```

### 对象属性赋值模式
```js
var { x: bam, y: baz, z: bap } = {
    x:4,
    y:5,
    z:6
};
console.log( bam, baz, bap );       // 4 5 6
console.log( x, y, z );             // ReferenceError
```

```js
var x = 10, y = 20;
[ y, x ] = [ x, y ];
console.log( x, y );                // 20 10
```

### 重复赋值
```js
var {a: X, a: { x: Y, y: Z } } = {a : {x: 1, y: 2}}
console.log(X, Y, Z); //{ x: 1, y: 2 } 1 2

var {a: X, a: Y, a: [Z]} = {a: [1]}
console.log(X,Y,Z); //[ 1 ] [ 1 ] 1
```

### 解构赋值表达式
```js
var o = { a:1, b:2, c:3 },
a, b, c, p;
p = { a, b, c } = o;
console.log( a, b, c );         // 1 2 3
p === o;                        // true


var o = [1,2,3],
a, b, c, p;
p = { a, b, c } = o;
console.log( a, b, c );  // 1 2 3 
p === o;  // true


var o = { a:1, b:2, c:3 },
p = [4,5,6],
a, b, c, x, y, z;
( {a} = {b,c} = o );
[x,y] = [z] = p;
console.log( a, b, c );  // 1 2 3
console.log( x, y, z );  // 4 5 4
 
```

## 更多用法

```js
var a = [1,2,3]
var [c,...d] = a
console.log(c,d); //1 [ 2, 3 ]
```

### 默认值赋值
```js
var [ a = 3, b = 6, c = 9, d = 12 ] = foo();
var { x = 5, y = 10, z = 15, w = 20 } = bar();
console.log( a, b, c, d );          // 1 2 3 12
console.log( x, y, z, w );          // 4 5 6 20


//bar {x:4, y: 5, z:6}中没有w 所以用默认赋值WW = 20
var { x, y, z, w: WW = 20 } = bar();
console.log( x, y, z, WW );         // 4 5 6 20

```

### 嵌套解构
关键理解 source -> target模式
```js
var a1 = [ 1, [2, 3, 4], 5 ];
var o1 = { x: { y: { z: 6 } } };
var [ a, [ b, c, d ], e ] = a1;
var { x: { y: { z: w } } } = o1;
console.log( a, b, c, d, e );// 1 2 3 4 5
console.log( w ); // 6

```

### 解构参数
```js
function foo( [ x, y ] ) {
    console.log( x, y );
}
foo( [ 1, 2 ] );  // 1 2
foo( [ 1 ] );  // 1 undefined
foo( [] );  // undefined undefined
// 参数的对象解构也是可以的:
function foo( { x, y } ) {
    console.log( x, y );
}
foo( { y: 1, x: 2 } );  // 2 1
foo( { y: 42 } );  // undefined 42
foo( {} );  // undefined undefined

```

```js
function f6({ x = 10 } = {}, { y } = { y: 10 }) {
    console.log( x, y );
}
f6();                               // 10 10
f6( {}, {} ); // 10 undefined
```

## 对象字面量扩展

### 简洁属性
```js
var x = 2, y = 3
o= {
    x,
    y 
};
```

### 简洁方法
```js
var o = {
    x: function(){
// .. 
    } ,
    y: function(){
        // ..
    } 
}

//es6中的写法
var o = {
    x() {
        //...
    },
    y() {
        //...
    },
}
```

>简洁方法意味着匿名函数表达式。
```js
var obj = {
    a: 1,
    something(x,y) {
        if(x > y) {
            return something(y,x)
        }
    }
}
obj.something(3,1) //ReferenceError: something is not defined
```
所以对于简洁方法能得出什么结论呢?它们简洁方便。但是应该只在不需要它们执行递 归或者事件绑定/解绑定的时候使用。否则的话，就按照老式的something: function something(..) 方法来定义吧。

### 计算属性名
```js
var prefix = "user_";
var o = {
    baz: function(..){ .. },
    [ prefix + "foo" ]: function(..){ .. },
    [ prefix + "bar" ]: function(..){ .. }
    ..
};
```

### 设定[[Prototype]]
```js
var o1 = { // ..
};
var o2 = {
    __proto__: o1,
// .. 
};

```
o2 通过普通的对象字面量声明，但是它也 [[Prototype]] 连接到了 o1。这里的 __proto__ 属性名也可以是字符串 "__proto__"，但是注意它不能是计算属性名结果(参见前一节)。
退一步讲，对 __proto__ 的使用是有争议的。它是 JavaScript 多年前的属性扩展，最后被 ES6 标准化，但似乎标准化得不情不愿。许多开发者认为不应该使用它。实际上，它是在 ES6 的“附录 B”中出现的，这一部分列出的都是 JavaScript 只因兼容性问题不得不标准 化的特性。

### super对象
```js
var o1 = {
    foo() {
        console.log('o1.foo');
    }
}

var o2 = {
    foo() {
        super.foo()
        console.log('o2.foo');
    }
}

Object.setPrototypeOf(o2,o1)
o2.foo()  //o1.foo  o2.foo
```
:::tip
super 只允许在简洁方法中出现，而不允许在普通函数表达式属性中出 现。也只允许以 super.XXX 的形式(用于属性 / 方法访问)出现，而不能以 super() 的形式出现
:::


## 模版字面量

## 箭头函数
不只是更短的语法，而是 this
```js
var obj = {
    f1: () => {
        // console.log(this);
        return this
    }
}
obj.f1() // {}
console.log(module.exports === this );  //true 
```
## for...of循环
ES6 在把 JavaScript 中我们熟悉的 for 和 for..in 循环组合起来的基础上，又新增了一个for..of 循环，在迭代器产生的一系列值上循环。

for..of 循环的值必须是一个 iterable，或者说它必须是可以转换 / 封箱到一个 iterable 对象 的值(参见本系列《你不知道的 JavaScript(中卷)》第一部分)。iterable 就是一个能够产 生迭代器供循环使用的对象。

我们来对比一下 for..of 和 for..in 以展示其中的区别:
```js
var a = ["a","b","c","d","e"];
for (var idx in a) {
    console.log( idx );
}
// 0 1 2 3 4
for (var val of a) {
    console.log( val );
}
// "a" "b" "c" "d" "e"
```
下面是前面代码中的前 ES6 版本的 for..of 形式:
```js
var a = ["a","b","c","d","e"],
k = Object.keys( a );
for (var val, i = 0; i < k.length; i++) {
    val = a[ k[i] ];
    console.log( val );
}
// "a" "b" "c" "d" "e"
```
这里是 ES6 的但是不用 for..of 的等价代码，也可以用来展示如何手动在迭代器上迭代
```js

for (var val, ret, it = a[Symbol.iterator]();
    (ret = it.next()) && !ret.done;
){
val = ret.value;
    console.log( val );
}
// "a" "b" "c" "d" "e"
```
:::tip
JavaScript 中默认为(或提供)iterable 的标准内建值包括:
* Arrays
* Strings
* Generators
* Collections / TypedArrays
:::

在for (XYZ of ABC)..中，和for以及for..in循环中的语句一样，XYZ语句可以是赋值 表达式也可以是声明。所以可以这么做:
```js

for (o.a of [1,2,3]) {
    console.log( o.a );
}
// 1 2 3
for ({x: o.a} of [ {x: 1}, {x: 2}, {x: 3} ]) {
    console.log( o.a );
}
// 1 2 3
```

和其他循环一样，for..of 循环也可以通过 break、continue、return(如果在函数中的 话)提前终止，并抛出异常。在所有这些情况中，如果需要的话，都会自动调用迭代器的 return(..) 函数(如果存在的话)让迭代器执行清理工作。


## 正则表达式新特性

## 数字字面量拓展
```js
// es6之前
var dec = 42,
    oct = 052, //42
    hex = 0x2a //42
console.log(dec, oct, hex);

Number( "42" );// 42
Number( "052" );// 52
Number( "0x2a" );// 42

// es6
var dec = 42,
    oct = 0o52,
    hex = 0x2a,
    bin = 0b101010;

Number( "42" ); //42
Number( "0o52" ); //42
Number( "0x2a" ); //42
Number( "0b101010" ); //42

var a = 42;
a.toString(); // "42"--也可以用a.toString( 10 )
a.toString( 8 ); // "52"
a.toString( 16 ); // "2a"
a.toString( 2 ); // "101010"

```

## Unicode

## 符号（Symbol）
ES6 为 JavaScript 引入了一个新的原生类型:symbol，这是很久没有发生过的事情。但是，和其他原生类型不一样，symbol 没有字面量形式。

```js
var sym = Symbol( "some optional description" );
typeof sym;     // "symbol"
```
以下几点需要注意。
* 不能也不应该对 Symbol(..) 使用 new。它并不是一个构造器，也不会创建一个对象。
* 传给 Symbol(..) 的参数是可选的。如果传入了的话，应该是一个为这个 symbol 的用途
 给出用户友好描述的字符串。
* typeof 的输出是一个新的值 ("symbol")，这是识别 symbol 的首选方法。

如果提供了描述的话，它只被用作为这个符号的字符串表示:

> sym.toString(); // "Symbol(some optional description)"

:::tip
符号的主要意义是创建一个类 ( 似 ) 字符串的不会与其他任何值冲突的值。
:::

可以在对象中直接使用符号作为属性名 / 键值，比如用作一个特殊的想要作为隐藏或者元 属性的属性。尽管通常会这么使用，但是它实际上并不是隐藏的或者无法接触的属性，了 解这一点很重要。
```js
var sy1 = Symbol('test')
var obj = {
    sy1: 'symbol测试'
}
console.log(obj.sy1, obj['sy1']); //'symbol测试'  'symbol测试'
```

### 符号注册
可以通过全局符号注册(global symbol registry) 创建这些符号值
```js
function HappyFace() {
    const INSTANCE = Symbol.for( "instance" );
    if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];
    function smile() { 

     }
    return HappyFace[INSTANCE] = {
        smile: smile
}; }
var me = HappyFace(),
you = HappyFace();
console.log(me === you); //true
```
Symbol.for(..) 在全局符号注册表中搜索，来查看是否有描述文字相同的符号已经存在， 如果有的话就返回它。如果没有的话，会新建一个并将其返回。换句话说，全局注册表把 符号值本身根据其描述文字作为单例处理。

但是，这也意味着只要使用的描述名称匹配，可以在应用的任何地方通过 Symbol.for(..) 从注册表中获取这个符号。


可以使用 Symbol.keyFor(..) 提取注册符号的描述文本(键值)
```js
var s = Symbol.for('test')
console.log(s);//Symbol(test)
var dec = Symbol.keyFor(s)
console.log(dec); // 'test'
// 再次从注册中取得符号
var s2 = Symbol.for( dec );
console.log(s === s2);   // true
```

### 作为对象属性的符号
如果把符号用作对象的属性 / 键值，那么它会以一种特殊的方式存储，使得这个属性不出
现在对这个对象的一般属性枚举中:
```js
var o = {
    foo: 42,
    [ Symbol( "bar" ) ]: "hello world",
    baz: true 
};
Object.getOwnPropertyNames( o );    // [ "foo","baz" ]
// 要取得对象的符号属性:
Object.getOwnPropertySymbols( o );  // [ Symbol(bar) ]
```
> 内置符号
S6 支持若干预先定义好的内置符号，它们可以暴露 JavaScript 对象值的各种元特性。但 是，这些符号并不是像一般设想的那样注册在全局符号表里。

相反，它们作为 Symbol 函数对象的属性保存。比如 2.9 节中介绍的 Symbol.iterator 值:
```js
var a = [1,2,3];
a[Symbol.iterator]; // 原生函数
```


