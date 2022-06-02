元编程关注以下一点或几点:代码查看自身、代码修改自身、代码修改默认语言特性，以 此影响其他代码。

元编程的目标是利用语言自身的内省能力使代码的其余部分更具描述性、表达性和灵活性。
## 函数名称
你的代码在有些情况下可能想要了解自身，想要知道某个函数的名称是什么。
```js
function foo() {

}
console.log(foo.name); //foo

var bar = function() {

}
console.log(bar.name); //bar

var fn1 = function fn2() {

}
console.log(fn1.name); //fn2
```
## 元属性

## 公开符号
前面我们介绍了 ES6 新原生类型 symbol。除了在自己的程序中定义符号之外，
JavaScript 预先定义了一些内置符号，称为公开符号(Well-Known Symbol，WKS)。

定义这些符号主要是为了提供专门的元属性，以便把这些元属性暴露给 JavaScript 程序以
获取对 JavaScript 行为更多的控制。

### Symbol.iterator
Symbol.iterator 表示任意对象上的一个专门位置(属性)，语言机制自动在这个位置上寻找一个方法，这个方法构造一个迭代器来消耗这个对象的值。很多对象定义有这个符号的默认值。

然而，也可以通过定义 Symbol.iterator 属性为任意对象值定义自己的迭代器逻辑，即使 这会覆盖默认的迭代器。这里的元编程特性在于我们定义了一个行为特性，供 JavaScript 其他部分(也就是运算符和循环结构)在处理定义的对象时使用。
```js
var arr = [4,5,6,7,8,9];
for (var v of arr) {
console.log( v );
}
// 4 5 6 7 8 9
// 定义一个只在奇数索引值产生值的迭代器 
arr[Symbol.iterator] = function*() {
    var idx = 1;
    do {
        yield this[idx];
    } while ((idx += 2) < this.length);
};
for (var v of arr) {
    console.log( v );
}
// 5 7 9
```

## 代理
代理是一种由你创建的特殊的对象，它“封装”另一个普通对象——或者说挡在这个普通对象的前面。你可以在代理对象上注册特殊的处理函数(也就是 trap)，代理上执行各种操作的时候会调用这个程序。这些处理函数除了把操作转发给原始目标 / 被封装对象之外， 还有机会执行额外的逻辑
(也就是原对象一些默认的操作可以通过添加代理的方式使得这些操作在原本的逻辑上加上自己的一些逻辑(甚至可以覆盖原有的逻辑)然后再通过return转发回给原来的操作)

你可以在代理上定义的 trap 处理函数的一个例子是 get，当你试图访问对象属性的时候， 它拦截 [[Get]] 运算。考虑:
```js
var obj = { a: 1 },
handlers = {
    get(target,key,context) {
        // 注意:target === obj,
        // context === pobj
        console.log( "accessing: ", key );
        return Reflect.get(
            target, key, context
        );
    } 
},
pobj = new Proxy( obj, handlers );
obj.a; // 1
pobj.a;
// accessing: a
// 1
```
我们在 handlers(Proxy(..) 的第二个参数)对象上声明了一个 get(..) 处理函数命名方 法，它接受一个 target 对象的引用(obj)、key 属性名 ("a") 粗体文字以及 self/ 接收者 / 代理(pobj)。

在跟踪语句 console.log(..) 之后，我们把对 obj 的操作通过 Reflect.get(..)“转发”。 下一小节中会介绍 APIReflect，这里只要了解每个可用的代理 trap 都有一个对应的同名 Reflect 函数即可。

在目标对象 / 函数代理上可以定义的处理函数，以及它们如何 / 何时被触发的所有例子详情看书上列举

### 代理局限性
可以在对象上执行的很广泛的一组基本操作都可以通过这些元编程处理函数 trap。但有一
些操作是无法(至少现在)拦截的。比如，下面这些操作都不会 trap 并从代理 pobj 转发到目标 obj:
```js
var obj = { a:1, b:2 },
handlers = { .. },
pobj = new Proxy( obj, handlers );
typeof obj;
String( obj );
obj + "";
obj == pobj;
obj === pobj
```

