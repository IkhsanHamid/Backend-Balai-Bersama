import { Router } from 'express'
import { allTourist, deleteTourist, updateTouristData } from '../controllers/tourist.controller'
import { requireUserPegawai } from '../middleware/auth'

export const touristRouter: Router = Router()

touristRouter.get('/allTouristData', requireUserPegawai, allTourist)
touristRouter.put('/editTourist/:touristId', requireUserPegawai, updateTouristData)
touristRouter.delete('/deleteTourist/:touristId', requireUserPegawai, deleteTourist)
