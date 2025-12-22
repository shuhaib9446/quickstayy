import express from 'express'
 import dotenv from 'dotenv'
 dotenv.config();
import cors from 'cors'
import connectDB from './confiq/db.js'
import { clerkMiddleware ,requireAuth} from '@clerk/express'
import clerkWebhooks from './controller/clerkWebHooks.js'
import userRouter from './routes/userRoutes.js'
import HotelRouter from './routes/HotelRoutes.js'
import connectCloudinary from './confiq/Cloudinary.js'
import RoomRouter from './routes/RoomRoutes.js'
import bookingRoute from './routes/Booking.js'





connectDB()
connectCloudinary()
const app=express()
app.use(cors())


// middleware

app.use(express.json())
app.use(clerkMiddleware())

// api to listen to clerkWebhooks
app.get('api/clerk',clerkWebhooks)

app.get('/',(req,res)=>res.send("API is working"))
app.use('/api/user/',requireAuth(), userRouter)
app.use('/api/hotels/',HotelRouter)
app.use('/api/rooms/',RoomRouter)
app.use('/api/bookings/',bookingRoute)




const PORT=process.env.PORT || 5000     

app.listen(PORT,()=>console.log(`server is running ${PORT}`));




 
export default app;


 