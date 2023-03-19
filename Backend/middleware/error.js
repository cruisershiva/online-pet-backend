const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `resource not found, invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `json web token is invalid please try again`;
    err = new ErrorHandler(message, 400);
  }
  //JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `json web token is expired please try again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
