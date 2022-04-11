const db = require('../db')
const Item = require('../models/item')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const main = async () => {
  const items = [
      { title: 'Moped', link: 'https://detroitmopedworks.com' },
      { title: 'iPad Mini', link: 'https://www.apple.com/ipad-mini' },
      { title: 'Electric Scooter', link: 'https://swagtron.com/electric-scooter' },
      { title: 'Monitor', link: 'https://www.asus.com/us/Monitors/MB168B' },
  ]

  await Item.insertMany(items)
  console.log("Created some items!")
}

const run = async () => {
  await main()
  db.close()
}
run()