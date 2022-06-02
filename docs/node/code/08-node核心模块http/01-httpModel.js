let http = require('http')

// 创建server服务器对象
let server = http.createServer()
// 监听对当前服务器对象的请求
server.on('request', function(req,res) {
    // 当服务器被请求时会触发请求事件，并传入请求对象和响应对象
    // console.log('req',req);å
    console.log(req.url)
    // console.log(req.headers)
    // 设置响应头
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    // 根据路径信息显示页面不同内容
    if(req.url == '/'){
        res.end('<h1>首页</h1> <img src="https://s.cn.bing.net/th?id=OHR.KornatiNP_ZH-CN8829346235_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&qlt=30"/>')
    } else if(req.url == '/gnxw' ) {
        res.end('国内新闻')
    } else if(req.url == '/favicon.ico') {
        res.end('favicon.ico')
    }
     else {
        res.end('404 Not Found!')
    }
})

// 服务器监听的端口(默认端口号是80)
server.listen('3001', () => {
    // 启动监听端口号成功时触发
    console.log('服务器启动成功!');
})