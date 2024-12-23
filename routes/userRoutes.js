const express = require('express')
const router  = express.Router()
const {registerUser, authUser, logoutCurrentUser, forgotPassword, resetPassword, verifyOtp} = require('../controllers/userController')
const {authenticate} = require('../middleware/authUser')


router.route('/register')
        .post(registerUser)

router.route('/auth')
        .post(authUser)

router.route('/logout')
        .post(authenticate, logoutCurrentUser)

router.route('/forgotPassword')
        .post(forgotPassword)

router.route('/verifyOtp')
        .post(verifyOtp)


router.route('/resetPassword')
        .post(resetPassword)


module.exports = router