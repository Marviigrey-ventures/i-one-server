const Session = require("../models/session");
const User = require("../models/userModel");
const Set = require("../models/Set");

const allocateMembers = async (session, createdSets) => {
  const members = session.members;

  const pickedMembers = createdSets.flatMap((set) => set.players);

  const availablePlayers = members.filter(
    (member) => !pickedMembers.includes(member)
  );

  if (availablePlayers.length === 0) return;

  for (let i = 0; i < members.length; i++) {
    const player = availablePlayers[i];

    const setIndex = i % createdSets.length;
    const pickedSet = createdSets[setIndex];

    pickedSet.players.push(player);
    await pickedSet.save();
  }
};

const createSet = async (req, res) => {
  try {
    const { sessionid } = req.params;

    const setName = [
      "Team 7",
      "Royal Knights",
      "Bouillon Fc",
      "Sepulcher FC",
      "Akatsuki",
      "Amapiano FC",
      "Grey Fc",
      "Dynasty",
      "Elon Musk Fc",
      "J-boys FC",
      "Sporty9ja",
      "Wizkidfc",
      "30BG",
      "Valdomites",
      "OV-Hoes",
      "Outsiders",
      "Celeboys",
      "Azonto FC",
      "Akara warriors",
      "Egusi FC",
    ];

    const session = await Session.findById(sessionid);

    if (!session) return res.status(409).json({ message: "Session not found" });

    const { setNumber } = session;

    const existingSets = await Set.find({ session: sessionid });

    const usedNames = existingSets.map((set) => set.name);

    const availableNames = setName.filter((name) => !usedNames.includes(name));

    // Check if there are enough unique names available
    if (availableNames.length < setNumber) {
      return res
        .status(400)
        .json({ message: "Not enough unique names available for the session" });
    }

    const count = await Set.countDocuments({ session: sessionid });

    if (session.maxNumber >= count)
      return res.status(400).json({ message: "Set already created" });

    const setData = [];

    for (let i = 0; i < setNumber; i++) {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      const randomName = availableNames.splice(randomIndex, 1)[0];

      setData.push({
        session: session._id,
        name: randomName,
        players: [],
      });
    }

    const createdSets = await Set.insertMany(setData);

    await allocateMembers(session, createdSets);

    res.status(201).json({
      message: "sets created Sucessfully",
      createdSets,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(err);
  }
};

const viewAllSets = async (req, res) => {
  try {
    const sets = await Set.find({}).populate({
      path: "players",
      select: "username -_id",
    });

    res.status(200).json(sets);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(err.message)
  }
};

module.exports = { createSet, viewAllSets };
