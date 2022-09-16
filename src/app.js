const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const eventRouter = require("./routers/events");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(eventRouter);

module.exports = app;