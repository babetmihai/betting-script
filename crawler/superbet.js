const db = require('../db')
const nightmare = require('../crawler')
const { getId } = require('../utils')
const _ = require('lodash')

const ODD_TYPES = ['1', 'X', '2']
module.exports  = async () => {
  try {
    await nightmare
      .goto('https://www.superbet.ro/pariuri-sportive/astazi')
      .wait('.event-row-container')
      .wait(1000)
    const data = []
    while (true) {
      const pageMatches = await nightmare.evaluate((ODD_TYPES) => {
        let lastMatch
        const matchAcc = []
        const matches = document.querySelectorAll('.event-row-container')
        for (const match of matches) {
          const team1 = match.querySelector('.event-summary__competitors-team1').innerText
          const team2 = match.querySelector('.event-summary__competitors-team2').innerText
          const odds = [...match.querySelectorAll('.pick__click-buffer')]
            .reduce((oddAcc, element) => {
              const id = element.querySelector('.market.actionable').innerText
              const value = element.querySelector('.value.new.actionable').innerText
              if (ODD_TYPES.includes(id)) oddAcc[id] = value
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

    db.set('superbet', data.reduce((acc, { teams, odds }) => {
      const match = { id: getId(teams), teams, odds }
      if (_.isEqual(ODD_TYPES.sort(), Object.keys(odds).sort())) acc[match.id] = match
      return acc
    }, {})).write()
  } catch (error) {
    console.log(error.message)
  }
}
