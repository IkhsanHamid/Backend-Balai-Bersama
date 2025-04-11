import { Router } from 'express'
import {
  allTrips,
  createTripTourist,
  deleteTripData,
  historyTripTourist,
  updateTrip
} from '../controllers/trip.controller'
import { requireUser, requireUserPegawai } from '../middleware/auth'

export const tripRouter: Router = Router()

tripRouter.get('/allTripsData', requireUserPegawai, allTrips)
tripRouter.post('/createTrip', requireUserPegawai, createTripTourist)
tripRouter.delete('/deleteTrip/:tripId', requireUserPegawai, deleteTripData)
tripRouter.put('/updateTrips/:tripId', requireUserPegawai, updateTrip)
tripRouter.get('/historyTripsTourist', requireUser, historyTripTourist)
