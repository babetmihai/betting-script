const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

const links = [
  'https://www.bet365.com/#/AC/B1/C1/D13/E37628398/F2/', // premier league
  'https://www.bet365.com/#/AC/B1/C1/D13/E42493286/F2/', // la liga
  'https://www.bet365.com/#/AC/B1/C1/D13/E42856517/F2/' // seria A

]

module.exports = async () => {
  const lists = await nightmare
    .goto('https://www.bet365.com/#/AC/B1/C1/D13/E108/F16')
    .wait('.sl-CouponParticipantWithBookCloses_Name')
    .evaluate(() => {
      return  [...document.querySelectorAll('.cm-CouponMarketGroup')]
        .map((element) => {
          const labels = [...element.querySelectorAll('.sl-CouponParticipantWithBookCloses_Name')]
            .map((label) => label.innerText)
          const odds = [...element.querySelectorAll('.gll-ParticipantOddsOnly_Odds')]
            .map((odd) => odd.innerText)
          return { labels, odds }
        })
    })
    .end()

  return lists
    .map(({ labels, odds }) => {
      return labels.map((label, index) => ({
        label,
        odds: [...Array(odds.length / labels.length)]
          .map((_, column) =>  odds[column * labels.length + index])
      }))
    })
    .flat()
}
