## 迭代器
### next迭代

```js
var arr = [1,2,3,4]
var it = arr[Symbol.iterator]()
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: false }
// { value: 4, done: false }
// { value: undefined, done: true }

var str = 'cyxtest'
var it2 = str[Symbol.iterator]()
console.log(it2.next());
console.log(it2.next());
// { value: 'c', done: false }
// { value: 'y', done: false }
// ...
```
:::tip
严格来说，基本值本身不是 iterable，但是感谢“封箱”技术，"hello world" 被强制转换 / 变换为 String 对象封装形式，而这是一个 iterable
:::
:::tip
JavaScript 中默认为(或提供)iterable 的标准内建值包括:
* Arrays
* Strings
* Generators
* Collections / TypedArrays
:::
ES6 中还包括几个新的称为集合(参见第 5 章)的数据结构。这些集合不仅本身是 iterable，还提供了 API 方法来产生迭代器，

### 可选的return（...）和throw(...)
多数内置迭代器都没有实现可选的迭代器接口——return(..) 和 throw(..)。然而，在生
成器的上下文中它们肯定是有意义的，参见 3.2 节获取更多信息。

return(..) 被定义为向迭代器发送一个信号，表明消费者代码已经完毕，不会再从其中提 取任何值。这个信号可以用于通知生产者(响应 next(..) 调用的迭代器)执行可能需要的 清理工作，比如释放 / 关闭网络、数据库或者文件句柄资源。

如果迭代器存在 return(..)，并且出现了任何可以自动被解释为异常或者对迭代器消耗的 提前终止的条件，就会自动调用 return(..)。你也可以手动调用 return(..)。

return(..) 就像 next(..) 一样会返回一个 IteratorResult 对象。一般来说，发送给 return(..) 的可选值将会在这个 IteratorResult 中作为 value 返回，但在一些微妙的情况 下并非如此。

throw(..) 用于向迭代器报告一个异常 / 错误，迭代器针对这个信号的反应可能不同于针对 return(..) 意味着的完成信号。和对于 return(..) 的反应不一样，它并不一定意味着迭代 器的完全停止。

例如，通过生成器迭代器，throw(..) 实际上向生成器的停滞执行上下文中插入了一个抛 出的异常，这个异常可以用 try..catch 捕获。未捕获的 throw(..) 异常最终会异常终止生 成器迭代器。

具体代码可以参考你不知道的js(中)生成器那一章

### 迭代器循环
ES6 的 for..of 循环直接消耗一个符合规范的 iterable。

如果一个迭代器也是一个 iterable，那么它可以直接用于 for..of 循环。你可以通过为迭代 器提供一个 Symbol.iterator 方法简单返回这个迭代器本身使它成为 iterable
```js

var it = {
// 使迭代器it成为iterable 
    [Symbol.iterator]() { return this; },
    next() { .. },
    .. 
};
it[Symbol.iterator]() === it; // true
// 现在可以用 for..of 循环消耗这个 it 迭代器:
for (var v of it) {
    console.log( v );
}
```
要彻底理解这样的循环如何工作，可以回顾一下第 2 章 for..of 循环的等价 for 形式:
```js
for (var v, res; (res = it.next()) && !res.done; ) {
    v = res.value;
    console.log( v );
}
```
如果认真观察的话，可以看到每次迭代之前都调用了 it.next()，然后查看一下 res.done。 如果 res.done 为 true，表达式求值为 false，迭代就不会发生。


回忆一下，前面我们建议迭代器一般不应与最终预期的值一起返回done: true。现在能明 白其中的原因了吧。(先检查状态是否为true再返回value)

如果迭代器返回{ done: true, value: 42 }，for..of循环会完全丢弃值42，那么这个 值就被丢失了。因为这个原因，假定你的迭代器可能会通过 for..of 循环或者手动的等价 for形式模式消耗，那么你应该等返回所有的相关迭代值之后，再返回done: true来标明 迭代完毕。

