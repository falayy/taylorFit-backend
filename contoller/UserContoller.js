const { UserModel, generateToken, findByToken } = require('../models/User');
const Customer = require('../models/customer');
const MaleModel = require('../models/MaleMeasure');
const FemaleModel = require('../models/FemaleMeasure');
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
        const customer = await Customer.findById({ _id: req.body.customer_id });
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
        }).then((data) => {
            res.status(200).json({
                error: false,
                message: 'gig created successfully',
                data: {
                    id: data._id,
                    gender: customerGender,
                    title: data.title
                }
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
     * @function_to_update
     */
    async updateGig(req, res) {
        const id = req.body.gig_id;
        const style = req.body.style;
        const gig_object = await Gig.findOne({ customer_id: req.body.customer_id, _id: id });
        gig_object.notes = req.body.notes;
        const temp_array = gig_object.style
        var i;
        for (i = 0; i < style.length; i++) {
            temp_array.push(style[i])
        }
        gig_object.save().then((data) => {
            res.status(200).json({
                error: false,
                message: 'gig updated successfully',
                data: {
                    id: data._id,
                    title: data.title
                }
            })
        }).catch((e) => {
            res.status(401).json({
                error: true,
                message: 'unable to update gig',
                data: e
            });
        });
    }

    /**
     * @measurement_functions
     */

    async createMaleMeasurement(req, res) {
        const customer_id = req.body.customer_id;
        const customer_object = await Customer.findOne({ _id: customer_id });
        if (customer_object.gender == "male") {
            MaleModel.create({
                user_id: req.body.user_id,
                customer_id,
                gig_id: req.body.gig_id,
                neck_circumference: req.body.neck_circumference,
                shoulder_breadth: req.body.shoulder_breadth,
                chest_circumference: req.body.chest_circumference,
                waist_circumference: req.body.waist_circumference,
                hips_circumference: req.body.hips_circumference,
                thigh: req.body.thigh,
                calf: req.body.calf,
                wrist_circumference: req.body.wrist_circumference,
                arm_length: req.body.arm_length,
                full_length: req.body.full_length
            }).then((data) => {
                res.status(200).json({
                    error: false,
                    message: 'male measurement created successfully',
                    data: {
                        id: data._id,
                        neck_circumference: data.neck_circumference,
                        shoulder_breadth: data.shoulder_breadth,
                        chest_circumference: data.chest_circumference,
                        waist_circumference: data.waist_circumference,
                        hips_circumference: data.hips_circumference,
                        thigh: data.thigh,
                        calf: data.calf,
                        wrist_circumference: data.wrist_circumference,
                        arm_length: data.arm_length,
                        full_length: data.full_length
                    }
                })
            }).catch((e) => {
                res.status(401).json({
                    error: true,
                    message: 'unable to create measurement',
                    data: e
                })
            })
        } else {
            res.status(401).json({
                error: true,
                message: 'you might need to confirm your gender',
            })
        }
    }

    updateMaleMeasurement(req, res) {
        const id = req.body.id;
        const body = _.pick(req.body, ['neck_circumference', 'shoulder_breadth',
            'chest_circumference', 'waist_circumference', 'hips_circumference',
            'thigh', 'calf', 'wrist_circumference', 'arm_length', 'full_length']);
        MaleModel.findByIdAndUpdate(id, { $set: body }, { new: true })
            .then((data) => {
                res.status(200).json({
                    error: false,
                    message: 'male measurement updated successfully',
                    data: {
                        neck_circumference: data.neck_circumference,
                        shoulder_breadth: data.shoulder_breadth,
                        chest_circumference: data.chest_circumference,
                        waist_circumference: data.waist_circumference,
                        hips_circumference: data.hips_circumference,
                        thigh: data.thigh,
                        calf: data.calf,
                        wrist_circumference: data.wrist_circumference,
                        arm_length: data.arm_length,
                        full_length: data.full_length
                    }
                })
            }).catch((e) => {
                res.status(401).json({
                    error: true,
                    message: 'unable to update measurement',
                    data: e
                })
            })
    }

    async createFemaleMeasurement(req, res) {
        const customer_id = req.body.customer_id;
        const customer_object = await Customer.findOne({ _id: customer_id });
        if (customer_object.gender == "female") {
            FemaleModel.create({
                user_id: req.body.user_id,
                customer_id: req.body.customer_id,
                gig_id: req.body.gig_id,
                shoulder_shoulder: req.body.shoulder_shoulder,
                bust_line: req.body.bust_line,
                bust_round: req.body.bust_round,
                under_bust: req.body.under_bust,
                natural_waist_line: req.body.natural_waist_line,
                natural_waist_round: req.body.natural_waist_round,
                hip_line: req.body.hip_line,
                hip_round: req.body.hip_round,
                full_length: req.body.full_length,
                arm_hole: req.body.arm_hole,
                arm_round: req.body.arm_round,
                sleeve_length: req.body.sleeve_length,
                half_sleeve: req.body.half_sleeve
            }).then((data) => {
                res.status(200).json({
                    error: false,
                    message: 'female measurement created successfully',
                    data: {
                        id: data._id,
                        shoulder_shoulder: data.shoulder_shoulder,
                        bust_line: data.bust_line,
                        bust_round: data.bust_round,
                        under_bust: data.under_bust,
                        natural_waist_line: data.natural_waist_line,
                        natural_waist_round: data.natural_waist_round,
                        hip_line: data.hip_line,
                        hip_round: data.hip_round,
                        full_length: data.full_length,
                        arm_hole: data.arm_hole,
                        arm_round: data.arm_round,
                        sleeve_length: data.sleeve_length,
                        half_sleeve: data.half_sleeve
                    }
                })
            }).catch((e) => {
                res.status(401).json({
                    error: true,
                    message: 'unable to update measurement',
                    data: e
                })

            })
        } else {
            res.status(401).json({
                error: true,
                message: 'you might need to confirm your gender',
            })
        }
    }

    updateFemaleMeasurement(req, res) {
        const id = req.body.id;
        const body = _.pick(req.body, ['shoulder_shoulder', 'bust_line', 'bust_round',
            'under_bust', 'natural_waist_line', 'natural_waist_round', 'hip_line', 'hip_round',
            'full_length', 'arm_hole', 'arm_round', 'sleeve_length', 'half_sleeve']);
        FemaleModel.findByIdAndUpdate(id, { $set: body }, { new: true })
            .then((data) => {
                res.status(200).json({
                    error: false,
                    message: 'female measurement update successfully',
                    data: {
                        shoulder_shoulder: data.shoulder_shoulder,
                        bust_line: data.bust_line,
                        bust_round: data.bust_round,
                        under_bust: data.under_bust,
                        natural_waist_line: data.natural_waist_line,
                        natural_waist_round: data.natural_waist_round,
                        hip_line: data.hip_line,
                        hip_round: data.hip_round,
                        full_length: data.full_length,
                        arm_hole: data.arm_hole,
                        arm_round: data.arm_round,
                        sleeve_length: data.sleeve_length,
                        half_sleeve: data.half_sleeve
                    }
                })

            }).catch((e) => {
                res.status(200).json({
                    error: true,
                    message: 'unable to update measurement',
                    data: e
                })
            })
    }

    /**
     * @get_customers {get customers with id and subtle detail,
     *  then get other details with the id}
     */

    getCustomerGig(req, res) {
        Customer.find().populate('gigs')
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
                })
                res.status(200).json({
                    error: false,
                    message: 'customer info returned',
                    data
                })
            })
    }

    /**
     *  @get_measurement
     */

    async getCustomerMeasurement(req, res) {
        const customer = await Customer.findById({ _id: req.body.customer_id });
        if (customer.gender == "male") {
            MaleModel.find({ customer_id: req.body.customer_id, gig_id: req.body.gig_id })
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
        } else {
            FemaleModel.find({ customer_id: req.body.customer_id, gig_id: req.body.gig_id })
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
