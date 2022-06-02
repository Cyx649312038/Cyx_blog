## 简短历史回顾
为验证简单的表单而需要大量与服务器的往返通信成为用户的痛点。网景在当时是引领技术革新的公司，它将开发一个客户端脚本语言来处理 12 这种简单的数据验证提上了日程。
(详细见书这里不做总结。)
## JavaScript实现
> * ECMAScript:由 ECMA-262 定义并提供核心功能。
> * 文档对象模型(DOM):提供与网页内容交互的方法和接口。
> * 浏览器对象模型(BOM):提供与浏览器交互的方法和接口。

<img src="/assets/images/js.png"/>

### ECMAScript
>Ecma: 欧洲计算机制造商协会(Ecma)

因为在早期微软和网景两个公司都在实现自己的javascript(Netscape Navigator 中的 JavaScript，以 及 IE 中的 JScript),而当时不像其他语言，js还没有规范的语法和标准
所以踏上标准化的征途是必须的。1997 年，JavaScript 1.1 作为提案被提交给欧洲计算机制造商协会(Ecma)。第 39 技术委员会(TC39) 承担了“标准化一门通用、跨平台、厂商中立的脚本语言的语法和语义”的任务(参见 TC39-ECMAScript)。 TC39 委员会由来自网景、Sun、微软、Borland、Nombas 和其他对这门脚本语言有兴趣的公司的工程师 组成。他们花了数月时间打造出 ECMA-262，也就是 ECMAScript(发音为“ek-ma-script”)这个新的脚 本语言标准。

所以这个时候开始ECMAScript就是由这个ECMA-262标准定义的语言(也即之前称之为的JavaScript)，它并不局限于浏览器，Web浏览器知识ECMAScript实现的一种宿主环境，宿主环境提供 ECMAScript 的基准实现和与环境自身交互必需的扩展。扩展(比如 DOM)使用 ECMAScript 核心类型 和语法，提供特定于环境的额外功能。其他宿主环境还有服务器端 JavaScript 平台 Node.js 和即将被淘汰 的 Adobe Flash。

### DOM
文档对象模型(DOM，Document Object Model)是一个应用编程接口(API)，用于在 HTML 中使 用扩展的 XML。DOM 将整个页面抽象为一组分层节点（DOM树）。HTML 或 XML 页面的每个组成部分都是一种 节点，包含不同的数据。比如下面的 HTML 页面:
<img src="/assets/images/DOM.png"/>
DOM 通过创建表示文档的树，让开发者可以随心所欲地控制网页的内容和结构。使用 DOM API，可以轻松地删除、添加、替换、修改节点。

又由于最初网景和微软在为浏览器支持动态HTML(DHTML)时（如开发者首先可以 做到不刷新页面而修改页面外观和内容。）采用不一样的思路，这样就会导致开发者可能需要面对浏览器开发网页，这时万维网联盟(W3C，World Wide Web Consortium)开始了制定 DOM 标准的进程。

### BOM
BOM API用于支持访问和操作浏览器的窗口。使用 BOM，开发者可以操控浏览器显示页面之外的部分。而 BOM 真正独一无二的地方，当然也是 问题最多的地方，就是它是唯一一个没有相关标准的 JavaScript 实现。HTML5 改变了这个局面，这个版 本的 HTML 以正式规范的形式涵盖了尽可能多的 BOM 特性。由于 HTML5 的出现，之前很多与 BOM 有关的问题都迎刃而解了。
更多详细的BOM第12章再详解

:::tip
JavaScript 的这三个部分得到了五大 Web 浏览器(IE、Firefox、Chrome、Safari 和 Opera)不同程度
的支持。所有浏览器基本上对 ES5(ECMAScript 5)提供了完善的支持，而对 ES6(ECMAScript 6)和 ES7(ECMAScript 7)的支持度也在不断提升。这些浏览器对 DOM 的支持各不相同，但对 Level 3 的支 持日益趋于规范。HTML5 中收录的 BOM 会因浏览器而异，不过开发者仍然可以假定存在很大一部分 公共特性。
:::