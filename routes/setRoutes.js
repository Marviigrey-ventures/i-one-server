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
 * /i-one/set/{sessionid}/createset:
 *   post:
 *     summary: Create sets for a given session
 *     description: Generates a specified number of sets with random unique names for a session and allocates members.
 *     tags:
 *       - Set
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         description: The ID of the session for which to create sets.
 *         schema:
 *           type: string
 *           example: 66171cf870636e0d2a39e22e
 *     responses:
 *       201:
 *         description: Sets created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: sets created Sucessfully
 *                 createdSets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       session:
 *                         type: string
 *                       name:
 *                         type: string
 *                       players:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Set already created or not enough unique names.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Set already created
 *       409:
 *         description: Session not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session not found
 *       500:
 *         description: Internal server error.
 */

router.route("/:sessionid/createset").post(authenticate, createSet);

/**
 * @swagger
 * /i-one/set/{sessionid}/viewsessionsets:
 *   get:
 *     summary: View all sets for a session
 *     description: Retrieves all sets created for a specific session, including populated player details.
 *     tags:
 *       - Set
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         description: ID of the session to view sets for
 *         schema:
 *           type: string
 *           example: 66171cf870636e0d2a39e22e
 *     responses:
 *       200:
 *         description: A list of sets for the session
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   session:
 *                     type: string
 *                   players:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server error
 */

router
  .route("/:sessionid/viewsessionsets")
  .get(authenticate, viewSetForSession);

/**
 * @swagger
 * /i-one/set/{setid}/viewsingleset:
 *   get:
 *     summary: View a single set
 *     description: Retrieve a specific set by ID, including the players in that set.
 *     tags:
 *       - Set
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: setid
 *         in: path
 *         required: true
 *         description: ID of the set to retrieve
 *         schema:
 *           type: string
 *           example: 66211d3decb9a62914d01115
 *     responses:
 *       200:
 *         description: Set retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 session:
 *                   type: string
 *                 players:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       404:
 *         description: Set not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Set not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.route("/:setid/viewsingleset").get(authenticate, viewSingleSet);

/**
 * @swagger
 * /i-one/set/viewallsets:
 *   get:
 *     summary: View all sets
 *     description: Retrieve all sets in the system along with their players.
 *     tags:
 *       - Set
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All sets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   session:
 *                     type: string
 *                   players:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.route("/viewallsets").get(authenticate, viewAllSets);

module.exports = router;
