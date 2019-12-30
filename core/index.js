const db = require('../db')

const getMaxOdds = (...lists) => lists.map((list) => Math.max(...list))
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const getBets = (...odds) => odds.map((odd) => 1 / odd)


const findArbitrage = async () => {
  const data = db.get('data')
}

module.exports = {
  findArbitrage
}