const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Password must be of minimum 6 characters"],
  },
});

// fire function before doc has been saved in db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
