const cheerio = require('cheerio')
const axios = require('axios')
const {fsWrite, fsDir} = require('./fsAction')
const path = require('path')
const fs = require('fs')

const httpUrl = 'https://www.fabiaoqing.com/bqb/lists/type/hot/page/1.html'
// 获取页面总数
async function getPageTotal() {
    const res = await axios.get(httpUrl)
    const $ = cheerio.load(res.data)
    let pageTotal = $('.pagination a').eq($('.pagination a').length - 3).text().trim()
    console.log(pageTotal);
    return pageTotal
    // $('.pagination a').length
}

// 获取页面表情包栏目链接
function fetchPage(pageNum) {
    try {
        let url = `https://www.fabiaoqing.com/bqb/lists/type/hot/page/${pageNum}.html`
        axios.get(url).then((res) => {
            // console.log('爬取数据', res.data);
            const $ = cheerio.load(res.data)
            $('#bqblist .bqba').each(async (index, ele) => {
                // console.log('https://www.fabiaoqing.com/'+$(ele).attr('href'));
                const baseUrl = 'https://www.fabiaoqing.com/'+$(ele).attr('href')
                const title = $(ele).find('h1').text()
                // console.log(title);
                await fsDir('./img/' + title)
                // 爬太多会报503，所以这里先爬一点
                // if(index === 0) {
                    parseUrl(baseUrl, title)
                // }
            })
        })
    } catch(err) {
        console.log('error', err);
    }
    
}


// 解析不同栏目下所有图片的信息
async function parseUrl(url, title) {
    try {
        const res = await axios.get(url)
        const $ = cheerio.load(res.data)
        $('.swiper-wrapper .bqppdiv1 img').each(async (index, ele) => {
            // console.log($(ele).attr('data-original'));
            imgSrc = $(ele).attr('data-original')
            const extName = path.extname(imgSrc)
            const ws = fs.createWriteStream(`./img/${title}/${title}-${index}${extName}`)
            // await fsWrite('./img/' + title + '/', )
            const res2 = await axios.get(imgSrc, {responseType: 'stream'})
            res2.data.pipe(ws)
        })
    } catch(err) {
        console.log('error', err);
    }
   
}
// 循环去抓取页面内容
async function spider() {
    let pageTotal = await getPageTotal()
    // console.log('pageTotal',pageTotal);
    for (var i = 1; i <= pageTotal; i++) {
        // console.log('for ', pageTotal, i);
        fetchPage(i)
    }
}

spider()
