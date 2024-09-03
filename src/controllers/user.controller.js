import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Post } from "../models/post.model.js";
import { json } from "express";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { refreshToken, accessToken }
}
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    console.log(username);
    console.log(email);
    console.log(password);
    if ([username, email, password].some((field) => field?.trim() === '')) {
        throw new ApiError(401, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { password }]
    })
    console.log(existedUser);
    if (existedUser) {
        throw new ApiError(401, "User already exist with email or username")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user?._id).select("-password -refreshToken")
    return res
        .status(200)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body
    if (!username && !email) {
        throw new ApiError(401, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (!existedUser) {
        throw new ApiError(401, "user does't exist with username or email")
    }
    const loggedUser = await User.findById(existedUser?._id).select("-password -refreshToken")
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(loggedUser?._id)


    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, option)
        .cookie("accessToken", accessToken, option)
        .json(
            new ApiResponse(200, { loggedUser, accessToken, refreshToken }, "user login successfully")
        )
})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: undefined // this remove the field from the document
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User logged out"))
})
const myAllPosts = asyncHandler(async (req, res) => {
    const _id = req.user?._id
    const post = await User.aggregate([

        { $match: { _id: req?.user?._id } },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "userId",
                as: "result"
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                allPost: 1,
                result: 1
            }
        }


    ])
    console.log(post[0]);
    await User.findByIdAndUpdate(
        {
            _id: req.user._id
        },
        {
            $set: {
                allPost: post[0].result
            }
        },
        {
            new: true

        }
    )
console.log(post[0].username);

    return res
        .status(200)
        .json(new ApiResponse(200, post[0], "all posts fetched successfully"))
})


export { registerUser, loginUser, logoutUser, myAllPosts }