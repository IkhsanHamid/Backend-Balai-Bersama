import { logger } from '../config/logger'
import { type AuthType, type SessionType } from '../types/auth.type'
import prisma from '../config/prisma'
import utils from '../utils/utils'

export const findUserbyEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    return Promise.resolve({
      msg: 'success',
      data: user
    })
  } catch (error) {
    logger.error('Cannot find user')
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const createAuth = async (payload: AuthType) => {
  try {
    const findAuth = await prisma.authentication.findFirst({
      where: {
        userid: payload.user_id
      }
    })

    if (findAuth) {
      throw new Error('Double Login!')
    }

    await prisma.authentication.create({
      data: {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token ? payload.refresh_token : '',
        userid: payload.user_id
      }
    })

    return Promise.resolve({
      msg: 'success',
      data: { ...payload }
    })
  } catch (error) {
    logger.error('Cannot create auth', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const destroyAuth = async (token: string) => {
  try {
    const auth = await prisma.authentication.findFirst({
      where: { access_token: token }
    })

    if (!auth) {
      throw new Error('Authentication token not found')
    }

    const userId = auth.userid
    console.log(userId)

    await prisma.$queryRawUnsafe(
      `
      DELETE FROM "Authentication" WHERE "userid" = $1
    `,
      userId
    )

    return Promise.resolve({
      msg: 'success'
    })
  } catch (error) {
    logger.error('Cannot destroy auth', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const findAccessToken = async (userId: any) => {
  try {
    const findAuth = await prisma.authentication.findFirst({
      where: {
        userid: userId
      }
    })
    return Promise.resolve(findAuth)
  } catch (error) {
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const updateAccessToken = async (token: SessionType) => {
  try {
    const updatedAuth = await prisma.$transaction(async (transaction) => {
      const user = await transaction.authentication.findFirst({
        where: {
          userid: token.user_id
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const auth = await transaction.authentication.update({
        where: {
          id: user.id
        },
        data: {
          access_token: token.accessToken
        }
      })

      return auth
    })

    return Promise.resolve({
      msg: 'success',
      data: updatedAuth
    })
  } catch (error) {
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}
