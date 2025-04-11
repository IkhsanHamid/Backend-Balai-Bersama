import Joi from 'joi'
import { type userUpdate } from '../types/user.type'

export const updateUserValidation = (payload: userUpdate) => {
  const schema = Joi.object({
    username: Joi.string().optional().min(3),
    password: Joi.string().optional().min(8),
    email: Joi.string().optional(),
    name: Joi.string().optional().min(3)
  })

  return schema.validate(payload)
}
