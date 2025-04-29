const express = require("express");
const router = express.Router();
const {
  viewAllSessions,
  startSession,
  createSession,
  endSession,
  joinSession,
  viewSessionMembers,
  viewSessionById,
  leaveSession,
  deleteSession,
  rescheduleSession,
  findNearbySessionMatches,
} = require("../controllers/sessionController");

const { authenticate } = require("../middleware/authUser");


/**
 * @swagger
 * /i-one/sessionr/findnearbysessionmatches:
 *   get:
 *     summary: Find nearby session matches
 *     description: Retrieves matches associated with sessions near a specified geographic location.
 *     tags:
 *       - Session
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
 *                 example: 3.3792
 *               latitude:
 *                 type: number
 *                 example: 6.5244
 *     responses:
 *       200:
 *         description: List of matches near the provided location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "662f2aab72c12345abcde678"
 *                   session:
 *                     type: string
 *                     example: "662e108f1b58f7d9a7a59e2d"
 *                   teamOne:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "teamid123"
 *                       name:
 *                         type: string
 *                         example: "Team Alpha"
 *                   teamTwo:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "teamid456"
 *                       name:
 *                         type: string
 *                         example: "Team Beta"
 *                   result:
 *                     type: string
 *                     example: "Pending"
 *       404:
 *         description: Location parameters missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Location Paramneters not complete
 *       500:
 *         description: Server error
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
  .route("/findnearbysessionmatches")
  .get(authenticate, findNearbySessionMatches);

/**
 * @swagger
 * /i-one/sessionr/viewallsessions:
 *   get:
 *     summary: View all active (unfinished) sessions
 *     description: Retrieve a list of all sessions that have not been marked as finished.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "662e108f1b58f7d9a7a59e2d"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T14:00:00.000Z"
 *                   stopTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T15:00:00.000Z"
 *                   timeDuration:
 *                     type: number
 *                     example: 60
 *                   captain:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "662b52cf97d0b1e1ec42ff21"
 *                       name:
 *                         type: string
 *                         example: "Captain User"
 *                   members:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "662b52cf97d0b1e1ec42ff22"
 *                         name:
 *                           type: string
 *                           example: "Member User"
 *                   location:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "662c3b123c4a2f38b9f12e34"
 *                       address:
 *                         type: string
 *                         example: "123 Main Street, City"
 *                   inProgress:
 *                     type: boolean
 *                     example: false
 *                   isFull:
 *                     type: boolean
 *                     example: false
 *                   finished:
 *                     type: boolean
 *                     example: false
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

router.get("/viewallsessions", authenticate, viewAllSessions);

/**
 * @swagger
 * /i-one/sessionr/startsession:
 *   post:
 *     summary: Start a new session
 *     description: Allows an authenticated user to start a session at a specified location. The user becomes the session captain.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationid
 *             properties:
 *               locationid:
 *                 type: string
 *                 description: The ObjectId of the location where the session is to start
 *     responses:
 *       201:
 *         description: Session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: session in progress
 *                 session:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     location:
 *                       type: string
 *                     captain:
 *                       type: string
 *                     inProgress:
 *                       type: boolean
 *                     finished:
 *                       type: boolean
 *       400:
 *         description: Invalid location ObjectId
 *       404:
 *         description: Location ID is required
 *       500:
 *         description: Internal server error
 */

router.route("/startsession").post(authenticate, startSession);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}/createsession:
 *   post:
 *     summary: Create and configure a session
 *     description: Allows a captain to configure the details of an existing session by session ID.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to be configured
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - setNumber
 *               - playersPerTeam
 *               - timeDuration
 *               - minsPerSet
 *               - startTime
 *               - winningDecider
 *             properties:
 *               setNumber:
 *                 type: integer
 *                 example: 4
 *               playersPerTeam:
 *                 type: integer
 *                 example: 5
 *               timeDuration:
 *                 type: integer
 *                 description: Total session duration in minutes
 *                 example: 120
 *               minsPerSet:
 *                 type: integer
 *                 description: Duration of each set in minutes
 *                 example: 15
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Session start time in ISO 8601 format
 *                 example: "2025-04-28T15:00:00Z"
 *               winningDecider:
 *                 type: string
 *                 description: Criteria to determine the winning set/team
 *                 example: "Most Goals"
 *     responses:
 *       202:
 *         description: Session configured successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6616f10f4f2f72392f3d2d33"
 *                 location:
 *                   type: string
 *                   example: "6616f0f64f2f72392f3d2d12"
 *                 setNumber:
 *                   type: integer
 *                   example: 4
 *                 playersPerTeam:
 *                   type: integer
 *                   example: 5
 *                 timeDuration:
 *                   type: integer
 *                   example: 120
 *                 minsPerSet:
 *                   type: integer
 *                   example: 15
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-28T15:00:00Z"
 *                 stopTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-28T17:00:00Z"
 *                 winningDecider:
 *                   type: string
 *                   example: "Most Goals"
 *                 maxNumber:
 *                   type: integer
 *                   example: 20
 *       400:
 *         description: One or more required fields are missing
 *       401:
 *         description: User is not a captain
 *       404:
 *         description: Session not found
 *       409:
 *         description: Session time already exists or overlaps with another session
 *       500:
 *         description: Internal server error
 */

