const db = require("../models");
const bCrypt = require('bcrypt-nodejs');

let user_exports = {};

user_exports.create = function(req, res) {
  let full_address = buildAddress(req.body);

  db.User.create({
    email: req.body.email,
    password: generateHash(req.body.password),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    full_address: full_address,
    state: req.body.state
  }).then(function (userRsp) {
    req.login(userRsp, function (err) {
      if (err) {
       throw err;
      }
      return res.redirect("/profile");
    });
  });
}

user_exports.show = function(req, res) {
  db.User.findOne({
    where: {
      email: req.user.email
    }
  })
  .then(function(userRsp) {
      res.render("profile", userRsp);

    });
  }

user_exports.update = function (req, res) {
  let full_address = buildAddress(req.body);

  db.User.findOne({
    where: {
      email: req.user.email
    }
  }).then(function (userRsp) {
      userRsp.update({
        full_address: full_address,
        state: req.body.state
      }).then(function () {
        res.render("profile", userRsp);
      });
  });
}

function buildAddress(obj) {
  let address = obj.street + " " + obj.city + ", " + obj.state + " " + obj.zipcode;
  return address;
}

function generateHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

//delete user

module.exports = user_exports;
