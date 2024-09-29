const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    //user_id: String,
    cart_id: string,
    userInfo: {
      fullName: string,
      phone: string,
      address: string,
    },
    products: [
      {
        product_id: string,
        price: number,
        discountPercentage: number,
        quantity: number,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
