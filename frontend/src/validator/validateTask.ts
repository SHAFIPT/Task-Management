import * as Joi from 'joi';
import { AddTaskParams } from '../hooks/useAddTask';

const taskSchema = Joi.object({
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
    .items(
      Joi.alternatives().try(
        Joi.string(),
        Joi.object().unknown(true)
      )
    )
    .optional(),
  status: Joi.string()
    .valid('backlog', 'todo', 'inProgress', 'review', 'done')
    .default('backlog')
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .default('medium')
    .optional(),
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
  createdBy: Joi.string()
    .optional(),
});

export const validateTask = (data: Partial<AddTaskParams>) => {
  const { error } = taskSchema.validate(data, { abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
    return formattedErrors;
  }

  return null;
};