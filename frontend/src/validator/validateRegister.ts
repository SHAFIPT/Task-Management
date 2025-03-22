
import * as Joi from 'joi';
import { IUser } from '../types/auth';

const registerSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp("^[A-Za-z]+$"))
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "First name should only contain letters",
      "string.min": "First name should be at least 2 characters long",
      "string.max": "First name should not exceed 30 characters",
      "string.empty": "First name is required",
    }),
  email: Joi.string()
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
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password must match the password",
      "string.empty": "Confirm password is required",
    }),
});

export const ValidateRegister = (data: Partial<IUser>) => {
  const { error } = registerSchema.validate(data, { abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
    return formattedErrors;
  }

  return null;
};