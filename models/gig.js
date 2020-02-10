const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const gigSchema = new Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    customer_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    title: {
        type: String,
        required: true,
    },
    delivery_date: {
        type: Number,
        required: true,
    },
    style: [String],
    notes : {
        type: String,
    },
    is_done :{
        type : Boolean
    }
})

const gigModel = mongoose.model('gigModel', gigSchema)
module.exports = gigModel;