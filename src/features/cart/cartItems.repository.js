import { ObjectId, ReturnDocument } from "mongodb";
import { getDb } from "../../cofig/mongodb.js";
import { ApplicationError } from "../../error-handler/application.errors.js";

export default class CartRepository {
  constructor() {
    this.collection = "cart";
  }

  async add(productId, userId, quantity) {
    try {
      productId = new ObjectId(productId);
      userId = new ObjectId(userId);
      const db = getDb();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      await collection.updateOne(
        { productId, userId }, //filters
        { $setOnInsert: { _id: id }, $inc: { quantity: quantity } }, //data if we want to update
        { upsert: true } //option telling to update value
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "Unable to add products to the cart in the database",
        500
      );
    }
  }

  async get(userId) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      return await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "Unable to get product from the cart in the database",
        500
      );
    }
  }

  async delete(cartItemId, userId) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemId),
        userId: new ObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "Unable to delete product from the cart in the database",
        500
      );
    }
  }

  async getNextCounter(db) {
    try {
      const resultDocument = await db
        .collection("counters")
        .findOneAndUpdate(
          { _id: "cartItemId" },
          { $inc: { value: 1 } },
          { returnDocument: "after" }
        );
      return resultDocument.value;
    } catch (err) {
      console.log(err);
    }
  }
}
