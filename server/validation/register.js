const isEmpty = require("./isEmpty");
const hasSpace = require("./hasSpace");

validator = require("validator");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = isEmpty(data.username) ? "" : data.username;
  data.password = isEmpty(data.password) ? "" : data.password;

  if (!validator.isLength(data.username, { min: 2, max: 40 })) {
    errors.username = "username must be between 2 and 40 characters";
  }

  if (hasSpace(data.username)) {
    errors.username = "username cannot contain spaces";
  }

  if (validator.isEmpty(data.username)) {
    //this isEmpty funtion is coming from the validator lib
    errors.username = "username cannot be empty";
  }

  if (!validator.isLength(data.password, { min: 6 })) {
    errors.password = "password must be at least 6 characters long";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "password cannot be empty";
  }
  return {
    errors: errors,
    isValid: isEmpty(errors), //this isEmpty funtion is the one i made in isEmpty.js
  };
};
