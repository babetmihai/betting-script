const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/data.json')
const low = require('lowdb')

const db = low(adapter)
module.exports = db