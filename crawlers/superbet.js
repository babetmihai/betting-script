const db = require('../core/lowdb')
const nightmare = require('../core/nightmare')
const { toId } = require('../utils')

module.exports  = async () => {
  try {
    await nightmare
      .goto('https://www.superbet.ro/pariuri-sportive/astazi')
      .wait('.event-row-container')
      .wait(1000)

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

          data.push({ team1, team2, odds })
          lastEvent = event
        }
        lastEvent.scrollIntoView()

        return data

      })

      db.set('superbet', quotes)
        .write()

      break

    }

  } catch (error) {
    console.log(error.message)
  }
}

