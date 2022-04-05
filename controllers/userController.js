//const User = require('../models/User');
import User from '../models/User.js'
//const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
//const { validationResult } = require('express-validator');
import { validationResult } from 'express-validator';
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import idGenerator from '../helpers/idGenerator.js'


//exports.createUser = async (req, res)=>{
async function createUser(req, res) {
    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        //check if user or email already exist
        let user = await User.findOne({ email });

        if(user) {
            const error = new Error("User already exist")
            return res.status(400).json({ msg: error.message })
        }

        //create new user
        user = new User(req.body);

        // //hash password
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);

        //add unique token to user
        user.token = idGenerator();

        //Save new user
        await user.save();

        //create and sign json web token
        const payload = {
            user: {
                id: user.id 
            }
        };
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 //1h
        }, (error, token) => {
            if(error) throw error;
            //confirmation message
            res.json({ token });
        })

    } catch(error) {
        console.log(error);
        res.status(400).send('There was an error')
    }
};


export {
    createUser
};