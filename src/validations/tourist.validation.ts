import Joi from 'joi'
import { TouristTypeUpdate } from 'src/types/tourist.type'

export const updateTouristValidation = (payload: TouristTypeUpdate) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().min(8),
    phonenumber: Joi.string().required(),
    nationality: Joi.string().required()
  })

  return schema.validate(payload)
}
