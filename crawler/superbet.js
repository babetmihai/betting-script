const db = require('../db')
const nightmare = require('../crawler')
const { getId } = require('../utils')
const _ = require('lodash')

module.exports  = async () => {
  try {
    await nightmare
      .goto('https://www.superbet.ro/pariuri-sportive/astazi')
      .wait('.event-row-container')
      .wait(1000)
    const data = []
    while (true) {
      const quotes = await nightmare.evaluate(() => {
        let lastMatch
        const acc = []
        const matches = document.querySelectorAll('.event-row-container')
        for (const match of matches) {
          const team1 = match.querySelector('.event-summary__competitors-team1').innerText
          const team2 = match.querySelector('.event-summary__competitors-team2').innerText
          const odds = [...match.querySelectorAll('.pick__click-buffer')]
            .reduce((acc, element) => {
              const id = element.querySelector('.market.actionable').innerText
              const value = element.querySelector('.value.new.actionable').innerText
              acc[id] = value
              return acc
            }, {})
          acc.push({ teams: `${team1} - ${team2}`, odds })
          lastMatch = match
        }
        lastMatch.scrollIntoView()
        return acc

      })

      if (_.isEqual(_.last(data), _.last(quotes))) break
      data.push(...quotes)
      await nightmare.wait(1000)
    }

    db.set('superbet', data.reduce((acc, { teams, odds }) => {
      const match = { id: getId(teams), teams, odds }
      acc[match.id] = match
      return acc
    }, {}))
      .write()
  } catch (error) {
    console.log(error.message)
  }
}
