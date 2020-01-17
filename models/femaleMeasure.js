const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const femaleMeasurementSchema = new Schema({
    shoulder_shoulder: {
        type: Number
    },
    bust_line: {
        type : Number
    },
    sbust_round : {
        type : Number
    },
    under_bust : {
        type : Number
    },
    natural_waist_line : {
        type : Number
    },
    natural_waist_round : {
        type : Number
    },
    hip_line: {
        type : Number
    },
    hip_round : {
        type : Number
    },
    full_length : {
        type : Number
    },
    arm_hole : {
        type : Number
    },
    arm_round : {
        type : Number
    },
    sleeve_length: {
        type : Number
    },
    half_sleeve: {
        type : Number
    }
})

const femaleMeasurementModel = mongoose.model('femaleModel', femaleMeasurementSchema)
module.exports = femaleMeasurementModel