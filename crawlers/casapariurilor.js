
const db = require('../core/lowdb')
const nightmare = require('../core/nightmare')

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

