const crypto = require('crypto')

const getMaxOdds = (...lists) => lists.map((list) => Math.max(...list))
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const getBets = (...odds) => odds.map((odd) => 1 / odd)

const getId = (string) => crypto.createHash('sha1').update(string).digest('hex')

module.exports = {
  getMaxOdds,
  getProfit,
  getBets,
  getId
}
