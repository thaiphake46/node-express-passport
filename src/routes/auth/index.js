import express from 'express'
import asyncHandler from '~/helpers/asyncHandler'
import {
  logOut,
  signIn,
  signInGoogle,
  signInGoogleCallback,
  signInPage,
  signUp,
} from '~/controllers/authController'
import {
  middlewarePassportGoogle,
  middlewarePassportGoogleCallback,
  middlewarePassportLocal,
} from '~/middlewares/authMiddleware'
import { validationReqBody } from '~/middlewares/validationMiddleware'
import { signInValid, signUpValid } from '~/schemas/Joi'

const router = express.Router()

/**
 * [GET] /auth/signin-google -> redirect to /auth/google
 * [GET] /auth/google
 */
router.get('/signin-google', asyncHandler(signInGoogle))
router.get('/google', middlewarePassportGoogle)

/**
 * [GET] /auth/google/callback
 */
router.get('/google/callback', middlewarePassportGoogleCallback, asyncHandler(signInGoogleCallback))

/**
 * [GET] /auth/signin
 * -> return view sign in
 */
router.get('/signin', signInPage)

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

/**
 * [POST] /auth/logout
 */
router.post('/logout', asyncHandler(logOut))

export default router
