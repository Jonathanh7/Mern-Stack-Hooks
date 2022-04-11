const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Item = new Schema(
  {
    title: { type: String, required: true },
   link: {type: String, required: true} 
  },
  {timestamps: true}
)

module.exports = mongoose.model('items', Item)