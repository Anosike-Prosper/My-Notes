const request = require("supertest");
const { app } = require("../app");
const { userModel } = require("../models/userModel");
const { noteModel } = require("../models/noteModel");
const { user, note } = require("./test.helper");

const mongoose = require("mongoose");

describe("Create new note", () => {
  let authToken;

  beforeAll(async () => {
    await userModel.deleteMany({});
    await noteModel.deleteMany({});

    await request(app).post("/user/signup").send(user);

    const loginResponse = await request(app).post("/user/login").send(user);
    console.log("login response", loginResponse.body);
    // console.log("------------login response", loginResponse);
    authToken = loginResponse.body.token;
    // console.log("------------------authToken", authToken);
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  test("returns a 201 if new note was created successfully", async () => {
    const response = await request(app)
      .post("/note")
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${authToken}`)

      .send(note);

    console.log("response body is-------", response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body.newNote).toHaveProperty("title");
    expect(response.body.newNote.title).toBe("Fall of the Ocean");
    expect(response.body.message).toBe("Note created successfully");
  });

  test("should return a 401 error if token is not provided", async () => {
    const response = await request(app).post("/note").send(note);
    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.text).status).toBe("fail");
    expect(JSON.parse(response.text).message).toBe(
      "You are not logged in. Please log in to get access"
    );
  });

  // test("should return a 400 error when no data is passed", async () => {
  //   const response = await request(app)
  //     .post("/api/v1/note")
  //     .set("Cookie", authToken)
  //     .send({});
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body).toHaveProperty("status");
  //   expect(response.body).toHaveProperty("message");
  //   expect(response.body.status).toBe("fail");
  //   expect(response.body.message).toBe("Title or body not provided!");
  // });

  // test("should return a 400 error when title and body is empty", async () => {
  //   const response = await request(app)
  //     .post("/api/v1/note")
  //     .set("Cookie", authToken)
  //     .send(HELPER.emptyNote);
  //   expect(response.statusCode).toBe(400);
  //   expect(JSON.parse(response.text).status).toBe("fail");
  //   expect(JSON.parse(response.text).message).toBe("Empty note not saved!");
  // });
});
