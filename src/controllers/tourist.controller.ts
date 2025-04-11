import { paginationController } from '../types/global.type'
import { type Request, type Response } from 'express'
import { logger } from '../config/logger'
import { allTouristData, deleteTouristData, editTouristData } from '../services/tourist.service'
import { updateTouristValidation } from '../validations/tourist.validation'

export const allTourist = async (req: Request, res: Response): Promise<Response<paginationController>> => {
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
    logger.error('ERR: tourist - get = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const updateTouristData = async (req: Request, res: Response) => {
  try {
    const { touristId } = req.params
    const { error, value } = updateTouristValidation(req.body)
    if (error) {
      logger.error('ERR: tourist - update - validation = ', error.details[0].message)
      return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
    }

    const edit = await editTouristData(Number(touristId), value)
    return res.status(200).send({ status: true, statusCode: 200, message: 'success', data: edit })
  } catch (error: any) {
    console.log(error)
    logger.error('ERR: tourist - update = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const deleteTourist = async (req: Request, res: Response) => {
  try {
    const { touristId } = req.params

    await deleteTouristData(Number(touristId))
    return res.status(200).send({ status: true, statusCode: 200, message: 'success', data: null })
  } catch (error: any) {
    console.log(error)
    logger.error('ERR: tourist - delete = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}
