//Routes to users
//const express = require('express');
import express from 'express';
const router = express.Router();
//const userController = require('../controllers/userController');
import { createUser } from '../controllers/userController.js';
//const { check } = require('express-validator');
import { check } from 'express-validator';


//route to create user
router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', "Select a valid email").isEmail(),
        check('password', "Password must be at least 6 characters long").isLength({ min: 6 })
    ],
    createUser
)

//module.exports = router;
export default router;