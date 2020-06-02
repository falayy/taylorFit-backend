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
    gig_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gigModel'
    },
    measurement : {
        type : Map,
        of: String
    }
});



const FemaleModel = mongoose.model('FemaleModel', femaleMeasurementSchema);
module.exports = FemaleModel;