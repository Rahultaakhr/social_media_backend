import { Router } from "express";
import { loginUser, logoutUser, myAllPosts, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/allposts").get(verifyJWT, myAllPosts)
// router.route("/getallposts").get(verifyJWT, getMyAllPosts)
export { router }