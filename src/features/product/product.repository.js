import { ObjectId } from "mongodb";
import { getDb } from "../../cofig/mongodb.js";
import { ApplicationError } from "../../error-handler/application.errors.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

export default class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(productData) {
    console.log(productData);
    try {
      const product = new ProductModel(productData);
      const savedProduct = await product.save();
      
      // Update Categories
      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        { $push: { products: new ObjectId(savedProduct._id) } }
      );
      return savedProduct;
    } catch (err) {
      console.error(err);
      throw new ApplicationError("Unable to add product to the Database", 500);
    }
  }

  async getAll() {
    try {
      return await ProductModel.find();
    } catch (err) {
      console.error(err);
      throw new ApplicationError(
        "Unable to load products from the Database",
        500
      );
    }
  }

  async get(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new ApplicationError("Product not found", 404);
      }
      return product;
    } catch (err) {
      console.error(err);
      throw new ApplicationError(
        "Unable to load product from the database.",
        500
      );
    }
  }

  async filter(minPrice, maxPrice, category) {
    // try {
    //   const db = getDb();
    //   const collection = db.collection(this.collection);
    //   const filteredExpression = {};
    //   if (minPrice) {
    //     filteredExpression.price = { $gte: parseFloat(minPrice) };
    //   }
    //   if (maxPrice) {
    //     filteredExpression.price = {
    //       ...filteredExpression.price,
    //       $lte: parseFloat(maxPrice),
    //     };
    //   }
    //   if (category) {
    //     filteredExpression.category = category;
    //   }
    //   return await collection
    //     .find(filteredExpression)
    //     .project({ name: 1, price: 1, _id: 0, ratings: { $slice: 1 } })
    //     .toArray();
    // } catch (err) {
    //   console.error(err);
    //   throw new ApplicationError(
    //     "unable to filter products from the database",
    //     500
    //   );
    // }
    try {
      const filter = {};
      if (minPrice) {
        filter.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filter.price = {
          ...filter.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filter.category = category;
      }
      return await ProductModel.find(filter).select("name price _id").limit(1);
    } catch (err) {
      console.error(err);
      throw new ApplicationError(
        "Unable to filter products from the database",
        500
      );
    }
  }

  async rate(userId, productId, rating) {
    try {
      // const db = getDb();
      // const collection = db.collection(this.collection);

      // // Remove existing entry if any
      // await collection.updateOne(
      //   { _id: new ObjectId(productId) },
      //   {
      //     $pull: {
      //       ratings: { userId: new ObjectId(userId) },
      //     },
      //   }
      // );

      // // Add new entry
      // await collection.updateOne(
      //   { _id: new ObjectId(productId) },
      //   {
      //     $push: {
      //       ratings: { userId: new ObjectId(userId), rating },
      //     },
      //   }
      // );
      const productToUpdate = await ProductModel.findById(productId);
      // Check if product exists
      if (!productToUpdate) {
        throw new ApplicationError("Product not found", 404);
      }
      // Check if user already has a review
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productId),
        user: new ObjectId(userId),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
          rating: parseFloat(rating),
        });
        await newReview.save();
        productToUpdate.reviews.push(newReview._id);
        await productToUpdate.save();
      }
    } catch (err) {
      console.error(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    // try {
    //   const db = getDb();
    //   const collection = db.collection(this.collection);
    //   return await collection
    //     .aggregate([
    //       {
    //         $group: {
    //           _id: "$category",
    //           averagePrice: { $avg: "$price" },
    //         },
    //       },
    //     ])
    //     .toArray();
    // } catch (err) {
    //   console.error(err);
    //   throw new ApplicationError("Something went wrong with database", 500);
    // }
    try {
      return await ProductModel.aggregate([
        {
          $group: {
            _id: "$category",
            averagePrice: { $avg: "$price" },
          },
        },
      ]);
    } catch (err) {
      console.error(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAverageRatingPerProduct(name) {
    // try {
    //   const db = getDb();
    //   const collection = db.collection(this.collection);
    //   const pipeline = [
    //     {
    //       $unwind: "$ratings",
    //     },
    //     {
    //       $group: {
    //         _id: "$name",
    //         averageRating: { $avg: "$ratings.rating" },
    //         ratingCount: { $sum: 1 },
    //       },
    //     },
    //     {
    //       $sort: { ratingCount: -1 },
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         productName: "$_id",
    //         averageRating: 1,
    //         ratingCount: 1,
    //       },
    //     },
    //   ];

    //   // Add the $match stage only if a name is provided
    //   if (name) {
    //     pipeline.unshift({
    //       $match: { name: name },
    //     });
    //   }

    //   return await collection.aggregate(pipeline).toArray();
    // } catch (err) {
    //   console.error(err);
    //   throw new ApplicationError("Something went wrong with database", 500);
    // }
    try {
      const pipeline = [
        {
          $unwind: "$reviews",
        },
        {
          $group: {
            _id: "$name",
            averageRating: { $avg: "$reviews.rating" },
            ratingCount: { $sum: 1 },
          },
        },
        {
          $sort: { ratingCount: -1 },
        },
        {
          $project: {
            _id: 0,
            productName: "$_id",
            averageRating: 1,
            ratingCount: 1,
          },
        },
      ];

      if (name) {
        pipeline.unshift({
          $match: { name: name },
        });
      }

      return await ProductModel.aggregate(pipeline);
    } catch (err) {
      console.error(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async rate(userId, productId, rating) {
  //   try {
  //     const db = getDb();
  //     const collection = db.collection(this.collection);
  //     // Find the product
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productId),
  //     });
  //     // Find the rating
  //     const userRating = product?.ratings?.find((r) => r.userId == userId);
  //     if (userRating) {
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //           "ratings.userId": new ObjectId(userId),
  //         },
  //         {
  //           $set: { "ratings.$.rating": rating },
  //         }
  //       );
  //       return "Rating has been updated";
  //     } else {
  //       const result = await collection.updateOne(
  //         { _id: new ObjectId(productId) },
  //         {
  //           $push: {
  //             ratings: { userId: new ObjectId(userId), rating },
  //           },
  //         }
  //       );
  //       return "Rating has been added"
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }
}
