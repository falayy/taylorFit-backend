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
        type: String,
        required: true,
    },
    style_name : {
        type: String,
    },
    style: [String],
    notes : {
        type: String,
    },
    price : {
        type: Number,
    },
    is_done :{
        type : Boolean,
        default : false
    }
})

const gigModel = mongoose.model('gigModel', gigSchema)
module.exports = gigModel;