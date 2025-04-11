import { createTripValidation, updateTripValidation } from '../validations/trip.validation'
import { logger } from '../config/logger'
import { type Request, type Response } from 'express'
import { addTrip, deleteTrip, editTripsTourist, historyTrip } from '../services/trip.service'
import { paginationController } from '../types/global.type'
import { allTouristData } from '../services/tourist.service'

export const createTripTourist = async (req: Request, res: Response) => {
  try {
    const { error, value } = createTripValidation(req.body)
    if (error) {
      logger.error('ERR: trip - create - validation = ', error.details[0].message)
      return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
    }

    const create = await addTrip(value)
    return res.status(201).send({ status: true, statusCode: 201, message: 'success', data: create })
  } catch (error: any) {
    console.log(error)
    logger.error('ERR: trip - create = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const allTrips = async (req: Request, res: Response): Promise<Response<paginationController>> => {
  try {
    const { skip, limit, keyword } = req.query
    const allData = await allTouristData(Number(skip), Number(limit), String(keyword))

    const totalPages = limit ? Math.ceil(allData.length / Number(limit)) : 1
    const currentPage = skip !== undefined && limit ? Math.floor(Number(skip) / Number(limit)) + 1 : 1

    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'success',
      data: allData,
      skip: skip,
      limit: limit,
      totalData: allData.length,
      totalPages: totalPages,
      currentPage: currentPage
    })
  } catch (error: any) {
    logger.error('ERR: trip - get = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params
    const { error, value } = updateTripValidation(req.body)
    if (error) {
      logger.error('ERR: trip - update - validation = ', error.details[0].message)
      return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
    }

    const update = await editTripsTourist(Number(tripId), value)
    return res.status(200).send({ status: true, statusCode: 200, message: 'success', data: update })
  } catch (error: any) {
    console.log(error)
    logger.error('ERR: trip - update = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const deleteTripData = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params
    await deleteTrip(Number(tripId))
    return res.status(200).send({ status: true, statusCode: 200, message: 'success', data: null })
  } catch (error: any) {
    console.log(error)
    logger.error('ERR: trip - delete = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const historyTripTourist = async (req: Request, res: Response): Promise<Response<paginationController>> => {
  try {
    const { skip, limit } = req.query
    console.log(req.locals.id)
    const allData = await historyTrip(Number(req.locals.id), Number(skip), Number(limit))

    const totalPages = limit ? Math.ceil(allData.length / Number(limit)) : 1
    const currentPage = skip !== undefined && limit ? Math.floor(Number(skip) / Number(limit)) + 1 : 1

    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'success',
      data: allData,
      skip: skip,
      limit: limit,
      totalData: allData.length,
      totalPages: totalPages,
      currentPage: currentPage
    })
  } catch (error: any) {
    console.log(error)
    logger.error('ERR: tourist trips - get = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}
