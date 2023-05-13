const express = require("express");
require("dotenv").config();

const { globalError } = require("./src/errors/errorHandler");

const authRouter = require("./src/routes/authRoute");
const noteRouter = require("./src/routes/noteRoute");

const app = express();

const { connectToMongoDB } = require("./config/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRouter);
app.use("/note", noteRouter);

app.use(globalError);

connectToMongoDB();

module.exports = { app };
