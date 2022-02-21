const isEmpty = require("./isEmpty");

validator = require("validator");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.username = isEmpty(data.username) ? "" : data.username;
  data.password = isEmpty(data.password) ? "" : data.password;

  if (validator.isEmpty(data.username)) {
    //this isEmpty funtion is coming from the validator lib
    errors.username = "username cannot be empty";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "password cannot be empty";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors), //this isEmpty funtion is the one i made in isEmpty.js
  };
};
