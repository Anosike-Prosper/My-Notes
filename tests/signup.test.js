const request = require("supertest");
const { app } = require("../app");
const { userModel } = require("../models/userModel");
const mongoose = require("mongoose");

describe("User registration", () => {
  beforeAll(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
    console.log(await userModel.find({}));
  });

  test("should register a new user", async () => {
    const user = {
      email: "johndoe@example.com",
      password: "password123",
    };
    const response = await request(app).post("/user/signup").send(user);

    // console.log("------------------", response);
    expect(response.statusCode).toBe(201);

    expect(response.body.data).toHaveProperty("_id");
    // expect(response.body.data).toHaveProperty("email", user.email);
  });

  test("should return a 400 error with invalid email", async () => {
    const user = {
      email: "@example.com",
      password: "pass",
    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.text).message).toBe(
      "Provide a valid email address"
    );
  });

  test("should return a 400 error with a weak password", async () => {
    const user = {
      email: "user@example.com",
      password: "pass",
    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.text).message).toBe(
      "Password must be at least 8 characters"
    );
  });
});
