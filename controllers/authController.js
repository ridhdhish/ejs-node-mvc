const User = require("../models/User");

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

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.login_post = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  res.send("user login");
};
