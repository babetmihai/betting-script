const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

module.exports = async () => {
  const lists = await nightmare
    .goto('https://www.bet365.com/#/AC/B1/C1/D13/E108/F16')
    .wait('.sl-CouponParticipantWithBookCloses_Name')
    .evaluate(() => {
      return  [...document.querySelectorAll('.cm-CouponMarketGroup')]
        .map((element) => {
          const labels = [...element.querySelectorAll('.sl-CouponParticipantWithBookCloses_Name')]
          const odds = [...element.querySelectorAll('.gll-ParticipantOddsOnly_Odds')]
          return {
            labels: labels.map((label) => label.innerText),
            odds: odds.map((odd) => odd.innerText)
          }
        })
    })
    .end()

  return lists
    .map((list) => {
      const { labels, odds } = list
      const count = odds.length / labels.length
      return labels.map((label, index) => ({
        label,
        odds: [...Array(count)].map((_, column) => {
          return odds[column * labels.length + index]
        })
      }))
    })
    .flat()
}
