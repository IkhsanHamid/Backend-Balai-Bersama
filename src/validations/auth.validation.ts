import Joi from 'joi'
import { type userType } from '../types/user.type'

export const createUserValidation = (payload: userType) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    password: Joi.string().required().min(8),
    email: Joi.string().required(),
    role: Joi.string().required(),
    phonenumber: Joi.string().allow('', null),
    nationality: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const loginValidation = (payload: userType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })

  return schema.validate(payload)
}

export const refreshSessionValidation = (payload: userType) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })

  return schema.validate(payload)
}