router.route("/:sessionid/createsession").post(authenticate, createSession);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}/joinsession:
 *   post:
 *     summary: Join a session
 *     description: Allows an authenticated user to join a session if it is not full and the user is not already in another session.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session the user wants to join
 *     responses:
 *       201:
 *         description: User successfully joined the session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully joined session
 *                 updatedSession:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "661c1b4c7aa8c5a9e3d2e0dd"
 *                     captain:
 *                       type: object
 *                       properties:
 *                         nickname:
 *                           type: string
 *                           example: "CaptainJohn"
 *                     members:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["661c1a3c7aa8c5a9e3d2e0aa", "661c1a8e7aa8c5a9e3d2e0ab"]
 *                     isFull:
 *                       type: boolean
 *                       example: false
 *                     maxNumber:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Session is full or user is already in another session
 *       404:
 *         description: Session or user not found
 *       409:
 *         description: User already joined this session
 *       500:
 *         description: Internal server error
 */

router.route("/:sessionid/joinsession").post(authenticate, joinSession);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}:
 *   get:
 *     summary: Get session by ID
 *     description: Retrieve detailed information about a session by its ID, including the captain and members' nicknames.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to retrieve
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "661c1b4c7aa8c5a9e3d2e0dd"
 *                 captain:
 *                   type: object
 *                   properties:
 *                     nickname:
 *                       type: string
 *                       example: "CaptainJohn"
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nickname:
 *                         type: string
 *                         example: "PlayerJane"
 *                 location:
 *                   type: string
 *                   example: "661c18947aa8c5a9e3d2e088"
 *                 setNumber:
 *                   type: number
 *                   example: 5
 *                 playersPerTeam:
 *                   type: number
 *                   example: 2
 *                 timeDuration:
 *                   type: number
 *                   example: 60
 *                 minsPerSet:
 *                   type: number
 *                   example: 12
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T14:00:00.000Z"
 *                 stopTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T15:00:00.000Z"
 *                 inProgress:
 *                   type: boolean
 *                   example: true
 *                 finished:
 *                   type: boolean
 *                   example: false
 *                 winningDecider:
 *                   type: string
 *                   example: "Highest points"
 *                 maxNumber:
 *                   type: number
 *                   example: 10
 *                 isFull:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: session not found
 *       500:
 *         description: Internal server error
 */

router.route("/:sessionid").get(authenticate, viewSessionById);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}/leavesession:
 *   delete:
 *     summary: Leave a session
 *     description: Allows an authenticated user to leave a session they are a member of.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         description: The ID of the session to leave
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully removed from session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully removed from session
 *       400:
 *         description: User is not a member of this session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: not a member of this session
 *       404:
 *         description: User or session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session does not exist
 *       500:
 *         description: Internal server error
 */

router.route("/:sessionid/leavesession").delete(authenticate, leaveSession);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}/viewsessionmembers:
 *   get:
 *     summary: View members of a session
 *     description: Returns the list of nicknames for all users who have joined a specific session.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         description: The ID of the session
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved session members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["PlayerOne", "PlayerTwo", "Unknown"]
 *       404:
 *         description: Session not found or no members have joined yet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: no members have joined yet
 *       500:
 *         description: Internal server error
 */

router
  .route("/:sessionid/viewsessionmembers")
  .get(authenticate, viewSessionMembers);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}/endsession:
 *   post:
 *     summary: End a session
 *     description: Ends an active session, resets captain and member states, and clears all users' current session.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         description: The ID of the session to end
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Session successfully ended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session Ended
 *                 session:
 *                   type: object
 *                   description: The session object after being updated
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: session not found
 *       409:
 *         description: One or more users in the session could not be found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

router.route("/endsession").post(authenticate, endSession);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}/deletesession:
 *   delete:
 *     summary: Delete a session
 *     description: Deletes a session and resets all members' current session and captain status.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         description: The ID of the session to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted and members updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session deleted and members updated successfully
 *       409:
 *         description: One or more users in the session could not be found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

router.route("/:sessionid/deletesession").delete(authenticate, deleteSession);

/**
 * @swagger
 * /i-one/sessionr/{sessionid}/reschedulesession:
 *   patch:
 *     summary: Reschedule a session
 *     description: Updates the start time and duration of an existing session, ensuring no overlap with other sessions.
 *     tags:
 *       - Session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sessionid
 *         in: path
 *         required: true
 *         description: ID of the session to be rescheduled
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - timeDuration
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T14:00:00.000Z"
 *               timeDuration:
 *                 type: number
 *                 description: Duration of session in minutes
 *                 example: 60
 *     responses:
 *       201:
 *         description: Session rescheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session rescheduled
 *                 updatedSession:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "662e108f1b58f7d9a7a59e2d"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T14:00:00.000Z"
 *                     stopTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T15:00:00.000Z"
 *                     timeDuration:
 *                       type: number
 *                       example: 60
 *                     captain:
 *                       type: string
 *                       example: "662b52cf97d0b1e1ec42ff21"
 *                     members:
 *                       type: array
 *                       items:
 *                         type: string
 *                     location:
 *                       type: string
 *                     inProgress:
 *                       type: boolean
 *                     isFull:
 *                       type: boolean
 *                     finished:
 *                       type: boolean
 *       400:
 *         description: Missing required fields for rescheduling
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Input all information required for rescheduling
 *       409:
 *         description: Conflict due to existing or overlapping session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This session overlaps with another one
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
  .route("/:sessionid/reschedulesession")
  .patch(authenticate, rescheduleSession);

module.exports = router;
