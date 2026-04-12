import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateRegisterUser = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("contact").isMobilePhone().withMessage("Invalid contact number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("fullname")
    .notEmpty()
    .withMessage("Fullname is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("isSeller").isBoolean().withMessage("isSeller must be a boolean value"),
  validateRequest,
];
