import { logger } from '../config/logger'
import { TripType, TripTypeUpdate } from '../types/trip.type'
import utils from '../utils/utils'
import prisma from '../config/prisma'

export const addTrip = async (payload: TripType) => {
  try {
    const result = await prisma.trip.create({
      data: {
        startdate: payload.startDate,
        enddate: payload.endDate,
        destination: payload.destination,
        touristid: payload.touristId
      }
    })

    return result
  } catch (error) {
    logger.error('Cannot create trip', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const allTripsTourist = async (skip: number, limit: number, keyword?: string) => {
  try {
    const getAllData = await prisma.trip.findMany({
      where: {
        is_deleted: false,
        TouristProfile: {
          User: {
            ...(keyword && {
              OR: [
                { name: { contains: keyword, mode: 'insensitive' } },
                { email: { contains: keyword, mode: 'insensitive' } }
              ]
            })
          }
        }
      },
      include: {
        TouristProfile: {
          include: {
            User: true
          }
        }
      },
      skip,
      take: limit
    })

    return getAllData
  } catch (error) {
    logger.error('Cannot get trips tourist', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const editTripsTourist = async (tripId: number, payload: TripTypeUpdate) => {
  try {
    const update = await prisma.trip.update({
      where: {
        id: tripId
      },
      data: {
        startdate: payload.startDate,
        enddate: payload.endDate,
        destination: payload.destination
      }
    })

    return update
  } catch (error) {
    logger.error('Cannot update trips tourist', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const deleteTrip = async (tripId: number) => {
  try {
    await prisma.trip.update({
      where: {
        id: tripId
      },
      data: {
        is_deleted: true
      }
    })
  } catch (error) {
    logger.error('Cannot delete trip data', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}

export const historyTrip = async (userid: number, skip: number, limit: number) => {
  try {
    console.log(userid)
    const tourist = await prisma.touristProfile.findFirst({
      where: {
        userid
      }
    })
    console.log(tourist)

    const trips = await prisma.trip.findMany({
      where: {
        touristid: tourist?.id
      },
      skip,
      take: limit
    })

    return trips
  } catch (error) {
    logger.error('Cannot get trip data history', error)
    const formattedError = utils.formatUnexpectedError(error)
    throw formattedError
  }
}
