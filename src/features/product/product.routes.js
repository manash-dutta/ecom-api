// Manage Routes/Path to ProductController

import express from "express";
import ProductController from "./product.controller.js";
import upload from "../../middlewares/fileupload.middleware.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// Initialize Express Router
const productRouter = express.Router();

// Create instance of Product controller
const productController = new ProductController();

// All the paths to controller methods
// GET Routes
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});

productRouter.get("/filter", (req, res) => {
  productController.getFilteredProducts(req, res);
});

productRouter.get("/average-price", (req, res, next) => {
  productController.averagePrice(req, res, next);
});

productRouter.get("/average-rating", (req, res) => {
  productController.averageRating(req, res);
});

productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

// POST Routes
productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.postAddProduct(req, res);
});

productRouter.post("/rate", (req, res, next) => {
  productController.rateProduct(req, res, next);
});

export default productRouter;
