import Joi from 'joi'
import { TripType, TripTypeUpdate } from '../types/trip.type'

export const createTripValidation = (payload: TripType) => {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    destination: Joi.string().required(),
    touristId: Joi.number().required()
  })

  return schema.validate(payload)
}

export const updateTripValidation = (payload: TripTypeUpdate) => {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    destination: Joi.string().required()
  })

  return schema.validate(payload)
}