### 可取消代理
```js
var obj = { a: 1 },
handlers = {
    get(target,key,context) {
    // 注意:target === obj,
    // context === pobj
    console.log( "accessing: ", key ); return target[key];
    } 
},
 { proxy: pobj, revoke: prevoke } =
    Proxy.revocable( obj, handlers );
    pobj.a;
    // accessing: a
    // 1
    // 然后: prevoke();
    pobj.a;
    // TypeError
```
可取消代理用 Proxy.revocable(..) 创建，这是一个普通函数，而不像 Proxy(..) 一样是构 造器。除此之外，它接收同样的两个参数:target 和 handlers。

一旦可取消代理被取消，任何对它的访问(触发它的任意 trap)都会抛出 TypeError。

## 使用代理
这些处理函数为元编程带来的好处是显而易见的。我们可以拦截(并覆盖)对象的几乎所 有行为，这意味着我们可以以强有力的方式扩展对象特性超出核心 JavaScript 内容。这里 将会通过几种模式实例来探索这些可能性。

### 代理在先
我们在前面介绍过，通常可以把代理看作是对目标对象的“包装”。在这种意义上，代理 成为了代码交互的主要对象，而实际目标对象保持隐藏 / 被保护的状态。

你可能这么做是因为你想要把对象传入到某个无法被完全“信任”的环境，因此需要为对 它的访问增强规范性，而不是把对象本身传入。
```js
var messages = [],
handlers = {
    get(target,key) { // 字符串值?
        if (typeof target[key] == "string") { // 过滤掉标点符号
        return target[key].replace( /[^\w]/g, "" );
        }
        // 所有其他的传递下去
        return target[key];
    },
    set(target,key,val) {
        // 设定唯一字符串，改为小写 
        if (typeof val == "string") {
            val = val.toLowerCase();
            if (target.indexOf( val ) == -1) {
                target.push(
                    val.toLowerCase()
        ); }
        }
        return true;
    } 
},
messages_proxy = new Proxy( messages, handlers );
// 其他某处: 
messages_proxy.push("heLLo...", 42, "wOrlD!!", "WoRld!!");
messages_proxy.forEach( function(val){
    console.log(val);
} );
// hello world
messages.forEach( function(val){
    console.log(val);
} );
// hello... world!!
```

### 代理在后
另外，我们也可以完全反转这个模式，让目标与代理交流，而不是代理与目标交流。这 样，代码只能与主对象交互。这个回退方式的最简单实现就是把 proxy 对象放到主对象的 [[Prototype]] 链中。
```js
 var handlers = {
    get(target,key,context) {
        return function() {
            context.speak(key + "!");
        }; 
    }
},
catchall = new Proxy( {}, handlers ),
greeter = {
    speak(who = "someone") {
        console.log( "hello", who );
    } 
};
// 设定greeter回退到catchall Object.setPrototypeOf( greeter, catchall );
greeter.speak();
greeter.speak( "world" );
greeter.everyone();
// hello someone
// hello world
// hello everyone!
```
这里直接与 greeter 而不是 catchall 交流。当我们调用 speak(..) 的时候，它在 greeter 上被找到并直接使用。但是当我们试图访问像 everyone() 这样的方法的时候，这个函数在 greeter 上并不存在。

默认的对象属性行为是检查 [[Prototype]] 链(参见本系列《你不知道的 JavaScript(上 卷)》第二部分)，所以会查看 catchall 是否有 everyone 属性。然后代理的 get() 处理函 数介入并返回一个用访问的属性名("everyone")调用 speak(..) 的函数。

这个模式称为代理在后(proxy last)，因为在这里代理只作为最后的保障。

