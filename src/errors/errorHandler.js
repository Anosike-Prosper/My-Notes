require("dotenv").config();

let globalError;

const prodValidationError = (err) => {
  return new AppError(err.message, 400);
};

const handleTypeError = (err) => {
  return new AppError(err.message, 400);
};

/*Defined Error 1*/
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err) => {
  const value = err.keyValue.title
    ? JSON.stringify(err.keyValue.title)
    : JSON.stringify(err.keyValue.email);
  const message = `Duplicate field value < ${value} >: Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res, next) => {
  console.log(err);
  console.log("i am in the dev error handler");
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  res.status(statusCode).json({
    status: status,
    message: err.message,
    error: err,
  });
};

const sendErrorProd = (err, req, res, next) => {
  console.log("i am in the prod error handler");
  /*Defined Errors*/
  if (err.name === "ValidationError") {
    err = prodValidationError(err);
  }
  if (err.name === "CastError") {
    err = handleCastErrorDB(err);
  }
  if (err.code === 11000) {
    err = handleDuplicateFieldsDb(err);
  }

  // if (err.name === "TypeError") {
  //   err = handleTypeError(err);
  // }

  /*Response Handler for defined errors*/
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Server Issues!",
    });
  }
};

if (process.env.NODE_ENV === "development") {
  globalError = sendErrorDev;
} else {
  globalError = sendErrorProd;
}

module.exports = { globalError };

// module.exports =
// process.env.NODE_ENV === "development" ? sendErrorDev : sendErrorProd;

// const global_error = process.env.NODE_ENV === "deve"
