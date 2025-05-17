
const mockingoose = require("mockingoose");
const Match = require("../models/matches");
const Set = require("../models/Set");
const matchesController = require("../controllers/matchesController");

describe("Matches Controller", () => {
  let res;
  beforeEach(() => {
    mockingoose.resetAll();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("matchUp", () => {
    it("should return 404 if no sets found", async () => {
      mockingoose(Set).toReturn([], "find");

      const req = { params: { sessionid: "session1" } };
      await matchesController.matchUp(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No sets found for this session" });
    });

    it("should return 400 for odd number of sets", async () => {
      mockingoose(Set).toReturn([{ _id: "1" }, { _id: "2" }, { _id: "3" }], "find");

      const req = { params: { sessionid: "session1" } };
      await matchesController.matchUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Cannot create pairs with an odd number of sets" });
    });

    it("should return 400 if already matched", async () => {
      mockingoose(Set).toReturn([{ _id: "1" }, { _id: "2" }], "find");
      mockingoose(Match).toReturn([{}], "find");

      const req = { params: { sessionid: "session1" } };
      await matchesController.matchUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Teams already mactched for this session" });
    });

    it("should create matchups successfully", async () => {
      const sets = [{ _id: "1" }, { _id: "2" }];
      mockingoose(Set).toReturn(sets, "find");
      mockingoose(Match).toReturn([], "find");
      mockingoose(Match).toReturn(sets, "insertMany");

      const req = { params: { sessionid: "session1" } };
      await matchesController.matchUp(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe("viewSessionMatchUps", () => {
    it("should return 404 if no matchups", async () => {
      mockingoose(Match).toReturn([], "find");

      const req = { params: { sessionid: "session1" } };
      await matchesController.viewSessionMatchUps(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No matchups exist in this session yet" });
    });

    it("should return matchups", async () => {
      mockingoose(Match).toReturn([{ teamOne: {}, teamTwo: {} }], "find");

      const req = { params: { sessionid: "session1" } };
      await matchesController.viewSessionMatchUps(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe("startMatchInSession", () => {
    it("should return 404 if match not found", async () => {
      mockingoose(Match).toReturn(null, "findOne");

      const req = { params: { matchid: "match1" } };
      await matchesController.startMatchInSession(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Match not found" });
    });

    it("should start a match successfully", async () => {
      const match = {
        _id: "match1",
        teamOne: { name: "Team A" },
        teamTwo: { name: "Team B" },
        isStarted: false,
        save: jest.fn().mockResolvedValue(true),
      };

      mockingoose(Match).toReturn(match, "findOne");

      const req = { params: { matchid: "match1" } };
      await matchesController.startMatchInSession(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("vs"),
      }));
    });
  });

  describe("endMatchInSession", () => {
    it("should return 404 if match not found", async () => {
      mockingoose(Match).toReturn(null, "findOne");

      const req = { params: { matchid: "match1" } };
      await matchesController.endMatchInSession(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Match not found" });
    });

    it("should end a match successfully", async () => {
      const match = {
        _id: "match1",
        teamOne: { name: "Team A" },
        teamTwo: { name: "Team B" },
        teamOneScore: 2,
        teamTwoScore: 1,
        isStarted: true,
        save: jest.fn().mockResolvedValue(true),
      };

      mockingoose(Match).toReturn(match, "findOne");

      const req = { params: { matchid: "match1" } };
      await matchesController.endMatchInSession(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("Final Score"),
      }));
    });
  });

  describe("viewMatchDetails", () => {
    it("should return 404 if match not found", async () => {
      mockingoose(Match).toReturn(null, "findOne");

      const req = { params: { matchid: "match1" } };
      await matchesController.viewMatchDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Match Not found" });
    });

    it("should return match details", async () => {
      const match = {
        _id: "match1",
        teamOne: { name: "Team A" },
        teamTwo: { name: "Team B" },
      };

      mockingoose(Match).toReturn(match, "findOne");

      const req = { params: { matchid: "match1" } };
      await matchesController.viewMatchDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(match);
    });
  });
});
