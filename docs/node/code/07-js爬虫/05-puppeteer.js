const puppeteer = require('puppeteer')

async function test() {
    const options = {
        headless: false,
        defaultViewport: {
            width: 1400,
            height: 800
        }
    }
    const browser = await puppeteer.launch(options)
    const page = await browser.newPage()
    await page.goto('http://www.baidu.com')
}
test()