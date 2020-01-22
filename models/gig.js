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
    }
});

const femaleMeasurementSchema = new Schema({
    shoulder_shoulder: {
        type: Number
    },
    bust_line: {
        type : Number
    },
    bust_round : {
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
});

const gigSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    customer :{
        type : Number,
        required : true
    },
    male_measurement: {
        measuement : maleMeasurementSchema
    },
    female_measurement :{
        measurement : femaleMeasurementSchema
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