import mongoose, { Schema } from "mongoose";
const postSchema = new Schema({
    postImg: {
        type: String,
        required: true
    },
    postCaption: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema)