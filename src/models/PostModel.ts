import mongoose, { Document, Schema, Model } from "mongoose";


export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    image: string;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}


const PostSchema: Schema<IPost> = new Schema<IPost>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "UserModel2",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Title must be at least 3 characters long."],
            maxlength: [100, "Title cannot exceed 100 characters."],
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: [10, "Content must be at least 10 characters long."],
        },
        image: {
            type: String,
            required: [true, "Image is required for the post."],
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "UserModel2",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
        strict: true,
    }
);

PostSchema.index({ createdAt: -1 });

PostSchema.virtual("likeCount").get(function (this: IPost) {
    return this.likes.length;
});

PostSchema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    },
});

const PostModel: Model<IPost> = mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
