const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })


const run = async () => {
  const result = await nightmare
  .goto('https://www.bet365.com/#/AC/B1/C1/D13/E108/F16')
  .wait('.cm-CouponModule')
  .evaluate(() => document.querySelector('body').innerHTML)
  .end()
  console.log(result)
}


run()