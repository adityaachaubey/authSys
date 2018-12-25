"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    lowercase: true,
    unique: true
  },
  hashedPassword: String,
  fullName: Boolean,
  address: String,
  contact: String,
  profilePhoto: String
});

userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

module.exports = mongoose.model("User", userSchema);
