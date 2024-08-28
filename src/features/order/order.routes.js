import express from "express";
import OrderController from "./order.controller.js";

// Initialize Express Router
const orderRouter = express.Router();

// Create an instance of OrderController
const orderController = new OrderController();

// Routes
orderRouter.post("/", (req, res) => {
  orderController.placeOrder(req, res);
});

export default orderRouter;
