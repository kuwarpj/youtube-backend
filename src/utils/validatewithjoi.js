import { ApiError } from "./apiError.js";

export const validatewithjoi = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const formattedErrors = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return next(new ApiError(400, "Validation failed", formattedErrors));
    }

    next();
  };
};
