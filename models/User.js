import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        _id: {
                type: String, // Clerk IDs are strings
                required: true,
        },
        username: {
                type: String,
                required: false, // not always provided
        },
        email: {
                type: String,
                required: true,
                unique: true, // prevent duplicates
        },
        image: {
                type: String,
                required: false, // Clerk may not always send
        },
        role: {
                type: String,
                enum: ["user", "hotelOwner"],
                default: "user",
        },
        recentSearchedCities: [
                {
                        type: String,
                        required: false, // optional, don’t block creation
                },
        ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;