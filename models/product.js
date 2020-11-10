const { Schema, model } = require('mongoose')

const schema = new Schema({
    prodTitle: { type: String, required: true, },
    category: { type: Array, required: true },
    visible: { type: Boolean, required: true, default: false },
    price: { type: String, required: true },
    description: { type: String, required: true }
})

module.exports = model('Product', schema)