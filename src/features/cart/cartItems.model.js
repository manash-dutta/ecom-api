export default class CartModel {
  constructor(productId, userId, quantity, id) {
    this.productId = productId;
    this.userId = userId;
    this.quantity = quantity;
    this.id = id;
  }

  static add(productId, userId, quantity) {
    const newItem = new CartModel(productId, userId, quantity, cart.length + 1);
    cart.push(newItem);
  }

  static get(userId) {
    return cart.filter((i) => i.userId == userId);
  }

  static delete(cartItemId, userId) {
    const cartItemIndex = cart.findIndex(
      (i) => i.id == cartItemId && i.userId == userId
    );
    if (cartItemIndex === -1) {
      return "Item not found";
    } else {
      cart.splice(cartItemIndex, 1);
    }
  }
}

let cart = [new CartModel(1, 2, 1, 1), new CartModel(2, 1, 2, 2)];
