import mongoose from "mongoose";

const BookingSchema=new mongoose.Schema({
     user:{
        type:String,
        ref:"user",
        required:true
     },
     room:{
        type:String,
        ref:"Room",
        required:true
     },
     hotel:{
        type:String,
        ref:"Hotel",
        required:true
     },
    checkingDate:{
        type:Date,
        required:true
     },
     checkingOut:{
        type:Date,
        required:true
     },

     totalPrice:{
        type:Number,
        required:true
     },
     guests:{
        type:Number,
        required:true
     },
     status:{
        type:String,
        enum:["Pending","Confirmed","Cancelled"],
        default:"Pending",
     },
     paymentMethod:{
          type:String,
        required:true,
         default:"Pay At Hotel",
     },
     isPaid:{type:Boolean,default:false}
},{timestamps:true})

const Booking=new mongoose.model('Booking',BookingSchema)

export default Booking