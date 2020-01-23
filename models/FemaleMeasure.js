const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const femaleMeasurementSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    gigs_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gigModel'
    },
    shoulder_shoulder: {
        type: Number
    },
    bust_line: {
        type: Number
    },
    sbust_round: {
        type: Number
    },
    under_bust: {
        type: Number
    },
    natural_waist_line: {
        type: Number
    },
    natural_waist_round: {
        type: Number
    },
    hip_line: {
        type: Number
    },
    hip_round: {
        type: Number
    },
    full_length: {
        type: Number
    },
    arm_hole: {
        type: Number
    },
    arm_round: {
        type: Number
    },
    sleeve_length: {
        type: Number
    },
    half_sleeve: {
        type: Number
    }
})

const FemaleModel = mongoose.model('FemaleModel', femaleMeasurementSchema);
module.exports = FemaleModel;