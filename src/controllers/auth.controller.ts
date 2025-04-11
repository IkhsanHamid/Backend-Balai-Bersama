/* eslint-disable prefer-const */
import { type Request, type Response } from 'express'
import { createAuth, destroyAuth, findUserbyEmail, updateAccessToken } from '../services/auth.service'
import { createUserValidation, loginValidation, refreshSessionValidation } from '../validations/auth.validation'
import { logger } from '../config/logger'
import { checkPassword, hashing } from '../config/hashing'
import { reIssueAccessToken, signJWT } from '../config/jwt'
import { responseController } from '../types/global.type'
import { createUserPegawai } from '../services/user.service'
import { createTuris } from '../services/tourist.service'

// register
export const registerUser = async (req: Request, res: Response): Promise<Response<responseController>> => {
  // START: validation payload
  const { error, value } = createUserValidation(req.body)
  if (error) {
    logger.error('ERR: auth - register = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  // END: validation payload
  try {
    // hashing password
    value.password = `${hashing(value.password)}`

    // START: check if email and number phone have registered
    const user = await findUserbyEmail(value.email)

    if (user?.data !== null) {
      return res.status(412).send({
        status: false,
        statusCode: 412,
        message: 'Email is Already register, please use the different email'
      })
    }
    // END: check if email and number phone have registered

    // hit function createuser service
    let regist
    if (value.role === 'pegawai') {
      regist = await createUserPegawai(value)
    } else if (value.role === 'turis') {
      regist = await createTuris(value)
    }

    // throw error is failed regist
    if (!regist?.msg && regist?.msg !== 'success') {
      return res.status(412).send({ status: false, statusCode: 412, message: 'Failed Register User, please try again' })
    }

    // return if success
    logger.info('Register successfully, please login')
    return res.status(201).send({ status: true, statusCode: 201, message: 'Success register', data: null })
  } catch (error: any) {
    logger.error('ERR: auth - regist = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

// login
export const createSession = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = loginValidation(req.body)
  if (error) {
    logger.error('ERR: auth - login = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  // END: validation payload
  try {
    // checking user by email
    const user = await findUserbyEmail(value.email)

    // declare variabel
    let password, id, email

    if (user.data) {
      password = user.data?.password
      id = user.data?.id
      email = user.data?.email
    } else {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid credentials' })
    }

    // validation if password or email undefined
    if (!password || !email) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Not found account' })
    }

    // checking password
    const isValidPassword = checkPassword(value.password, password)
    if (!isValidPassword) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid password' })
    }

    // signJWT for access and refresh token
    const accessToken = signJWT({ ...user.data }, { expiresIn: '1d' })
    const refreshToken = signJWT({ ...user.data }, { expiresIn: '1y' })

    if (!accessToken || !refreshToken) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid credential, please try again' })
    }

    // save auth
    await createAuth({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: id
    })

    return res.status(201).send({
      status: true,
      statusCode: 201,
      message: 'login success',
      data: {
        accessToken,
        refreshToken
      }
    })
  } catch (error: any) {
    logger.error('ERR: auth - login = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

// refresh token
export const refreshSession = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = refreshSessionValidation(req.body)
  if (error) {
    logger.error('ERR: auth - refresh session = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  // END: validation payload
  try {
    // refresh token
    const refresh = await reIssueAccessToken(value.refreshToken)
    if (typeof refresh === 'boolean') {
      return res.status(404).send({ status: false, statusCode: 404, message: 'user not found' })
    }

    // update access token in db
    await updateAccessToken(refresh)

    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'refresh session success',
      data: { accessToken: refresh.accessToken }
    })
  } catch (error: any) {
    console.log(error)
    logger.error('ERR: auth - refresh session = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

// logout
export const destroySession = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '') as string
    // destroy
    await destroyAuth(accessToken)
    return res.status(200).send({ status: true, statusCode: 200, message: 'logout success' })
  } catch (error: any) {
    logger.error('ERR: auth - auth session = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
