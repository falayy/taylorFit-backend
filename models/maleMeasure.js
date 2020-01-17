const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const maleMeasurementSchema = new Schema({
    neck_circumference : {
        type : Number
    },
    mini_sleeve: {
        type : Number
    },
    midi_sleeve: {
        type : Number
    },
    long_sleeve: {
        type : Number
    },
    round_wrist: {
        type : Number
    },
    shoulder_breadth : {
        type : Number
    },
    shoulder_to_crotch : {
        type : Number
    },
    chest_circumference : {
        type : Number
    },
    waist_circumference : {
        type : Number
    },
    hips_circumference : {
        type : Number
    },
    crotch_to_ankle : {
        type : Number
    },
    knee_length : {
        type : Number
    },
    thigh : {
        type : Number
    },
    calf : {
        type : Number
    },
    ankle : {
        type : Number
    },
    arm_circumference : {
        type : Number
    },
    forearm_circumference : {
        type : Number
    },
    wrist_circumference : {
        type : Number
    },
    arm_length : {
        type : Number
    },
    short_sleeve : {
        type : Number
    },
    full_length : {
        type : Number
    },
})

const maleMeasurementModel = mongoose.model('maleModel', maleMeasurementSchema)
module.exports = maleMeasurementModel