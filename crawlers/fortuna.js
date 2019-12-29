const db = require('../db')
const nightmare = require('.')
const { normalizeData } = require('../utils')
const { ODD_TYPES } = require('../settings')


module.exports  = async () => {
  try {
    await nightmare
      .goto('https://agentii.efortuna.ro/ocurrent;current=0')
      .wait('.offrz')
      .wait(1000)

    const data = await nightmare.evaluate((ODD_TYPES) => {
      const matchAcc = []
      const matches = document.querySelectorAll('.offrzin>tbody>tr>td.ofmatch')
      for (const teamNode of matches) {
        const category = teamNode
          .parentNode
          .parentNode
          .parentNode
          .parentNode
          .querySelector('.sportliga').innerText.split('/')[0].trim().toLowerCase()
        const teams = teamNode.innerText.trim()
        const odds = ODD_TYPES.reduce((oddAcc, id, index) => {
          const valueNode = [...teamNode.parentNode.querySelectorAll('.oftip')][index]
          if (valueNode) oddAcc[id] = valueNode.innerText.trim()
          return oddAcc
        }, {})
        matchAcc.push({ teams, category, odds })
      }
      return matchAcc
    }, ODD_TYPES)
    db.set('fortuna', normalizeData(data)).write()
  } catch (error) {
    console.log(error)
  }
}
