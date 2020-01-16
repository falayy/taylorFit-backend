const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const gigSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    customer :{
        required : true
    },
    measurement: {
        type: String,
        unique: true,
        required: true
    },
    delivery_date: {
        type: Number,
        required: true,
    },
    style: [{
        type: String,
    }],
    notes : {
        type: String,
    }
})

const gigModel = mongoose.model('gigModel', gigSchema)
module.exports = gigModel