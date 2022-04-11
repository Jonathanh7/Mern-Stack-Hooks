const mongoose = require('mongoose')

let MONGODB_URI = process.env.PROD_MONGODB || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thirdItemsDatabase'

mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  console.log('Successfully connected to MongoDB')
}).catch(e => {
  console.error('Conection error', e.message)
})

const db = mongoose.connection

module.exports =  db