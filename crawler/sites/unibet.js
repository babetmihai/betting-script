const { normalizeData } = require('../../db/utils')
const { ODD_TYPES } = require('../../settings')

module.exports  = async ({ nightmare, db }) => {
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
      const matches = document.querySelectorAll('.KambiBC-event-item.KambiBC-event-item--type-match')
      for (const match of matches) {
        const category = match.parentNode.parentNode.parentNode.querySelector('.KambiBC-mod-event-group-header__main-title').innerText.trim().toLowerCase()
        const teams = [...match.querySelectorAll('.KambiBC-event-participants__name')]
          .map((element) => element.innerText)
          .join(' - ')
        const odds = [...match.querySelectorAll('.KambiBC-mod-outcome__odds')]
          .reduce((oddAcc, element, index) => {
            const id = ODD_TYPES[index]
            const value = element.innerText.trim()
            oddAcc[id] = value
            return oddAcc
          }, {})
        matchAcc.push({ teams, odds, category })
      }
      return matchAcc
    }, ODD_TYPES)
    db.set('data.unibet', normalizeData(data)).write()
  } catch (error) {
    console.log(error)
  }
}
