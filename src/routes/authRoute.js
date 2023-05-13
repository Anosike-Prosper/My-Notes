const express = require("express");
const passport = require("passport");
const { login, signUp } = require("../controllers/authController");

const { signupDto, loginDto } = require("../validators/user");

const router = express.Router();

// const { logIn, signUp } = require("../controllers/authController");

router.post("/login", loginDto, login);

router.post("/signup", signupDto, signUp);

module.exports = router;
