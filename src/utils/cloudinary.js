import fs from "fs"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRETE
})

const uploadCloudinary = async (localFilePath) => {
    if (!localFilePath) return null

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log(" file is uploaded on cloudinary successfully ", response);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("file is not uploaded on cloudinary", error);

        fs.unlinkSync(localFilePath)
        return null
    }

}
export { uploadCloudinary }