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
                        code: 400,
                        message: 'phone number exists'
                    })
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hashed = bcrypt.hashSync(req.body.password, salt);
                    UserModel.create({
                        name: req.body.name,
                        phone_number: req.body.phone_number,
                        password: hashed,
                        business_name: req.body.business_name
                    }).then(async (user) => {
                        const token = generateToken(user._id);
                        const user_object = await UserModel.findOne({ _id: user._id });
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
        UserModel.findOne({ phone_number: req.body.phone_number })
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
                code: 201,
                message: 'customer created successfully',
                customer: {
                    id: data._id,
                    phone_number: data.phone_number,
                    name: data.name
                }
            })
        }).catch((e) => {
            res.status(400).json({
                error: false,
                code: 400,
                message: 'unable to create customer'
            })
        })
    }
    /**
     * @function_to_create_gig
     */

    createGig(req, res) {
        const dateStamp = new Date().getTime();             //req.body.delivery_date;
        const date = dateStamp;
        Gig.create({
            user_id: req.body.user_id,
            customer_id: req.body.customer_id,
            title: req.body.title,
            delivery_date: date,
            style: req.body.style,
            notes: req.body.notes
        }).then((data) => {
            res.status(200).json({
                error: false,
                code: 201,
                message: 'gig created successfully',
                gig: {
                    id: data._id,
                    title: data.title
                }
            })
        }).catch((e) => {
            res.status(401).json({
                error: true,
                code: 401,
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
                code: 201,
                message: 'gig updated successfully',
                gig: {
                    id: data._id,
                    title: data.title
                }
            })
        }).catch((e) => {
            res.status(401).json({
                error: true,
                code: 401,
                message: 'unable to update gig',
                data: e
            });
        });
    }

    /**
     * @measurement_functions
     */

    createMaleMeasurement(req, res) {
        MaleModel.create({
            user_id : req.body.user_id,
            customer_id : req.body.customer_id,
            gig_id : req.body.gig_id,
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
                code: 201,
                message: 'male measurement created successfully',
                male_measurement: {
                    id : data._id,
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
            res.status(202).json({
                error: true,
                code: 201,
                message: 'unable to create measurement',
                data: e
            })
        })
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
                    code: 201,
                    message: 'male measurement updated successfully',
                    male_measurement: {
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
                res.status(400).json({
                    error: true,
                    code: 401,
                    message: 'unable to update measurement',
                    data: e
                })
            })
    }

    createFemaleMeasurement(req, res) {
        FemaleModel.create({
            user_id : req.body.user_id,
            customer_id : req.body.customer_id,
            gig_id : req.body.gig_id,
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
                code: 201,
                message: 'female measurement created successfully',
                female_measurement: {
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
                code: 401,
                message: 'unable to update measurement',
                data: e
            })

        })
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
                    code: 201,
                    message: 'female measurement update successfully',
                    female_measurement: {
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
                    code: 401,
                    message: 'unable to update measurement',
                    data: e
                })
            })
    }

    /**
     * @get_customers {get customers with id and subtle detail,
     *  then get other details with the id}
     */

    getCustomers(req, res) {
        Customer.find({ user_id: req.body.user_id })
            .then((data) => {
                res.status(200).json({
                    error: false,
                    code: 201,
                    message: 'here are the customers ',
                    customers: data
                })
            }).catch((e) => {
                res.status(200).json({
                    error: true,
                    code: 401,
                    message: 'unable to get customers',
                    data: e
                })
            })
    }
    /**
     * @measurement_comes_with_gigs_for_a_particular_customer
     */
    getGigs(req, res) {
        Gig.find({ customer: _id })
            .then((data) => {

            }).catch((e) => {

            })
    }



}

module.exports = new Usercontroller();
