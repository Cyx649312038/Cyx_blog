const lcApp = require('./lcApp')
const path = require('path')
const app = new lcApp()
app.staticDir = "/cc"
app.on('/', (req,res) => {
    // console.log('访问根目录');
    // res.setHeader('content-type', "text/html;charset=utf-8")
    res.end('<h1>这是根目录</h1> <img src="./cc/img1.jpeg"/>')
})
app.on('/gnxw ', (req,res) => {
    // console.log('访问国内新闻目录目录');
    // res.setHeader('content-type', "text/html;charset=utf-8")
    if(path.parse(req.url).base === 'index') {
        res.end('这是国内新闻首页')
    } else {
        res.end('这是国内新闻的其他页面')
    }
})
app.on('/movies', (req,res ) => {
    // console.log('访问国内新闻目录目录');
    let movies = [
        {
            name: 'movie0',
            discription: 'movie0 description',
            author: 'movie0 author',
            stars: [
                {
                    name: 'star1',
                    gender: '男',
                    age: 18
                },
                {
                    name: 'star2',
                    gender: '女',
                    age: 18
                },
                {
                    name: 'star2',
                    gender: '男',
                    age: 18
                },
            ]
        },
        {
            name: 'movie1',
            discription: 'movie1 description',
            author: 'movie1 author',
            stars: [
                'star1',
                'star2',
                'star3'
            ]
        },
    ]
    // console.log(path.parse(req.url));
    let index = path.parse(req.url).base
    if(index == 0) {
        res.render(movies[index],'./template/index.html')
    } else {
        res.render(movies[index],'./template/index1.html')
    }
    // res.render(movies[index],'./template/index.html')
    // res.end(movies[index].name)
})

app.run('3001', () => {
    console.log('服务器启动！', 'http://30.43.99.238/');
})

