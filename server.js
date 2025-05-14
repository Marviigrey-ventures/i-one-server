const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = require("./app");

connectDB();

mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`server connected to db and listening on ${process.env.PORT}`);
  });
});
