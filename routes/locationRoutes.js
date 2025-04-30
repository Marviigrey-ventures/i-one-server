const express = require("express");
const router = express.Router();

const { authenticate, authorizeOwner } = require("../middleware/authUser");
const {
  registerLocation,
  viewAllLocations,
  viewNearbyLocations,
  getMyLocation,
} = require("../controllers/locationController");

/**
 * @swagger
 * /i-one/location/:
 *   get:
 *     summary: Retrieve all available locations
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 662f4c4eb3e4de001fb8ab00
 *                   name:
 *                     type: string
 *                     example: National Stadium
 *                   address:
 *                     type: string
 *                     example: 123 Sports Ave, Lagos, Nigeria
 *                   location:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: Point
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [3.3792, 6.5244]
 *       500:
 *         description: Server error while retrieving locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/").get(authenticate, viewAllLocations);



/**
 * @swagger
 * /i-one/location/registerlocation:
 *   post:
 *     summary: Register a new location
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: Teslim Balogun Stadium
 *               address:
 *                 type: string
 *                 example: Surulere, Lagos, Nigeria
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [3.3489, 6.5039]
 *     responses:
 *       200:
 *         description: Location successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 662f4c4eb3e4de001fb8ab12
 *                 name:
 *                   type: string
 *                   example: Teslim Balogun Stadium
 *                 address:
 *                   type: string
 *                   example: Surulere, Lagos, Nigeria
 *                 location:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: Point
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [3.3489, 6.5039]
 *       404:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please fill all required fields
 *       409:
 *         description: Location already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Location already registered
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router
  .route("/registerlocation")
  .post(authenticate, authorizeOwner, registerLocation);


/**
/**
 * @swagger
 * /i-one/location/nearbylocations:
 *   get:
 *     summary: Get locations near a given coordinate
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longitude
 *               - latitude
 *             properties:
 *               longitude:
 *                 type: number
 *                 example: 3.3489
 *               latitude:
 *                 type: number
 *                 example: 6.5039
 *               maxDistance:
 *                 type: number
 *                 example: 5000
 *                 description: Maximum distance in meters (optional, defaults to 5000)
 *     responses:
 *       200:
 *         description: List of nearby locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 662f4c4eb3e4de001fb8ab12
 *                   name:
 *                     type: string
 *                     example: Teslim Balogun Stadium
 *                   address:
 *                     type: string
 *                     example: Surulere, Lagos
 *                   location:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: Point
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [3.3489, 6.5039]
 *       404:
 *         description: Missing longitude or latitude
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Location Paramneters not complete
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/nearbylocations").get(authenticate, viewNearbyLocations);
  


router.route("/mylocation").get(authenticate, getMyLocation);

module.exports = router;
