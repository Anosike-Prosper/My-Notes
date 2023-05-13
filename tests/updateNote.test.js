const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../app");
const { userModel } = require("../models/userModel");
const { noteModel } = require("../models/noteModel");

describe("Update Note", () => {
  let authToken, id;

  const note = {
    title: "Fall of the Ocean",
    body: "Hearld grift thoughts",
  };
  const user = {
    email: "userone@gmail.com",
    password: "password",
  };

  beforeAll(async () => {
    await userModel.deleteMany({});
    await noteModel.deleteMany({});

    await request(app).post("/user/signup").send(user);

    const loginResponse = await request(app).post("/user/login").send(user);
    authToken = loginResponse.body.token;

    const newPost = await request(app)
      .post("/note")
      .send(note)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);
    id = newPost.body.newNote._id;
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  test("returns a 200 if update successful", async () => {
    const updateNote = {
      body: "Hear the ocean and the earth",
    };
    const response = await request(app)
      .patch(`/note/${id}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updateNote);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.updatedNote.title).toBe("Fall of the Ocean");
    expect(response.body.updatedNote.body).toBe("Hear the ocean and the earth");
  });

  test("return 401 error if token not provided", async () => {
    const updateNote = {
      body: "Hear the ocean and the earth",
    };
    const response = await request(app).patch(`/note/${id}`).send(updateNote);
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe(
      "You are not logged in. Please log in to get access"
    );
  });

  test("return 404 error if note id not found or note id doesn't belong to user", async () => {
    const invalidId = "63f5022ff0b2c6f5c4cf5fb9";
    const updateNote = {
      body: "Hear the ocean and the earth",
    };
    const response = await request(app)
      .patch(`/note/${invalidId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updateNote);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe(
      "note with ID: 63f5022ff0b2c6f5c4cf5fb9 not found"
    );
  });
});
