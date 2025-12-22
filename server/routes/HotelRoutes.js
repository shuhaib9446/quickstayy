import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { registerHotel } from '../controller/HotelController.js'
import { requireAuth} from '@clerk/express'

const HotelRouter=express.Router()

HotelRouter.post('/',requireAuth(),registerHotel)

export default HotelRouter