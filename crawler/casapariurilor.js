const db = require('../db')
const nightmare = require('../crawler')
const { getId } = require('../utils')
const _ = require('lodash')
const moment = require('moment')

const ODD_TYPES = ['1', 'X', '2']
module.exports  = async () => {
  try {
    await nightmare
      .goto(`https://www.casapariurilor.ro/Sports/offer?date=${moment().format('dd.mm.yyyy')}`)
      .wait('.js-psk-event-container')
      .wait(1000)
    const data = []
    while (true) {
      const pageMatches = await nightmare.evaluate((ODD_TYPES) => {
        let lastMatch
        const matchAcc = []
        const matches = document.querySelectorAll('.event-layout')
        for (const match of matches) {
          const [team1, team2] = [...match.querySelectorAll('.event-header-team')]
            .map((element) => element.innerText)
          const odds = [...match.querySelectorAll('.bet-pick')]
            .slice(0, 3)
            .reduce((oddAcc, element, index) => {
              oddAcc[ODD_TYPES[index]] = element.innerText
              return oddAcc
            }, {})
          matchAcc.push({ teams: `${team1} - ${team2}`, odds })
          lastMatch = match
        }
        lastMatch.scrollIntoView()
        return matchAcc
      }, ODD_TYPES)

      if (_.isEqual(_.last(data), _.last(pageMatches))) break
      data.push(...pageMatches)
      await nightmare.wait(1000)
    }

    db.set('casapariurilor', data.reduce((acc, { teams, odds }) => {
      const match = { id: getId(teams), teams, odds }
      if (_.isEqual(ODD_TYPES.sort(), Object.keys(odds).sort())) acc[match.id] = match
      return acc
    }, {})).write()
  } catch (error) {
    console.log(error.message)
  }
}
