const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
//[get]/cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  if (cart.products.length > 0) {
    for await (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false,
      }).select("title thumbnail slug price discountPercentage");
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = productInfo.priceNew * item.quantity;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/pages/carts/index.pug", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};
//[post]/cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  // console.log(productId);
  // console.log(quantity);
  // console.log(cartId);
  const cart = await Cart.findOne({
    _id: cartId,
  });
  const exitProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (exitProductInCart) {
    const quantityNew = quantity + exitProductInCart.quantity;
    console.log(quantityNew);
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        $set: {
          "products.$.quantity": quantityNew,
        },
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng!");
  res.redirect("back");
};
//[get]/cart/deleted/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );
  req.flash("success", "Xóa sản phẩm thành công");
  res.redirect("back");
};
