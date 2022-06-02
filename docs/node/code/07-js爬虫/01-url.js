const url = require('url')
console.log(url);
console.log(url.parse('https://www.bilibili.com/video/BV1i7411G7kW?p=9&spm_id_from=pageDriver'));
// Url {
//     protocol: 'https:',
//     slashes: true,
//     auth: null,
//     host: 'www.bilibili.com',
//     port: null,
//     hostname: 'www.bilibili.com',
//     hash: null,
//     search: '?p=9&spm_id_from=pageDriver',
//     query: 'p=9&spm_id_from=pageDriver',
//     pathname: '/video/BV1i7411G7kW',
//     path: '/video/BV1i7411G7kW?p=9&spm_id_from=pageDriver',
//     href: 'https://www.bilibili.com/video/BV1i7411G7kW?p=9&spm_id_from=pageDriver'
//   }

let targetUrl = 'http://www.baidu.com',
    httpUrl = './text/cyx.html'
let newUrl = url.resolve(targetUrl, httpUrl)
console.log('newUrl', newUrl);
// http://www.baidu.com/text/cyx.html