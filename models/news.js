const { Schema, model } = require('mongoose')
const dateParse = require('../middleware/dateParser')

const schema = new Schema({
    newsTitle: { type: String, required: true, },
    category: { type: Array, required: true },
    text: { type: String },
    date: { type: Date, default: Date.now() },
    newsDate: { type: String, default: dateParse(Date.now()) },
    discription: { type: String },
    visible: { type: Boolean },
    views: { type: Number, default: 0 }
})

module.exports = model('News', schema)