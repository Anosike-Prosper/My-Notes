const AppError = require("../errors/appError");
const { StatusCodes } = require("http-status-codes");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");

const validateUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not logged in. Please log in to get access",
        StatusCodes.UNAUTHORIZED
      );
    }

    const decoded = await promisify(jwt.verify)(token, "our secret");

    const currentUser = await userModel.findById(decoded.id);

    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token no longer exist",
        StatusCodes.UNAUTHORIZED
      );
    }

    req.user = currentUser.id;

    next();
  } catch (err) {
    console.log("i dey here");
    next(err);
  }
};

module.exports = { validateUser };
