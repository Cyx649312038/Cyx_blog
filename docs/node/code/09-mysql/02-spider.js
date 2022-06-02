const mysql = require('mysql')
const axios = require('axios')
const cheerio = require('cheerio')
let option = {
    host: "localhost",
    port: "3306", //默认就是3306可选设置
    user: "root",
    password: "cyx123456",
    database: "user"
}

// 创建与数据库的连接对象
let con = mysql.createConnection(option)
// 建立连接
con.connect(err => {
    if(err) {
        console.log('error',err);
    } else {
        console.log('连接数据库成功!');
    }
})

// 爬取单页面所有书籍数据
async function getPageData() {
    try {
        const res = await axios.get('https://sobooks.net/')
        // console.log('res',res);
        let $ = cheerio.load(res.data)
        // console.log(" $('card-item thumb-img > a')", $('.card-item .thumb-img > a'));
        $('.card-item .thumb-img>a').each((i,ele) => {
            // console.log(ele);
            let bookurl = $(ele).attr('href')
            // console.log('bookurl',bookurl);
            getPageDetail(bookurl)
        })
    } catch(err) {
        console.log('error',err);
    }
   
}
getPageData()

// 爬取单本书籍数据
async function getPageDetail(bookurl) {
    try {
        const res = await axios.get(bookurl)
        // console.log('res',res);
        let $ = cheerio.load(res.data)
        const imgurl = $('.book-left .item .bookpic > img').attr('src')
        // console.log('imgurl', imgurl);
        const bookname = $('.book-left .item .bookinfo li:nth-child(1)').text().substring(3)
        // console.log('bookname',bookname);
        const author = $('.book-left .item .bookinfo li:nth-child(2)').text().substring(3)
        const tag = $('.book-left .item .bookinfo li:nth-child(4)').text().substring(3)
        const pubtime = $('.book-left .item .bookinfo li:nth-child(5)').text().substring(3)
        const score = $('.book-left .item .bookinfo li:nth-child(6) b').attr('class').replace(/[^\d.]/g, "");
        const abrief = $('.book-left .item .bookinfo li:nth-child(6) b').text()
        // console.log('info',score );
        // const score = $('.book-left .item .bookinfo li:nth-child(5)').text()
        const strSql = "insert into book (bookname, author, tag, pubtime, score, bookurl, imgurl) values(?, ?, ?, ?, ?, ?, ?)"
        con.query(strSql, [bookname, author, tag, pubtime , score, bookurl, imgurl ], function(err,result) {
            console.log('error',err);
            console.log('插入成功',result);
        })
    }catch(error) {
        console.log('error',error);
    }
}
