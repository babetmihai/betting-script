const superbetCrawler = require('./crawler/superbet')
const casapariurilorCrawler = require('./crawler/casapariurilor')
const nightmare = require('./crawler')

Promise.resolve().then(async () => {
  await casapariurilorCrawler()
  // await superbetCrawler()
  await nightmare.end()
})
