const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../app");
const { userModel } = require("../models/userModel");
const { noteModel } = require("../models/noteModel");

describe("GET a note", () => {
  let authToken;
  let id;
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

    /*signup*/
    await request(app).post("/user/signup").send(user);

    /* login user*/
    const loginResponse = await request(app).post("/user/login").send(user);
    authToken = loginResponse.body.token;

    /* save a new note to db*/
    const newPost = await request(app)
      .post("/note")
      .send(note)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);
    console.log(newPost);
    id = newPost.body.newNote._id;
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  test("returns 200 when a correct note id is passed", async () => {
    const response = await request(app)
      .get(`/note/${id}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.note).toHaveProperty("title");
    expect(response.body.note).toHaveProperty("body");
    expect(response.body.note).toHaveProperty("noteOwner_id");
  });

  test("returns 404 error if note requested doesn't belong to user or isn't found", async () => {
    const invalidId = "63f5022ff0b2c6f5c4cf5fb9";
    const response = await request(app)
      .get(`/note/${invalidId}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);

    // console.log("invalidID RESPONSE", response.body);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe(
      "note with ID: 63f5022ff0b2c6f5c4cf5fb9 not found"
    );
  });

  test("returns a 401 error if token not provided", async () => {
    const invalidId = "63f5022ff0b2c6f5c4cf5fb9";

    const response = await request(app).get(`/note/${invalidId}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe(
      "You are not logged in. Please log in to get access"
    );
  });
});
