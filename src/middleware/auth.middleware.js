import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
      
        const authHeader = req.header("Authorization");
   
       
        
        const token = await req.cookies?.accessToken || (authHeader ? authHeader.replace("Bearer ", "") : "");
      
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
      
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalide access token")
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error.name);
             
        throw new ApiError(401, error.message || "Invalide access token")
    }
})
export { verifyJWT }