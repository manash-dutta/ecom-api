import express from "express";
import CartController from "./cartItems.controller.js";

// Initialize express router
const cartRouter = express.Router();

// Create instance of CartController
const cartController = new CartController();

// GET Routes
cartRouter.get("/", (req, res) => {
  cartController.getCartItems(req, res);
});

// POST Routes
cartRouter.post("/", (req, res) => {
  cartController.postAddItem(req, res);
});

// PUT Routes

// DELETE Routes
cartRouter.delete("/:id", (req, res) => {
  cartController.deleteCartItem(req, res);
});

export default cartRouter;
