import { ApplicationError } from "../../error-handler/application.errors.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, price, imageUrl, category, sizes, inStock, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.sizes = sizes;
    this.inStock = inStock;

  }


  // static rateProduct(userId, productId, rating) {
  //   // Validate user and product
  //   const user = UserModel.getAll().find(
  //     (user) => user.id === parseInt(userId)
  //   );
  //   if (!user) {
  //     throw new ApplicationError("User not found", 404);
  //   }

  //   const product = products.find(
  //     (product) => product.id === parseInt(productId)
  //   );
  //   if (!product) {
  //     throw new ApplicationError("Product not found", 400);
  //   }

  //   // Check if there are any ratings, if not add ratings array
  //   if (!product.ratings) {
  //     product.ratings = [];
  //   }

  //   // Check if user rating is already available
  //   const existingRatingIndex = product.ratings.findIndex(
  //     (r) => r.userId === parseInt(userId)
  //   );

  //   if (existingRatingIndex >= 0) {
  //     // Update the existing rating
  //     product.ratings[existingRatingIndex].rating = rating;
  //   } else {
  //     // If there is no existing rating, push a new rating to the ratings array
  //     product.ratings.push({ userId: parseInt(userId), rating });
  //   }
  // }
}

let products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "category1"
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    29.99,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "category2",
    ["M", "XL"]
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "category3",
    ["S", "M", "L"]
  ),
];
