const db = require('../db')
const stringSimilarity = require('string-similarity')
const _ = require('lodash')

const getMaxOdds = (...lists) => lists.map((list) => Math.max(...list))
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const getBets = (...odds) => odds.map((odd) => 1 / odd)


const findArbitrage = async () => {
  const data = db.get('data').value()

  const matches = Object.keys(data)
    .reduce((acc, key) => {
      acc.push(...Object.values(data[key]).map(({ teams }) => teams))
      return acc
    }, [])
    .sort()
    .reduce((acc, name) => {
      const previousName = _.last(acc)
      if (!previousName || stringSimilarity.compareTwoStrings(previousName, name) < .6) {
        acc.push(name)
      }
      return acc
    }, [])

  console.log(matches)
  console.log(stringSimilarity.compareTwoStrings('ASV Hamm-Westfalen - Gummersbach Vfl',
    'ASV Hamm-Westfalen - VfL Gummersbach'))
}

module.exports = {
  findArbitrage
}