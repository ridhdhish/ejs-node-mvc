const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

// Handling Errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  //Duplicate error code
  if (err.code === 11000) {
    errors.email = "Email is already registered";
  }

  //Validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secrete key", {
    expiresIn: maxAge,
  });
};

// Signup page
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

// Login page
module.exports.login_get = (req, res) => {
  res.render("login");
};

// Signup API
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

// Login API
module.exports.login_post = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  res.send("user login");
};
