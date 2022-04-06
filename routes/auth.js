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
    checkToken
} from '../controllers/authController.js'
const auth = require('../middleware/auth');

//route to autorice user
router.post('/',
    [
        check('email', "Select a valid email").isEmail()
    ],
    authenticateUser
)

router.get('/',
    auth,
    authenticatedUser
);

router.post('/confirm/:token', confirmFunc);

router.post('recover-password', forgetPass);

router.get('recover-password/:token', checkToken);


//module.exports = router;
export default router;