const superbetCrawler = require('./crawlers/superbet')

Promise.resolve().then(async () => {
  await superbetCrawler()
})
