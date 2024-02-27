import express from 'express'
import asyncHandler from '~/helpers/asyncHandler'
import { signIn, signUp } from '~/controllers/authController'
import {
  middlewarePassportGoogle,
  middlewarePassportGoogleCallback,
  middlewarePassportLocal,
} from '~/middlewares/passportMiddleware'
import { validationReqBody } from '~/middlewares/validationMiddleware'
import { signInValid, signUpValid } from '~/Joi'

const router = express.Router()

/**
 * [GET] /auth/google/login
 */
router.get('/google/login', middlewarePassportGoogle)

/**
 * [GET] /auth/google/callback
 */
router.get('/google/callback', middlewarePassportGoogleCallback)

/**
 * [POST] /auth/signup
 */
router.post('/signup', validationReqBody(signUpValid), asyncHandler(signUp))

/**
 * [POST] /auth/signin
 */
router.post(
  '/signin',
  validationReqBody(signInValid),
  middlewarePassportLocal,
  asyncHandler(signIn),
)

export default router
