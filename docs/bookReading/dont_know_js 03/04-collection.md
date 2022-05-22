## TypeArray

## Map
如果你的 JavaScript 经验丰富的话，应该会了解对象是创建无序键 / 值对数据结构 [ 也称为映射(map)] 的主要机制。但是，对象作为映射的主要缺点是不能使用非字符串值作为键

```js
var m = {};
var x = { id: 1 },
    y = { id: 2 };
m[x] = "foo";
m[y] = "bar";
m[x]; // "bar"
m[y]; // "bar"
```
这里发生了什么?x和y两个对象字符串化都是"[object Object]"，所以m中只设置了一 个键。

在es6中可以使用map来实现这个
```js
var m = new Map()
var x = {id: 1}
var y = {id: 2}
m.set(x, "foo")
m.set(y, "bar")
console.log(m.get(x), m.get(y));// "foo"  "bar"
m.delete(y)
console.log(m,m.get(y)); //{ { id: 1 } => 'foo' } undefined
m.clear()
console.log(m, m.get(x)); //Map(0) {} undefined
console.log(m.size); //0
```
这里唯一的缺点就是不能使用方括号[ ]语法设置和获取值，但完全可以使用get(..)和 set(..) 方法完美代替。

要从 map 中删除一个元素，不要使用 delete 运算符，而是要使用 delete() 方法

可以通过 clear() 清除整个 map 的内容, 可以通过size属性获取集合长度

Map(..) 构造器也可以接受一个 iterable(参见 3.1 节)，这个迭代器必须产生一列数组，每 个数组的第一个元素是键，第二个元素是值。这种迭代的形式和 entries() 方法产生的形 式是完全一样的，下一小节将会介绍。这使得创建一个 map 的副本很容易:
```js
var m = new Map()
m.set({id:1}, 1)
m.set({id:2}, 2)
console.log(m.entries()); //{ [ { id: 1 }, 1 ], [ { id: 2 }, 2 ] }
var m2 = new Map(m.entries())
console.log(m2); //{ { id: 1 } => 1, { id: 2 } => 2 }
var m3 = new Map(m2) //因为 map 的实例是一个 iterable，它的默认迭代器与 entries() 相同，所以我们更推荐使用 后面这个简短的形式。
console.log(m3); //{ { id: 1 } => 1, { id: 2 } => 2 }
```
也可以在 Map(..) 构造器中手动指定一个项目(entry)列表(键 / 值数组的数组)
```js
var x = {id: 1}
var y = {id: 2}
var m = new Map([
    [x,"foo"],
    [y,"bar"]
])
console.log(m,  m.get(x), m.get(y)); //{ { id: 1 } => 'foo', { id: 2 } => 'bar' } foo bar
```

### Map值
要从 map 中得到一列值，可以使用 values(..)，它会返回一个迭代器
```js
var x = {id: 1}
var y = {id: 2}
var m = new Map([
    [x, "foo"],
    [y, "bar"]
])
console.log(m.values()); //[Map Iterator] { 'foo', 'bar' }
var vals = [...m.values()]
console.log(vals); //[ 'foo', 'bar' ]
console.log(Array.from(m.values())); //[ 'foo', 'bar' ]
```
前面一小节介绍过，可以在一个 map 的项目上使用 entries() 迭代(或者默认 map 迭代 器)。
```js
var m = new Map();
var x = { id: 1 },
    y = { id: 2 };
m.set( x, "foo" );
m.set( y, "bar" );
var vals = [ ...m.entries() ];
vals[0][0] === x; // true
vals[0][1];  // "foo"
vals[1][0] === y;  // true
vals[1][1];  // "bar"
```
### Map键
要得到一列键，可以使用 keys()，它会返回 map 中键上的迭代器:
```js
var m = new Map();
var x = { id: 1 },
    y = { id: 2 };
m.set( x, "foo" );
m.set( y, "bar" );
var keys = [ ...m.keys() ];
keys[0] === x;  // true
keys[1] === y;  // true
```
要确定一个 map 中是否有给定的键，可以使用 has(..) 方法:
```js
var m = new Map();
var x = { id: 1 },
    y = { id: 2 };
m.set( x, "foo" );
m.has( x );  // true
m.has( y );  // false
```
map 的本质是允许你把某些额外的信息(值)关联到一个对象(键)上，而无需把这个信 息放入对象本身。

对于 map 来说，尽管可以使用任意类型的值作为键，但通常我们会使用对象，因为字符串 或者其他基本类型已经可以作为普通对象的键使用。换句话说，除非某些或者全部键需要 是对象，否则可以继续使用普通对象作为影射，这种情况下 map 才更加合适。

