const { resolve } = require('path')
const readline = require('readline')
const {fsWrite, fsRead} = require('../02-文件操作/fsAction')

// 实例化接口对象
const res = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
// res.question('输入啥?', (answer) => {
//     console.log('答复:', answer);
//     res.close()
// })

// res.on('close', () => {
//     console.log('进程结束！');
// })

// 进一步封装
function myQuestion(question) {
    return new Promise((resolve, reject) => {
        res.question(question, (answer) => {
        // console.log('回答:', answer);
        resolve(answer)
        // res.close()

        }) 
    })

}

async function creatMyPackageJson() {
    const answer1 = await myQuestion('您的包名是什么?')
    const answer2 = await myQuestion('您的包名版本?')
    const answer3 = await myQuestion('您的包主程序入口是什么?')
    const answer4 = await myQuestion('您的包作者是谁?')
    await fsWrite('./myPackage.json', `{
        "name": "${answer1}",
        "version": "${answer2}",
        "main": "${answer3}",
        "author": "${answer4}",
        "license": "MIT",
        "devDependencies": {
          "@vuepress/plugin-back-to-top": "^1.9.7",
          "@vuepress/plugin-nprogress": "^1.9.7",
          "vuepress": "^1.9.7"
        },
        "scripts": {
          "docs:dev": "vuepress dev docs",
          "docs:build": "vuepress build docs"
        },
        "dependencies": {
          "typescript": "^4.6.3",
          "vuepress-plugin-auto-sidebar": "^2.3.2",
          "vuepress-plugin-code-copy": "^1.0.6"
        }
      }`
      )
      res.close()
}
creatMyPackageJson()