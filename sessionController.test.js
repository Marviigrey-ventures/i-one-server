// tests/sessionController.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app"); // Adjust path to your Express app

const User = require("../models/userModel");
const Session = require("../models/session");
const Location = require("../models/Locations");
const Match = require("../models/matches");

let token;
let user;
let session;
let location;

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});

  // Create a test user
  user = await User.create({
    nickname: "testUser",
    email: "test@example.com",
    password: "password123",
  });

  // Mock authentication middleware
  app.use((req, res, next) => {
    req.user = user;
    next();
  });

  // Create location
  location = await Location.create({
    name: "Test Field",
    location: {
      type: "Point",
      coordinates: [6.5244, 3.3792],
    },
  });

  // Create a session
  session = await Session.create({
    captain: user._id,
    location: location._id,
    members: [user._id],
    setNumber: 3,
    playersPerTeam: 2,
    timeDuration: 60,
    minsPerSet: 20,
    startTime: new Date(),
    stopTime: new Date(Date.now() + 60 * 60000),
    winningDecider: "firstToScore",
    maxNumber: 6,
    isFull: false,
    inProgress: false,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe("Session Controller Tests", () => {
  test("Should return session by ID", async () => {
    const res = await request(app).get(`/session/${session._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("captain");
    expect(res.body).toHaveProperty("members");
  });

  test("Should let user join a session", async () => {
    const newUser = await User.create({
      nickname: "newMember",
      email: "new@example.com",
      password: "pass456",
    });

    app.use((req, res, next) => {
      req.user = newUser;
      next();
    });

    const res = await request(app).post(`/session/${session._id}/join`);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/successfully joined/i);
  });

  test("Should return all active sessions", async () => {
    const res = await request(app).get("/session");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Should return session members", async () => {
    const res = await request(app).get(`/session/${session._id}/members`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Should remove user from session", async () => {
    const res = await request(app).post(`/session/${session._id}/leave`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removed/i);
  });

  test("Should reschedule a session", async () => {
    const newTime = new Date(Date.now() + 1000000);
    const res = await request(app)
      .post(`/session/${session._id}/reschedule`)
      .send({
        startTime: newTime,
        timeDuration: 30,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/rescheduled/i);
  });

  test("Should find nearby matches", async () => {
    const match = await Match.create({
      session: session._id,
      teamOne: user._id,
      teamTwo: user._id,
    });

    const res = await request(app).post("/matches/findNearby").send({
      latitude: 3.3792,
      longitude: 6.5244,
    });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Should delete a session", async () => {
    const res = await request(app).delete(`/session/${session._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});