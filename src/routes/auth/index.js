import express from 'express'
import asyncHandler from '~/helpers/asyncHandler'
import { signIn, signInGoogle, signInGoogleCallback, signUp } from '~/controllers/authController'
import {
  middlewarePassportGoogle,
  middlewarePassportGoogleCallback,
  middlewarePassportLocal,
} from '~/middlewares/passportMiddleware'
import { validationReqBody } from '~/middlewares/validationMiddleware'
import { signInValid, signUpValid } from '~/schemas/Joi'

const router = express.Router()

/**
 * [GET] /auth/login-google -> redirect to /auth/google
 * [GET] /auth/google
 */
router.get('/signin-google', asyncHandler(signInGoogle))
router.get('/google', middlewarePassportGoogle)

/**
 * [GET] /auth/google/callback
 */
router.get('/google/callback', middlewarePassportGoogleCallback, asyncHandler(signInGoogleCallback))

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
