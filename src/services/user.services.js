const { userModel } = require("../models/userModel");

const userExist = async (email) => {
  //check the db if a user exist
  const user = await userModel.findOne({ email });
  return user;
};

const createUser = async (user) => {
  //create user
  const newuser = await userModel.create({
    email: user.email,
    password: user.password,
  });
  return newuser;
};

const getUserByEmail = async (email) => {
  const user = await userModel.findOne({ email });
  return user;
};

module.exports = { userExist, createUser, getUserByEmail };
