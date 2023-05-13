const userModel = require("../models/userModel");
const AppError = require("../errors/appError");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

require("dotenv").config();

const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByEmail,
  userExist,
} = require("../services/user.services");

const createToken = (id) => {
  const token = jwt.sign({ id: id }, "our secret", {
    expiresIn: "1d",
  });

  return token;
};

const signUp = async (req, res, next) => {
  try {
    const userRequest = req.body;

    const existing = await userExist(userRequest.email);
    // console.log("existing-----------", existing);

    if (existing) {
      throw new AppError(
        "user with this email already exist",
        StatusCodes.CONFLICT
      );
    }

    const newUser = await createUser(userRequest);
    newUser.password = undefined;

    return res.status(StatusCodes.CREATED).send({
      message: "User has been succesfully signed up",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new AppError(
        "Please provide email and password",
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await getUserByEmail(email);

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError(
        "Incorrect Email or Password",
        StatusCodes.UNAUTHORIZED
      );
    }

    const token = createToken(user.id);

    return res.status(StatusCodes.OK).json({
      message: "Login Successful",
      status: true,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, signUp };
