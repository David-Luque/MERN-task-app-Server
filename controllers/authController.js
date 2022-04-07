//const User = require('../models/User');
import User from '../models/User.js'
//const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
//const { validationResult } = require('express-validator');
import { validationResult } from 'express-validator';
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import jwtGenerator from '../helpers/jwtGenerator.js';
import idGenerator from '../helpers/idGenerator.js';


//exports.authenticateUser = async (req, res)=>{
const authenticateUser = async (req, res)=>{
    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        //check if user is registered
        if(!user) {
            const error = new Error('This user does not exist');
            return res.status(404).json({ msg: error.message });
        }

        //check if user account is verified
        if(!user.confirmed) {
            const error = new Error('Your account is not verified yet');
            return res.status(403).json({ msg: error.message });
        }

        //check user password
        const isCorrectPass = await user.isisCorrectPass(password);
        if(!isCorrectPass) {
            const error = new Error('Incorrect password');
            return res.status(403).json({ msg: error.message });
        }

        //if everything is OK
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: jwtGenerator(user._id)
        });


        // //if everything is correct: create and sign json web token
        // const payload = {
        //     user: {
        //         id: user.id
        //     }
        // };

        // jwt.sign(payload, process.env.JWT_SECRET, {
        //     expiresIn: "1h"
        // }, (error, token)=>{
        //     if(error) throw error;

        //     //confirmation message
        //     res.json({ token });
        // })

    } catch(error) {
        console.log(error)
    }
};

//obtain that user is authenticated
//exports.authenticatedUser = async (req, res)=>{
const authenticatedUser = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user })
    } catch (error) { 
        console.log(error);
        res.status(500).send({ msg: "There was an error" });
    }
};

const confirmFunc = async (req, res)=>{
    const { token } = req.params;

    const userToConfirm = await User.findOne({ token });

    if(!userToConfirm) {
        const error = new Error('Token not valid');
        return res.status(404).json({ msg: error.message });
    }

    try {
        userToConfirm.confirmed = true;
        userToConfirm.token = '';
        await userToConfirm.save();
        res.json({ msg: "User successfully validated" });

    } catch (error) {
        console.log(error);
    }
};

const forgetPass = async (req, res)=>{
    const { email } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
        const error = new Error('Email not valid');
        return res.status(404).json({ msg: error.message });
    };

    try {
        user.token = idGenerator();
        await user.save();
        res.json({ msg: "We have sent an email to recover your password" })
    } catch (error) {
        console.log(error)
    }
};

const checkToken = async (req, res)=>{
    const { token } = req.params;
    const validToken = await User.findOne({ token });

    if(!validToken) {
        const error = new Error('Token not valid');
        return res.status(404).json({ msg: error.message });
    }

    res.json({ msg: 'Token valid - User exist' });
};

const newPassword = async (req, res)=>{
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token });

    if(!user) {
        const error = new Error('Token not valid');
        return res.status(404).json({ msg: error.message });
    }

    try {
        user.password = password;
        user.token = '';
        await user.save();
        res.json({ msg: "Password successfully modified" });

    } catch (error) {
        console.log(error)
    }
};

const getProfile = async (req, res)=>{
    const { user } = req;
    res.json(user);
};


export {
    authenticateUser,
    authenticatedUser,
    confirmFunc,
    forgetPass,
    checkToken,
    newPassword,
    getProfile
}