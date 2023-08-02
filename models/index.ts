import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { Category } from "@/models/Category";
import { Comment } from "@/models/Comment";
import { Tag } from "@/models/Tag";
import { getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

export const UserModel = mongoose.models.User || getModelForClass(User);
export const PostModel = mongoose.models.Post || getModelForClass(Post);
export const CategoryModel = mongoose.models.Category || getModelForClass(Category);
export const TagModel = mongoose.models.Tag || getModelForClass(Tag);
export const CommentModel = mongoose.models.Comment || getModelForClass(Comment);
