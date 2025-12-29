import express from "express"
import Booking from "../models/Booking.js"
import Room from "../models/Rooms.js"
import Hotel from "../models/Hotel.js"



//function to check availability of Rooms
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const booking = await Booking.find({
            room,
            checkInDate: { $lte: new Date(checkOutDate) },
            checkOutDate: { $gte: new Date(checkInDate) },
        })
        const isAvailable = booking.length === 0
        return isAvailable
    } catch (error) {
        console.error(error.message)
    }
}


//api to check availability of room
//post /api/booking/check-availability

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        res.json({ success: true, isAvailable })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}



//API to create a new booking
//POST/api/bookings/book

export const createBooking = async (req, res) => {
    try {

        const { rid, checkInDate, checkOutDate, guests } = req.body
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const user = req.user.id
        const room = rid
        //before booking check availability
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        if (!isAvailable) {
            return res.json({ success: false, message: "room is no available" })
        }
        // return res.json({room,checkInDate})
        //get totalPrice from room
        const roomData = await Room.findById(room).populate('hotel')
        let totalPrice = roomData.PricePerNight


        //calculating totalPrice based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

        totalPrice *= nights


        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        res.json({ success: true, message: "Booking created successfully" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed to create booking" })
    }
}

//api to get all booking for a user
//Get /api/booking/user

export const getUserBooking = async (req, res) => {
    try {
        const user = req.user._id
        const booking = await Booking.find({ user }).populate('room hotel').sort({ createdAt: -1 })
        res.json({ success: true, booking })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch booking" })

    }
}

export const getHotelBooking = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId })
        if (!hotel) {
            res.json({ success: false, message: "No Hotel found" })
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate('room hotel user').sort({ createdAt: -1 })
        //Total Booking
        const totalBookings = bookings.length
        //Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })

    } catch (error) {
        res.json({ success: false, message: "failed to fetch booking" })

    }
}