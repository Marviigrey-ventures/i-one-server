const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  logoutCurrentUser,
  forgotPassword,
  resetPassword,
  verifyOtp,
  testsession,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authUser");

/**
 * @swagger
 * /i-one/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: "Register a new user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickname
 *               - password
 *               - isOwner
 *               - location
 *               - position
 *               - phoneNumber
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               nickname:
 *                 type: string
 *                 example: johndoe123
 *               password:
 *                 type: string
 *                 example: P@ssw0rd!
 *               isOwner:
 *                 type: boolean
 *                 example: true
 *               locationInfo:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "123 Main St, City, Country"
 *                   location:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [Point]
 *                         default: "Point"
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [-74.006, 40.7128]
 *               position:
 *                 type: string
 *                 example: MF
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: "User registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 nickname:
 *                   type: string
 *                   example: johndoe123
 *                 id:
 *                   type: string
 *                   example: 662ec898ce8d8c6dbd0e37fb
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: "Bad Request - Missing or invalid fields"
 *       409:
 *         description: "Conflict - Email or Nickname already exists"
 *       500:
 *         description: "Internal Server Error"
 */

router.route("/register").post(registerUser);

/**
 * @swagger
 * /i-one/user/auth:
 *   post:
 *     tags:
 *       - User
 *     summary: "Authenticate user and return token"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd!
 *     responses:
 *       200:
 *         description: "User authenticated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *                 id:
 *                   type: string
 *                   example: 662ec898ce8d8c6dbd0e37fb
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: "Bad Request - Missing email or password"
 *       404:
 *         description: "Not Found - User not found or invalid credentials"
 *       500:
 *         description: "Internal Server Error"
 */

router.route("/auth").post(authUser);

/**
 * @swagger
 * /i-one/user/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: "Logout the currently authenticated user"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "User logged out successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user logged out successfully
 *       401:
 *         description: "Unauthorized - User not authenticated"
 *       500:
 *         description: "Internal Server Error"
 */

router.route("/logout").post(authenticate, logoutCurrentUser);

/**
 * @swagger
 * /i-one/user/forgotPassword:
 *   post:
 *     summary: Request a password reset OTP.
 *     description: Generates an OTP and sends it to the user's email for password reset.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully to user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to example@example.com
 *                 email:
 *                   type: string
 *                   example: example@example.com
 *       400:
 *         description: Email not provided or input error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Input Email
 *       404:
 *         description: User not found with provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found with given mail
 *       500:
 *         description: Internal Server Error.
 */

router.route("/forgotPassword").post(forgotPassword);

/**
 * @swagger
 * /i-one/user/verifyOtp:
 *   post:
 *     summary: Verify the OTP for password reset.
 *     description: Verifies the OTP sent to the user's email and allows them to proceed to reset their password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verified, proceed to reset password
 *                 email:
 *                   type: string
 *                   example: example@example.com
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: Invalid or expired OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired OTP
 *       500:
 *         description: Internal Server Error.
 */

router.route("/verifyOtp").post(verifyOtp);

/**
 * @swagger
 * /i-one/user/resetPassword:
 *   post:
 *     summary: Reset user's password after verifying OTP.
 *     description: Allows a user to reset their password after successful OTP verification.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               newPassword:
 *                 type: string
 *                 example: newStrongPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset Successful
 *       400:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: OTP not verified or passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP not verified
 *       500:
 *         description: Internal Server Error.
 */

router.route("/resetPassword").post(resetPassword);

//ignore this for now
router.route("/test").get(testsession);

module.exports = router;
