const Match = require("../models/matches");
const Session = require("../models/session");
const Set = require("../models/Set");

const viewSetForSession = async (sessionid) => {
  const sets = await Set.find({ session: sessionid });

  return sets;
};

const matchUp = async (req, res) => {
  try {
    const { sessionid } = req.params;
    let availablesets;
    const sets = await viewSetForSession(sessionid);

    if (!sets || sets.length === 0) {
      return res
        .status(404)
        .json({ message: "No sets found for this session" });
    }

    const expectedLength = sets.length / 2;

    availablesets = sets.map((set) => set._id);

    if (availablesets.length % 2 !== 0) {
      return res
        .status(400)
        .json({ message: "Cannot create pairs with an odd number of sets" });
    }

    let matchUp = [];

    const existingMatchUp = await Match.find({ session: sessionid });

    const alreadyMatched = existingMatchUp.length >= expectedLength;

    if (alreadyMatched)
      return res
        .status(400)
        .json({ message: "Teams already mactched for this session" });

    while (availablesets.length > 0) {
      const randomIndex1 = Math.floor(Math.random() * availablesets.length);
      const randomTeam1 = availablesets[randomIndex1];
      availablesets.splice(randomIndex1, 1);

      const randomIndex2 = Math.floor(Math.random() * availablesets.length);
      const randomTeam2 = availablesets[randomIndex2];
      availablesets.splice(randomIndex2, 1);

      matchUp.push({
        teamOne: randomTeam1,
        teamTwo: randomTeam2,
        session: sessionid,
      });
    }

    const createdMatchUps = await Match.insertMany(matchUp);

    res.status(200).json(createdMatchUps);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
    console.log(error);
  }
};

const viewSessionMatchUps = async (req, res) => {
  try {
    const { sessionid } = req.params;

    const matches = await Match.find({ session: sessionid })
      .populate({
        path: "teamOne",
        select: "name -_id",
      })
      .populate({
        path: "teamTwo",
        select: "name -_id",
      });

    if (!matches || matches.length == 0)
      return res
        .status(404)
        .json({ message: "No matchups exist in this session yet" });

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

module.exports = { matchUp, viewSessionMatchUps };
