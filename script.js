const win =  [21/20, 11/10, 11/10, 11/10, 121/ 100,  11/10,   11/10, 11/10, 11/10, 11/10, 11/10, 11/10, 11/10, 21/20,   11/10, 11/10, 11/10, 27/25, 11/10, 11/10, 11/10, 11/10,   23/20, 10/9,  23/20, 23/20]
const draw = [12/5,  9/4, 9/4, 9/4, 59/25, 23/10,   23/10, 11/5,  9/4, 9/4, 9/4, 9/4, 9/4, 23/10,   9/4, 9/4, 9/4, 11/5,  11/5,  9/4, 227/ 100,  9/4,   12/5,  12/5,  12/5,  12/5]
const loss = [14/5,  13/5,  13/5,  13/5,  131/ 50, 5/2,   5/2, 11/4,  13/5,  13/5,  11/4,  13/5,  45/17, 13/5,    45/17, 45/17, 11/4,  27/10, 13/5,  13/5,  271/ 100,  45/17,   27/10, 14/5,  14/5,  27/10]

const getMaxOdds = (...lists) => lists.map((list) => Math.max(...list))
const getProfit = (...odds) => 1 - odds.reduce((acc, odd) => acc + 1 / odd , 0)
const getBets = (...odds) => odds.map((odd) => 1 / odd)


const odds = getMaxOdds(win, draw, loss)
const profit = getProfit(...odds)

const bet = [1.42, 3.93]
const testProfit = getProfit(...bet)
const testBet = getBets(...bet)

console.log({ odds, profit, testProfit, testBet })



