import Hotel from "../models/Hotel.js"
import user from "../models/User.js"

//get/api/hotel/  


export const  registerHotel= async(req,res)=>{
        try {
            const {name,address,contact,city}=req.body
             const owner = req.auth().userId
             // check if user already registered
            const hotel=await Hotel.findOne({owner})
            if(hotel){
                return res.json({success:false,message:"Already registered"})
            } 
            await Hotel.create({name,address,contact,city,owner})
            await user.findByIdAndUpdate(owner,{role:"hotelOwner"})
            res.json({success:true,message:"Hotel Registered Successfully"})

        } catch (error) {
            res.json({success:false,message:error.message})
            
        }
}