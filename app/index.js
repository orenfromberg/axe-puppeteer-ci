const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer')

if (process.argv.slice(2).length == 0) { 
  console.error("please specify a website")
} else {
  ;(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()
    await page.setBypassCSP(true)
  
    await page.goto(process.argv[2])
  
    const results = await new AxePuppeteer(page).analyze()
    console.log(JSON.stringify(results))
  
    await page.close()
    await browser.close()
  })()
}

