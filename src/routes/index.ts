/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Application, type Router } from 'express'
import { authRouter } from './auth.routes'
import { userRouter } from './user.routes'
import { touristRouter } from './tourist.routes'
import { tripRouter } from './trip.routes'

const _routes: Array<[string, Router]> = [
  ['/api/v1/auth', authRouter],
  ['/api/v1/user', userRouter],
  ['/api/v1/tourist', touristRouter],
  ['/api/v1/trips', tripRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
