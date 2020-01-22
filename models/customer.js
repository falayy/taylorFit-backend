const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    gigs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gigModel',
    }]
})

const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer;