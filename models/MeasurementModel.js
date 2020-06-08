const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const measurementSchema = new Schema({
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



const MeasurementModel = mongoose.model('FemaleModel', measurementSchema);
module.exports = MeasurementModel;