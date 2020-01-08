const Nightmare = require('nightmare')
const db = require('../db')
const superbet = require('./sites/superbet')
const casapariurilor = require('./sites/casapariurilor')
const unibet = require('./sites/unibet')
const betano = require('./sites/betano')
const fortuna = require('./sites/fortuna')
const { findArbitrage } = require('./utils')

module.exports = async () => {
  const nightmare = Nightmare({ show: true })
  await fortuna({ nightmare, db })
  await betano({ nightmare, db })
  await casapariurilor({ nightmare, db })
  await superbet({ nightmare, db })
  await unibet({ nightmare, db })
  await nightmare.end()

  findArbitrage({ db })
}