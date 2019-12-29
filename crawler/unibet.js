const db = require('../db')
const nightmare = require('../crawler')
const { getId } = require('../utils')
const _ = require('lodash')

const ODD_TYPES = ['1', 'X', '2']
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
    db.set('unibet', data.reduce((acc, { teams, odds }) => {
      const match = { id: getId(teams), teams, odds }
      if (_.isEqual(ODD_TYPES.sort(), Object.keys(odds).sort())) acc[match.id] = match
      return acc
    }, {})).write()
  } catch (error) {
    console.log(error.message)
  }
}
