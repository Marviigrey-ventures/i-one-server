require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const corsOptions = require("./config/corsList");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
const sessionR = require("./routes/sessionsRoutes");
const setRoutes = require("./routes/setRoutes");
const matchesRoutes = require("./routes/matchesRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "i-one-server-API",
      version: "1.0.0",
      description: "API documentation for i-one-server",
    },
    servers: [
      { url: "https://i-one-server.onrender.com" },
      { url: "http://localhost:4500" },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          }
        }
    },
  },
  apis: ["./routes/*.js"],
};

//swaggwer Docs Setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

connectDB();

//Routes
app.use("/i-one/user", userRoutes);
app.use("/i-one/sessionr", sessionR);
app.use("/i-one/set", setRoutes);
app.use("/i-one/match", matchesRoutes);
app.use("/i-one/location", locationRoutes);

mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`server connected to db and listening on ${process.env.PORT}`);
  });
});
