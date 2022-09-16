const express = require("express");
const Event = require("../models/event");
const auth = require("../middleware/auth");
const User = require("../models/user");
const { addMinutesToTimestamp } = require("../utils/dateUtils");

const router = new express.Router();

router.post("/create-event", auth, async (req, res) => {
  const organizer = req.user._id;
  const guest = await User.checkuser(req.body.guest);
  const [date, time] = req.body.startTime.split(" ");
  const [hours, mintues, seconds] = time.split(":");
  const startTime = new Date(
    new Date(date).setUTCHours(hours, mintues, seconds)
  );
  const duration = req.body.duration;
  const endTime = addMinutesToTimestamp(startTime, duration);
  const conflicts = await Event.find({
    $and: [
      {
        $or: [
          { startTime: { $gt: startTime, $lt: endTime } },
          { endTime: { $gt: startTime, $lt: endTime } },
        ],
      },
      { $or: [{ organizer: guest._id }, { guest: guest._id }] },
    ],
  });
  if (conflicts.length > 0) {
    return res.status(400).send({
      success: false,
      message: "user has conflicts during the provided time window",
      conflicts,
    });
  }
  const event = await new Event({
    createdBy: req.user.name,
    organizer,
    guest: guest._id,
    description: req.body.description,
    startTime,
    endTime,
  });
  event.save();
  event
    .populate("guest")
    .then((populatedEvent) => {
      let result = populatedEvent.toObject();
      const organizer = req.user.toObject();
      delete organizer._id;
      delete organizer.__v;
      delete organizer.password;
      delete organizer.tokens;
      delete result.guest._id;
      delete result.guest.__v;
      delete result.guest.password;
      delete result.guest.tokens;
      result = {
        ...result,
        organizer,
      };
      console.log("Result", result);
      return res.send(result);
    })
    .catch((e) => {
      return res.send(e);
    });
});

router.get("/list-all-events", auth, async (req, res) => {
  const email = req.query.email;
  const user = await User.checkuser(email);
  const query = { $or: [{ organizer: user._id }, { guest: user._id }] };
  Event.find(query)
    .populate("organizer")
    .populate("guest")
    .then((events) => {
      const result = events.map((event) => {
        event = event.toObject();
        return {
          ...event,
          organizer: {
            name: event.organizer.name,
            email: event.organizer.email,
          },
          guest: {
            name: event.guest.name,
            email: event.guest.email,
          },
        };
      });
      return res.send(result);
    })
    .catch((error) => {
      return res.send(error);
    });
});

module.exports = router;
