const axios = require('axios')
//网上找的免费代理
let options = {
    proxy: {
        host: '222.74.73.202',
        port: 42055
    }
}
try {
    axios.get('https://www.fabiaoqing.com/bqb/lists/type/hot/page/1.html',options).then((res) => {
        console.log('res', res);
    })
}catch(err) {
    console.log('error',err);
}
