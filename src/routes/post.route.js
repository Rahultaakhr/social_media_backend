import { Router } from "express";
import { createPost, deletePost, getallPosts } from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()
router.route("/createpost").post(verifyJWT, upload.single("post"), createPost)
router.route("/deletepost").post(verifyJWT, deletePost)
router.route("/getallposts").get(verifyJWT, getallPosts)
export { router }