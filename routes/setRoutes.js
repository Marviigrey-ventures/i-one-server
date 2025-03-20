const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authUser");
const {
  createSet,
  viewSetForSession,
  viewSingleSet,
  viewAllSets,
} = require("../controllers/setController");

const { findNearbySession } = require("../controllers/sessionController");

/**
 * @swagger
 * tags:
 *      - name: Set
 *        description: Endpoints for set creation, set allocation e.t.c
 *
 */

/**
 * @swagger
 * /i-one/set/:sessionid/createset:
 *   post:
 *     tags: [Set]
 *     summary: "To create sets"
 *     responses:
 *         200:
 *           description: create sets for the session
 *
 */

router.route("/:sessionid/createset").post(authenticate, createSet);

/**
 * @swagger
 * /i-one/set/:sessionid/viewsessionsets:
 *   get:
 *     tags: [Set]
 *     summary: "To view sets in a session"
 *     responses:
 *         200:
 *           description: sends sets in a session as the response
 *
 */
router
  .route("/:sessionid/viewsessionsets")
  .get(authenticate, viewSetForSession);

/**
 * @swagger
 * /i-one/set/:setid/viewsingleset:
 *   get:
 *     tags: [Set]
 *     summary: "To view single set by id"
 *     responses:
 *         200:
 *           description: sends that single set as response
 *
 */
router.route("/:setid/viewsingleset").get(authenticate, viewSingleSet);


router.route("/viewallsets").get(authenticate, viewAllSets);

module.exports = router;
