const corsOptions = {
  origin: function (origin, callback) {
    if (origin) {
      callback(null, origin); // allow all origins that send an Origin header
    } else {
      callback(new Error('Origin not allowed'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
module.exports = corsOptions