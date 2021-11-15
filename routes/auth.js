//Routes to authentication
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//route to autorice user
router.post('/',
    [
        check('email', "Select a valid email").isEmail()
    ],
    authController.authenticateUser
)

router.get('/',
    auth,
    authController.authenticatedUser
);

module.exports = router;