const db = require('../db')
const nightmare = require('../crawler')
const { normalizeData, ODD_TYPES } = require('../utils')
const _ = require('lodash')

module.exports  = async () => {
  try {
    await nightmare
      .goto('https://www.unibet.ro/betting/sports/filter/all/all/all/all/starting-soon')
      .wait('.KambiBC-collapsible-header')
      .wait(1000)

    await nightmare.evaluate(() => {
      const headers = document.querySelectorAll('.KambiBC-mod-event-group-header__event-count')
      for (const header of headers) {
        header.click()
      }
    })
    await nightmare.wait(1000)
    await nightmare.evaluate(() => {
      const subHeaders = document.querySelectorAll('.KambiBC-betoffer-labels__event-count')
      for (const subHeader of subHeaders) {
        subHeader.click()
      }
    })
    await nightmare.wait(1000)
    const data = await nightmare.evaluate((ODD_TYPES) => {
      const matchAcc = []
      const matches = document.querySelectorAll('.KambiBC-event-item__event-wrapper')
      for (const match of matches) {
        const teams = [...match.querySelectorAll('.KambiBC-event-participants__name')]
          .map((element) => element.innerText)
          .join(' - ')

        const odds = [...match.querySelectorAll('.KambiBC-mod-outcome__odds')]
          .reduce((oddAcc, element, index) => {
            const id = ODD_TYPES[index]
            const value = element.innerText
            oddAcc[id] = value
            return oddAcc
          }, {})
        matchAcc.push({ teams, odds })
      }
      return matchAcc
    }, ODD_TYPES)
    db.set('unibet', normalizeData(data)).write()
  } catch (error) {
    console.log(error.message)
  }
}
