import mongoose from "mongoose";
import { categorySchema } from "../features/product/category.schema.js";

const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
  try {
    // await mongoose.connect(url, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    await mongoose.connect(url);
    console.log("MongoDB using Mongoose is connected.");
    await addCategories();
  } catch (err) {
    console.error(err);
  }
};

const addCategories = async () => {
  try {
    const CategoryModel = mongoose.model("Category", categorySchema);
    
    const categories = await CategoryModel.find();
    
    if (!categories || categories.length === 0) {
      await CategoryModel.insertMany([
        { name: "Books" },
        { name: "Clothing" },
        { name: "Electronics" },
      ]);
      console.log("Categories added.");
    } else {
      console.log("Categories already exist.");
    }
  } catch (err) {
    console.error("Error adding categories:", err);
  }
};
