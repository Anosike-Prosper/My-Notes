const request = require("supertest");
const { app } = require("../app");
const { userModel } = require("../models/userModel");
const mongoose = require("mongoose");

describe("User Login", () => {
  beforeAll(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
    await userModel.create({
      email: "james@gmail.com",
      password: "password1234",
    });
  });

  test("returns a 200 if login is successful", async () => {
    const user = {
      email: "james@gmail.com",
      password: "password1234",
    };
    const response = await request(app).post("/user/login").send(user);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.text).message).toBe("Login Successful");
  });

  test("returns a 400 if incorrect details is provided", async () => {
    const user = {
      email: "user@gmail.com",
      password: "password123",
    };
    const response = await request(app).post("/user/login").send(user);
    expect(response.statusCode).toBe(401);
    //   expect(JSON.parse(response.text).status).toBe("fail");
    expect(JSON.parse(response.text).message).toBe(
      "Incorrect Email or Password"
    );
  });

  test("returns a 400 if details not provided", async () => {
    const user = {
      email: "",
      password: "",
    };
    const response = await request(app).post("/user/login").send(user);
    expect(response.statusCode).toBe(400);
  });
});
