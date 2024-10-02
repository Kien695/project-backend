const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    // Tạo giỏ hàng mới
    const cart = new Cart();
    await cart.save();
    const expiresCookie = 5 * 24 * 60 * 60 * 1000; // 5 ngày
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie),
    });
  } else {
    // Lấy giỏ hàng hiện có
    const cart = await Cart.findOne({
      _id: req.cookies.cartId,
    });

    if (cart) {
      // Kiểm tra nếu giỏ hàng trống
      if (cart.products.length === 0) {
        console.log("Giỏ hàng hiện đang trống.");
      } else {
        // Tính tổng số lượng sản phẩm
        cart.totalQuantity = cart.products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        res.locals.miniCart = cart;
      }
    } else {
      console.log("Không tìm thấy giỏ hàng.");
    }
  }
  next();
};
