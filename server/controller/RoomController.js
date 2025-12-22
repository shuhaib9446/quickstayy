import { v2 as cloudinary } from 'cloudinary'
import Hotel from "../models/Hotel.js"
import Room from '../models/Rooms.js'




// backend controller
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body; // match frontend casing
    const hotel = await Hotel.findOne({ owner: req.auth().userId });

    if (!hotel) return res.json({ success: false, message: "No Hotel Found" });

    // upload images to Cloudinary
    const uploadImages = req.files.map(file =>
      cloudinary.uploader.upload(file.path).then(res => res.secure_url)
    );
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      RoomType: roomType,
      PricePerNight: pricePerNight,
      Amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room Created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//api to get AllRooms
export const AllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).populate({
      path: 'hotel',
      populate: {
        path: 'owner',
        select: 'image'
      }
    }).sort({ createdAt: -1 })
    res.json({ success: true, rooms })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
//api to  get all room for a specific hotel
export const getOwnerRoom = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });
    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel")
    res.json({ success: true, rooms })

  } catch (error) {
    res.json({ success: false, message: error.message })

  }

}


//api to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body

    const roomData = await Room.findById(roomId)
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }
    roomData.isAvailable = !roomData.isAvailable
    await roomData.save()
    res.json({
      success: true, message: "Room Availability Updated ", room: roomData
    })
  } catch (error) {
    res.json({ success: false, message: error.message })

  }
} 