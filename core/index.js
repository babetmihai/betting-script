const db = require('../db')
const { ODD_TYPES } = require('../settings')
const stringSimilarity = require('string-similarity')
const _ = require('lodash')

const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const isSameName = (first, second) => stringSimilarity.compareTwoStrings(first, second) > .5

const findArbitrage = async () => {
  const data = db.get('data').value()
  const matches = Object.keys(data)
    .reduce((acc, key) => {
      acc.push(...Object.values(data[key]).map(({ teams }) => teams))
      return acc
    }, [])
    .reduce((acc, name) => {
      const similarName = acc.find((accName) => isSameName(accName, name))
      if (!similarName) acc.push(name)
      return acc
    }, [])
    .map((name) => Object.keys(data).reduce((acc, key) => {
      const similarMatch = Object.values(data[key])
        .find(({ teams }) => isSameName(teams, name))
      if (similarMatch) acc.push({ house: key, ...similarMatch })
      return acc
    }, []))
    .filter((matches) => matches.length > 1)
    .map((matches) => {
      const bestOdds = matches.reduce((acc, { odds }) => {
        ODD_TYPES.forEach((odd) => {
          acc[odd] = Math.max(...[
            acc[odd],
            Number(odds[odd].replace(',', '.'))
          ].filter(Boolean))
        })
        return acc
      }, {})
      const title = _.first(matches).teams
      return { title, bestOdds, profit: getProfit(...Object.values(bestOdds)) }
    })

  console.log(matches)
}

module.exports = {
  findArbitrage
}