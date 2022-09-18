const { fetch } = require('undici')
const { write } = require('./write')

async function update () {
  const rawIndex = await fetch('https://nodejs.org/dist/index.json')
  const rawSchedule = await fetch('https://raw.githubusercontent.com/nodejs/Release/master/schedule.json')
  const index = await rawIndex.json()
  const schedule = await rawSchedule.json()

  write('../../test/data/static/index.json', index)
  write('../../test/data/static/schedule.json', schedule)
}

update()
