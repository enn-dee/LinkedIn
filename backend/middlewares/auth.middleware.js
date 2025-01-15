import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
export const protectedRoute = async(req , res, next)=>{
    try{
const token = req.cookies["jwt-linkedin"]
if(!token){
    return res.status(401).json({message:"Unauthorized - No Token Provided"})
    
}
const decoded =  jwt.verify(token, process.env.JWT_SECRECT)
if(!decoded){
return res.status(401).json({message:"Unauthorized - Invalid Token"})
}
const user = await User.findOne(decoded.userId).select("-password")
if(!user){
    return res.status(404).json({message:"User not found"})
}
req.user = user
next();
    }catch(error){
console.log("Error in protect Route mw: ", error)
return res.status(500).json({message:"Internal server error"})
    }
}