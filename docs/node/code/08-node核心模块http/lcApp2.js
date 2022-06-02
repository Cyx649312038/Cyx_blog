const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

class lcApp {
    constructor() {
        this.server = http.createServer()
        // 路由列表
        this.reqEvent = {
            
        }
        this.staticDir = "/static"
        this.server.on('request', (req, res) => {
            const dir = req.url
            let pathObj = path.parse(dir)
            let reqState = false
            res.render = render
              // const dir = path.parse(url).dir
            // console.log('url,dir', url,dir);
            // console.log('path',path.parse(dir));
            // 循环匹配正则路径
            for(let key in this.reqEvent) {
                var regStr = key
                let reg = new RegExp(key, 'igs')
                if(reg.test(dir)) {
                    console.log('匹配');
                    reqState = true
                    res.setHeader('content-type', "text/html;charset=utf-8")
                    this.reqEvent[key](req, res)
                    break;
                }
            }
            if(!reqState) {
                if(pathObj.dir == this.staticDir) {
                    // console.log('this.getContentType(pathObj.ext)',pathObj.ext,this.getContentType(pathObj.ext));
                    res.setHeader('content-type', this.getContentType(pathObj.ext))
                    let rs = fs.createReadStream('./static/' + pathObj.base )
                    console.log('res', res);
                    rs.pipe(res)
                } else {
                    res.setHeader('content-type', "text/html;charset=utf-8")
                    res.end('404 not found')
                }
            }
            
        })
    }
    // 注册路由函数
    on(dir,callback) {
        this.reqEvent[dir] = callback
    }
    // 服务器启动函数
    run(port, callback) {
        this.server.listen(port, callback)
    }
    getContentType(extName) {
        switch(extName) {
            case '.jpeg':
                return "image/jpeg";
            case '.html':
                return "text/html;charset=utf-8";
            case ".json":
                return "text/json;charset=utf-8"
            case ".gif":
                return "image/gif"
        }
    }
}

function render(options,path) {
    fs.readFile(path,{encoding: 'utf-8', flag:'r'},(err, data) => {
        if(err) {
            console.log(err);
        } else {
            // console.log('data',data);
            // 匹配普通的变量并且替换内容
            // let reg = /\{\{(.*?)\}\}/igs
            // let result
            // while (result = reg.exec(data)) {
            //     console.log('reg',result);
            //     var data = data.replace(result[0], options[result[1].trim()])
            // }
            data = replaceArr(data, options)
            data = replaceVal(data, options)
            // console.log(data);
            // 匹配列表项
            // let reg2 = /\{\%for \{(.*?)\} \% \}(.*?)\{\%endfor\%\}/
            // let listStr = ''
            // while(result = reg2.exec(data)) {
            //     console.log('reg2',result);
            //     var starsList = options[result[1].trim()]
            //     console.log('starsList', starsList);
            //     starsList.forEach(item => {
            //         listStr += replaceVal(result[2], {"item": item})
            //     })
            //     data = data.replace(result[0], listStr)
            // }
            
            this.end(data)
        }
    })

}

function replaceVal(data, options) {
    let reg = /\{\{(.*?)\}\}/igs
    let result
    while (result = reg.exec(data)) {
        // console.log('reg',result);
        let strKey = result[1].trim()
        data = data.replace(result[0], eval('options.' + strKey))
    }
    return data
}

function replaceArr(data, options) {
    console.log('data',data);
    let reg2 = /\{\%for \{(.*?)\} \% \}(.*?)\{\%endfor\%\}/igs
    let listStr = ''
    while(result = reg2.exec(data)) {
        console.log('reg2',result);
        var starsList = options[result[1].trim()]
        console.log('starsList', starsList)
        starsList.forEach(item => {
            listStr += replaceVal(result[2], {"item": item})
        })
        data = data.replace(result[0], listStr)
    }
    return data
}

module.exports = lcApp