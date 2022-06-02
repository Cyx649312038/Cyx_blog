let axios = require('axios')
let {fsRead, fsWrite, fsDir} = require('./fsAction')
let httpUrl1 = 'https://www.1905.com/mdb/film/search/'
// 获取起始页面的所有分类
async function getClassUrl() {
    try {
        let res = await axios.get(httpUrl1)
        // console.log('起始页所有分类', res.data);
        const html = res.data 
        // 解析html内容
        let reg = /<dt>按类型(.*?)<dl class="srhGroup clear">/igs
        let result = reg.exec(html)
        // console.log('匹配到的html片段',result[1]);
        let reg2 = /<a href="(.*?)".*?>(.*?)<\/a>/igs
        var result2,arrClass = []
        while(result2 = reg2.exec(result)) {
            let obj = {
                className: result2[2],
                url:'https://www.1905.com/' + result2[1]
            }
            arrClass.push(obj)
            await fsDir('./movies/' + result2[2])
            getMovieUrl(obj.url,result2[2])
        }
    // console.log('匹配到的电影类型地址和类型名字',arrClass);
    } catch(err) {
        console.log('error', err);
    }
}
getClassUrl()
// 获取分类里的电影链接
async function getMovieUrl(url,moviesType) {
    let res = await axios.get(url)
    const html = res.data
    // 解析html内容
    let reg = /<li class="fl line"> <a href="(.*?)".*?><img/igs
    var result,arrClass = []
    while(result = reg.exec(html)) {
        arrClass.push('https://www.1905.com' + result[1])
        getMovieDetail('https://www.1905.com' + result[1],moviesType)
    }
    
    // console.log('匹配到的对应类型电影地址',arrClass);
}
// 根据电影链接获取电影的详情
async function getMovieDetail(url,moviesType) {
    try{
        let res = await axios.get(url)
        var html = res.data
        var arrClass = []
  // 解析html内容
        let reg = /<div class="container-right">.*?<h1>(.*?)<span>.*?<\/span>.*?<span class="score">.*?<div class="creator">.*?<div class="creator-name">(.*?)<\/div>.*?<span class="creator-class">导演<\/span>.*?<div class="plot">.*?<p>(.*?)<\/p>.*?<\/div>/igs
        // let reg = /<div class="container-right">.*?<h1>(.*?)<span>.*?<div class="creator-name">(.*?)<\/div>.*?<span class="creator-class">导演<\/span>.*?<div class="plot"><p>(.*?)<\/p>.*?<\/div>/igs
            // console.log('reg.exec(html)',reg.exec(html));
            while(result = reg.exec(html)) {
                // console.log('result',result,result[1],result[2],result[3]);
                var obj = {
                    title: result[1].trim(),
                    director: result[2],
                    content: result[3],
                    url,
                    moviesType
                }
                arrClass.push(obj)
                let content = JSON.stringify(obj)
                await fsWrite('./movies/' + moviesType + '/' + result[1].trim() + '.json', content)
        }

        // console.log('匹配到的对应类型电影详情',arrClass);
        
      
    } catch(err) {
        // console.log('error',err);
    }
    
}
