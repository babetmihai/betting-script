const db = require('../db')
const nightmare = require('../crawler')

module.exports  = async () => {
  try {
    await nightmare
      .goto('https://www.superbet.ro/pariuri-sportive/astazi')
      .wait('.event-row-container')
      .wait(1000)
    const data = []
    while (true) {
      const quotes = await nightmare.evaluate(() => {
        const data = []
        let lastEvent
        const events = document.querySelectorAll('.event-row-container')
        for (const event of events) {
          const team1 = event.querySelector('.event-summary__competitors-team1').innerText
          const team2 = event.querySelector('.event-summary__competitors-team2').innerText
          const odds = [...event.querySelectorAll('.pick__click-buffer')]
            .filter((element) => ['X', '1', '2'].includes(element.querySelector('.market.actionable').innerText))
            .map((element) => element.querySelector('.value.new.actionable').innerText)

          data.push({ teams: `${team1} - ${team2}`, odds })
          lastEvent = event
        }
        lastEvent.scrollIntoView()
        return data

      })
      console.log(data[data.length - 1], quotes[quotes.length - 1])
      if (data[data.length - 1] && data[data.length - 1].teams === quotes[quotes.length - 1].teams) {
        data.push(...quotes)
        break
      } else {
        data.push(...quotes)
      }
      await nightmare.wait(1000)
    }

    db.set('superbet', data)
      .write()
  } catch (error) {
    console.log(error.message)
  }
}

