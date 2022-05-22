:::tip
typeof null是object原理是这样的，不同的对象在底层都表示为二进制，在 JavaScript 中二进制前三位都为 0 的话会被判 断为 object 类型，null 的二进制表示是全 0，自然前三位也是 0，所以执行 typeof 时会返回“object”。
:::

## 内置对象
> 在 JavaScript 中如String、Number、Boolean、Object、Function、Array、Date、RegExp、Error，它们实际上只是一些内置函数。这些内置函数可以当作构造函数 (由 new 产生的函数调用——参见第 2 章)来使用，从而可以构造一个对应子类型的新对象
```js
var str = '1111'
console.log(str instanceof String);//false  
var str2 = new String()
console.log(str2 instanceof String) //true
```
:::tip
因为str只是一个字符串类型的字面量而不是对象，但在使用操作字符串的一些方法时即在必要时语言会自动把字符串字面量转换成一个 String 对象，也就是说你并不需要 显式创建一个对象,其他内置对象也类似的会进行自动转换。

null 和 undefined 没有对应的构造形式，它们只有文字形式。相反，Date 只有构造，没有文字形式。对于 Object、Array、Function 和 RegExp(正则表达式)来说，无论使用文字形式还是构造形式，它们都是对象，不是字面量
:::


> 在对象中，属性名永远都是字符串。如果你使用 string(字面量)以外的其他值作为属性名，那它首先会被转换为一个字符串。即使是数字或者布尔值也不例外，虽然在数组下标中使用的的确是数字，但是在对象属性名中数字会被转换成字符串，所以当心不要搞混对象和数组中数字的用法:

