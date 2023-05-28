const handleMongooseError = (err, data, next) => {
  const { name, code } = err;
  console.log(name);
  console.log(code);
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  err.statusCode = status;
  next();
};

module.exports = handleMongooseError;
