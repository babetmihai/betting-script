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
    const dataAcc = []
    while (true) {
      const newData = await nightmare.evaluate(() => {
        let lastMatch
        const newDataAcc = []
        const matches = document.querySelectorAll('.event-row-container')
        for (const match of matches) {
          const team1 = match.querySelector('.event-summary__competitors-team1').innerText
          const team2 = match.querySelector('.event-summary__competitors-team2').innerText
          const odds = [...match.querySelectorAll('.pick__click-buffer')]
            .reduce((oddAcc, element) => {
              const id = element.querySelector('.market.actionable').innerText
              const value = element.querySelector('.value.new.actionable').innerText
              oddAcc[id] = value
              return oddAcc
            }, {})
          newDataAcc.push({ teams: `${team1} - ${team2}`, odds })
          lastMatch = match
        }
        lastMatch.scrollIntoView()
        return newDataAcc
      })

      if (_.isEqual(_.last(dataAcc), _.last(newData))) break
      dataAcc.push(...newData)
      await nightmare.wait(1000)
    }

    db.set('superbet', dataAcc.reduce((acc, { teams, odds }) => {
      const match = { id: getId(teams), teams, odds }
      acc[match.id] = match
      return acc
    }, {}))
      .write()
  } catch (error) {
    console.log(error.message)
  }
}
