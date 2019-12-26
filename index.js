const superbetCrawler = require('./crawler/superbet')
const nightmare = require('./crawler')

Promise.resolve().then(async () => {
  await superbetCrawler()
  await nightmare.end()
})
