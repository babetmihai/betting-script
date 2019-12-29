const superbet = require('./crawler/superbet')
const casapariurilor = require('./crawler/casapariurilor')
const unibet = require('./crawler/unibet')
const nightmare = require('./crawler')

Promise.resolve().then(async () => {
  await casapariurilor()
  await superbet()

  await unibet()
  await nightmare.end()
})
