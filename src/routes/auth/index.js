import express from 'express'
import asyncHandler from '~/helpers/asyncHandler'
import { signIn, signUp } from '~/controllers/authController'
import { middlewarePassportLocal } from '~/middlewares/passportMiddleware'
import { validationAuth, validationUser } from '~/middlewares/validationMiddleware'

const router = express.Router()

router.post('/signup', validationUser, asyncHandler(signUp))
router.post('/signin', validationAuth, middlewarePassportLocal, asyncHandler(signIn))

export default router
