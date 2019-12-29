const db = require('../db')
const nightmare = require('../crawler')
const _ = require('lodash')
const { normalizeData } = require('../utils')
const { ODD_TYPES } = require('../settings')
const moment = require('moment')

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
        const matches = document.querySelectorAll('.event-layout:not(.has-filter)')
        for (const match of matches) {
          const category = match.parentNode.parentNode.parentNode.querySelector('.header-group-title').innerText.split(' - ')[0].trim().toLowerCase()
          const [team1, team2] = [...match.querySelectorAll('.event-header-team')]
            .map((element) => element.innerText)
          const odds = [...match.querySelectorAll('.bet-pick')]
            .slice(0, 3)
            .reduce((oddAcc, element, index) => {
              oddAcc[ODD_TYPES[index]] = element.innerText
              return oddAcc
            }, {})
          matchAcc.push({ teams: `${team1} - ${team2}`, odds, category })
          lastMatch = match
        }
        lastMatch.scrollIntoView()
        return matchAcc
      }, ODD_TYPES)

      if (_.isEqual(_.last(data), _.last(pageMatches))) break
      data.push(...pageMatches)
      await nightmare.wait(1000)
    }

    db.set('casapariurilor', normalizeData(data)).write()
  } catch (error) {
    console.log(error.message)
  }
}
