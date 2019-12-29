const nightmare = require('./crawlers')

const superbet = require('./crawlers/superbet')
const casapariurilor = require('./crawlers/casapariurilor')
const unibet = require('./crawlers/unibet')
const betano = require('./crawlers/betano')
const fortuna = require('./crawlers/fortuna')
const netbet = require('./crawlers/netbet')

Promise.resolve()
  .then(async () => {
    await netbet()
    // await fortuna()
    // await betano()
    // await casapariurilor()
    // await superbet()
    // await unibet()
  })
  // .finally(() => nightmare.end())
