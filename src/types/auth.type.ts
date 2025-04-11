export type AuthType = {
  access_token: string
  refresh_token?: string
  user_id: number
}

export type SessionType = {
  accessToken: string
  name: string
  user_id: number
}
