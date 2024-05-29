import Cart from "../dao/models/cartModel";
import Product from "../dao/models/productModel";
import Ticket from "../dao/models/ticketModel";

export async function finalizePurchase(cartId) {
  const cart = await Cart.findById(cartId).populate('products.product');
  const purchasedItems = [];
  const failedItems = [];

  for (const item of cart.products) {
    const product = item.product /*await Product.find({ id: item.id });*/

    if (item.quantity <= product.stock) {
      product.stock -= item.quantity;
      await product.save();
      purchasedItems.push({ id: item.id, quantity: item.quantity, _id: product._id, price: product.price })
    } else {
      failedItems.push({ id: item.id, quantity: item.quantity, _id: product._id, price: product.price })
    }
  }
  cart.products = purchasedItems;
  await cart.save();

  const ticket = new Ticket({
    code: 'TICKET-' + Math.random().toString(36).substring(2, 9),
    purchase_datetime: new Date(),
    amount: cart.products.reduce((total, item) => total + item.quantity * item.price, 0),
    purchaser: cart.userId
  });
  await ticket.save();

  return { purchasedItems, failedItems, ticket }
}


