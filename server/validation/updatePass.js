const isEmpty = require("./isEmpty");

validator = require("validator");

module.exports = function validateUpdatePass(data) {
  let errors = {};

  data.newPass = isEmpty(data.newPass) ? "" : data.newPass;

  if (!validator.isLength(data.newPass, { min: 6 })) {
    errors.password = "new password must be at least 6 characters long";
  }

  if (validator.isEmpty(data.newPass)) {
    errors.password = "new password cannot be empty";
  }
  return {
    errors: errors,
    isValid: isEmpty(errors), //this isEmpty funtion is the one i made in isEmpty.js
  };
};