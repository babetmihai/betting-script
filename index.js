const nightmare = require('./crawler')

const superbet = require('./crawler/superbet')
const casapariurilor = require('./crawler/casapariurilor')
const unibet = require('./crawler/unibet')
const betano = require('./crawler/betano')


Promise.resolve().then(async () => {
  await betano()
  await casapariurilor()
  await superbet()
  await unibet()
  await nightmare.end()
})
