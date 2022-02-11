const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res)=>{
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
            return res.status(400).json({ msg: "User already exist" })
        }

        //create new user
        user = new User(req.body);

        //hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

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