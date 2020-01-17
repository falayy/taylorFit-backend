const User = require('../models/User');
const Customer = require('../models/customer');
const Gig = require('../models/gig')
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');


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
            return res.status(409).json({
                error: true,
                message: 'pass the required fields, boss, thanks.'
            });
        }
        User.find({ phone_number })
            .then((data) => {
                if (data) {
                    res.status(409).json({
                        error: true,
                        code: 409,
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
                        const user_object = await User.findOne({ _id: user_res._id });
                        user_object.token = token;
                        user_object.save().then((data) => {
                            res.status(200).json({
                                error: false,
                                code: 201,
                                message: 'user registered',
                                user: {
                                    id: data._id,
                                    token: data.token,
                                    name: data.name
                                }
                            })
                        }).catch((e) => {
                            res.status(200).json({
                                error: true,
                                code: 401,
                                message: 'unable to register user',
                                data: e
                            })
                        })
                    })
                }
            })
    }

    signIn(req, res) {
        User.findOne({ phone_number: req.body.phone_number })
            .then((user) => {
                if (!user) {
                    res.status(409).json({
                        error: true,
                        code: 409,
                        message: 'phone number does not exist'
                    })
                } else {
                    var result = bcrypt.compareSync(req.body.password, user.password);
                    if (result) {
                        const token = generateToken(user._id);
                        user.token = token;
                        user.save().then((data) => {
                            res.status(200).json({
                                error: false,
                                code: 201,
                                message: 'user signed in',
                                user: {
                                    id: data._id,
                                    token: data.token,
                                    name: data.name
                                }
                            })
                        }).catch((e) => {
                            res.status(400).json({
                                error: false,
                                code: 201,
                                message: 'unable to sign user in',
                            })
                        })
                    } else {
                        res.status(400).json({
                            error: false,
                            code: 400,
                            message: 'incorrect password',
                        })
                    }
                }
            })
    }

    /**
     * Todo @forgot_password_function
     */

    /**
     * user's can their @create_customer
     */

    createCustomer(req, res) {
        Customer.create({
            name: req.body.name,
            phone_number: req.body.phone_number,
            gender: req.body.gender
        }).then((data) => {
            res.status(200).json({
                error: false,
                code: 201,
                message: 'customer created successfully',
                customer: {
                    id: data._id,
                    phone_number: data.phone_number,
                    name: data.name
                }
            })
        })
    }
    /**
     * @function_to_create_gig
     */

    createGig(req, res) {
        var dateStamp = req.body.delivery_date;
        var date = dateStamp;
        Gig.create({
            title: req.body.title,
            customer: id,
            delivery_date: date,
            notes: req.body.notes
        }).then((data) => {

        }).catch((e) => {

        })
    }

    /**
     * @function_to_update
     */
    updateGig(req, res) {
        const id = req.body.id;
        const body = _.pick(req.body, ['delivery_date', 'notes']);
        Gig.findByIdAndUpdate(id, { $set: body }, { new: true })
            .then((data) => {

            }).catch((e) => {

            })
    }

    createMaleMeasurement(req, res) {

    }

    createFemaleMeasurement(req, res) {

    }

    updateMaleMeasurement(req, res) {

    }

    updateFemaleMeasurement(req, res) {

    }

    getCustomers(req, res){
      Customer.find({})
      .then((data) =>{

      }).catch((e) =>{

      })
    }

    getGigs(req, res){
        Gig.find({customer : _id})
        .then((data) =>{

        }).catch((e) =>{

        })
    }



}
