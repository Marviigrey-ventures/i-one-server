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
 * tags:
 *      - name: Matches
 *        description: Endpoints for matchups, fetching scores e.t.c
 *
 */



 /**
 * @swagger
 * /i-one/match/:sessionid/matchup:
 *   post:
 *     tags: [Matches]
 *     summary: "matches up the set in pairs"
 *     responses: 
 *         200: 
 *           description: returns the matchups as response
 * 
 */ 
router.route("/:sessionid/matchup").post(authenticate, matchUp);



 /**
 * @swagger
 * /i-one/match/viewsessionmatchups:
 *   get:
 *     tags: [Matches]
 *     summary: "View matches in session"
 *     responses: 
 *         200: 
 *           description: returns matches response   
 * 
 */ 
router
  .route("/:sessionid/viewsessionmatchups")
  .get(authenticate, viewSessionMatchUps);


 /**
 * @swagger
 * /i-one/match/:matchid/startmatch:
 *   post:
 *     tags: [Matches]
 *     summary: "To update match status to started"
 *     responses: 
 *         200: 
 *           description: returns message containing the teams and the match itself 
 * 
 */ 
router.route("/:matchid/startmatch").post(authenticate, startMatchInSession);



 /**
 * @swagger
 * /i-one/match/:matchid/viewmatchdetails:
 *   post:
 *     tags: [User]
 *     summary: "View Details about one match"
 *     responses: 
 *         200: 
 *           description:returns the match as a response    
 * 
 */ 
router.route("/:matchid/viewmatchdetails").get(authenticate, viewMatchDetails);


 /**
 * @swagger
 * /i-one/match/:matchid/endmatch:
 *   post:
 *     tags: [Matches]
 *     summary: "To end an on going match"
 *     responses: 
 *         200: 
 *           description: returns message 
 * 
 */ 
router.route("/:matchid/endmatch").post(authenticate, endMatchInSession);

module.exports = router;
