const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const maleMeasurementSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    gig_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gigModel'
    },
    measurement : {
        type : Map,
        of: String
    }
});
    // neck_circumference: {
    //     type: Number
    // },
    // shoulder_breadth: {
    //     type: Number
    // },
    // chest_circumference: {
    //     type: Number
    // },
    // waist_circumference: {
    //     type: Number
    // },
    // hips_circumference: {
    //     type: Number
    // },
    // thigh: {
    //     type: Number
    // },
    // calf: {
    //     type: Number
    // },
    // wrist_circumference: {
    //     type: Number
    // },
    // arm_length: {
    //     type: Number
    // },
    // full_length: {
    //     type: Number
    // }


const MaleModel = mongoose.model('MaleModel', maleMeasurementSchema);
module.exports = MaleModel;