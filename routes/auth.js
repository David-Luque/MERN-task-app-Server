//Routes to authentication
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
//const authController = require('../controllers/authController');
import { 
    authenticateUser,
    authenticatedUser, 
    confirmFunc, 
    forgetPass,
    checkToken,
    newPassword,
    getProfile
} from '../controllers/authController.js'
import checkAuth from '../middleware/checkAuth.js';

//route to autorice user
router.post('/',
    [
        check('email', "Select a valid email").isEmail()
    ],
    authenticateUser
)

router.get('/profile',
    checkAuth,
    authenticatedUser
);

router.get('/profile', checkAuth, getProfile);

router.post('/confirm/:token', confirmFunc);

router.post('recover-password', forgetPass);

// router.get('recover-password/:token', checkToken);
// router.post('recover-password/:token', newPassword);
//WE CAN DO INSTEAD:
router.route('recover-password/:token').get(checkToken).post(newPassword)

//module.exports = router;
export default router;