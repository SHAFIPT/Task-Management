import * as Joi from 'joi';
import { ITask } from '../types/task.types';

const editTaskSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      "string.empty": "Title is required",
    }),
  description: Joi.string()
    .allow('', null)
    .optional(),
  project: Joi.alternatives()
    .try(
      Joi.string().required(),
      Joi.object().unknown(true)
    )
    .required()
    .messages({
      "any.required": "Project is required",
    }),
  assignedTo: Joi.array()
    .items(Joi.string())
    .optional(),
  status: Joi.string()
    .valid('backlog', 'todo', 'inProgress', 'review', 'done')
    .required()
    .messages({
      "any.only": "Please select a valid status",
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .required()
    .messages({
      "any.only": "Please select a valid priority",
    }),
  timeEstimate: Joi.number()
    .allow(null, '')
    .min(0)
    .optional()
    .messages({
      "number.min": "Time estimate must be a positive number",
    }),
  tags: Joi.array()
    .items(Joi.string())
    .optional(),
});

export const validateEditTask = (data: Partial<ITask>) => {
  const { error } = editTaskSchema.validate(data, { abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
    return formattedErrors;
  }

  return null;
};