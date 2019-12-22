const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: true,
  // switches: {
  //   'proxy-server': 'http://82.77.55.46:8080',
  //   'ignore-certificate-errors': true
  // },
  waitTimeout: 5000
})

const contentQuery = `
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
`

module.exports = async () => {
  try {
    const values = []
    const groups = await nightmare.goto('https://www.bet365.com/#/AS/B1/')
      .wait('.sm-SplashMarket')
      .wait(1000)
      .evaluate(({ contentQuery }) => {
        const groupContainer = document.querySelector(contentQuery)

        const groups = []
        for (const element of [...groupContainer.childNodes]) {
          try {
            const group = element.querySelector('.sm-SplashMarket_Header').innerText.trim()
            const open = !!element.querySelector('.sm-SplashMarketContainer_Expanded')
            groups.push({ open, group })
          } catch (error) {
            // nothing
          }

        }
        return groups
      }, { contentQuery })

    for (const { open, group } of groups) {
      if (!open) {
        nightmare.evaluate(({ contentQuery, group }) => {
          const groupContainer = document.querySelector(contentQuery)
          const button = [...groupContainer.children]
            .find((element) => element.querySelector('.sm-SplashMarket_Header').innerText.includes(group))
          button.click()
        }, { contentQuery, group })
      }

      await nightmare.wait(1500)
      const categories = await nightmare.evaluate(({ contentQuery, group }) => {
        const groupContainer = document.querySelector(contentQuery)
        const listContainer = [...groupContainer.children]
          .find((element) => element.querySelector('.sm-SplashMarket_Header').innerText.includes(group))
          .querySelector('.sm-SplashMarketContainer_Expanded')

        return [...listContainer.children].map((element) => element.innerText.trim())
      }, { contentQuery, group })
      await nightmare.wait(1500)

      for (const category of categories) {
        await nightmare.evaluate(({ contentQuery, group, category }) => {
          const groupContainer = document.querySelector(contentQuery)
          const listContainer = [...groupContainer.children]
            .find((element) => element.querySelector('.sm-SplashMarket_Header').innerText.includes(group))
            .querySelector('.sm-SplashMarketContainer_Expanded')
          const button = [...listContainer.children]
            .find((element) => element.innerText.includes(category))

          button.click()
        }, { contentQuery, group, category })

        await nightmare.wait('.gl-MarketGrid.gl-MarketGrid-paddingforlhs')
        await nightmare.wait(1500)

        const odds = await nightmare.evaluate(() => {
          return document.querySelector(`
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
            `).innerHTML
        })
        values.push(odds)

        await nightmare.back()
        await nightmare.wait(1000)
      }
    }
    await nightmare.end()
    return values
  } catch (error) {
    // nothing
  }
}
