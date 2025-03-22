import * as Joi from "joi";
import { IProject } from "../types/task.types";


const projectSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Project name is required",
    "string.min": "Project name must be at least 3 characters long",
    "string.max": "Project name cannot exceed 50 characters",
  }),
  description: Joi.string().max(300).allow("").messages({
    "string.max": "Description cannot exceed 300 characters",
  })
}).unknown(true);

export const validateProject = (data:IProject ) => {
  const { error } = projectSchema.validate(data, { abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
    return formattedErrors;
  }

  return null;
};
