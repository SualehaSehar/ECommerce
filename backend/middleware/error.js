const ErrorHandler = require("../utils/errorhandler");

//error handling middleware function with four parameters (err, req, res, next) to handle errors.
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //500 Internal Server Error
  err.message = err.message || "Internal Server Error";

  // Wrong Mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400); //400 Bad Request
  }

  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = `This Email is already taken, Try different email`;
    err = new ErrorHandler(message, 400); //400 Bad Request
  }

  // wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400); //400 Bad Request
  }

  // JWT Expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message, 400); //400 Bad Request
  }

  res.status(err.statusCode).json({
    success: false,
    // error:err,
    message: err.message,
  });
};
