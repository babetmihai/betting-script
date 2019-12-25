const Nightmare = require('nightmare')

const nightmare = Nightmare({
  show: true,
  // switches: {
  //   'proxy-server': 'http://82.77.55.46:8080',
  //   'ignore-certificate-errors': true
  // },
  waitTimeout: 30000
})

module.exports = nightmare