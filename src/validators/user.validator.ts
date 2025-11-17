import Joi from 'joi';

/**
 * User registration validation schema
 */
export const registerUserSchema = Joi.object({
  userId: Joi.string().min(3).max(50).alphanum().required().messages({
    'string.min': 'User ID must be at least 3 characters',
    'string.max': 'User ID cannot exceed 50 characters',
    'any.required': 'User ID is required',
  }),

  email: Joi.string().email().optional().messages({
    'string.email': 'Must be a valid email address',
  }),

  name: Joi.string().max(100).optional().messages({
    'string.max': 'Name cannot exceed 100 characters',
  }),

  publicKey: Joi.string().required().messages({
    'any.required': 'Public key is required to generate wallet address',
  }),
}).unknown(false);

/**
 * Update user validation schema
 */
export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),

  name: Joi.string().max(100).optional(),

  metadata: Joi.object().optional(),
}).unknown(false);
