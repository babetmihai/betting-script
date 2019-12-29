const crypto = require('crypto')
const _ = require('lodash')
const getMaxOdds = (...lists) => lists.map((list) => Math.max(...list))
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const getBets = (...odds) => odds.map((odd) => 1 / odd)

const getId = (string) => crypto.createHash('sha1').update(string).digest('hex')

const ODD_TYPES = ['1', 'X', '2']
const CATEGORIES = ['fotbal, basket, handbal, hockey']

const normalizeData = (data) =>  data.reduce((acc, { teams, odds, category, ...rest }) => {
  const match = { id: getId(teams), teams, odds, category, ...rest }
  if (
    _.isEqual(ODD_TYPES.sort(), Object.keys(odds).sort()) &&
    CATEGORIES.some((name) => category.includes(name.toLowerCase()))
  ) acc[match.id] = match
  return acc
}, {})

module.exports = {
  normalizeData,
  getMaxOdds,
  getProfit,
  getBets,
  getId,
  ODD_TYPES
}
