const crypto = require('crypto')
const _ = require('lodash')
const {
  ODD_TYPES,
  CATEGORIES,
  CATEGORY_BLACKLIST
} = require('../settings')

const getId = (string) => crypto.createHash('sha1').update(string).digest('hex')
const normalizeData = (data) => data
  .filter(({ odds, category }) =>  (
    !CATEGORY_BLACKLIST.some((name) => category.toLowerCase().includes(name)) &&
    CATEGORIES.some((name) => category.toLowerCase().includes(name)) &&
    _.isEqual([...ODD_TYPES].sort(), Object.keys(odds).sort())
  ))
  .reduce((acc, { teams, odds, category, ...rest }) => {
    const match = {
      id: getId(teams),
      teams,
      odds: Object.keys(odds).reduce((oddAcc, odd) => {
        oddAcc[odd] = Number(odds[odd].replace(',', '.'))
        return oddAcc
      }, {}),
      category,
      ...rest
    }
    acc[match.id] = match
    return acc
  }, {})

module.exports = {
  normalizeData,
  getId
}
