const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    basket: [{ type: Types.ObjectId, ref: 'Product' }],
    status: { type: String, default: 'Ожидается подтверждение' },
    totalPrice: { type: Number,},
    customer: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: String, required: false },
    deliveryMethod: { type: String, default: 'Неизвестно' },
    deliveryPrice: { type: Number, default: 0 },
    comment: { type: String },
    orderDate: { type: String, required: false },
    time: { type: String, required: false },
    ended: { type: Boolean, default: false }
})

module.exports = model('Order', schema)
