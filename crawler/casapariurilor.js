
const db = require('../db')
const nightmare = require('../crawler')

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

