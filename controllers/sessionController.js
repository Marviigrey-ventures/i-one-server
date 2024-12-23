const User = require("../models/userModel");
const Session = require("../models/session");

const startSession = async (req, res) => {
  try {
    const userid = req.user._id;
    const { location } = req.body;

    const user = await User.findById(userid);

    user.isCaptain = true;

    await user.save();

    const session = await Session.create({ location, captain: userid });

    user.currentSession = session._id;
    await user.save();

    res.status(201).json({ message: "session in progress", session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const endSession = async (req, res) => {
  const userid = req.user._id;

  const user = await User.findById(userid);

  if (!user.isCaptain)
    res.status(401).json({ message: "You are not a captain" });

  user.isCaptain = false;

  await user.save();

  res.status(201).json({ message: "Session Ended" });
};

const kickOff = async (req, res) => {
  const { sessionid } = req.params;

  const session = await Session.findById(sessionid);

  session.inProgress = true;

  await session.save();

  res.status(200).json({ message: "Session has kicked off" });
};

const createSession = async (req, res) => {
  try {
    const { sessionid } = req.params;

    const userid = req.user._id;
    const {
      setNumber,
      playersPerTeam,
      timeDuration,
      minsPerSet,
      startTime,
      winningDecider,
    } = req.body;

    const user = await User.findById(userid);
    const session = await Session.findById(sessionid)
      .populate({
        path: "members",
        select: "username -_id",
      })
      .populate({
        path: "captain",
        select: "username -_id",
      });

    if (!session) return res.status(404).json({ message: "Session not founf" });

    if (!user.isCaptain)
      return res.status(401).json({ message: "you are not a captain" });

    if (
      !setNumber ||
      !timeDuration ||
      !minsPerSet ||
      !startTime ||
      !winningDecider ||
      !playersPerTeam
    )
      return res.status(400).json({ mesage: "All fields must be field" });

    const addedStopTime = new Date(
      new Date(startTime).getTime() + timeDuration * 60000
    );

    const existingSchedule = await Session.findOne({
      startTime,
      stopTime: addedStopTime,
    });

    if (existingSchedule)
      return res.status(409).json({ message: "Session Time already exist" });

    const overlappingSchedule = await Session.findOne({
      startTime: { $lt: new Date(addedStopTime) },
      stopTime: { $gt: new Date(startTime) },
    });

    if (overlappingSchedule)
      return res
        .status(409)
        .json({ message: "This session overlaps with another one" });

    const maxNum = playersPerTeam * setNumber;

    session.setNumber = setNumber;
    session.playersPerTeam = playersPerTeam;
    session.timeDuration = timeDuration;
    session.minsPerSet = minsPerSet;
    session.startTime = startTime;
    session.stopTime = addedStopTime;
    session.winningDecider = winningDecider;
    session.maxNumber = maxNum;

    const newSession = await session.save();

    res.status(202).json(newSession);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const viewSessionById = async (req, res) => {
  try {
    const { sessionid } = req.params;

    const sessionexists = await Session.findById(sessionid);

    if (!sessionexists) {
      return res.status(400).json({ message: "session not found" });
    }
    const session = await Session.findById(sessionid)
      .populate({
        path: "members",
        select: "username -_id",
      })
      .populate({
        path: "captain",
        select: "username -_id",
      });

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(err.mesage);
  }
};

const joinSession = async (req, res) => {
  try {
    const { sessionid } = req.params;
    const userid = req.user._id;

    console.log("Session ID:", sessionid);
    console.log("User ID:", userid);

    // Find the session by ID and populate necessary fields
    const session = await Session.findById(sessionid).populate({
      path: "captain",
      select: "username -_id",
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user exists
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a member
    const alreadyJoined = session.members.some(
      (member) => member.toString() === userid.toString()
    );

    if (alreadyJoined) {
      return res
        .status(409)
        .json({ message: "You are already in this session" });
    }

    if (user.currentSession !== null)
      return res.status(400).json({
        message: "You are currently in a session, please leave that session",
      });

    // Check if session is full
    if (session.isFull) {
      return res.status(400).json({ message: "Session is full" });
    }

    // Add user to members array
    session.members.addToSet(userid); // Push the user ID directly

    // Check if session is now full
    if (session.members.length >= session.maxNumber) {
      session.isFull = true;
    }

    const updatedSession = await session.save();

    // Update user's current session
    user.currentSession = updatedSession._id;
    await user.save();

    res.status(201).json({ message: "User successfully joined session" });
  } catch (err) {
    console.error("Error in joinSession:", err);
    res.status(500).json({ message: err.message });
  }
};

const viewAllSessions = async (req, res) => {
  const sessions = await Session.find({})
    .populate({
      path: "captain",
      select: "username -_id",
    })
    .populate({
      path: "members",
      select: "username -_id",
    });

  res.status(200).json(sessions);
};

const leaveSession = async (req, res) => {
  try {
    const { sessionid } = req.params;

    const userid = req.user._id;

    const user = await User.findById(userid);

    if (!user) return res.status(404).json({ message: "User not found" });

    const session = await Session.findById(sessionid);

    if (!session)
      return res.status(404).json({ message: "Session does not exist" });

    const alreadyJoined = session.members.some(
      (member) => member.toString() === userid.toString()
    );

    if (!alreadyJoined)
      return res.status(400).json({ message: "not a member of this session" });

    session.members.pull(userid);

    session.isFull = session.members.length >= session.maxNumber;

    await session.save();

    user.currentSession = null;
    await user.save();

    res.status(200).json({ message: "User successfully removed from session" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(err);
  }
};

const viewSessionMembers = async (req, res) => {
  try {
    const { sessionid } = req.params;
    const session = await Session.findById(sessionid).populate("members");

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.members || session.members.length === 0)
      return res.status(404).json({ message: "no members have joined yet" });

    const memberNames = session.members.map((member) => ({
      username: member.username,
    }));

    res.status(200).json(memberNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

const deleteSession = async (req, res) => {
  try {
    const { sessionid } = req.params;

    const session = await Session.findById(sessionid);

    const members = session.members;

    console.log(members);

    await Promise.all(
      members.map(async (memberid) => {
        const user = await User.findById(memberid);
        if (user) {
          user.currentSession = null;
          user.isCaptain = false;
          await user.save();
        } else {
          res.status(409).json({ message: "User not found" });
        }
      })
    );

    await Session.findByIdAndDelete(sessionid);

    res
      .status(200)
      .json({ message: "Session deleted and members updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const rescheduleSession = async (req, res) => {
  try {
    const { sessionid } = req.params;
    const { startTime, timeDuration } = req.body;

    const session = await Session.findById(sessionid);
    if (!session) return res.status(409).json({ message: "Session not found" });

    if (!startTime || !timeDuration)
      return res
        .status(400)
        .json({ message: "Input all information required for rescheduling" });

    const addedStopTime = new Date(
      new Date(startTime).getTime() + timeDuration * 60000
    );

    const existingSchedule = await Session.findOne({
      startTime,
      stopTime: addedStopTime,
    });

    if (existingSchedule)
      return res.status(409).json({ message: "Session Time already exist" });

    const overlappingSchedule = await Session.findOne({
      _id: { $ne: sessionid }, 
      startTime: { $lt: new Date(addedStopTime) },
      stopTime: { $gt: new Date(startTime) },
    });

    if (overlappingSchedule)
      return res
        .status(409)
        .json({ message: "This session overlaps with another one" });

    session.startTime = startTime;
    session.timeDuration = timeDuration;
    session.stopTime = addedStopTime;

    const updatedSession = await session.save();

    res.status(201).json({ message: "Session resheduled", updatedSession });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(err);
  }
};

module.exports = {
  startSession,
  createSession,
  endSession,
  kickOff,
  viewAllSessions,
  joinSession,
  viewSessionMembers,
  viewSessionById,
  leaveSession,
  deleteSession,
  rescheduleSession,
};
