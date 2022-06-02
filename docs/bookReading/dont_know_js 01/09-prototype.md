JavaScript 中的对象有一个特殊的 [[Prototype]] 内置属性，其实就是对于其他对象的引用。几乎所有的对象在创建时 [[Prototype]] 属性都会被赋予一个非空的值。
一般用字面量创建的对象[[prototype]]指向object的prototype
:::tip
注意此书中的[[prototype]]即我们平常所说的__proto__,只不过在主流的浏览器中，都用__proto__来代表[[prototype]]属性

关于[[prototype]] 和 prototype的关系可以看下面文章

:::
[[[prototype]] 和 prototype](https://zhuanlan.zhihu.com/p/92894937)

## 屏蔽
myObject.foo = "bar";

foo 不直接存在于 myObject 中而是存在于原型链上层时 myObject.foo = "bar" 会出现的三种情况。

1. 如果在[[Prototype]]链上层存在名为foo的普通数据访问属性(参见第3章)并且没 有被标记为只读(writable:false)，那就会直接在 myObject 中添加一个名为 foo 的新 属性，它是屏蔽属性。
2. 如果在[[Prototype]]链上层存在foo，但是它被标记为只读(writable:false)，那么 无法修改已有属性或者在 myObject 上创建屏蔽属性。如果运行在严格模式下，代码会 抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
3. 如果在[[Prototype]]链上层存在foo并且它是一个setter(参见第3章)，那就一定会 调用这个 setter。foo 不会被添加到(或者说屏蔽于)myObject，也不会重新定义 foo 这 个 setter。
:::tip
注意第二个情况限制只存在于 = 赋值中，使用 Object. defineProperty(..) 并不会受到影响。
:::
有些情况下会隐式产生屏蔽
```js
var anotherObject = { 
    a:2
};
var myObject = Object.create( anotherObject );
anotherObject.a; // 2
myObject.a; // 2
anotherObject.hasOwnProperty( "a" ); // true
myObject.hasOwnProperty( "a" ); // false
myObject.a++; // 隐式屏蔽! anotherObject.a; // 2
myObject.a; // 3
myObject.hasOwnProperty( "a" ); // true
```
> 尽管 myObject.a++ 看起来应该(通过委托)查找并增加 anotherObject.a 属性，但是别忘 了 ++ 操作相当于 myObject.a = myObject.a + 1。因此 ++ 操作首先会通过 [[Prototype]] 查找属性 a 并从 anotherObject.a 获取当前属性值 2，然后给这个值加 1，接着用 [[Put]] 将值 3 赋给 myObject 中新建的屏蔽属性 a(上面三种情况的第一种)

## “类”
Js并没有类来作为对象的抽象模式,Js只有对象.多年以来，JavaScript 中有一种奇怪的行为一直在被无耻地滥用，那就是模仿类.这种奇怪的“类似类”的行为利用了函数的一种特殊特性:所有的函数默认都会拥有一个名为 prototype 的公有并且不可枚举(参见第 3 章)的属性，它会指向另一个对象

Foo.prototype 默认(在代码中第一行声明时!)有一个公有并且不可枚举(参见第 3 章) 的属性 .constructor，这个属性引用的是对象关联的函数(本例中是 Foo)

```js
function Foo() { // ...
}
Foo.prototype; // { }
```

new一个新对象发生的过程: 
1. 创建(或者说构造)一个全新的对象。
2. 这个新对象会被执行[[prototype]]连接（将新对象的__proto__关联到构造函数的prototype上）。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

## (原型)继承
下面是一种典型的“原型风格”
```js
function Foo(name) { 
    this.name = name;
}
Foo.prototype.myName = function() { 
    return this.name;
};
function Bar(name,label) { 
    Foo.call( this, name ); 
    this.label = label;
}
// 我们创建了一个新的 Bar.prototype 对象并关联到 Foo.prototype 
Bar.prototype = Object.create( Foo.prototype );
// 注意!现在没有 Bar.prototype.constructor 了 // 如果你需要这个属性的话可能需要手动修复一下它
Bar.prototype.myLabel = function() { 
    return this.label;
};
var a = new Bar( "a", "obj a" );
a.myName(); // "a"
a.myLabel(); // "obj a"
```
注意，下面这两种方式是常见的错误做法，实际上它们都存在一些问题:

// 和你想要的机制不一样! Bar.prototype = Foo.prototype; 当你执行类似 Bar.prototype.myLabel = ... 的赋值语句时会直接修改 Foo.prototype 对象本身

// 基本上满足你的需求，但是可能会产生一些副作用 : Bar.prototype = new Foo();如果函数 Foo 有一些副作用(比如写日志、修改状态、注 册到其他对象、给 this 添加数据属性，等等)的话，就会影响到 Bar() 的“后代”，后果 不堪设想。

es6之后添加了辅助函数Object.setPrototypeOf()来修改对象的[[prototype]]关联我们来对比一下两种把 Bar.prototype 关联到 Foo.prototype 的方法:
```js
// ES6 之前需要抛弃默认的 Bar.prototype
    Bar.ptototype = Object.create( Foo.prototype );
// ES6 开始可以直接修改现有的 Bar.prototype 
    Object.setPrototypeOf( Bar.prototype, Foo.prototype );

```

## 检查“类”关系

```js
function Foo() { // ...
}
Foo.prototype.blah = ...
var a = new Foo();
a instanceof Foo; // true
```
:::tip
instanceof 操作符的左操作数是一个普通的对象，右操作数是一个函数。instanceof 回答
的问题是:在 a 的整条 [[Prototype]] 链中是否有指向 Foo.prototype 的对象?
:::

但如何判断两个对象之间是否通过[[prototype]]链关联

一种不是很合理的方法: 
```js
// 用来判断 o1 是否关联到(委托)o2 的辅助函数 
function isRelatedTo(o1, o2) {
    function F(){} 
    F.prototype = o2; 
    return o1 instanceof F;
}
var a = {};
var b = Object.create( a ); 
isRelatedTo( b, a ); // true
```
第二种
```js
b.isPrototypeOf(a) //true  a的整条原型链中是否出现过b注意不要搞反了
```
第三种
```js
Object.getPrototypeOf( a ) === b; // true
```
第四种
```js
a.__proto__ === b; // true
```
:::tip
和我们之前说过的 .constructor 一样，.__proto__ 实际上并不存在于你正在使用的对象中 (本例中是 a)。实际上，
它和其他的常用函数(.toString()、.isPrototypeOf(..)，等等)一样，存在于内置的 Object.prototype 中。(它们是不可枚举的，参见第 2 章。) 此外，.__proto__ 看起来很像一个属性，但是实际上它更像一个 getter/setter。.__proto__ 的实现大致上是这样的
:::
```js
Object.defineProperty( Object.prototype, "__proto__", { 
    get: function() {
        return Object.getPrototypeOf( this ); 
    },
    set: function(o) {
        // ES6 中的 setPrototypeOf(..) 
        Object.setPrototypeOf( this, o ); 
        return o;
        } 
} );
```
>因此，访问(获取值)a.__proto__ 时，实际上是调用了 a.__proto__()(调用 getter 函 数)。虽然 getter 函数存在于 Object.prototype 对象中，但是它的 this 指向对象 a(this 的绑定规则参见第 2 章)，所以和 Object.getPrototypeOf( a ) 结果相同。

## 对象关联
通常来说，这个链接的作用是:如果在对象上没有找到需要的属性或者方法引用，引擎就 会继续在 [[Prototype]] 关联的对象上进行查找。同理，如果在后者中也没有找到需要的 引用就会继续查找它的 [[Prototype]]，以此类推。这一系列对象的链接被称为“原型链”。

>Object.create(..)

```js
var foo = {
    something: function() {
             console.log( "Tell me something good..." );
        }
};
var bar = Object.create( foo ); 
bar.something(); // Tell me something good...
```
Object.create(..) 会创建一个新对象(bar)并把它关联到我们指定的对象(foo)，这样 我们就可以充分发挥 [[Prototype]] 机制的威力(委托)并且避免不必要的麻烦(比如使 用 new 的构造函数调用会生成 .prototype 和 .constructor 引用)。

:::tip
Object.create(..) 会创建一个新对象(bar)并把它关联到我们指定的对象(foo)，这样 我们就可以充分发挥 [[Prototype]] 机制的威力(委托)并且避免不必要的麻烦(比如使 用 new 的构造函数调用会生成 .prototype 和 .constructor 引用)。
:::

>Object.create()的polyfill代码(兼容es5之前)
```js
if (!Object.create) { 
    Object.create = function(o) {
        function F(){} 
        F.prototype = o; 
        return new F();
}; }
```

>Object.create(..)拓展
```js
var anotherObject = { 
    a:2
};
var myObject = Object.create( anotherObject, { 
    b: {
        enumerable: false, 
        writable: true, 
        configurable: false, 
        value: 3
    }, 
    c: {
        enumerable: true, 
        writable: false, 
        configurable: false, 
        value: 4
    } 
});
myObject.hasOwnProperty( "a" ); // false
myObject.hasOwnProperty( "b" ); // true
myObject.hasOwnProperty( "c" ); // true
myObject.a; // 2
myObject.b; // 3
myObject.c; // 4
```
:::tip
Object.create(..) 的第二个参数指定了需要添加到新对象中的属性名以及这些属性的属性描述符
:::








