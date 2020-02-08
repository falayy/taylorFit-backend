const mongoose = require("../database/mongoose");
const jwt = require('jsonwebtoken');
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

function generateToken(id) {
    var token = jwt.sign({ _id: id.toHexString() }, 'abc123').toString();
    return token;
}


const UserModel = mongoose.model('UserModel', userSchema)
module.exports = {UserModel , findByToken, generateToken} 
