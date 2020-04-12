const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    gigs : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gigModel'
    },
    user_id : {
        ref : 'UserModel',
        type: mongoose.Schema.Types.ObjectId,
    }
})

const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer;