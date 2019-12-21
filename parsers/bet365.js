const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: true,
  switches: {
    'proxy-server': 'http://82.77.55.46:8080',
    'ignore-certificate-errors': true
  },
  waitTimeout: 1000000000
})

const links = [
  'https://www.bet365.com/#/AC/B1/C1/D13/E37628398/F2/', // premier league
  'https://www.bet365.com/#/AC/B1/C1/D13/E42493286/F2/', // la liga
  'https://www.bet365.com/#/AC/B1/C1/D13/E42856517/F2/', // seria A
  'https://www.bet365.com/#/AC/B1/C1/D13/E108/F16' // europa elite
]

const getList = async () => {
  const lists = await nightmare
    .goto('https://www.bet365.com/#/AC/B1/C1/D13/E37628398/F2')
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

module.exports = async () => {
  const values = []
  for (const index in [...Array(31)]) {
    const item = await nightmare
      .goto('https://www.bet365.com/#/AS/B1/')
      .wait('.sm-CouponLink_Title ')
      .wait(1000)
      .evaluate((index) => {
        try {
          const button = document.querySelector(`
            body 
            > div:nth-child(1) 
            > div > div.wc-PageView 
            > div.wc-PageView_Main 
            > div 
            > div.wcl-CommonElementStyle_PrematchCenter.wc-SplashPage_CenterColumn 
            > div.sm-SplashModule 
            > div.gl-MarketGrid.gl-MarketGrid-paddingforlhs 
            > div:nth-child(2) 
            > div.gl-MarketGroup_Wrapper.sm-SplashMarketGroup_Container 
            > div 
            > div:nth-child(2) 
            > div.sm-SplashMarketContainer_Expanded
            > div:nth-child(${index + 1})
          `)

          button.click()
        } catch (error) {
          // nothing
        }

      }, index)
      .wait('.gll-ParticipantOddsOnly_Odds')
      .wait(1000)
      .evaluate(() => document.body.innerHTML)

    values.push(item)
  }

  nightmare.end()
  return values
}