### "No Such Property/Method"
有一个关于 JavaScript 的常见抱怨，在你试着访问或设置一个还不存在的属性时，默认情 况下对象不是非常具有防御性。你可能希望预先定义好一个对象的所有属性 / 方法之后， 访问不存在的属性名时能够抛出一个错误。代理在先或代理在后设计都可以。
```js
// 代理在前
var obj = {
    a: 1,
    foo() {
        console.log('a: ', this.a);
    }
}
var handlers = {
    get(target, key, context) {
        if(Reflect.has(target, key)) {
            return Reflect.get(target, key, context)
        }else {
            throw "No such property/method!"
        }
    },
    set(target, key, val, context) {
        if(Reflect.has(target, key)) {
            return Reflect.set(target, key, val, context)
        } else {
            throw "No such property/method!"
        }
    }
}
var pobj = new Proxy(obj, handlers)
console.log(pobj.a); //1
pobj.foo() //a: 1
console.log(pobj.b); //throw "No such property/method!"


// 代理在后
var handlers = {
    get() {
        throw "No such property/method!";
    },
    set() {
        throw "No such property/method!";
    } 
},
pobj = new Proxy( {}, handlers ),
obj = {
    a: 1, 
    foo() {
        console.log( "a:", this.a );
    }
};
// 设定obj回退到pobj Object.setPrototypeOf( obj, pobj );
obj.a = 3;
obj.foo();
obj.b = 4;
obj.bar();
// a: 3
// Error: No such property/method!
// Error: No such property/method!

//我们依赖于这样一个事实:如果 [[Get]] 或 [[Set]] 进入我们的 pobj 回退，此时这个动作已经遍历了整个 [[Prototype]] 链(关键！！)并且没有发 现匹配的属性。这时候我们可以自由抛出错误。
```

### 代理 hack [[Prototype]] 链
>实际上并不能创建一个真正的 [[Prototype]] 环，因为引擎会抛出错 误。但是可以用代理模拟!
```js
var handlers = {
    get(target,key,context) {
        if (Reflect.has( target, key )) {
            return Reflect.get(
                target, key, context
            );
        }
    // 伪环状[[Prototype]] 
        else {
            return Reflect.get(
                    target[
                        Symbol.for( "[[Prototype]]" )
                    ],
                    key,
                    context 
                );
        } 
    }
},
obj1 = new Proxy(
    {
        name: "obj-1",
        foo() {
            console.log( "foo:", this.name );
        } 
    },
    handlers ),
},
obj2 = Object.assign(
    Object.create( obj1 ),
    {
        name: "obj-2",
        bar() {
            console.log( "bar:", this.name );
            this.foo();
        }
    } 
);
// 伪环状[[Prototype]]链接
obj1[ Symbol.for( "[[Prototype]]" ) ] = obj2;
obj1.bar();
// bar: obj-1 <-- 通过代理伪装[[Prototype]] // foo: obj-1 <-- this上下文依然保留着
obj2.foo();
// foo: obj-2 <-- 通过[[Prototype]]
```
:::tip
在这个例子中，我们不需要代理 / 转发 [[Set]]，所以比较简单。要完整模拟 [[Prototype]]，需要实现一个 set(..) 处理函数来搜索 [[Prototype]] 链寻 找匹配的属性，并遵守其描述符特性(比如 set，可写的)。
:::
在前面的代码中，通过Object.create(..)语句obj2 [[Prototype]]链接到了obj1。而为 了创建反向(环)的链接，我们在 obj1 符号位置 Symbol.for("[[Prototype]]")(参见 2.13 节)处创建了属性。这个符号可能看起来有点特殊 / 神奇，但实际上并非如此。它只是给 我提供了一个方便的与我正在执行的任务关联的命名钩子，以便语义上引用。

然后，代理的 get(..) 处理函数首先查看这个代理上是否有请求的 key。如果没有，就手动把这个运算转发给保存在 target 的 Symbol.for("[[Prototype]]") 位置中的对象引用。