## 可计算属性名
S6 增加了可计算属性名，可以在文字形式中使用 [] 包裹一个表达式来当作属性名:
```js
var prefix = "foo";
var myObject = {
    [prefix + "bar"]:"hello",
    [prefix + "baz"]: "world"
};
myObject["foobar"]; // hello
myObject["foobaz"]; // world
myObject.foobar  //hello
```
可计算属性名最常用的场景可能是 ES6 的符号(Symbol),关于Symbol详情请点下面链接
[Symbol](https://cloud.tencent.com/developer/article/1627337#:~:text=%E4%BB%80%E4%B9%88%E6%98%AFSymbol.%20JavaScript%E6%A0%87%E5%87%86%E4%B8%AD%E8%A7%84%E5%AE%9A%E5%AF%B9%E8%B1%A1%E7%9A%84key%E5%8F%AA%E8%83%BD%E6%98%AF%20String%20%E6%88%96%20Symbol%20%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%8C%BA%E5%88%AB%E5%9C%A8%E4%BA%8E%20String,%E7%B1%BB%E5%9E%8B%E7%9A%84key%E5%8F%AF%E4%BB%A5%E9%87%8D%E5%A4%8D%E8%80%8C%20Symbol%20%E7%B1%BB%E5%9E%8B%E7%9A%84key%E6%98%AF%E5%94%AF%E4%B8%80%E7%9A%84%E3%80%82.%20Symbol%20%E7%9A%84%E6%9C%AC%E8%B4%A8%E6%98%AF%E8%A1%A8%E7%A4%BA%E4%B8%80%E4%B8%AA%E5%94%AF%E4%B8%80%E6%A0%87%E8%AF%86%E3%80%82.%20%E6%AF%8F%E6%AC%A1%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AASymbol%EF%BC%8C%E5%AE%83%E6%89%80%E4%BB%A3%E8%A1%A8%E7%9A%84%E5%80%BC%E9%83%BD%E4%B8%8D%E5%8F%AF%E8%83%BD%E9%87%8D%E5%A4%8D%EF%BC%8C%E8%AF%A5%E5%80%BC%E7%9A%84%E5%86%85%E9%83%A8%E5%AE%9E%E7%8E%B0%E5%8F%AF%E4%BB%A5%E8%A7%86%E4%B8%BA%E4%B8%80%E6%AE%B5%E6%95%B0%E5%AD%97%EF%BC%88%E7%B1%BB%E4%BC%BC%EF%BC%9A%203423498431987719455..)。

## 属性描述符
从 ES5 开始，所有的属性都具备了属性描述符

```js
var myObject = { 
    a:2
};
Object.getOwnPropertyDescriptor( myObject, "a" );
// {
// value: 2,
// writable: true,
// enumerable: true,
// configurable: true //
//}
```
我们可以使用 Object.defineProperty(..) 来添加一个新属性或者修改一个已有属性(如果它是 configurable)并对特性进行设置
### 1.writable
```js
var myObject = {};
Object.defineProperty( myObject, "a", {
    value: 2,
    writable: false, // 不可写! configurable: true, enumerable: true
} );
myObject.a = 3;
myObject.a; // 2
```
### 2.configurable
```js
var myObject = { 
    a:2
};
myObject.a = 3;
myObject.a; // 3
Object.defineProperty( myObject, "a", {
    value: 4,
    writable: true,
    configurable: false, // 不可配置!
    enumerable: true 
} );
myObject.a; // 4
myObject.a = 5;
myObject.a; // 5
Object.defineProperty( myObject, "a", {
    value: 6,
    writable: true, 
    configurable: true, 
    enumerable: true
} ); // TypeError
```
:::tip
要注意有一个小小的例外:即便属性是 configurable:false，我们还是可以 把 writable 的状态由 true 改为 false，但是无法由 false 改为 true。
除了无法修改，configurable:false 还会禁止删除这个属性:
:::
### 3.enumerable
从名字就可以看出，这个描述符控制的是属性是否会出现在对象的属性枚举中，比如说 for..in 循环。如果把 enumerable 设置成 false，这个属性就不会出现在枚举中，虽然仍 然可以正常访问它。相对地，设置成 true 就会让它出现在枚举中。

<!-- > 枚举：
>
> -->

### 4.get

### 5.set
这两个属性后面getter和setter会详解

## 不变性
有时候你会希望属性或者对象是不可改变(无论有意还是无意)的，在 ES5 中可以通过很多种方法来实现。
:::tip
很重要的一点是，所有的方法创建的都是浅不变性，也就是说，它们只会影响目标对象和它的直接属性。如果目标对象引用了其他对象(数组、对象、函数，等)，其他对象的内容不受影响，仍然是可变的:
:::
```js
var obj2 = {
    a:{
        b:2
    }
}
console.log(Object.getOwnPropertyDesc
    writable: false,
    configurable: true,
    enumerable: true
})
obj2.a.b = 3
console.log(obj2.a.b); //3
```
 ### 1.对象常量
 结合 writable:false 和 configurable:false 就可以创建一个真正的常量属性(不可修改、 重定义或者删除)
 ### 2.禁止拓展
 如果你想禁止一个对象添加新属性并且保留已有属性，可以使用 Object.preventExtensions(..),但对象内部的属性还能修进行改
```js
var myObj2 = {
    a: 2
}
Object.preventExtensions(myObj2)
myObj2.b = 3
console.log(myObj2.b);//undefined
```
:::tip
在非严格模式下，创建属性 b 会静默失败。在严格模式下，将会抛出 TypeError 错误。
:::

 ### 3.密封
 Object.seal(..) 会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用Object.preventExtensions(..) 并把所有现有属性标记为 configurable:false。
 所以，密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性(虽然可以 修改属性的值)。
 ### 4.冻结
 Object.freeze(..) 会创建一个冻结对象，这个方法实际上会在一个现有对象上调用 Object.seal(..) 并把所有“数据访问”属性标记为 writable:false，这样就无法修改它们 的值。
 :::tip
 这个方法是你可以应用在对象上的级别最高的不可变性，它会禁止对于对象本身及其任意 直接属性的修改(不过就像我们之前说过的，这个对象引用的其他对象是不受影响的)。
 :::

## [[Get]]
 ```js
 var myObject = { 
    a: 2
 };
 myObject.a; // 2
 ```
 myObject.a 是一次属性访问，但是这条语句并不仅仅是在 myObjet 中查找名字为 a 的属性， 虽然看起来好像是这样。
在语言规范中，myObject.a 在 myObject 上实际上是实现了 [[Get]] 操作(有点像函数调 用:[[Get]]())。对象默认的内置 [[Get]] 操作首先在对象中查找是否有名称相同的属性， 如果找到就会返回这个属性的值。
然而，如果没有找到名称相同的属性，按照 [[Get]] 算法的定义会执行另外一种非常重要 的行为。我们会在第 5 章中介绍这个行为(其实就是遍历可能存在的 [[Prototype]] 链， 也就是原型链)。
如果无论如何都没有找到名称相同的属性，那 [[Get]] 操作会返回值 undefined

>注意，这种方法和访问变量时是不一样的。如果你引用了一个当前词法作用域中不存在的 变量，并不会像对象属性一样返回 undefined，而是会抛出一个 ReferenceError 异常:

```js

var myObject = { 
    a: undefined
};
myObject.a; // undefined
myObject.b; // undefined
```
从返回值的角度来说，这两个引用没有区别——它们都返回了 undefined。然而，尽管乍 看之下没什么区别，实际上底层的 [[Get]] 操作对 myObject.b 进行了更复杂的处理。
由于仅根据返回值无法判断出到底变量的值为 undefined 还是变量不存在，所以 [[Get]] 操作返回了 undefined。不过稍后我们会介绍如何区分这两种情况（存在性中）。

## [[Put]]
[Put]] 被触发时，实际的行为取决于许多因素，包括对象中是否已经存在这个属性(这 是最重要的因素)。