### 自定义迭代器
```js
var Fib = {
    [Symbol.iterator]() {
    var n1 = 1, n2 = 1;
    return {
        // 使迭代器成为iterable 
        [Symbol.iterator]() { return this; },
        next() {
            var current = n2;
            n2 = n1;
            n1 = n1 + current;
            return { value: current, done: false };
        },
        return(v) {
            console.log(
                "Fibonacci sequence abandoned."
            );
            return { value: v, done: true };
        }
    }; 
    }
};
for (var v of Fib) {
    console.log( v );
    if (v > 50) break;
}
// 1 1 2 3 5 8 13 21 34 55
// Fibonacci sequence abandoned.


var something = (function() {
    var nextVal
    return {
        // for...of循环需要这个
        //将 something 的值(迭代器 something 的接口)也构建成为一 个 iterable。现在它既是 iterable，也是迭代器。
        [Symbol.iterator]:function() {return this},
        // 标准迭代器接口方法
        next: function() {
            if(nextVal === undefined) {
                nextVal = 1
            } else {
                nextVal = (3 * nextVal)
            }
            if(nextVal > 500 ) {
                return {
                    done: true,
                    value: nextVal
                }
            }
            return {
                done: false,
                value: nextVal
            }
        }


    }
})()

for(var v of something) {
    console.log(v);
}
```
迭代对象Fib调用Fib[Symbol.iterator]() 方法的时候，会返回带有 next() 和 return(..) 方法的迭代器对象。通过放在闭包里的变量 n1 和 n2 维护状态。

### 迭代器消耗
前面已经展示了如何通过 for..of 循环一个接一个地消耗迭代器项目，但是还有其他 ES6结构可以用来消耗迭代器。
> spread 运算符 ... 完全消耗了迭代器
```js
var a = [1,2,3,4,5]
function foo(x,y,z,w,p) {
    console.log( x + y + z + w + p );
}
foo( ...a );            // 15
// ... 也可以把一个迭代器展开到一个数组中: 
var b = [ 0, ...a, 6 ];
b; // [0,1,2,3,4,5,6]
```
> 数组解构(参见 2.4 节)可以部分或完全(如果和 rest / gather 运算符 ... 配对使用的话)消耗一个迭代器:
```js
var it = a[Symbol.iterator]();
var [x,y] = it;
// 从it中获取前两个元素
var [z, ...w] = it;
// 获取第三个元素，然后一次取得其余所有元素
// it已经完全耗尽?是的。
it.next(); // { value: undefined, done: true }
x; // 1
y; // 2
z; // 3
w; // [4,5]
```

## 生成器
生成器部分具体可以看你不知道的js(中)生成器那章 这里只做一些不太熟悉的内容

yield 关键字的优先级很低，几乎 yield.. 之后的任何表达式都会首先计算，然后再 通过 yield 发送。只有 spread 运算符 ... 和逗号运算符 , 拥有更低的优先级，也就是说它们会在 yield 已经被求值之后才会被绑定。

```js
yield 2 + 3; // 等价于yield (2 + 3)
(yield 2) + 3; // 首先yield 2，然后+ 3
```
yield委托
```js
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}
function *bar() {
    var x = yield *foo();
    console.log( "x:", x );
}
for (var v of bar()) {
    console.log( v );
}
// 1 2 3 // x: 4
```

### 提前完成
```js
function *foo() {
    yield 1;
    yield 2;
    yield 3; 
}
var it = foo();
it.next();  // { value: 1, done: false }
it.return( 42 );  // { value: 42, done: true }
it.next();  // { value: undefined, done: true }
```
return(x)有点像强制立即执行一个return x，这样就能够立即得到指定值。一旦生成器 完成，或者正常完毕或者像前面展示的那样提前结束，都不会再执行任何代码也不会返回 任何值。

return(..) 除了可以手动调用，还可以在每次迭代的末尾被任何消耗迭代器的 ES6 构件自 动调用，比如 for..of 循环和 spread 运算符 ...。

这个功能的目的是通知生成器如果控制代码不再在它上面迭代，那么它可能就会执行清理 任务(释放资源、重置状态等)。和普通的函数清理模式相同，完成这一点的主要方式是 通过 finally 子句:

```js
function *foo() {
    try {
        yield 1;
        yield 2;
        yield 3;
    }
    finally {
        console.log( "cleanup!" );
    }
}
for (var v of foo()) {
    console.log( v );
}
// 1 2 3
// cleanup!
var it = foo();
    it.next();       // { value: 1, done: false }
it.return( 42 );     // cleanup!
                     // { value: 42, done: true }
```
> 提前终止
除了调用 return(..)，还可以调用 throw(..)。正如 return(x) 基本上就是在生成器中的当 前暂停点插入了一个 return x，调用 throw(x) 基本上就相当于在暂停点插入一个 throw x。

