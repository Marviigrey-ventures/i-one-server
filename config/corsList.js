const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins including Postman/no-origin tools
    callback(null, origin || true); 
  },
  credentials: true,
  optionsSuccessStatus: 200
};
