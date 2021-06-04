const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    count: { type: Number, required: true },
    date: { type: String }
})

module.exports = model('Shipment', schema)