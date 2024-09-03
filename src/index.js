import dotenv from "dotenv";
import { app } from "./app.js";
import { dbConnection } from "./db/index.js";

dotenv.config();
dbConnection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`sever is running`);
    })
}).catch((error) => {
    console.log(error);
})