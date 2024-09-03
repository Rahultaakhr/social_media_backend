import mongoose from "mongoose"
import { db_name } from "../../constant.js"

const dbConnection = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        console.log("MONGODB CONNECT SUCCESSFULLY", connectionInstance.connection.host);

    } catch (error) {
        console.log("MONGOGB CONNECTION FAILED", error.message);
        process.exit(1)
    }
}
export { dbConnection }