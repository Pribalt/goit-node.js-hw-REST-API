const { HttpError } = require("../utils");

const validateBody = (schemas) => {
  const func = (req, res, next) => {
    const { error } = schemas.validate(req.body);

    if (error) {
      return next(new HttpError(404, error.message));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
