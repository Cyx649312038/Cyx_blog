## Web Worker
在我们对 Web 平台 HTML5 的一个叫作 Web Worker 的新增特性的探索过程中，这些都是 很好的问题。这是浏览器(即宿主环境)的功能，实际上和 JavaScript 语言本身几乎没什 么关系。也就是说，JavaScript 当前并没有任何支持多线程执行的功能。

但是，像你的浏览器这样的环境，很容易提供多个 JavaScript 引擎实例，各自运行在自己 的线程上，这样你可以在每个线程上运行不同的程序。程序中每一个这样的独立的多线程 部分被称为一个(Web)Worker。这种类型的并行化被称为任务并行，因为其重点在于把 程序划分为多个块来并发运行。

从 JavaScript 主程序(或另一个 Worker)中，可以这样实例化一个 Worker:
```js
var w1 = new Worker( "http://some.url.1/mycoolworker.js" );
```

Worker 之间以及它们和主程序之间，不会共享任何作用域或资源，那会把所有多线程编程 的噩梦带到前端领域，而是通过一个基本的事件消息机制相互联系。

```js
// 以下是如何侦听事件(其实就是固定的 "message" 事件):
    w1.addEventListener( "message", function(evt){
         // evt.data
    } );
    // 也可以发送 "message" 事件给这个 Worker:
     w1.postMessage( "something cool to say" );

    // 在这个 Worker 内部，收发消息是完全对称的: // "mycoolworker.js"
     addEventListener( "message", function(evt){
         // evt.data
     } );
     postMessage( "a really cool reply" );
```

如果浏览器中有两个或多个页面(或同一页上的多个 tab !)试图从同一个文件 URL 创 建 Worker，那么最终得到的实际上是完全独立的 Worker。后面我们会简单介绍如何共享 Worker。

### Worker环境
在 Worker 内部是无法访问主程序的任何资源的。这意味着你不能访问它的任何全局变量，也不能访问页面的 DOM 或者其他资源。记住，这是一个完全独立的线程。

但是，你可以执行网络操作(Ajax、WebSockets)以及设定定时器。还有，Worker 可 以访问几个重要的全局变量和功能的本地复本，包括 navigator、location、JSON 和 applicationCache。

你还可以通过 importScripts(..) 向 Worker 加载额外的 JavaScript 脚本: 

// 在Worker内部

importScripts( "foo.js", "bar.js" );

这些脚本加载是同步的。也就是说，importScripts(..) 调用会阻塞余下 Worker 的执行，
直到文件加载和执行完成。

Web Worker 通常应用于哪些方面呢?

• 处理密集型数学计算

• 大数据集排序

• 数据处理(压缩、音频分析、图像处理等) • 高流量网络通信

### 数据传递
在早期的 Worker 中，唯一的选择就是把所有数据序列化到一个字符串值中。除了双向序 列化导致的速度损失之外，另一个主要的负面因素是数据需要被复制，这意味着两倍的内 存使用(及其引起的垃圾收集方面的波动)。
 谢天谢地，现在已经有了一些更好的选择。

如果要传递一个对象，可以使用结构化克隆算法(structured clone algorithm)(https:// developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm) 把 这 个 对象复制到另一边。这个算法非常高级，甚至可以处理要复制的对象有循环引用的情况。这 样就不用付出 to-string 和 from-string 的性能损失了，但是这种方案还是要使用双倍的内存。 IE10 及更高版本以及所有其他主流浏览器都支持这种方案。

还有一个更好的选择，特别是对于大数据集而言，就是使用 Transferable 对象(http:// updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)。这时发生的是对象所 有权的转移，数据本身并没有移动。一旦你把对象传递到一个 Worker 中，在原来的位置 上，它就变为空的或者是不可访问的，这样就消除了多线程编程作用域共享带来的混乱。 当然，所有权传递是可以双向进行的。

如果选择 Transferable 对象的话，其实不需要做什么。任何实现了 Transferable 接口 (http://developer.mozilla.org/en-US/docs/Web/API/Transferable)的数据结构就自动按照这种
方式传输(Firefox 和 Chrome 都支持)。

举例来说，像 Uint8Array 这样的带类型的数组(参见本系列的《你不知道的 JavaScript (下卷)》的“ES6 & Beyond”部分)就是 Transferable。下面是如何使用 postMessage(..)
发送一个 Transferable 对象:

// 比如foo是一个Uint8Array

postMessage( foo.buffer, [ foo.buffer ] );

第一个参数是一个原始缓冲区，第二个是一个要传输的内容的列表。

不支持 Transferable 对象的浏览器就降级到结构化克隆，这会带来性能下降而不是彻底的 功能失效。

### 共享Worker
如果你的站点或 app 允许加载同一个页面的多个 tab(一个常见的功能)，那你可能非常希望通过防止重复专用 Worker 来降低系统的资源使用。在这种情况下，创建一个整个站点或 app 的所有页面实例都可以共享的中心 Worker 就非 常有用了。

这称为 SharedWorker，可通过下面的方式创建(只有 Firefox 和 Chrome 支持这一功能):

```js
var w1 = new SharedWorker( "http://some.url.1/mycoolworker.js" );
```

因为共享 Worker 可以与站点的多个程序实例或多个页面连接，所以这个 Worker 需要通过 某种方式来得知消息来自于哪个程序。这个唯一标识符称为端口(port)，可以类比网络 socket 的端口。因此，调用程序必须使用 Worker 的 port 对象用于通信:
```js
w1.port.addEventListener( "message", handleMessages );
// ..
w1.port.postMessage( "something cool" );
//  还有，端口连接必须要初始化，形式如下:
w1.port.start();
```

在共享 Worker 内部，必须要处理额外的一个事件:"connect"。这个事件为这个特定的连
接提供了端口对象。保持多个连接独立的最简单办法就是使用 port 上的闭包(参见本系列 《你不知道的 JavaScript(上卷)》的“作用域和闭包”部分)，就像下面的代码一样，把这
个链接上的事件侦听和传递定义在 "connect" 事件的处理函数内部:
```js
// 在共享Worker内部
addEventListener( "connect", function(evt){
// 这个连接分配的端口 
var port = evt.ports[0];
port.addEventListener( "message", function(evt){
// ..
port.postMessage( .. );
// .. 
} );
// 初始化端口连接
port.start();
} );
```
:::tip
如果有某个端口连接终止而其他端口连接仍然活跃，那么共享 Worker 不会 终止。而对专用 Worker 来说，只要到实例化它的程序的连接终止，它就会 终止。
:::