```js
function *foo() {
    yield 1;
    yield 2;
    yield 3; 
}
var it = foo();
it.next();  // { value: 1, done: false }
try {
    it.throw( "Oops!" );
}
catch (err) {
    console.log( err );  // Exception: Oops!
} 
it.next();    // { value: undefined, done: true }

```
因为throw(..)基本上就是在生成器yield 1这一行插入一个throw ..，没有处理这个异 常，所以它会立即传递回调用代码，其中通过 try..catch 处理了这个异常。

和 return(..) 不同，迭代器的 throw(..) 方法从来不会被自动调用。 当然，尽管没有在前面代码中展示，如果在调用 throw(..) 的时候有 try..finally 子句在

生成器内部等待，那么在异常传回调用代码之前 finally 子句会有机会运行。

## 模块
### 旧方法
传统的模块模式基于一个带有内部变量和函数的外层函数，以及一个被返回的“publicAPI”，这个“public API”带有对内部数据和功能拥有闭包的方法。通常这样表达:
```js
function Hello(name) {
    function greeting() {
        console.log( "Hello " + name + "!" );
    }
    // public API
    return {
        greeting: greeting
    };
}
var me = Hello( "Kyle" );
me.greeting();          // Hello Kyle!

```
其中常用的是异步模块定义(Asynchronous Module Definition，AMD)，还有一种是通用模 块定义(Universal Module Definition，UMD)。这里我们不会具体介绍这些模式和技术，但 网上有很多详尽的解释。
### es6模块
对于 ES6 来说，我们不再需要依赖于封装函数和闭包提供模块支持。ES6 中模块已经具备一等(first class)语法和功能支持。

在讨论具体语法细节之前，有一点很重要，就是要理解 ES6 模块和过去我们处理模块的方式之间的显著概念区别。

* ES6 使用基于文件的模块，也就是说一个文件一个模块。目前，还没有把多个模块合并 到单个文件中的标准方法。
这意味着如果想要把 ES6 模块直接加载到浏览器 Web 应用中，需要分别加载，而不是作 为一大组放在单个文件中加载。在过去，为了性能优化，后者这种加载方式是很常见的。 期待 HTTP/2 的到来能够显著消除所有这样的性能担忧，因为它运行在持久 socket 连接 上，所以能够高效并发、交替加载多个小文件。
* ES6 模块的 API 是静态的。也就是说，需要在模块的公开 API 中静态定义所有最高层导出， 之后无法补充。
某些应用已经习惯了提供动态 API 定义的能力，可以根据对运行时情况的响应增加 / 删 除 / 替换方法。这些用法或者改变自身以适应 ES6 静态 API，或者需要限制对二级对象 属性 / 方法的动态修改。
* ES6 模块是单例。也就是说，模块只有一个实例，其中维护了它的状态。每次向其他模 块导入这个模块的时候，得到的是对单个中心实例的引用。如果需要产生多个模块实例， 那么你的模块需要提供某种工厂方法来实现这一点。
* 模块的公开 API 中暴露的属性和方法并不仅仅是普通的值或引用的赋值。它们是到内 部模块定义中的标识符的实际绑定(几乎类似于指针)。
在前 ES6 的模块中，如果把一个持有像数字或者字符串这样的原生值的属性放在公开 API 中，这个属性赋值是通过值复制赋值，任何对于对应变量的内部更新将会是独立
的，不会影响 API 对象的公开复制。

对于 ES6 来说，导出一个局部私有变量，即使当前它持有一个原生字符串 / 数字等，导
 出的都是到这个变量的绑定。如果模块修改了这个变量的值，外部导入绑定现在会决议
到新的值。
* 导入模块和静态请求加载(如果还没加载的话)这个模块是一样的。如果是在浏览器环境中，这意味着通过网络阻塞加载;如果是在服务器上(比如 Node.js)，则是从文件系 统的阻塞加载。

  但是，不要惊慌于这里的性能暗示。因为 ES6 模块具有静态定义，导入需求可以静态 扫描预先加载，甚至是在使用这个模块之前。

  关于如何处理这些加载请求，ES6 并没有实际指定或处理具体机制。这里有一个独立的 模块加载器(Module Loader)的概念，其中每个宿主环境(浏览器、Node.js 等)提供 一个适合环境的默认加载器。导入模块时使用一个字符串值表示去哪里获得这个模块(URL、文件路径等)，但是这个值对于你的程序来说是透明的，只对加载器本身有意义。 如果需要提供比默认加载器更细粒度的控制能力可以自定义加载器，默认加载器基本上 没有粒度控制，因为它对于你的程序代码完全是不可见的。