:::tip
如果使用对象作为映射的键，这个对象后来被丢弃(所有的引用解除)(比如上面的x = null )，试 图让垃圾回收(GC)回收其内存(如上面的{id: 1}占用的内存)，那么 map 本身仍会保持其项目。你需要 从 map 中移除这个项目来支持 GC。在下一小节中，我们将会介绍作为对象 键和 GC 的更好选择——WeakMap。
:::

## WeakMap
WeakMap 是 map 的变体，二者的多数外部行为特性都是一样的，区别在于内部内存分配(特别是其 GC)的工作方式。

WeakMap(只)接受对象作为键。这些对象是被弱持有的，也就是说如果对象本身被垃圾 回收的话，在 WeakMap 中的这个项目也会被移除。然而我们无法观测到这一点，因为对 象被垃圾回收的唯一方式是没有对它的引用了。但是一旦不再有引用，你也就没有对象引 用来查看它是否还存在于这个 WeakMap 中了。

除此之外，WeakMap 的 API 是类似的，尽管要更少一些。WeakMap 没有 size 属性或 clear() 方法，也不会暴露任何键、值或项目上的迭代器。所 以即使你解除了对 x 的引用，它将会因 GC 时这个条目被从 m 中移除，也没有办法确定这 一事实。所以你就相信 JavaScript 所声明的吧!

和 Map 一样，通过 WeakMap 可以把信息与一个对象软关联起来。而在对这个对象没有完 全控制权的时候，这个功能特别有用，比如 DOM 元素。如果作为映射键的对象可以被删 除，并支持垃圾回收，那么 WeakMap 就更是合适的选择了。

需要注意的是，WeakMap 只是弱持有它的键，而不是值。考虑:
```js
var m = new WeakMap();
var x = { id: 1 },
    y = { id: 2 },
    z = { id: 3 },
    w = { id: 4 };
m.set( x, y );
x = null;  //{ id: 1 } 可GC
y = null;  //{ id: 2 } 可GC  只因 { id: 1 } 可GC
m.set( z, w );
w = null  // { id: 4 } 不可GC
```

## Set
set 是一个值的集合，其中的值唯一(重复会被忽略)。

set 的 API 和 map 类似。只是 add(..) 方法代替了 set(..) 方法(某种程度上说有点讽刺)， 没有 get(..) 方法。

Set(..) 构造器形式和 Map(..) 类似，都可以接受一个 iterable，比如另外一个 set 或者仅 仅是一个值的数组。但是，和 Map(..) 接受项目(entry)列表(键 / 值数组的数组)不同， Set(..) 接受的是值(value)列表(值的数组):
```js
var x = { id: 1 },
    y = { id: 2 };
var s = new Set( [x,y] );
```
set 不需要 get(..) 是因为不会从集合中取一个值，而是使用 has(..) 测试一个值是否存在:
```js
var s = new Set();
var x = { id: 1 },
    y = { id: 2 };
s.add( x );
s.has( x );
s.has( y );
// true
// false
```
:::tip
除了会把 -0 和 0 当作是一样的而不加区别之外，has(..) 中的比较算法和 Object.is(..) 几乎一样(参见第 6 章)。
:::

### Set 迭代器
```js
var s = new Set()
var x = {id: 1}
var y = {id: 2}
s.add(x)
s.add(y)
console.log(s, [...s]); //Set(2) { { id: 1 }, { id: 2 } } [ { id: 1 }, { id: 2 } ]
console.log('keys',s.keys(),'values', s.values(), 'entries', s.entries());  //keys [Set Iterator] { { id: 1 }, { id: 2 } } values [Set Iterator] { { id: 1 }, { id: 2 } }  entries [Set Entries] { [ { id: 1 }, { id: 1 } ], [ { id: 2 }, { id: 2 } ] }
```
keys() 和 values() 迭代器都从 set 中 yield 出一列不重复的值。entries() 迭代器 yield 出 一列项目数组，其中的数组的两个项目都是唯一 set 值。set 默认的迭代器是它的 values() 迭代器。

set 固有的唯一性是它最有用的特性
```js
var s = new Set( [1,2,3,4,"1",2,4,"5"] ),
uniques = [ ...s ];
uniques;                        // [1,2,3,4,"1","5"]
```
set 的唯一性不允许强制转换，所以 1 和 "1" 被认为是不同的值。

## WeakSet
就像 WeakMap 弱持有它的键(对其值是强持有的)一样，WeakSet 对其值也是弱持有的 (这里并没有键):
```js
var s = new WeakSet();
var x = { id: 1 },
    y = { id: 2 };
s.add( x );
s.add( y );
x = null;  // x可GC
y = null; // y可GC
```
:::tip
WeakSet 的值必须是对象，而并不像 set 一样可以是原生类型值。
:::