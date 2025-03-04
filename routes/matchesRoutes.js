const express = require("express");
const {matchUp, viewSessionMatchUps} = require('../controllers/matchesController')
const { authenticate } = require("../middleware/authUser");
const router = express.Router();

router.route("/:sessionid/matchup").post(authenticate, matchUp)
router.route("/:sessionid/viewsessionmatchups").get(authenticate, viewSessionMatchUps)

module.exports = router;
