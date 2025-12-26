import user from "../models/User.js";

 
export const protect=async(req,res,next)=>{
        const {userId}=req.auth
        if(!userId){
            res.json({success:false,message:"not Authenticated"})
        }else{
            const users=await user.findById(userId)
            req.user=users
            next()
        }
}

export default protect