> 关于CommonJS和ES6 Modules规范请参考下面链接

[关于CommonJS和ES6 Modules规范](https://zhuanlan.zhihu.com/p/27644026)

### 新方法
:::tip
这里有一个很容易被忽略的重要细节:import 和 export 都必须出现在使用 它们的最顶层作用域。举例来说，不能把 import 或 export 放在 if 条件中; 它们必须出现在所有代码块和函数的外面。
:::
> 导出

```js
// 导出的几种方式
export function foo() {
    // ..
}
export var awesome = 42;
var bar = [1,2,3];
export { bar };

 
var awesome = 42;
export { foo, awesome, bar };

```
这些都称为命名导出(named export)，因为导出变量 / 函数等的名称绑定。

在命名导出时还可以“重命名”(也即别名)一个模块成员:
```js
function foo() { .. }
export { foo as bar };
```
:::tip
模块导出不是像你熟悉的赋值运算符 = 那样只是值或者引用的普通赋值。实际上，导出的
是对这些东西(变量等)的绑定(类似于指针)。默认导出（export default）导出的有所不同
:::

```js
var a = 1, b = 3, c = 4
export default a;
a = 2;
export {b}
b = 4
// export {c as default}

c = 5

// 另一个文件引入
import c, {b} from './02-codeOrganization2.js'
console.log('a',a,'c',c,'b',b);  // a 1   b 4  c 5
```

尽管显然可以在模块定义内部多次使用 export，ES6 绝对倾向于一个模块使用一个 export，称之为默认导出(export default)。每个模块定义只能有一个 default

注意下面两种默认导出的细小区别
```js
// 1、
function foo(..) {
    // ..
}
export default foo;

// 2、
function foo(..) {
    // ..
}
export { foo as default };

```

:::tip
在第一段代码中，导出的是此时到函数表达式值的绑定，而不是标识符 foo(引用)。换句话说， export default ..接受的是一个表达式。如果之后在你的模块中给foo赋一个不同的值， 模块导入得到的仍然是原来导出的函数，而不是新的值。
第二段代码中，默认导出绑定实际上绑定到 foo 标识符而不是它的值，所以得 到了前面描述的绑定行为(也就是说，如果之后修改了 foo 的值，在导入一侧看到的值也 会更新)。
:::

用户可以用import * as ..(名字空间导入，下一小节将会介绍)方法来一次把所有命名导出API引入到某个名字空间中。

>导入

```js
// 导入某些特定命名导出
import { foo, bar, baz } from "foo";
// 你可以对导入绑定标识符重命名
import { foo as theFooFunc } from "foo";
theFooFunc();

```

如果这个模块只有一个你想要导入并绑定到一个标识符的默认导出，绑定时可以省略包围 的 { .. } 语法。
```js
import foo from "foo";
// 或者完整形式但这种用的不多:
import { default as foo } from "foo";
```
:::tip
前面一小节介绍过，模块的 export 中的关键字 default 指定了一个命名导 出，名称实际上就是 default，
:::

你还可以把默认导出与其他命名导出一起导入
```js
// 导出文件
 export default function foo() { .. }
export function bar() { .. }
export function baz() { .. }
// 导入文件
 import FOOFN, { bar, baz as BAZ } from "foo";
FOOFN();
bar();
BAZ();
```
导入所有模块
```js
// 导出文件
export function bar() { .. }
export var x = 42;
export function baz() { .. }
export default a = 3
// 导入文件
import * as foo from "foo";
// 或者（这种比较常用）
// import a , * as foo from "foo"
foo.bar();
foo.x;          // 42
foo.baz();
foo.default  //3

```
:::tip
如果通过 * as .. 导入的模块有默认导出，它在指定的命名空间中的名字就是 default。
:::

:::tip
所有导入的绑定都是不可变和 / 或只读的。
:::
```js
import foofn, * as hello from "world";
foofn = 42;
hello.default = 42  // (运行时)TypeError!;
hello.bar = 42;   // (运行时)TypeError!
hello.baz = 42;  // (运行时)TypeError!
```

作为 import 结果的声明是“提升的”
```js
// 合法
foo();
import { foo } from "foo";
```

import 最基本的形式是这样的
```js
import 'foo'
```
这种形式并没有实际导入任何一个这个模块的绑定到你的作用域。它加载(如果还没有加 载的话)、编译(如果还没有编译的话)，并求值(如果还没有运行的话)"foo" 模块。

### 模块依赖环

### 模块加载


## 类

### class
新的 ES6 类机制的核心是关键字 class，表示一个块，其内容定义了一个函数原型的成员。
```js
class Foo {
    constructor(a,b) {
    this.x = a;
    this.y = b; 
    }
    gimmeXY() {
        return this.x * this.y;
    } 
}
```
需要注意以下几点
* class Foo 表明创建一个(具体的)名为 Foo 的函数，与你在前 ES6 中所做的非常类似。
* constructor(..) 指定 Foo(..) 函数的签名以及函数体内容。
* 类方法使用第 2 章讨论过的对象字面量可用的同样的“简洁方法”语法。这也包含本章
前面讨论过的简洁生成器形式，以及 ES5 getter/setter 语法。但是，类方法是不可枚举的，
 而对象方法默认是可枚举的。
* 和对象字面量不一样，在 class 定义体内部不用逗号分隔成员!实际上，这甚至是不允
许的。

可以把前面代码中的 class 语法定义粗略理解为下面这个等价前 ES6 代码
```js
function Foo(a,b) {
    this.x = a;
    this.y = b;
}
Foo.prototype.gimmeXY = function() {
    return this.x * this.y;
}
```
注意!尽管 class Foo 看起来很像 function Foo()，但二者有重要区别。

* 由于前 ES6 可用的 Foo.call(obj) 不能工作，class Foo 的 Foo(..) 调用必须通过 new 来实现。
* function Foo是“提升的”(参见本系列《你不知道的JavaScript(上卷)》第一部分)， 而class Foo并不是;extends ..语句指定了一个不能被“提升”的表达式。所以，在 实例化一个 class 之前必须先声明它。
* 全局作用域中的class Foo创建了这个作用域的一个词法标识符Foo，但是和function Foo 不一样，并没有创建一个同名的全局对象属性。

因为 class 只是创建了一个同名的构造器函数，所以现有的 instanceof 运算符对 ES6 类 仍然可以工作。然而，ES6 引入了一种使用 Symbol.hasInstance(参见 7.3 节)自定义 instanceof 如何工作的方法。

### extends和super
ES6 类还通过面向类的常用术语 extends 提供了一个语法糖，用来在两个函数原型之间 建立 [[Prototype]] 委托链接——通常被误称为“继承”或者令人迷惑地标识为“原型 继承”:
```js
class Bar extends Foo {
    constructor(a,b,c) {
        super( a, b );
        this.z = c;
}
    gimmeXYZ() {
        return super.gimmeXY() * this.z;
    } 
}
var b = new Bar( 5, 15, 25 );  
```
还有一个重要的新增特性是 super,在构造器中，super 自动指向“父构造器”，在前面的例子中 就是 Foo(..)。在方法中，super 会指向“父对象”，这样就可以访问其属性 
:::tip
Bar extends Foo 的意思当然就是把 Bar.prototype 的 [[Prototype]] 连接到 Foo.prototype。 所以，在像 gimmeXYZ() 这样的方法中，super 具体指 Foo.prototype，而在 Bar 构造器中 super 指的是 Foo
:::

> super恶龙
```js

class ParentA {
    constructor() { this.id = "a"; }
    foo() { console.log( "ParentA:", this.id ); }
}
class ParentB {
    constructor() { this.id = "b"; }
    foo() { console.log( "ParentB:", this.id ); }
}
class ChildA extends ParentA {
    foo() {
        super.foo();
        console.log( "ChildA:", this.id );
    }
}
class ChildB extends ParentB {
    foo() {
        super.foo();
        console.log( "ChildB:", this.id );
    }
}
var a = new ChildA();
a.foo();
var b = new ChildB();
b.foo();
// ParentA: a
// ChildA: a
// ParentB: b
// ChildB: b

// 在a的上下文中借来b.foo()使用 
b.foo.call( a ); // ParentB: a
                // ChildB: a
```
可以看到，this.id引用被动态重新绑定，因此两种情况下都打印: a，而不是: b。但是 b.foo() 的 super.foo() 引用没有被动态重绑定，所以它仍然打印出 ParentB 而不是期望的 ParentA。

因为 b.foo() 引用了 super，它是静态绑定到 ChildB/ParentB 类层次的，而不能用在 ChildA / ParentA 类层次。ES6 并没有对这个局限提供解决方案。

> 子类构造器
对于类和子类来说，构造器并不是必须的;如果省略的话那么二者都会自动提供一个默认 构造器。但是，这个默认替代构造器对于直接类和扩展类来说有所不同。

具体来说，默认子类构造器自动调用父类的构造器并传递所有参数。换句话说，可以把默 认子类构造器看成下面这样:
```js
constructor(...args) {
    super(...args);
}
```
这是一个需要注意的重要细节。并不是在所有支持类的语言中子类构造器都会自动调用 父类构造器。C++ 会这样，Java 则不然。更重要的是，在前 ES6 的类中，并不存在这样 的自动“父类构造器”调用

另外一个 ES6 子类构造器或许是出乎意料的偏离 / 限制是:子类构造器中调用 super(..) 之后才能访问 this。其原因比较微妙复杂，但可以归结为创建 / 初始化你的实例 this 的实 际上是父构造器。前 ES6 中，它的实现正相反;this 对象是由“子类构造器”创建的，然 后在子类的 this 上下文中调用“父类”构造器。

```js
// 下面来说明一下。以下代码在前 ES6 中可以工作:
function Foo() {
    this.a = 1;
}
function Bar() {
    this.b = 2;
    Foo.call( this );
}
// `Bar` "extends" `Foo`
Bar.prototype = Object.create( Foo.prototype );
// 而这个等价 ES6 代码则不合法:
class Foo {
    constructor() { this.a = 1; }
}
class Bar extends Foo {
    constructor() {
    this.b = 2; // 不允许在super()之前
    super();  // 要改正的话可以交换这两条语句
    }
}
```
> 扩展原生类
新的 class 和 extend 设计带来的最大好处之一是(终于 !)可以构建内置类的子类了。比 如 Array。
```js
class MyCoolArray extends Array {
    first() { return this[0]; }
    last() { return this[this.length - 1]; }
}
var a = new MyCoolArray( 1, 2, 3 );
a.length; // 3
a; // [1,2,3]
a.first(); // 1 
a.last(); // 3
```
在 ES6 之前，有一个 Array 的伪“子类”通过手动创建对象并链接到 Array.prototype，只 能部分工作。它不支持真正 array 的特有性质，比如自动更新 length 属性。ES6 子类则可 以完全按照期望“继承”并新增特性!

其他还有Error对象等...

### new.target
ES6 以 new.target 的形式引入了一个新概念，称为元属性(meta property，参见第 7 章)。

new.target 是一个新的在所有函数中都可用的“魔法”值，尽管在一般函数中它通常是 undefined。在任何构造器中，new.target 总是指向 new 实际上直接调用的构造器，即使构 造器是在父类中且通过子类构造器用 super(..) 委托调用。

```js
class Foo {
    constructor() {
        console.log( "Foo: ", new.target.name );
    }
}
class Bar extends Foo {
    constructor() {
        super();
        console.log( "Bar: ", new.target.name );
    }
    baz() {
        console.log( "baz: ", new.target );
    } 
}
var a = new Foo();
// Foo: Foo
var b = new Bar();
// Foo: Bar <-- 遵循new调用点 // Bar: Bar
b.baz();
// baz: undefined
```
除了访问静态属性 / 方法(参见下一小节)之外，类构造器中的 new.target 元属性没有什 么其他用处。

如果 new.target 是 undefined，那么你就可以知道这个函数不是通过 new 调用的。因此如果需要的话可以强制一个 new 调用。

### static
```js
class Foo {
    static cool() { console.log( "cool" ); }
    wow() { console.log( "wow" ); }
}
class Bar extends Foo {
    static awesome() {
        super.cool();
        console.log( "awesome" );
    }
    neat() {
        super.wow();
        console.log( "neat" );
    }
}
Foo.cool();  // "cool"
Bar.cool();  // "cool"
Bar.awesome();  // "cool"
var b = new Bar();  // "awesome"
b.neat();  // "wow"  "neat"
b.awesome;  // undefined
b.cool;  // undefined
```