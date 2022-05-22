##  代码块
```js
[] + {}; // "[object Object]"
{} + []; // 0
```

第一行代码中，{} 出现在 + 运算符表达式中，因此它被当作一个值(空对象)来处理。第
4 章讲过 [] 会被强制类型转换为 ""，而 {} 会被强制类型转换为 "[object Object]"。
但在第二行代码中，{} 被当作一个独立的空代码块(不执行任何操作)。代码块结尾不需 要分号，所以这里不存在语法上的问题。最后 + [] 将 [] 显式强制类型转换(参见第 4 章) 为 0。

## 对象解构
> 详情请参见本系列的 《你不知道的 JavaScript(下卷)》的“ES6 & Beyond”部分
{ .. }还可以用作函数命名参数(namedfunctionargument)的对象解构(objectdestructuring)， 方便隐式地用对象属性赋值:
```js
function foo({ a, b, c }) { // 不再需要这样:
    // var a = obj.a, b = obj.b, c = obj.c
    console.log( a, b, c );
}
foo( {
    c: [1,2,3],
    a: 42,
    b: "foo"
} );    // 42 "foo" [1, 2, 3]
```

## else if 和可选代码块
事实上 JavaScript 没有 else if，但 if 和 else 只包含单条语句的时候可以省略代码块的 { }
```js
if (a) doSomething( a );
else (b) doSomething( b );
```
所以我们经常用到的 else if 实际上是这样的:
```js
if (a) { 
    // ..
}
else {
    if (b) { 
    //..
    }
    else {
    //.. 
    }
}
```

## 运算符优先级
[运算符优先级](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

## 短路
对 && 和 || 来说，如果从左边的操作数能够得出结果，就可以忽略右边的操作数。我们将 这种现象称为“短路”(即执行最短路径)。

## ASI
有时 JavaScript 会自动为代码行补上缺失的分号，即自动分号插入(Automatic Semicolon
Insertion，ASI)。这也是为什么我们写代码可以省略分号的原因，因为这个机制帮我们加上了。

如果 JavaScript 解析器发现代码行可能因为缺失分号而导致错误，那么它就会自动补上分 号。并且，只有在代码行末尾与换行符之间除了空格和注释之外没有别的内容时，它才会 这样做。

## 错误
JavaScript 不仅有各种类型的运行时错误(TypeError、ReferenceError、SyntaxError 等)，它的语法中也定义了一些编译时错误。

在编译阶段发现的代码错误叫作“早期错误”(early error)。语法错误是早期错误的一种
(如 a = ,)(所有语法错误都是早期错误，程序有语法错误 则无法运行。)。另外，语法正确但不符合语法规则的情况也存在

这些错误在代码执行之前是无法用 try..catch 来捕获的，相反，它们还会导致解析 / 编译
失败。

## try..finally
finally 中的代码总是会在 try 之后执行，如果有 catch 的话则在 catch 之后执行。也可以
将 finally 中的代码看作一个回调函数，即无论出现什么情况最后一定会被调用。
```js
function foo() {
    try {
        return 42;
    }
    finally {
        console.log( "Hello" );
        console.log( "never runs" );
    }
}
console.log( foo() );
    // Hello
    // 42
```
> 这里return 42先执行，并将foo()函数的返回值设置为42。然后try执行完毕，接着执 行 finally。最后 foo() 函数执行完毕，console.log(..) 显示返回值。
try 中的 throw 也是如此:
```js
function foo() {
    try {
        throw 42; 
    }
    finally {
        console.log( "Hello" );
    }
    console.log( "never runs" );
}
console.log( foo() );
    // Hello
    // Uncaught Exception: 42
```
如果 finally 中抛出异常(无论是有意还是无意)，函数就会在此处终止。如果此前 try 中 已经有 return 设置了返回值，则该值会被丢弃:
```js
 function foo() {
    try {
        return 42;
    }
    finally {
        throw "Oops!";
        console.log( "never runs" );
    }
 }
console.log( foo() );
    // Uncaught Exception: Oops!

//continue 和 break 等控制语句也是如此:
for (var i=0; i<10; i++) {
    try {
        continue; 
    }
    finally {
        console.log( i );
    } 
}
// 0 1 2 3 4 5 6 7 8 9
```
finally 中的 return 会覆盖 try 和 catch 中 return 的返回值:
```js
function foo() {
    try {
        return 42;
    }
    finally {
// 没有返回语句，所以没有覆盖  
    } 
}
function bar() {
    try {
        return 42;
    }
    finally {
        // 覆盖前面的 
        return 
     }
}


function baz() {
    try {
        return 42;
    }
    finally {
// 覆盖前面的 
        return "Hello";
    } 
}
     foo();  // 42
     bar();  // undefined
     baz();  // Hello

```