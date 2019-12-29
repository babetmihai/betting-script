const crypto = require('crypto')
const _ = require('lodash')
const {
  ODD_TYPES,
  CATEGORY_WHITELIST,
  CATEGORY_BLACKLIST
} = require('./settings')

const getMaxOdds = (...lists) => lists.map((list) => Math.max(...list))
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const getBets = (...odds) => odds.map((odd) => 1 / odd)
const getId = (string) => crypto.createHash('sha1').update(string).digest('hex')

const normalizeData = (data) => data
  .filter(({ odds, category }) =>  (
    !CATEGORY_BLACKLIST.some((name) => category.toLowerCase().includes(name)) &&
    CATEGORY_WHITELIST.some((name) => category.toLowerCase().includes(name)) &&
    _.isEqual(ODD_TYPES.sort(), Object.keys(odds).sort())
  ))
  .reduce((acc, { teams, odds, category, ...rest }) => {
    const match = { id: getId(teams), teams, odds, category, ...rest }
    acc[match.id] = match
    return acc
  }, {})

module.exports = {
  normalizeData,
  getMaxOdds,
  getProfit,
  getBets,
  getId
}
