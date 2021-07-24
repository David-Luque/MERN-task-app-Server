const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res)=>{

    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        //check if user is registered
        const user = await User.findOne({ email });
        
        if(!user) {
            return res.status(400).json({ msg: "This user does not exist" })
        }

        //check user password
        const correctPass = await bcrypt.compare(password, user.password);

        if(!correctPass) {
            return res.status(400).json({ msg: "Incorrect password" })
        }

        //if everything is correct: create and sign json web token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: "1h"
        }, (error, token)=>{
            if(error) throw error;

            //confirmation message
            res.json({ token });
        })

    } catch(error) {
        console.log(error)
    }
};

//obtain that user is authenticated
exports.authenticatedUser = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user })
    } catch (error) { 
        console.log(error);
        res.status(500).send({ msg: "There was an error" });
    }
};