import express from 'express'
import authRoute from './auth'
import usersRoute from './users'
import { middlewarePassportJwt } from '~/middlewares/authMiddleware'
import asyncHandler from '~/helpers/asyncHandler'
import { NotFoundException } from '~/core/ErrorResponse'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', usersRoute)

router.get(
  '/test',
  middlewarePassportJwt,
  asyncHandler(async (req, res, next) => {
    res.json({
      cookies: req.cookies,
    })
  }),
)

router.use((req, res, next) => {
  return next(new NotFoundException({ message: `URL Not Found: ${req.url} ` }))
})

export default router
