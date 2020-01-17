const mongoose = require("../database/mongoose");
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    business_name: {
        type: String,
        unique: true,
        required: true
    },
    phone_number: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
})

function findByToken(token) {
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123')
    } catch (e) {
        return Promise.reject();
    }
    var response = UserModel.findOne({
        '_id': decoded._id,
        token
    });
    return response;
}


const UserModel = mongoose.model('userModel', userSchema)
module.exports = {UserModel , findByToken}
