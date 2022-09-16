const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
  createdBy: {
    type: "string",
    required: true,
    trim: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  }
});

module.exports = Event;
