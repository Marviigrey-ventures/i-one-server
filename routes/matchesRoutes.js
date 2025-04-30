const express = require("express");
const {
  matchUp,
  viewSessionMatchUps,
  startMatchInSession,
  viewMatchDetails,
  endMatchInSession,
} = require("../controllers/matchesController");
const { authenticate } = require("../middleware/authUser");
const router = express.Router();

/**
 * @swagger
 * /i-one/match/{sessionid}/matchup:
 *   post:
 *     summary: Randomly match sets into teams for a given session
 *     tags:
 *       - Match
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionid
 *         required: true
 *         description: The ID of the session to generate matchups for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully created matchups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 662f1f2eb3e4de001fb8a123
 *                   teamOne:
 *                     type: string
 *                     example: 662f1c84b3e4de001fb8a101
 *                   teamTwo:
 *                     type: string
 *                     example: 662f1c84b3e4de001fb8a102
 *                   teamOneScore:
 *                     type: integer
 *                     example: 0
 *                   teamTwoScore:
 *                     type: integer
 *                     example: 0
 *                   isStarted:
 *                     type: boolean
 *                     example: false
 *                   session:
 *                     type: string
 *                     example: 662f1c01b3e4de001fb8a100
 *       400:
 *         description: Bad request (e.g., odd number of sets or already matched)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot create pairs with an odd number of sets
 *       404:
 *         description: No sets found for this session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No sets found for this session
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

router.route("/:sessionid/matchup").post(authenticate, matchUp);






/**
 * @swagger
 * /i-one/match/{sessionid}/viewsessionmatchups:
 *   get:
 *     summary: View all matchups for a given session
 *     tags:
 *       - Match
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionid
 *         required: true
 *         description: The ID of the session to view matchups for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of matchups in the session
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 662f1f2eb3e4de001fb8a123
 *                   teamOne:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Team A
 *                   teamTwo:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Team B
 *                   teamOneScore:
 *                     type: integer
 *                     example: 0
 *                   teamTwoScore:
 *                     type: integer
 *                     example: 0
 *                   isStarted:
 *                     type: boolean
 *                     example: false
 *                   session:
 *                     type: string
 *                     example: 662f1c01b3e4de001fb8a100
 *       404:
 *         description: No matchups found for this session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No matchups exist in this session yet
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

router
  .route("/:sessionid/viewsessionmatchups")
  .get(authenticate, viewSessionMatchUps);


/**
 * @swagger
 * /i-one/match/{matchid}/startmatch:
 *   post:
 *     summary: Start a specific match in a session
 *     tags:
 *       - Match
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchid
 *         required: true
 *         description: The ID of the match to start
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match successfully started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team A vs Team B is underway
 *                 match:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 662f1f2eb3e4de001fb8a123
 *                     teamOne:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 662f1c84b3e4de001fb8a101
 *                         name:
 *                           type: string
 *                           example: Team A
 *                     teamTwo:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 662f1c84b3e4de001fb8a102
 *                         name:
 *                           type: string
 *                           example: Team B
 *                     teamOneScore:
 *                       type: integer
 *                       example: 0
 *                     teamTwoScore:
 *                       type: integer
 *                       example: 0
 *                     isStarted:
 *                       type: boolean
 *                       example: true
 *                     session:
 *                       type: string
 *                       example: 662f1c01b3e4de001fb8a100
 *       404:
 *         description: Match not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Match not found
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

router.route("/:matchid/startmatch").post(authenticate, startMatchInSession);




/**
 * @swagger
 * /i-one/match/{matchid}/viewmatchdetails:
 *   get:
 *     summary: View full details of a specific match
 *     tags:
 *       - Match
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchid
 *         required: true
 *         description: The ID of the match to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 662f1f2eb3e4de001fb8a123
 *                 teamOne:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 662f1c84b3e4de001fb8a101
 *                     name:
 *                       type: string
 *                       example: Team A
 *                 teamTwo:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 662f1c84b3e4de001fb8a102
 *                     name:
 *                       type: string
 *                       example: Team B
 *                 teamOneScore:
 *                   type: integer
 *                   example: 0
 *                 teamTwoScore:
 *                   type: integer
 *                   example: 0
 *                 isStarted:
 *                   type: boolean
 *                   example: true
 *                 session:
 *                   type: string
 *                   example: 662f1c01b3e4de001fb8a100
 *       404:
 *         description: Match not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Match Not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.route("/:matchid/viewmatchdetails").get(authenticate, viewMatchDetails);



/**
 * @swagger
 * /i-one/match/{matchid}/endmatch:
 *   post:
 *     summary: End a match and return final scores
 *     tags:
 *       - Match
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchid
 *         required: true
 *         description: ID of the match to end
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match ended successfully with final scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Final Score- Team A:3 vs Team B:2"
 *                 match:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 662f3e7cb3e4de001fb8a999
 *                     teamOne:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 662f1c84b3e4de001fb8a101
 *                         name:
 *                           type: string
 *                           example: Team A
 *                     teamTwo:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 662f1c84b3e4de001fb8a102
 *                         name:
 *                           type: string
 *                           example: Team B
 *                     teamOneScore:
 *                       type: integer
 *                       example: 3
 *                     teamTwoScore:
 *                       type: integer
 *                       example: 2
 *                     isStarted:
 *                       type: boolean
 *                       example: false
 *                     session:
 *                       type: string
 *                       example: 662f1c01b3e4de001fb8a100
 *       404:
 *         description: Match not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Match not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.route("/:matchid/endmatch").post(authenticate, endMatchInSession);


module.exports = router;
