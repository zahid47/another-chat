const isEmpty = require("./isEmpty");

validator = require("validator");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

  // if (!validator.isEmail(data.email)) {
  //   errors.email = "invalid email";
  // }

  // if (validator.isEmpty(data.email)) {
  //   errors.email = "email cannot be empty";
  // }

  if (validator.isEmpty(data.password)) {
    errors.password = "password cannot be empty";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors), //this isEmpty funtion is the one i made in isEmpty.js
  };
};