如果已经存在这个属性，[[Put]] 算法大致会检查下面这些内容。
1. 属性是否是访问描述符(参见3.3.9节)?如果是并且存在setter就调用setter。
2. 属性的数据描述符中writable是否是false?如果是，在非严格模式下静默失败，在
严格模式下抛出 TypeError 异常。
3. 如果都不是，将该值设置为属性的值。

如果对象中不存在这个属性，[[Put]] 操作会更加复杂。我们会在第 5 章讨论 [[Prototype]] 时详细进行介绍。

## Getter和Setter
在 ES5 中可以使用 getter 和 setter 来部分改写默认操作（如默认的[[Get]]、[[Put]]），但是只能应用在单个属性上，无法应用在整个对象上。getter 是一个隐藏函数，会在获取属性值时调用。setter 也是一个隐藏函数，会在设置属性值时调用。

当你给一个属性定义 getter、setter 或者两者都有时，这个属性会被定义为“访问描述符”(和“数据描述符”相对)。对于访问描述符来说，JavaScript 会忽略它们的 value 和 writable 特性，取而代之的是关心 set 和 get(还有 configurable 和 enumerable)特性。

```js
var myObject = {
// 给 a 定义一个 getter 
    get a() {   //对象文字语法
        return 2;
     }
};
Object.defineProperty( 
    myObject, // 目标对象
    "b", // 属性名
    {  // 描述符
        // 给 b 设置一个 getter
        get: function(){   //显式定义
            return this.a * 2 
        },
    // 确保 b 会出现在对象的属性列表中
        enumerable: true
    }
);
myObject.a; // 2
myObject.b; // 4
```

不管是对象文字语法中的get a(){...}，还是 defineProperty(..) 中的显式定义，二者都会在对象中创建一个不包含值的属性，对于这个属性的访问会自动调用一个隐藏函数，它的返回值会被当作属性访问的返回值

```js
var myObject = {
// 给 a 定义一个 getter 
    get a() {
        return this._a_; 
    },
// 给 a 定义一个 setter 不定义setter的话没办法给对象属性赋值，获取到的属性值依然是之前默认设定的值
    set a(val) {
        this._a_ = val * 2; 
    }
};
myObject.a = 2;
myObject.a; // 4
```

## 存在性
可以在不访问属性值的情况下判断对象中是否存在这个属性
```js
var myObject = { 
    a:2
};
("a" in myObject); // true
("b" in myObject); // false
myObject.hasOwnProperty( "a" ); // true
myObject.hasOwnProperty( "b" ); // false
```
:::tip
in 操作符会检查属性是否在对象及其 [[Prototype]] 原型链中(参见第 5 章)。相比之下， hasOwnProperty(..) 只会检查属性是否在 myObject 对象中，不会检查 [[Prototype]] 链。

