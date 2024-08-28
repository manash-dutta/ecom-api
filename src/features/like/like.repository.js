import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ApplicationError } from "../../error-handler/application.errors.js";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model("Like", likeSchema);

export default class LikeRepository {
  async getLikes(type, id) {
    return await LikeModel.find({
      likeable: new ObjectId(id),
      type: type,
    })
      
  }

  async likeProduct(userId, productId) {
    try {
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(productId),
        type: "Product",
      });
      await newLike.save();
    } catch (err) {
      console.error(err);
      throw new ApplicationError("Unable to add product to the Database", 500);
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      const newLike = new LikeModel({
        user: userId,
        likeable: categoryId,
        type: "Category",
      });
      await newLike.save();
    } catch (err) {
      console.error(err);
      throw new ApplicationError("Unable to add product to the Database", 500);
    }
  }
}
