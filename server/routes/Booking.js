import express from 'express'
import { checkAvailabilityAPI, createBooking, getHotelBooking, getUserBooking } from '../controller/BookingControllerr.js'
import { requireAuth } from '@clerk/express'



const bookingRoute=express.Router()

bookingRoute.post('/check-availability',checkAvailabilityAPI)
bookingRoute.post('/book',requireAuth(),createBooking)
bookingRoute.get('/user',requireAuth(),getUserBooking)
bookingRoute.get('/hotel',requireAuth(),getHotelBooking)

export default bookingRoute

