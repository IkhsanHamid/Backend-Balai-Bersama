import { userType } from 'src/types/user.type'
import { logger } from '../config/logger'
import prisma from '../config/prisma'
import utils from '../utils/utils'

export const createUserPegawai = async (payload: userType) => {
  try {
    const user = await prisma.user.create({
      data: payload
    })
    return Promise.resolve({
      msg: 'success',
      data: user
    })
  } catch (error) {
    logger.error('Cannot create user')
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const getUserInfo = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    return Promise.resolve({
      msg: 'success',
      data: user
    })
  } catch (error) {
    logger.error('Cannot create user')
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}
