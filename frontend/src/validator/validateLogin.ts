import * as Joi from 'joi';
import { IUser } from '../types/auth';

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.min": "Password should be at least 8 characters long",
      "string.pattern.base":
        "Password should include uppercase, lowercase, number, and special character",
      "string.empty": "Password is required",
    }),
  role: Joi.string()
    .valid("user", "admin") // Ensure only allowed roles are accepted
    .required()
    .messages({
      "any.only": "Invalid role selected",
      "string.empty": "Role is required",
    }),
});


export const validateLogin = (data: Partial<IUser>) => {
  const { error } = loginSchema.validate(data, { abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
    return formattedErrors;
  }

  return null;
};