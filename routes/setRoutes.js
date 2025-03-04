const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authUser");
const {
  createSet,
  viewSetForSession,
} = require("../controllers/setController");

const {findNearbySession}
= require('../controllers/sessionController')
router.route("/:sessionid/createset").post(authenticate, createSet);
router.route("/:sessionid/viewsets").get(authenticate, viewSetForSession);

router.route('/nearbysession').get(findNearbySession)


module.exports = router;
