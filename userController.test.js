const request = require("supertest");
const express = require("express");
const mockingoose = require("mockingoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const userRoutes = require("../routes/userRoutes");
const sendMail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

jest.mock("../utils/sendEmail");
jest.mock("../utils/createToken");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Controller", () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      createToken.mockReturnValue("fake_token");

      const mockUser = {
        _id: "user123",
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        nickname: "johnd",
        password: await bcrypt.hash("Password123", 10),
        isOwner: true,
        address: "123 Street",
        locationInfo: "Lagos",
        position: "Midfielder",
        phoneNumber: "09012345678",
        isAdmin: false,
      };

      mockingoose(User).toReturn(null, "findOne");
      mockingoose(User).toReturn(mockUser, "create");

      const res = await request(app).post("/api/users/register").send({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        nickname: "johnd",
        password: "Password123",
        isOwner: true,
        address: "123 Street",
        locationInfo: "Lagos",
        position: "Midfielder",
        phoneNumber: "09012345678",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login an existing user", async () => {
      const password = await bcrypt.hash("Password123", 10);
      const user = {
        _id: "user123",
        email: "john@example.com",
        password,
        isAdmin: false,
      };

      mockingoose(User).toReturn(user, "findOne");
      createToken.mockReturnValue("fake_token");

      const res = await request(app).post("/api/users/login").send({
        email: "john@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("POST /api/users/forgot-password", () => {
    it("should send OTP to user's email", async () => {
      const user = {
        _id: "user123",
        email: "john@example.com",
        save: jest.fn(),
      };

      mockingoose(User).toReturn(user, "findOne");
      sendMail.mockResolvedValue(true);

      const res = await request(app).post("/api/users/forgot-password").send({
        email: "john@example.com",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/OTP sent to/);
    });
  });

  describe("POST /api/users/verify-otp", () => {
    it("should verify valid OTP", async () => {
      const user = {
        email: "john@example.com",
        otp: "123456",
        otpExpiration: Date.now() + 10000,
        otpVerified: false,
        save: jest.fn(),
      };

      mockingoose(User).toReturn(user, "findOne");

      const res = await request(app).post("/api/users/verify-otp").send({
        email: "john@example.com",
        otp: "123456",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("OTP verified, proceed to reset password");
    });
  });

  describe("POST /api/users/reset-password", () => {
    it("should reset password if OTP is verified", async () => {
      const user = {
        email: "john@example.com",
        otpVerified: true,
        save: jest.fn(),
      };

      mockingoose(User).toReturn(user, "findOne");

      const res = await request(app).post("/api/users/reset-password").send({
        email: "john@example.com",
        newPassword: "NewPassword123",
        confirmPassword: "NewPassword123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Password reset Successful");
    });
  });
});