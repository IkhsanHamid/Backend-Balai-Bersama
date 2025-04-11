import { logger } from '../config/logger'
import prisma from '../config/prisma'
import { TouristType, TouristTypeUpdate } from '../types/tourist.type'
import utils from '../utils/utils'

export const createTuris = async (payload: TouristType) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role
        }
      })

      const turis = await tx.touristProfile.create({
        data: {
          userid: user.id,
          phonenumber: payload.phonenumber,
          nationality: payload.nationality
        }
      })

      return turis
    })

    return {
      msg: 'success',
      data: result
    }
  } catch (error) {
    logger.error('Cannot create user', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const allTouristData = async (skip: number, limit: number, keyword?: string) => {
  try {
    const getAllData = await prisma.user.findMany({
      where: {
        role: 'turis',
        ...(keyword && {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } }
          ]
        }),
        is_deleted: false
      },
      include: {
        TouristProfile: true
      },
      skip,
      take: limit
    })

    return getAllData
  } catch (error) {
    logger.error('Cannot get user tourist', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const editTouristData = async (userid: number, payload: TouristTypeUpdate) => {
  try {
    const update = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userid
        },
        data: {
          name: payload.name,
          email: payload.email
        }
      })

      const tourist = await tx.touristProfile.findFirst({
        where: {
          userid
        }
      })
      await tx.touristProfile.update({
        where: {
          id: tourist?.id
        },
        data: {
          phonenumber: payload.phonenumber,
          nationality: payload.nationality
        }
      })

      return tourist
    })

    return update
  } catch (error) {
    logger.error('Cannot edit tourist data', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const deleteTouristData = async (userid: number) => {
  try {
    const delData = await prisma.$transaction(async (tx) => {
      const tourist = await tx.touristProfile.findFirst({
        where: {
          userid
        }
      })
      await tx.touristProfile.update({
        where: {
          id: tourist?.id
        },
        data: {
          is_deleted: true
        }
      })

      await tx.user.update({
        where: {
          id: userid
        },
        data: {
          is_deleted: true
        }
      })

      return
    })

    return 'success'
  } catch (error) {
    logger.error('Cannot delete tourist data', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}
