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
 * tags:
 *      - name: Session
 *        description: Endpoints for session creation, session joining, session rescheduling e.t.c
 *
 */

/**
 * @swagger
 * /i-one/sessionr/findnearbysessionmatches:
 *   get:
 *     tags: [Session]
 *     summary: "To find nearby session matches"
 *     description: "Takes longtitude and latitudes as request from the client side"
 *     responses:
 *         200:
 *           description: sends that single set as response
 *
 */
router
  .route("/findnearbysessionmatches")
  .get(authenticate, findNearbySessionMatches);

/**
 * @swagger
 * /i-one/sessionr/viewallsessions:
 *   get:
 *     tags: [Session]
 *     summary: "To view all sessions"
 *     responses:
 *         200:
 *           description: sends all sessions as response
 *
 */
router.get("/viewallsessions", authenticate, viewAllSessions);

/**
 * @swagger
 * /i-one/sessionr/startsession:
 *   post:
 *     tags: [Session]
 *     summary: "To initialize sessions"
 *     responses:
 *         200:
 *           description: makes user a captain and allows him create the session
 *
 */
router.route("/startsession").post(authenticate, startSession);

/**
 * @swagger
 * /i-one/sessionr/:sessionid/createsession:
 *   post:
 *     tags: [Session]
 *     summary: "To finalise session creation"
 *     responses:
 *         200:
 *           description: the session is created and returned as a response
 *
 */
router.route("/:sessionid/createsession").post(authenticate, createSession);

/**
 * @swagger
 * /i-one/sessionr/:sessionid/joinsession:
 *   get:
 *     tags: [Session]
 *     summary: "User joining session"
 *     responses:
 *         200:
 *           description: the session joined is returned as a response
 *
 */
router.route("/:sessionid/joinsession").post(authenticate, joinSession);

/**
 * @swagger
 * /i-one/sessionr/:sessionid:
 *   get:
 *     tags: [Session]
 *     summary: "To view a single session by id"
 *     responses:
 *         200:
 *           description: the session is returned as a response
 *
 */
router.route("/:sessionid").get(authenticate, viewSessionById);

/**
 * @swagger
 * /i-one/sessionr/:sessionid/leave:
 *   get:
 *     tags: [Session]
 *     summary: "To finalise session creation"
 *     responses:
 *         200:
 *           description: the session is created and returned as a response
 *
 */
router.route("/:sessionid/leavesession").delete(authenticate, leaveSession);

/**
 * @swagger
 * /i-one/sessionr/:sessionid/viewsessionmembers:
 *   get:
 *     tags: [Session]
 *     summary: "To view members in a session"
 *     responses:
 *         200:
 *           description: returns session members as response
 *
 */
router
  .route("/:sessionid/viewsessionmembers")
  .get(authenticate, viewSessionMembers);

/**
 * @swagger
 * /i-one/sessionr/:sessionid/leave:
 *   get:
 *     tags: [Session]
 *     summary: "To finalise session creation"
 *     responses:
 *         200:
 *           description: the session is ended and returned as response
 *
 */
router.route("/endsession").post(authenticate, endSession);

/**
 * @swagger
 * /i-one/sessionr/:sessionid/deleteSession:
 *   get:
 *     tags: [Session]
 *     summary: "Deletes session"
 *     responses:
 *         200:
 *           description: it deletes session by id
 *
 */
router.route("/:sessionid/deletesession").delete(authenticate, deleteSession);

/**
 * @swagger
 * /i-one/sessionr/:sessionid/reschedulesession:
 *   get:
 *     tags: [Session]
 *     summary: "To reschedule session"
 *     responses:
 *         200:
 *           description: the updated session is returned as response
 *
 */

router
  .route("/:sessionid/reschedulesession")
  .patch(authenticate, rescheduleSession);

module.exports = router;
