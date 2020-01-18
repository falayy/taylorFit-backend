const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const maleMeasurementSchema = new Schema({
    neck_circumference : {
        type : Number
    },
    shoulder_breadth : {
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
    thigh : {
        type : Number
    },
    calf : {
        type : Number
    },
    wrist_circumference : {
        type : Number
    },
    arm_length : {
        type : Number
    },
    full_length : {
        type : Number
    },
})

const maleMeasurementModel = mongoose.model('maleModel', maleMeasurementSchema)
module.exports = maleMeasurementModel