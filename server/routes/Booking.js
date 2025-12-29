import express from 'express'
import { checkAvailabilityAPI, createBooking, getHotelBooking, getUserBooking } from '../controller/BookingControllerr.js'
import {protect} from '../middleware/AuthMiddleware.js'



const bookingRoute=express.Router()

bookingRoute.post('/check-availability',checkAvailabilityAPI)
bookingRoute.post('/book',protect,createBooking)
bookingRoute.get('/user',protect,getUserBooking)
bookingRoute.get('/hotel',protect,getHotelBooking)

export default bookingRoute

