const Location = require("../models/Locations");
const User = require("../models/userModel");

const registerLocation = async (req, res) => {
  try {
    const { name, address, location } = req.body;

    if (!name || !address || !location)
      res.status(404).json({ message: "Please fill all required fields" });

    const alreadyExists = await Location.findOne({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location.coordinates,
          },
          $maxDistance: 1, // 1 meter tolerance to avoid duplicates
        },
      },
    });

    if (alreadyExists)
      return res.status(409).json({ message: "Location already registered" });

    const place = await Location.create({ name, address, location });

    res.status(200).json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

const viewAllLocations = async (req, res) => {
  try {
    const places = await Location.find();

    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const viewNearbyLocations = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.body;

    if (!longitude || !latitude)
      return res
        .status(404)
        .json({ message: "Location Paramneters not complete" });

    const nearbyLocations = await Location.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000,
        },
      },
    });
    res.status(200).json(nearbyLocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyLocation = async (req, res) => {
  try {
    const userid = req.user._id;

    const user = await User.findById(userid);

    if (!user) res.status(404).json({ message: "User not found" });

    const location = user.locationInfo;
    const address = user.locationInfo.address;
    const coordinates = user.locationInfo.location.coordinates;

    res.status(200).json({ locationInfo: location, address, coordinates });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
    console.log(err);
  }
};

module.exports = {
  registerLocation,
  viewAllLocations,
  viewNearbyLocations,
  getMyLocation,
};
