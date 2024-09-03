import dotenv from "dotenv";
import { app } from "./src/app.js";
import { dbConnection } from "./src/db/index.js";

dotenv.config();
dbConnection().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`sever is running`);
    })
}).catch((error) => {
    console.log(error);
})