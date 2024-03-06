import express from 'express'
import { userProfile } from '~/controllers/userController'
import asyncHandler from '~/helpers/asyncHandler'
import { verifyJwtTokenCookie } from '~/middlewares/authMiddleware'

const route = express.Router()

/**
 * [GET] /users/profile
 * route -> verifyJwtTokenCookie -> controller: response json
 */
route.get('/profile', verifyJwtTokenCookie, asyncHandler(userProfile))

export default route
