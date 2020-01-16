const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');


class Usercontroller {
    /**
     * User signs up with 
     * @name
     * @phone_number
     * @password
     * @business_name
     */
    signUp(req, res) {
        const { name, phone_number, password, business_name } = req.body;
        if (!name || !phone_number || !password || !business_name) {
            return res.json({
                error: true,
                message: 'pass the required fields, boss, thanks.'
            });
        }
        User.find({ phone_number })
            .then((data) => {
                if (data) {
                    res.status(409).json({
                        statusCode: 409,
                        message: 'phone number exists'
                    })
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hashed = bcrypt.hashSync(req.body.password, salt);
                    User.create({
                        name: req.body.name,
                        phone_number: req.body.phone_number,
                        password: hashed,
                        business_name: req.body.business_name
                    }).then(async (user) => {
                        const token = generateToken(user._id);
                        const user_object = User.findOne({_id: user_res._id })


                    })

                }
            })
    }

}
