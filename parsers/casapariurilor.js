const Nightmare = require('nightmare')
const db = require('../db')

const nightmare = Nightmare({
  show: true,
  // switches: {
  //   'proxy-server': 'http://82.77.55.46:8080',
  //   'ignore-certificate-errors': true
  // },
  waitTimeout: 30000
})

module.exports  = async () => {
  try {
    const quotes = await nightmare
      .goto('https://www.superbet.ro/pariuri-sportive/astazi')
      .wait()
      .evaluate(() => {})
    db.set('quotes.casapariurilor.quotes',  quotes)
      .write()

  } catch (error) {
    console.log(error.message)
  }

}

