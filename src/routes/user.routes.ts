import { Router } from 'express'
import { getUserController } from '../controllers/user.controller'
import { requireUser } from '../middleware/auth'

export const userRouter: Router = Router()

userRouter.get('/findUser', requireUser, getUserController)