起来 in 操作符可以检查容器内是否有某个值，但是它实际上检查的是某 个属性名是否存在。对于数组来说这个区别非常重要，4 in [2, 4, 6]的结 果并不是你期待的 True，因为 [2, 4, 6] 这个数组中包含的属性名是 0、1、 2，没有 4。
:::

>关于枚举： “可枚举”就相当于“可以出现在对象属性 的遍历中”
```js
var myObject = {};
    Object.defineProperty(
    myObject,
    "a",
// 让 a 像普通属性一样可以枚举 
    { enumerable: true, value: 2 }
);
Object.defineProperty(
    myObject,
    "b",
// 让b不可枚举
    { enumerable: false, value: 3 }
);
myObject.b; // 3
("b" in myObject); // true myObject.hasOwnProperty( "b" ); // true
// .......
for (var k in myObject) {
    console.log( k, myObject[k] );
}
// "a" 2
```

其他判断属性是否可枚举的方法
```js
var myObject = { };
Object.defineProperty(
    myObject,
    "a",
// 让 a 像普通属性一样可以枚举 
    { enumerable: true, value: 2 }
);
Object.defineProperty(
    myObject,
    "b",
// 让 b 不可枚举
    { enumerable: false, value: 3 }
);
myObject.propertyIsEnumerable( "a" ); // true
myObject.propertyIsEnumerable( "b" ); // false
Object.keys( myObject ); // ["a"]
Object.getOwnPropertyNames( myObject ); // ["a", "b"]
```
:::tip
propertyIsEnumerable(..) 会检查给定的属性名是否直接存在于对象中(而不是在原型链上）

Object.keys(..) 会返回一个数组，包含所有可枚举属性

Object.getOwnPropertyNames(..) 会返回一个数组，包含所有属性，无论它们是否可枚举

这三个都只会查找对象直接包含的属性不会查找原型链
:::

## 遍历
首先要先了解关于迭代器的知识，点击下面链接

[迭代器](https://juejin.cn/post/7018850645226569758)

ES6 增加了一种用来遍 历数组的 for..of 循环语法(如果对象本身定义了迭代器的话也可以遍历对象)，
for..of 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的 next() 方法来遍历所有返回值。
数组有内置的 @@iterator，因此 for..of 可以直接应用在数组上。我们使用内置的 @@ iterator 来手动遍历数组，看看它是怎么工作的:

```js

var myArray = [ 1, 2, 3 ];
var it = myArray[Symbol.iterator]();
it.next(); // { value:1, done:false } 
it.next(); // { value:2, done:false } 
it.next(); // { value:3, done:false } 
it.next(); // { done:true }
```
:::tip
我们使用 ES6 中的符号 Symbol.iterator 来获取对象的 @@iterator 内部属性,@@iterator 本身并不是一个迭代器对象，而是一个返回迭代器对象的函数(下面value属性的值),可以参考下面手动实现迭代器的方法
:::

```js
var myObject = { 
    a: 2,
    b: 3 
};
Object.defineProperty( myObject, Symbol.iterator, { 
    enumerable: false,
    writable: false,
    configurable: true,
    value: function() { 
        var o = this;
        var idx = 0;
        var ks = Object.keys( o ); 
        return {
            next: function() { 
                return {
                    value: o[ks[idx++]],
                    done: (idx > ks.length)
                };
            } 
        };
    } 
} );
// 手动遍历 myObject
var it = myObject[Symbol.iterator](); 
it.next(); // { value:2, done:false } 
it.next(); // { value:3, done:false } 
it.next(); // { value:undefined, done:true }
// 用 for..of 遍历 myObject 
for (var v of myObject) { 
    console.log( v );
}
// 2 // 3
```
:::tip
我们使用 Object.defineProperty(..) 定义了我们自己的 @@iterator(主要是 为了让它不可枚举)，不过注意，我们把符号当作可计算属性名(本章之前 有介绍)。此外，也可以直接在定义对象时进行声明，比如 var myObject = { a:2, b:3, [Symbol.iterator]: function() { /* .. */ } }。
:::



