import { getUserInfo } from '../services/user.service'
import { logger } from '../config/logger'
import { type Request, type Response } from 'express'

export const getUserController = async (req: Request, res: Response) => {
  try {
    const user = await getUserInfo(req.locals.id)
    return res.status(200).send({ status: true, statusCode: 200, message: 'Success', data: user })
  } catch (error) {
    logger.error('ERR: category - get = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