>不用环状 [[Prototype]]，用多个 [[Prototype]] 链接(也就是“多继承”)
```js
var obj1 = {
    name: "obj-1",
    foo() {
        console.log( "obj1.foo:", this.name );
    }, 
},
obj2 = {
    name: "obj-2",
    foo() {
        console.log( "obj2.foo:", this.name );
    }, 
    bar() {
            console.log( "obj2.bar:", this.name );
    }
},
handlers = {
    get(target,key,context) {
        if (Reflect.has( target, key )) {
            return Reflect.get(
                target, key, context
            ); 
        }
        // 伪装多个[[Prototype]] else {
        for (var P of target[Symbol.for( "[[Prototype]]" )]) {
            if (Reflect.has( P, key )) {
                return Reflect.get(P, key, context);
            } 
        }
    } 
}
},
obj3 = new Proxy(
    {
        name: "obj-3",
        baz() {
            this.foo();
            this.bar();
        }
    },
    handlers );
// 伪装多个[[Prototype]]链接
obj3[ Symbol.for( "[[Prototype]]" ) ] = [obj1, obj2 ];
obj3.baz();
// obj1.foo: obj-3
// obj2.bar: obj-3

```

## Reflect API
Reflect 对象是一个平凡对象(就像 Math)，不像其他内置原生值一样是函数 / 构造器。

它持有对应于各种可控的元编程任务的静态函数。这些函数一对一对应着代理可以定义的 处理函数方法(trap)。

可以使用下面这些工具访问 / 查看一个对象键:

Reflect.ownKeys(..)
返回所有“拥有”的(不是“继承”的)键的列表，就像 Object.getOwnPropertyNames (..) 和 Object.getOwnPropertySymbols(..) 返回的一样。关于键的顺序参见后面的“属 性排序”一节。

Reflect.enumerate(..)
返回一个产生所有(拥有的和“继承的”)可枚举的(enumerable)非符号键集合的迭 代器(参见本系列《你不知道的 JavaScript(上卷)》第二部分)。本质上说，这个键的 集合和 foo..in 循环处理的那个键的集合是一样的。关于键的顺序参见后面的“属性排 序”一节。

Reflect.has(..)
实 质 上 和 in 运 算 符 一 样， 用 于 检 查 某 个 属 性 是 否 在 某 个 对 象 上 或 者 在 它 的 [[Prototype]] 链上。比如，Reflect.has(o, "foo") 实质上就是执行 "foo" in o。

函数调用和构造器调用可以通过使用下面这些工具手动执行，与普通的语法(比如，(..) 和 new)分开 :

Reflect.apply(..)
举例来说，Reflect.apply(foo,thisObj,[42,"bar"]) 以 thisObj 作为 this 调用 foo(..) 函数，传入参数 42 和 "bar"。

Reflect.construct(..)
举例来说，Reflect.construct(foo,[42,"bar"]) 实质上就是调用 new foo(42,"bar")。

可以使用下面这些工具来手动执行对象属性访问、设置和删除。

Reflect.get(..) 举例来说，Reflect.get(o,"foo") 提取 o.foo。

Reflect.set(..)
举例来说，Reflect.set(o,"foo",42) 实质上就是执行 o.foo = 42。

Reflect.deleteProperty(..)
举例来说，Reflect.deleteProperty(o,"foo") 实质上就是执行 delete o.foo。

Reflect 的元编程能力提供了模拟各种语法特性的编程等价物，把之前隐藏的抽象操作暴 露出来。比如，你可以利用这些能力扩展功能和 API，以实现领域特定语言(DSL)。

## 特性测试
什么是特性测试?就是一种由你运行的用来判断一个特性是否可用的测试。有时候，这个 测试不只是为了测试特性是否存在，还是为了测试特性是否符合指定的行为规范——特性可能存在但却是有问题的

JavaScript 中最常用的特性测试是检查一个 API 是否存在，如果不存在的话，定义一个polyfill(参见第 1 章)。比如:
```js
if (!Number.isNaN) {
    Number.isNaN = function(x) {
        return x !== x;
    };
}
```
但是如何测试涉及新语法的特性呢?
```js
// 假设在不支持es6的环境中
try {
    a = () => {};
    ARROW_FUNCS_ENABLED = true;
}
catch (err) {
     // 到不了这前面编译都过不了
    ARROW_FUNCS_ENABLED = false;
}

try {
    // eval("(){}")  //存在性能问题你不知道的js（上）有解释过
    new Function("(){}")
} catch(err) {
    console.log('error',err); //这样可以到这
}

```

## 尾递归调用
