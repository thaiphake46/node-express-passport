import express from 'express'
import { ReasonPhrases } from 'http-status-codes'
import authRoute from './auth'
import { middlewarePassportJwt } from '~/middlewares/passportMiddleware'
import asyncHandler from '~/helpers/asyncHandler'
import { NotFoundException } from '~/core/ErrorResponse'

const router = express.Router()

router.use('/auth', authRoute)

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
  const err = new NotFoundException(`URL ${ReasonPhrases.NOT_FOUND}`)
  return next(err)
})

export default router
