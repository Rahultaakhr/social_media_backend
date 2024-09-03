import express from "express";
import { router as userRoute } from "./routes/user.route.js";
import { router as postRoute } from "./routes/post.route.js";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(cookieParser())
app.use("/api/v1/users", userRoute)
app.use("/api/v1/posts", postRoute)
export { app }