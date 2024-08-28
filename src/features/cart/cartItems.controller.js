import CartModel from "./cartItems.model.js";
import CartRepository from "./cartItems.repository.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }
  async postAddItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;
      await this.cartRepository.add(productId, userId, quantity);
      res.status(201).send("Cart is updated");
    } catch (err) {
      console.error(err);
      res.status(400).send("Unable to add items to cart");
    }
  }

  async getCartItems(req, res) {
    try {
      const userId = req.userId;
      const items = await this.cartRepository.get(userId);
      return res.status(200).send(items);
    } catch (err) {
      console.error(err);
      res.status(400).send("Unable to get items from the cart");
    }
  }

  async deleteCartItem(req, res) {
    try {
      const userId = req.userId;
      const cartItemId = req.params.id;
      const isDeleted = await this.cartRepository.delete(cartItemId, userId);
      if (!isDeleted) {
        return res.status(404).send("Item not found");
      } else {
        return res.status(200).send("Cart Item deleted ");
      }
    } catch (err) {
      console.error(err);
      res.status(400).send("Unable to get items from the cart");
    }
  }
}
