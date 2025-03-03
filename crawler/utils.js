const { ODD_TYPES } = require('../settings')
const stringSimilarity = require('string-similarity')
const _ = require('lodash')

const getTeams = (name) => name.split('-').map((team) => team.trim())
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const isSameName = (first, second) => {
  const firstTeams = getTeams(first)
  const secondTeams = getTeams(second)
  return (
    stringSimilarity.compareTwoStrings(firstTeams[0], secondTeams[0]) > .50 &&
    stringSimilarity.compareTwoStrings(firstTeams[1], secondTeams[1]) > .50
  )
}
const findArbitrage = async ({ db }) => {
  const data = db.get('data').value()
  const arbitrage = Object.keys(data)
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
      const { values, houses } = matches.reduce((acc, { odds, house }) => {
        ODD_TYPES.forEach((odd) => {
          const value = Math.max(acc.values[odd], odds[odd])
          acc.houses[odd] = odds[odd] === value
            ? house
            : acc.houses[odd]
          acc.values[odd] = value
        })
        return acc
      }, {
        values: { 'X': 0,  '1': 0, '2': 0 },
        houses: {}
      })
      return {
        title: _.first(matches).teams,
        category: _.first(matches).category,
        houses,
        values,
        profit: getProfit(...Object.values(values))
      }
    })
    .sort((first, second) => first.profit - second.profit)
  db.set('arbitrage', arbitrage).write()
  console.log(arbitrage)
}

module.exports = {
  findArbitrage
}