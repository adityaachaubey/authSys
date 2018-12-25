"use strict";

const jwt = require("jsonwebtoken");
//custom defined objects
const User = require("../Models/user.models");
const helper = require("../Helper");

exports.createUser = function(req, res, next) {
  User.find({ userName: req.body.userName }, function(err, user) {
    if (user.length) {
      res.json({
        status: "200",
        message: "User Already Exists"
      });
    } else {
      let newUser = new User(req.body);
      newUser.hashedPassword = helper.generateHash(req.body.hashedPassword);

      newUser.save(function(err, savedObject) {
        if (err) return next(err);
        if (savedObject) {
          res.json({
            status: "200",
            message: "you are registered successfully"
          });
        }
        next();
      });
    }
  });
};

exports.loginUser = function(req, res) {
  User.findOne({ userName: req.body.userName }, function(err, User) {
    if (err) return err;
    console.log(User);
    if (!User) {
      res.json({
        status: 200,
        message: "This email is not registered or Active"
      });
    } else {
      if (!User.authenticate(req.body.hashedPassword)) {
        if (err) console.log(err);

        res.json({
          status: 200,
          message: "This password is not correct."
        });
      } else {
        let token = jwt.sign({ _id: User._id }, "secret", {
          expiresIn: "7d"
        });
        res.json({
          status: 200,
          token: token,
          message: "You are logged in successfully"
        });
      }
    }
  });
};

exports.editDetails = function(req, res) {
  const { address, contact } = req.body;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { address: address, contact: contact } },
    { new: true },
    (err, doc) => {
      if (err) {
        res.json({
          err: err
        });
      }
      res.json({
        data: doc
      });
    }
  );
};

exports.uploadProfilePhoto = function(req, res) {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { profilePhoto: "/ProfilePhotoDir/" + req.file.filename } },
    { new: true },
    (err, doc) => {
      if (err) {
        res.json({
          err: err
        });
      }
      res.json({
        data: doc,
        message: "DONE"
      });
    }
  );
};


