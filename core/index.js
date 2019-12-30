const db = require('../db')
const stringSimilarity = require('string-similarity')
const _ = require('lodash')

const getMaxOdds = (...lists) => lists.map((list) => Math.max(...list))
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd, 0)
const getBets = (...odds) => odds.map((odd) => 1 / odd)

const isSameName = (first, second) => stringSimilarity.compareTwoStrings(first, second) > .5

const findArbitrage = async () => {
  const data = db.get('data').value()
  const matches = Object.keys(data)
    // get match list
    .reduce((acc, key) => {
      acc.push(...Object.values(data[key]).map(({ teams }) => teams))
      return acc
    }, [])
    // filter duplicates
    .reduce((acc, name) => {
      const similarName = acc.find((accName) => isSameName(accName, name))
      if (!similarName) acc.push(name)
      return acc
    }, [])
    // get match stats for each house
    .map((name) => Object.keys(data).reduce((acc, key) => {
      const similarMatch = Object.values(data[key])
        .find(({ teams }) => isSameName(teams, name))
      if (similarMatch) acc.push({ house: key, ...similarMatch })
      return acc
    }, []))
    // only use matches with multiple houses
    .filter((matches) => matches.length > 1)

  console.log(matches)
}

module.exports = {
  findArbitrage
}