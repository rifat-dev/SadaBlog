const router = require('express').Router()
const { isNotAuthenticated, isAuthenticated } = require('../midelware/authMidelware')

//signUP validator 
const signupValidator = require('../validation/auth/signUpValidator')
const loginValidator = require('../validation/auth/loginValidatior')
    ///=========
const {
    signupGet,
    signupPost,
    loginGet,
    loginPost,
    changepasswordGetController,
    changepasswordPostController,
    logout
} = require('../controlers/authControler')

///========

router.get('/signup', isNotAuthenticated, signupGet)
router.post('/signup', isNotAuthenticated, signupValidator, signupPost)

router.get('/login', isNotAuthenticated, loginGet)
router.post('/login', isNotAuthenticated, loginValidator, loginPost)

router.get('/change-password', isAuthenticated, changepasswordGetController)
router.post('/change-password', isAuthenticated, changepasswordPostController)

router.get('/logout', logout)

module.exports = router