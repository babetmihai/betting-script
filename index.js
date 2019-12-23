const bet365Parser = require('./parsers/bet365')

bet365Parser.init()
  .then(() => bet365Parser.fetchOdds())
