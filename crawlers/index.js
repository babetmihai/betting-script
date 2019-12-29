const Nightmare = require('nightmare')

const nightmare = Nightmare({
  show: true,
  waitTimeout: 30000
})

module.exports = nightmare