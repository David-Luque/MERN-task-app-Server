//const User = require('../models/User');
import User from '../models/User.js'
//const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
//const { validationResult } = require('express-validator');
import { validationResult } from 'express-validator';
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import jwtGenerator from '../helpers/jwtGenerator.js'


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

export {
    authenticateUser,
    authenticatedUser
}