import { user_role } from '@prisma/client'

export type TouristType = {
  name: string
  email: string
  password: string
  phonenumber: string
  nationality: string
  role: user_role
}

export type TouristTypeUpdate = {
  name: string
  email: string
  phonenumber: string
  nationality: string
}
