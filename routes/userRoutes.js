const express = require('express')
const router  = express.Router()
const {registerUser, authUser, logoutCurrentUser, forgotPassword, resetPassword, verifyOtp, testsession} = require('../controllers/userController')
const {authenticate} = require('../middleware/authUser')



/**
 * @swagger
 * tags: 
 *      - name: User
 *        description: Endpoints for user
 * 
 */




/**
 * @swagger
 * i-one/user/register:
 *   post:
 *     tags: [User]
 *     summary: "To register User"
 *     responses: 
 *         200: 
 *           description: accepts inuts and regisr   
 * 
 */
router.route('/register')
        .post(registerUser)


/**
 * @swagger
 * /i-one/user/auth:
 *   post:
 *     tags: [User] 
 *     summary: "To Login User"
 *     responses: 
 *         200: 
 *           description: accepts inputs and logs in user   
 * 
 */
router.route('/auth')
        .post(authUser)

   
        


/**
 * @swagger
 * /i-one/user/logout:
 *   post:
 *     tags: [User]
 *     summary: "To Logout User"
 *     responses: 
 *         200: 
 *           description: clears user cookies   
 * 
 */
router.route('/logout')
        .post(authenticate, logoutCurrentUser)




 
 /**
 * @swagger
 * /i-one/user/forgotPassword:
 *   post:
 *     tags: [User]
 *     summary: "To make requests for forgotten Password"
 *     responses: 
 *         200: 
 *           description: verifies mail and sends otp to user    
 * 
 */       
router.route('/forgotPassword')
        .post(forgotPassword)






  /**
 * @swagger
 * /i-one/user/verifyOtp:
 *   post:
 *     tags: [User]
 *     summary: "To make requests to verify Otp"
 *     responses: 
 *         200: 
 *           description: verifies user otp   
 * 
 */        
router.route('/verifyOtp')
        .post(verifyOtp)





 /**
 * @swagger
 * /i-one/user/resetPassword:
 *   post:
 *     tags: [User]
 *     summary: "To make requests to update Password"
 *     responses: 
 *         200: 
 *           description: updates user password    
 * 
 */ 
router.route('/resetPassword')
        .post(resetPassword)

        router.route('/test')
                .get(testsession)


module.exports = router