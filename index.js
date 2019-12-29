const superbet = require('./crawler/superbet')
const casapariurilo = require('./crawler/casapariurilor')
const unibet = require('./crawler/unibet')
const nightmare = require('./crawler')

Promise.resolve().then(async () => {
  await superbet()
  await casapariurilo()
  await unibet()
  await nightmare.end()
})
