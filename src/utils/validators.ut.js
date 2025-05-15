import Joi from "joi";
import { validatewithjoi } from "./validatewithjoi.js";


// Register schema
const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
    "string.empty": "Name cannot be empty.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email.",
    "any.required": "Email is required.",
  }),
  username: Joi.string().required().messages({
    "any.required": "Username is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
  }),
});

// Login schema
const baseLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

// Export all validators in one block
export const registerUserSchema = validatewithjoi(registerSchema);
export const loginUserSchema = validatewithjoi(baseLoginSchema);
