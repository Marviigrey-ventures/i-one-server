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
 * tags:
 *      - name: Location
 *        description: Endpoints for location registraion, fetching nearby locations e.t.c
 *
 */

/**
 * @swagger
 * /i-one/location/:
 *   get:
 *     tags: [Location]
 *     summary: "To fetch all location"
 *     responses:
 *         200:
 *           description: returns all location as the response
 *
 */
router.route("/").get(authenticate, viewAllLocations);

/**
 * @swagger
 * /i-one/location/registerlocation:
 *   post:
 *     tags: [Location]
 *     summary: "makes request to register location"
 *     responses: 
 *         200: 
           description: returns registered location
 * 
 */
router
  .route("/registerlocation")
  .post(authenticate, authorizeOwner, registerLocation);

/**
 * @swagger
 * /i-one/location/nearbylocations:
 *   post:
 *     tags: [Location]
 *     summary: "To fetch nearby locations"
 *     description: "takes user longtitude and latitude and sends it as request"
 *     responses:
 *         200:
 *           description: returns locations near user
 *
 */
router.route("/nearbylocations").get(authenticate, viewNearbyLocations);
router.route("/mylocation").get(authenticate, getMyLocation);

module.exports = router;
