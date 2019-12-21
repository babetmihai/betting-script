const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: true,
  switches: {
    'proxy-server': 'http://82.77.55.46:8080',
    'ignore-certificate-errors': true
  },
  waitTimeout: 25000
})

module.exports = async () => {
  try {
    const values = []
    const items = await nightmare.goto('https://www.bet365.com/#/AS/B1/')
      .wait('.sm-SplashMarket')
      .wait(1000)
      .evaluate(() => {
        const items = document.querySelector(`
          body 
            > div:nth-child(1) 
            > div 
            > div.wc-PageView 
            > div.wc-PageView_Main 
            > div 
            > div.wcl-CommonElementStyle_PrematchCenter.wc-SplashPage_CenterColumn 
            > div.sm-SplashModule 
            > div.gl-MarketGrid.gl-MarketGrid-paddingforlhs 
            > div:nth-child(2) 
            > div.gl-MarketGroup_Wrapper.sm-SplashMarketGroup_Container
            > div.gl-MarketGroupContainer
            > div:nth-child(2)
            > div:nth-child(2)
          `)
        return [...items.childNodes].map((element) => element.innerText)
      })
    for (const text of items) {
      console.log(text)
      try {
        const item = await nightmare
          .wait(1000)
          .evaluate((text) => {
            const buttons = document.querySelector(`
              body 
              > div:nth-child(1) 
              > div 
              > div.wc-PageView 
              > div.wc-PageView_Main 
              > div 
              > div.wcl-CommonElementStyle_PrematchCenter.wc-SplashPage_CenterColumn 
              > div.sm-SplashModule 
              > div.gl-MarketGrid.gl-MarketGrid-paddingforlhs 
              > div:nth-child(2) 
              > div.gl-MarketGroup_Wrapper.sm-SplashMarketGroup_Container
              > div.gl-MarketGroupContainer
              > div:nth-child(2)
              > div:nth-child(2)
            `)

            const button = [...buttons.children].find((element) => element.innerText.includes(text))
            button && button.click()

          }, text)
          .wait('.gll-MarketGroup_Wrapper')
          .wait(1000)
          .evaluate(() => {
            const quotes = document.querySelector(`
              body 
              > div:nth-child(1) 
              > div 
              > div.wc-PageView 
              > div.wc-PageView_Main 
              > div 
              > div.wcl-CommonElementStyle_PrematchCenter 
              > div.cm-CouponModule 
              > div 
              > div.gll-MarketGroup.cm-CouponMarketGroup.cm-CouponMarketGroup_DropdownIsAvailable.cm-CouponMarketGroup_Open 
              > div.gll-MarketGroup_Wrapper
            `)
            return quotes.innerHTML
          })

        values.push(item)
        nightmare.back()
      } catch (error) {
      // nothing
      }
    }
    await nightmare.end()
    return values
  } catch (error) {
    // nothing
  }
}
