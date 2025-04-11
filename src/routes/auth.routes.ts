import { Router } from 'express'
import { createSession, destroySession, refreshSession, registerUser } from '../controllers/auth.controller'
import { requireUser } from '../middleware/auth'

export const authRouter: Router = Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', createSession)
authRouter.put('/refreshToken', refreshSession)
authRouter.put('/logout', requireUser, destroySession)
