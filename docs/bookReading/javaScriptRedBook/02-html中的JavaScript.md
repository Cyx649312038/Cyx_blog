## script元素
script元素有下 列 8 个属性
* async:可选。表示应该立即开始下载脚本，但不能阻止其他页面动作，比如下载资源或等待其 他脚本加载。只对外部脚本文件有效。
* charset:可选。使用 src 属性指定的代码字符集。这个属性很少使用，因为大多数浏览器不 在乎它的值。
* crossorigin:可选。配置相关请求的 CORS(跨源资源共享)设置。默认不使用 CORS。crossorigin= "anonymous"配置文件请求不必设置凭据标志。crossorigin="use-credentials"设置凭据 标志，意味着出站请求会包含凭据。
* defer:可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效。 在 IE7 及更早的版本中，对行内脚本也可以指定这个属性。
* integrity:可选。允许比对接收到的资源和指定的加密签名以验证子资源完整性(SRI， 12 Subresource Integrity)。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，
脚本不会执行。这个属性可以用于确保内容分发网络(CDN，Content Delivery Network)不会提供恶意内容.
* language:废弃。最初用于表示代码块中的脚本语言(如"JavaScript"、"JavaScript 1.2"
或"VBScript")。大多数浏览器都会忽略这个属性，不应该再使用它。 
* src:可选。表示包含要执行的代码的外部文件。
* type:可选。代替 language，表示代码块中脚本语言的内容类型(也称 MIME 类型)。按照惯 例，这个值始终都是"text/javascript"，尽管"text/javascript"和"text/ecmascript" 都已经废弃了。JavaScript 文件的 MIME 类型通常是"application/x-javascript"，不过给 type 属性这个值有可能导致脚本被忽略。在非 IE 的浏览器中有效的其他值还有 "application/javascript"和"application/ecmascript"。如果这个值是 module，则代 码会被当成 ES6 模块，而且只有这时候代码中才能出现 import 和 export 关键字。

> 使用script标签的几个注意点
1. 在使用行内 JavaScript 代码时，要注意代码中不能出现字符串 &lt;/script&gt;,浏览器会把它当成结束标签,想避免这个问题，只需要转义字符“\”即可:
2. 在 XHTML 文档中，可以忽略结束标签(&lt;script/&gt;)，但不能载html文件中使用
3. script标签不存在跨域问题, integrity属性是防范这种问题的一个武器，但这个属性也不是所有 浏览器都支持。
:::tip
 按照惯例，外部 JavaScript 文件的扩展名是.js。这不是必需的，因为浏览器不会检 查所包含 JavaScript 文件的扩展名。这就为使用服务器端脚本语言动态生成 JavaScript 代 码，或者在浏览器中将 JavaScript 扩展语言(如 TypeScript，或 React 的 JSX)转译为 JavaScript 提供了可能性。不过要注意，服务器经常会根据文件扩展来确定响应的正确 MIME 类型。 如果不打算使用.js 扩展名，一定要确保服务器能返回正确的 MIME 类型。
:::

## 标签位置