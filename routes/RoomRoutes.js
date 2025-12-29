import express from 'express'
import upload from '../middleware/UploadMiddleware.js'
import { AllRooms, createRoom, getOwnerRoom, toggleRoomAvailability } from '../controller/RoomController.js'
import { requireAuth } from '@clerk/express'
 

const RoomRouter=express.Router()
RoomRouter.post('/',upload.array("images",4),requireAuth(),createRoom)
RoomRouter.get('/',AllRooms)
RoomRouter.get('/owner',requireAuth(),getOwnerRoom)
RoomRouter.post('/toggle-availability',requireAuth(),toggleRoomAvailability)



export default RoomRouter