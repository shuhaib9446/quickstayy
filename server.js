import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import connectDB from './confiq/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controller/clerkWebHooks.js'
import userRouter from './routes/userRoutes.js'
import HotelRouter from './routes/HotelRoutes.js'
import connectCloudinary from './confiq/Cloudinary.js'
import RoomRouter from './routes/RoomRoutes.js'
import bookingRoute from './routes/Booking.js'
import helmet from "helmet";


connectDB()
connectCloudinary()
const app = express()



// middleware
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "https://apis.google.com", "https://cdn.jsdelivr.net"],
//             styleSrc: ["'self'", "'unsafe-inline'"],
//             imgSrc: ["'self'", "data:", "https:"],
//         },
//     })
// );

app.use(express.json())
app.use(clerkMiddleware())
app.use(cors())

// api to listen to clerkWebhooks
app.use('/api/clerk', clerkWebhooks)

app.get('/', (req, res) => res.send("API is working"))
app.use('/api/user/', userRouter)
app.use('/api/hotels/', HotelRouter)
app.use('/api/rooms/', RoomRouter)
app.use('/api/bookings/', bookingRoute)



const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server is running ${PORT}`));





export default app;


