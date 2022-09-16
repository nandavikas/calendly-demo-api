const mongoose = require("mongoose");
const mongoDBUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/calendly-api";
mongoose.connect(mongoDBUrl, {
  useNewUrlParser: true,
});
