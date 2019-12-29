const db = require('../db')
const nightmare = require('../crawler')
const { normalizeData } = require('../utils')
const { ODD_TYPES } = require('../settings')
const _ = require('lodash')

const CAROUSEL_ITEMS = ['Fotbal', 'Handbal', 'Hochei pe Gheata']

module.exports  = async () => {
  try {
    await nightmare
      .goto('https://sport.netbet.ro/')
      .wait('.tab-switch-btns-holder')
      .wait(500)
      .evaluate(() => {
        const button = document.querySelector('.tab-switch-btns-holder>ul>li:last-child').parentNode.parentNode
        button.click()
      })
      .wait('.rj-carousel-item__sportName')
      .wait(1000)
    const data = []
    for (const category of CAROUSEL_ITEMS) {
      await nightmare
        .evaluate((category) => {
          const carousel = document.querySelector('.rj-carousel-container')
          const button = [...carousel.querySelectorAll('.rj-carousel-item__sportName')]
            .find((element) => element.innerText.includes(category))
          button.click()
        }, category)
        .wait('.rj-ev-list__ev-card')
        .wait(1000)


      while (true) {
        const pageMatches = await nightmare.evaluate(({ ODD_TYPES, category }) => {
          let lastMatch
          const matchAcc = []
          const matches = document.querySelectorAll('.event-row-container')
          for (const match of matches) {
            const team1 = match.querySelector('.event-summary__competitors-team1').innerText
            const team2 = match.querySelector('.event-summary__competitors-team2').innerText
            const odds = [...match.querySelectorAll('.pick__click-buffer')]
              .reduce((oddAcc, element) => {
                const id = element.querySelector('.market.actionable').innerText
                const value = element.querySelector('.value.new.actionable').innerText.trim()
                if (ODD_TYPES.includes(id)) oddAcc[id] = value
                return oddAcc
              }, {})
            matchAcc.push({ teams: `${team1} - ${team2}`, odds, category })
            lastMatch = match
          }
          lastMatch.scrollIntoView()
          return matchAcc
        }, { ODD_TYPES, category })

        if (_.isEqual(_.last(data), _.last(pageMatches))) break
        data.push(...pageMatches)
        await nightmare.wait(1000)
      }
    }


    db.set('superbet', normalizeData(data)).write()
  } catch (error) {
    console.log(error)
  }
}
