const nightmare = require('./crawler')

const superbet = require('./crawler/superbet')
const casapariurilor = require('./crawler/casapariurilor')
const unibet = require('./crawler/unibet')
const betano = require('./crawler/betano')
const fortuna = require('./crawler/fortuna')
const netbet = require('./crawler/netbet')

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
