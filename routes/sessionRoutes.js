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
  rescheduleSession
} = require("../controllers/sessionController");
const { authenticate } = require("../middleware/authUser");

router.get("/viewallsessions", authenticate, viewAllSessions);

router.route("/startsession").post(authenticate, startSession);

router.route("/:sessionid/createsession").post(authenticate, createSession);

router.route("/:sessionid/joinsession").post(authenticate, joinSession);

router.route("/:sessionid").get(authenticate, viewSessionById);

router.route("/:sessionid/leavesession").delete(authenticate, leaveSession);

router
  .route("/:sessionid/viewsessionmembers")
  .get(authenticate, viewSessionMembers);

router.route("/endsession").post(authenticate, endSession);

router.route('/:sessionid/deletesession').delete(authenticate, deleteSession)

router.route('/:sessionid/reschedulesession').patch(authenticate, rescheduleSession)



module.exports = router;
