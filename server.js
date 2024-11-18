require("dotenv").config();
const cors = require('cors')
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const corsOptions = require('./config/corsList')
const userRoutes = require('./routes/userRoutes')
  


const app = express();
app.use(express.json());
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB()




//Routes
app.use('/i-one/user', userRoutes)

  app.listen(process.env.PORT, () => {
    console.log(`server Started and listening on ${process.env.PORT}`);
  });
