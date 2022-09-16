const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const Event = require("../src/models/event");
const jwt = require("jsonwebtoken");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Nanda",
  email: "nanda@example.com",
  password: "qwerty_123",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwo = {
  name: "Vikas",
  email: "vikas@example.com",
  password: "qwerty_123",
};

beforeEach(async () => {
  await User.deleteMany();
  await Event.deleteMany();
  var user1 = new User(userOne);
  await user1.save();
  var user2 = new User(userTwo);
  await user2.save();
  var event = new Event({
    createdBy: user1.name,
    organizer: user1._id,
    guest: user2._id,
    description: "Testing the event endpoint",
    startTime: new Date("2022-09-15 12:00:00"),
    endTime: new Date("2022-09-15 12:30:00"),
  });
  event.save();
});

afterEach(async () => {});

test("List all the events of a user", async () => {
  await request(app)
    .get("/list-all-events?email=nanda@example.com")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});
