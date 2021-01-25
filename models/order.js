const { Schema, model, Types } = require('mongoose')

const schema = new Schema({

    orderNumber: { type: String, required: true, unique: true },
    basket: [{ type: Types.ObjectId, required: true }],
    status: { type: String, required: true, default: 'Ожидается подтверждение' },
    totalPrice: { type: String, required: true },
    customer: { type: String, required: true },
    phone: { type: String, required: true },

    address: { type: String, required: true }

})

module.exports = model('Order', schema)