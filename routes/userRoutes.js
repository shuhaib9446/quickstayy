import express from 'express'
import { getUserData, recentSearchedCities } from '../controller/UserController.js'
import { requireAuth } from '@clerk/express'

const userRouter = express.Router()

userRouter.get('/', requireAuth(), getUserData)
userRouter.post('/store-recent-search', requireAuth(), recentSearchedCities)

export default userRouter