import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './confiq/db.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import clerkWebhooks from './controller/clerkWebHooks.js';
import userRouter from './routes/userRoutes.js';
import HotelRouter from './routes/HotelRoutes.js';
import connectCloudinary from './confiq/Cloudinary.js';
import RoomRouter from './routes/RoomRoutes.js';
import bookingRoute from './routes/Booking.js';

dotenv.config();
connectDB();
connectCloudinary();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Clerk webhook (POST is typical)
app.post('/api/clerk', clerkWebhooks);

app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', requireAuth(), userRouter);
app.use('/api/hotels', HotelRouter);
app.use('/api/rooms', RoomRouter);
app.use('/api/bookings', bookingRoute);

// ❌ REMOVE app.listen()
// ✅ Export handler for Vercel
export default app;
