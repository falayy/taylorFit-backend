const { UserModel, generateToken, findByToken } = require('../models/User');
const Customer = require('../models/customer');
const MeasurementModel = require('../models/MeasurementModel');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const Gig = require('../models/gig')
const bcrypt = require('bcrypt');
const moment = require('moment');



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
        UserModel.findOne({ phone_number: req.body.phone_number })
            .then((data) => {
                if (data) {
                    res.status(400).json({
                        error: true,
                        message: 'phone number exists'
                    })
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hashed = bcrypt.hashSync(req.body.password, salt);
                    UserModel.create({
                        name: req.body.name,
                        phone_number: req.body.phone_number,
                        password: hashed,
                        business_name: req.body.business_name,
                    }).then(async (user) => {
                        const token = generateToken(user._id);
                        const user_object = await UserModel.findOne({ _id: user._id });
                        user_object.token = token;
                        user_object.save()
                            .then((data) => {
                                res.status(200).json({
                                    error: false,
                                    message: 'user registered',
                                    data: {
                                        id: data._id,
                                        token: data.token,
                                        name: data.name
                                    }
                                })
                            }).catch((e) => {
                                res.status(401).json({
                                    error: true,
                                    message: 'unable to register user',
                                    data: e
                                })
                            })
                    })
                }
            })
    }



    signIn(req, res) {
        UserModel.findOne({ phone_number: req.body.phone_number })
            .then((user) => {
                if (!user) {
                    res.status(401).json({
                        error: true,
                        message: 'phone number does not exist'
                    })
                } else {
                    var result = bcrypt.compareSync(req.body.password, user.password);
                    if (result) {
                        const token = generateToken(user._id);
                        user.token = token;
                        user.save().then((user) => {
                            res.status(200).json({
                                error: false,
                                message: 'user signed in',
                                data: {
                                    id: user._id,
                                    token: user.token,
                                    name: user.name
                                }
                            })
                        })
                    } else {
                        res.status(400).json({
                            error: false,
                            message: 'incorrect password'
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
            user_id: req.body.user_id,
            name: req.body.name,
            phone_number: req.body.phone_number,
            gender: req.body.gender
        }).then((data) => {
            res.status(200).json({
                error: false,
                message: 'customer created successfully',
                data: {
                    id: data._id,
                    phone_number: data.phone_number,
                    name: data.name
                }
            })
        }).catch((e) => {
            res.status(400).json({
                error: false,
                message: 'unable to create customer'
            })
        })
    }
    /**
     * @function_to_create_gig
     */

    async createGig(req, res) {
        const customer_id = req.body.customer_id;
        const customer = await Customer.findById({ _id: customer_id});
        const customerGender = customer.gender;
        Gig.create({
            user_id: req.body.user_id,
            customer_id: req.body.customer_id,
            title: req.body.title,
            price: req.body.price,
            delivery_date: req.body.date,
            style_name: req.body.style_name,
            style: req.body.style,
            notes: req.body.notes
        }).then( async (data) => {
            res.status(200).json({
                error: false,
                message: 'gig created successfully',
                data: {
                    id: data._id,
                    gender: customerGender,
                    title: data.title
                }
            })
            const customer = await Customer.findById({ _id: customer_id});
            customer.gigs = data._id;
            customer.save().then((data) =>{
                console.log("up", data)
            })
        }).catch((e) => {
            res.status(401).json({
                error: true,
                message: 'unable to create gig',
                data: e
            })
        })
    }

    /**
     * @measurement_functions
     */

    async createMeasurement(req, res) {
            MeasurementModel.create({
                user_id: req.body.user_id,
                customer_id: req.body.customer_id,
                gig_id: req.body.gig_id,
                measurement : req.body.measurement
            }).then((data) => {
                res.status(200).json({
                    error: false,
                    message: 'measurement created successfully',
                    data: {
                        id: data._id,
                        measurement : data.measurement
                    }
                })
            }).catch((e) => {
                res.status(401).json({
                    error: true,
                    message: 'unable to create measurement',
                    data: e
                })

            })
    }

    

    /**
     * @get_customers {get customers with id and subtle detail,
     *  then get other details with the id}
     */

    getCustomerPendingGig(req, res) {
        Customer.find({user_id : req.header("user_id")}).populate('gigs')
            .exec((error, _data) => {
                if (error) console.log(error)
                const data = _data.map(element => {
                    const query = element.gigs;
                    const customer_name = element.name;
                    const customer_number = element.phone_number;
                    const customer_gender = element.gender;
                    const gig_title = query.title;
                    const delivery_date = query.delivery_date;
                    const style_name = query.style_name;
                    const style = query.style;
                    const price = query.price;
                    const notes = query.notes;
                    const is_done = query.is_done;
                    const customer_id = element._id;
                    const gig_id = query._id;
                    if(!is_done) {
                        return {
                            customer_id,
                            customer_name,
                            customer_number,
                            customer_gender,
                            gig_title,
                            delivery_date,
                            style_name,
                            style,
                            price,
                            notes,
                            is_done,
                            gig_id
                        }
                    }
                })
                res.status(200).json({
                    error: false,
                    message: 'pending customer info returned',
                    data
                })
            })
    }

    getCustomerCompletedGig(req, res) {
        Customer.find({user_id : req.header("user_id")}).populate('gigs')
            .exec((error, _data) => {
                if (error) console.log(error)
                const data = _data.map(element => {
                    const query = element.gigs;
                    const customer_name = element.name;
                    const customer_number = element.phone_number;
                    const customer_gender = element.gender;
                    const gig_title = query.title;
                    const delivery_date = query.delivery_date;
                    const style_name = query.style_name;
                    const style = query.style;
                    const price = query.price;
                    const notes = query.notes;
                    const is_done = query.is_done;
                    const customer_id = element._id;
                    const gig_id = query._id;
                    if(is_done){
                        return {
                            customer_id,
                            customer_name,
                            customer_number,
                            customer_gender,
                            gig_title,
                            delivery_date,
                            style_name,
                            style,
                            price,
                            notes,
                            is_done,
                            gig_id
                        }
                    }
                })
                res.status(200).json({
                    error: false,
                    message: 'completed customer info returned',
                    data
                })
            })
    }
    /**
     *  @get_measurement
     */

    async getCustomerMeasurement(req, res) {
        const customer_id = req.header('customer_id')
        const gig_id = req.header('gig_id')
            MeasurementModel.findOne({ customer_id,  gig_id })
                .then((data) => {
                    res.status(200).json({
                        error: false,
                        message: 'measurement info returned',
                        data
                    }).catch((e) => {
                        res.status(400).json({
                            error: true,
                            message: 'unable to get measurement',
                        })
                    })
                })
        }
    

    /**
     * @get_user_details for dashboard shenanigans
     */

    getUserInfo(req, res) {
        const token = req.header('x-auth');
        findByToken(token).then((user) => {
            res.status(200).json({
                error: false,
                message: 'user info returned',
                data: {
                    business_name: user.business_name,
                    phone_number: user.phone_number,
                    username: user.name
                }
            })
        }).catch((e) => {
            res.status(400).json({
                error: true,
                message: 'unable to get user info',
            })
        })
    }

    /**
     * @add_to_done
     */

    async addToDone(req, res) {
        const id = req.body.gig_id;
        const gig_object = await Gig.findOne({ customer_id: req.body.customer_id, _id: id });
        gig_object.is_done = true;
        gig_object.save().then((data) => {
            res.status(200).json({
                error: false,
                code: 201,
                message: 'gig marked as done',
                data: {
                    id: data._id,
                    title: data.title
                }
            })
        }).catch((e) => {
            res.status(401).json({
                error: true,
                message: 'cannot be marked as done',
                data: e
            });
        });
    }

}

module.exports = new Usercontroller();
