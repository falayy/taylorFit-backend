const mongoose = require("../database/mongoose");
const MaleMeasurement = require("../models/maleMeasure");
const FemaleMeasurement = require("../models/femaleMeasure");
const { Schema } = mongoose

const gigSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    customer :{
        required : true
    },
    male_measurement: {
        MaleMeasurement,
        default : null
    },
    female_measurement :{
        default : null,
        FemaleMeasurement
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
module.exports = gigModel;