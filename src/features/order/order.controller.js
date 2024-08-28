import OrderRepository from "./order.repository.js";

export default class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async placeOrder(req, res) {
    try {
      const userId = req.userId;
      await this.orderRepository.placeOrder(userId);
      return res.status(201).send("Order has been created.");
    } catch (err) {
      console.error(err);
      return res.status(400).send("Something went wrong while creating order"); 
    }
  }
}
