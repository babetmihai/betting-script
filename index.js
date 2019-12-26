const superbetCrawler = require('./crawlers/superbet')
const nightmare = require('./core/nightmare')

Promise.resolve().then(async () => {
  await superbetCrawler()
  await nightmare.end()
})
