const { normalizeData } = require('../../db/utils')
const { ODD_TYPES } = require('../../settings')

const URL_CODES = {
  fotbal: 'Soccer-FOOT',
  handbal: 'Handball-HAND',
  hockey: 'Ice-Hockey-ICEH'
}


module.exports  = async ({ nightmare, db }) => {
  try {
    const data = []
    for (const category in URL_CODES) {
      await nightmare
        .goto(`https://ro.betano.com/Upcoming24H/${URL_CODES[category]}`)
        .wait('.tab-content')
        .wait(1000)
      const pageMatches = await nightmare.evaluate(({ category, ODD_TYPES }) => {
        const matchAcc = []
        const matches = document.querySelectorAll('.tab-content>table>tbody>tr.table-row')
        for (const match of matches) {
          const teams = match.querySelector('.js-event-click.event-title').innerText.trim()
          const odds = [...match.querySelectorAll('.price-selection')]
            .reduce((oddAcc, element, index) => {
              const id = ODD_TYPES[index]
              const value = element.innerText.trim()
              oddAcc[id] = value
              return oddAcc
            }, {})
          matchAcc.push({ teams, odds, category })
        }
        return matchAcc
      }, { category, ODD_TYPES })
      data.push(...pageMatches)
    }
    db.set('data.betano', normalizeData(data)).write()
  } catch (error) {
    console.log(error)
  }
}