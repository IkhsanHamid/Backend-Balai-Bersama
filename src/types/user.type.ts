import { user_role } from '@prisma/client'

export type userType = {
  name: string
  email: string
  password: string
  role: user_role
}

export type userUpdate = {
  email?: string
  name?: string
  username?: string
  password?: string
  role_id?: number
}
