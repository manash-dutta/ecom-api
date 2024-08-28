import { ObjectId } from "mongodb";
import { getClient, getDb } from "../../cofig/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/application.errors.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {

      const db = getDb();
      session.startTransaction();

      // 1. Get the cart items of user and calculate the total.
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );

      // 2. Create a record for the order.
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      // 3. Reduce the product quantity for the product ordered.
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      // throw new Error("Something went wrong");

      // 4. Clear the cart.
      await db
        .collection("cart")
        .deleteMany({ userId: new ObjectId(userId) }, { session });

      await session.commitTransaction(); // Commit the transaction
      session.endSession(); // End the session
    } catch (err) {
      await session.abortTransaction(); // Abort the transaction in case of error
      session.endSession(); // End the session
      console.error(err);
    }
  }

  async getTotalAmount(userId, session) {
    try {
      const db = getDb();
      const items = await db
        .collection("cart")
        .aggregate(
          [
            // Get cart item for the user
            {
              $match: { userId: new ObjectId(userId) },
            },
            // Get product from products collection based on the productId
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productInfo",
              },
            },
            // Unwind the product Info
            {
              $unwind: "$productInfo",
            },
            // Calculate totalAmount for each cart item
            {
              $addFields: {
                totalAmount: {
                  $multiply: ["$productInfo.price", "$quantity"],
                },
              },
            },
          ],
          { session }
        )
        .toArray();
      return items;
    } catch (err) {
      console.error(err);
      throw new ApplicationError("Error calculating total amount", 500);
    }
  }
}
