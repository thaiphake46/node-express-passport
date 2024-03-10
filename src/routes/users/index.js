import express from 'express'
import { userProfile } from '~/controllers/userController'
import asyncHandler from '~/helpers/asyncHandler'
import { verifyJwtTokenCookie } from '~/middlewares/authMiddleware'

const router = express.Router()

/**
 * [GET] /users/profile
 * router -> verifyJwtTokenCookie -> controller: response json
 */
router.get('/profile', verifyJwtTokenCookie, asyncHandler(userProfile))

export default router
