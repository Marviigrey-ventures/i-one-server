const express = require('express')
const router  = express.Router()
const {registerUser, authUser, logoutCurrentUser} = require('../controllers/userController')
const {authenticate} = require('../middleware/authUser')


router.route('/register')
        .post(registerUser)

router.route('/auth')
        .post(authUser)

router.route('/logout')
        .post(authenticate, logoutCurrentUser)


module.exports = router
