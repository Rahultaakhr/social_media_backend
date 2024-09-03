import { application } from "express";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
    const { postCaption } = req.body
    if (!postCaption) {
        throw new ApiError(401, "caption is required")
    }
    console.log(" api", process.env.API_SECRETE);
    const postImg = req.file?.path
    console.log("post local path", postImg);

    if (!postImg) {
        throw new ApiError(401, "Post is required")
    }
    console.log(postImg);
    const uploadedPost = await uploadCloudinary(postImg)
    console.log(uploadedPost);

    if (!uploadedPost) {
        throw new ApiError(401, "Post is required")
    }
    const createdPost = await Post.create({
        postCaption,
        postImg: uploadedPost.url,
        userId: req.user?._id
    })
    return res
        .status(200)
        .json(
            new ApiResponse(200, createdPost, "Post uploaded successfully")
        )
})
const deletePost = asyncHandler(async (req, res) => {
    const { _id } = req.body
    // const post = await Post.findById(_id)
    if (!_id) {
        throw new ApiError(401, "Post not found")
    }
    await Post.findByIdAndDelete(_id)


    return res
        .status(200)
        .json(
            new ApiResponse(200, "post delete successfully")
        )
})
const getallPosts = asyncHandler(async (req, res) => {
    const _id = req.user?._id

    const allPosts = await Post.find({
        userId: _id
    })
    return res
        .status(200)
        .json(new ApiResponse(200, allPosts, "all posts fetched successfully"))
})
export { createPost, deletePost, getallPosts }