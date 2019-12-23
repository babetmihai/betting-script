const Nightmare = require('nightmare')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const crypto = require('crypto')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ categories: {} }).write()

const nightmare = Nightmare({
  show: true,
  // switches: {
  //   'proxy-server': 'http://82.77.55.46:8080',
  //   'ignore-certificate-errors': true
  // },
  waitTimeout: 30000
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

const init = async () => {
  try {
    if (db.get('categories').size() > 0) return

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

        const url = await nightmare.url()
        await nightmare.wait(1000)

        const id = crypto.createHash('sha1').update(category).digest('hex')
        db.set(`categories.${id}`, { id, category, group, url })
          .write()

        await nightmare.back()
        await nightmare.wait(1000)
        if (!open) {
          nightmare.evaluate(({ contentQuery, group }) => {
            const groupContainer = document.querySelector(contentQuery)
            const button = [...groupContainer.children]
              .find((element) => element.querySelector('.sm-SplashMarket_Header').innerText.includes(group))
            button.click()
          }, { contentQuery, group })
        }
        await nightmare.wait(1000)
      }
    }
    await nightmare.end()
  } catch (error) {
    console.log(error)
  }
}

const fetchOdds = async () => {
  const categoryList = Object.values(db.get('categories').value())
  for (const category of categoryList) {
    try {
      const lists = await nightmare
        .goto(category.url)
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
      db.set(`categories.${category.id}.labels`,  lists
        .map(({ labels, odds }) => {
          return labels.map((label, index) => ({
            label,
            odds: [...Array(odds.length / labels.length)]
              .map((_, column) =>  odds[column * labels.length + index])
          }))
        })
        .flat())
        .write()

    } catch (error) {
      console.log(error.message)
    }

  }
}

module.exports = {
  fetchOdds,
  init
}